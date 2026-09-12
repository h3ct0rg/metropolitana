using Common.model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace DataBase.management
{
    // Flujo de caja: cuánto USD/Bs ingresó y a qué cuenta, en un rango de
    // fechas, a través de los 3 módulos (travelace/UA, paquetes, carga).
    // Solo lee OP ya pagadas y no anuladas -- no escribe nada.
    public class flujoCajaManagement : gestorDB
    {
        private const string DetalleQuery = @"
select * from (
    select 'TRAVELACE' as modulo, OP.id as idOrdenPago, OP.idNotaDebito, OP.fechaPago, OP.montoAPagar, OP.idSucursal,
           FP.nombre as formaPagoNombre,
           COALESCE(CB.nombre, FP.nombre, 'Sin forma de pago') as cuenta,
           COALESCE(NULLIF(FP.moneda, 'AMBOS'), CB.moneda, 'USD') as moneda,
           ND.concepto, ND.tipoCambioValor
    from travelOrdenPago OP
    left join formaPago FP on FP.id = OP.formaPago
    left join cuentaBancaria CB on FP.requiereCuentaBancaria = 1 and TRY_CONVERT(int, OP.numeroTarjeta) = CB.id
    left join travelaceNotaDebito ND on ND.codigoUnicoNota = OP.idNotaDebito and ND.idSucursal = OP.idSucursal
    where OP.pagado = 1 and (OP.anulado is null or OP.anulado = 0)
      and OP.fechaPago between @startDate and @endDate

    union all

    select 'PAQUETES' as modulo, OP.id as idOrdenPago, OP.idNotaDebito, OP.fechaPago, OP.montoAPagar, OP.idSucursal,
           FP.nombre as formaPagoNombre,
           COALESCE(CB.nombre, FP.nombre, 'Sin forma de pago') as cuenta,
           COALESCE(NULLIF(FP.moneda, 'AMBOS'), CB.moneda, 'USD') as moneda,
           ND.concepto, ND.tipoCambioValor
    from paquetesOrdenPago OP
    left join formaPago FP on FP.id = OP.formaPago
    left join cuentaBancaria CB on FP.requiereCuentaBancaria = 1 and TRY_CONVERT(int, OP.numeroTarjeta) = CB.id
    left join paquetesNotaDebito ND on ND.codigoUnicoNota = OP.idNotaDebito and ND.idSucursal = OP.idSucursal
    where OP.pagado = 1 and (OP.anulado is null or OP.anulado = 0)
      and OP.fechaPago between @startDate and @endDate

    union all

    select 'CARGA' as modulo, OP.id as idOrdenPago, OP.idNotaDebito, OP.fechaPago, OP.montoAPagar, OP.idSucursal,
           FP.nombre as formaPagoNombre,
           COALESCE(CB.nombre, FP.nombre, 'Sin forma de pago') as cuenta,
           COALESCE(NULLIF(FP.moneda, 'AMBOS'), CB.moneda, 'USD') as moneda,
           ND.concepto, ND.tipoCambioValor
    from cargaOrdenPago OP
    left join formaPago FP on FP.id = OP.formaPago
    left join cuentaBancaria CB on FP.requiereCuentaBancaria = 1 and TRY_CONVERT(int, OP.numeroTarjeta) = CB.id
    left join cargaNotaDebito ND on ND.codigoUnicoNota = OP.idNotaDebito and ND.idSucursal = OP.idSucursal
    where OP.pagado = 1 and (OP.anulado is null or OP.anulado = 0)
      and OP.fechaPago between @startDate and @endDate
) as T
where (@area = 'TODAS' OR modulo = @area)
  and (@sucursal = 0 OR idSucursal = @sucursal)
";

        public List<FlujoCajaMovimiento> getMovimientos(DateTime startDate, DateTime endDate, string area = "TODAS", int sucursal = 0)
        {
            startDate = new DateTime(startDate.Year, startDate.Month, startDate.Day, 0, 0, 0);
            endDate = new DateTime(endDate.Year, endDate.Month, endDate.Day, 23, 59, 59);
            if (string.IsNullOrEmpty(area))
            {
                area = "TODAS";
            }

            List<FlujoCajaMovimiento> lista = new List<FlujoCajaMovimiento>();
            base.sqlConnection.open();
            try
            {
                using (SqlCommand command = new SqlCommand(DetalleQuery + " order by fechaPago desc", sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@startDate", startDate);
                    command.Parameters.AddWithValue("@endDate", endDate);
                    command.Parameters.AddWithValue("@area", area);
                    command.Parameters.AddWithValue("@sucursal", sucursal);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            FlujoCajaMovimiento m = new FlujoCajaMovimiento();
                            m.modulo = GetStringByName(reader, "modulo");
                            m.idOrdenPago = GetInt32ByName(reader, "idOrdenPago");
                            m.idNotaDebito = GetInt32ByName(reader, "idNotaDebito");
                            m.fechaPago = GetDateTimeByName(reader, "fechaPago");
                            m.monto = GetDoubleByName(reader, "montoAPagar");
                            m.formaPago = GetStringByName(reader, "formaPagoNombre");
                            m.cuenta = GetStringByName(reader, "cuenta");
                            m.moneda = GetStringByName(reader, "moneda");
                            m.concepto = GetStringByName(reader, "concepto");
                            m.tipoCambioValor = GetNullableDoubleByName(reader, "tipoCambioValor");
                            lista.Add(m);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                base.sqlConnection.close();
                throw new Exception(ex.Message);
            }
            base.sqlConnection.close();
            return lista;
        }

        public List<FlujoCajaResumen> getResumen(DateTime startDate, DateTime endDate, string area = "TODAS", int sucursal = 0)
        {
            return getMovimientos(startDate, endDate, area, sucursal)
                .GroupBy(m => new { m.cuenta, m.moneda })
                .Select(g => new FlujoCajaResumen
                {
                    cuenta = g.Key.cuenta,
                    moneda = g.Key.moneda,
                    totalIngresos = g.Sum(m => m.monto),
                    cantidadOperaciones = g.Count()
                })
                .OrderBy(r => r.moneda).ThenBy(r => r.cuenta)
                .ToList();
        }
    }
}
