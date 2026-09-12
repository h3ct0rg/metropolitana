using Common.model;
using Common.model.dashboard;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace DataBase.management.dashboard
{
    public class DashboardCurrencyManagement : gestorDB
    {
        private const string NotaDebitoConsolidadoCte = @"
;WITH NotaDebitoConsolidado AS (
    SELECT 'Travelace' AS modulo, ND.id, ND.idSucursal, ND.fechaGestion, ND.estado, ND.total,
           ND.monedaNota, ND.tipoCambioValor
    FROM travelaceNotaDebito ND
    UNION ALL
    SELECT 'Carga', ND.id, ND.idSucursal, ND.fechaGestion, ND.estado, ND.total,
           ND.monedaNota, ND.tipoCambioValor
    FROM cargaNotaDebito ND
    UNION ALL
    SELECT 'Paquetes', ND.id, ND.idSucursal, ND.fechaGestion, ND.estado, ND.total,
           ND.monedaNota, ND.tipoCambioValor
    FROM paquetesNotaDebito ND
)
";

        private const string OrdenPagoConsolidadoCte = @"
;WITH OrdenPagoConsolidado AS (
    SELECT 'Travelace' AS modulo, OP.id, OP.idNotaDebito, OP.idSucursal, OP.fechaPago, OP.pagado,
           OP.montoAPagar, OP.formaPago
    FROM travelOrdenPago OP
    UNION ALL
    SELECT 'Carga', OP.id, OP.idNotaDebito, OP.idSucursal, OP.fechaPago, OP.pagado,
           OP.montoAPagar, OP.formaPago
    FROM cargaOrdenPago OP
    UNION ALL
    SELECT 'Paquetes', OP.id, OP.idNotaDebito, OP.idSucursal, OP.fechaPago, OP.pagado,
           OP.montoAPagar, OP.formaPago
    FROM paquetesOrdenPago OP
)
";

        private const string MonedaCase = "CASE WHEN monedaNota = 2 THEN 'BS' ELSE 'USD' END";

        public CurrencySummaryDto getCurrencySummary(int idSucursal, string modulo, DateTime start, DateTime end)
        {
            CurrencySummaryDto resultado = new CurrencySummaryDto();
            base.sqlConnection.open();
            try
            {
                tipoCambioConfigManagement tcManagement = new tipoCambioConfigManagement();
                tipoCambioConfig actual = tcManagement.getUltimo();
                if (actual != null)
                {
                    resultado.tipoCambioActual = actual.valor;
                    resultado.fechaTipoCambioActual = actual.createDate;
                }

                List<tipoCambioConfig> historial = tcManagement.getHistorial(start, end);
                if (historial.Count > 0)
                {
                    double valorInicio = historial[historial.Count - 1].valor;
                    double valorFin = historial[0].valor;
                    resultado.variacionPorcentual = valorInicio > 0 ? ((valorFin - valorInicio) / valorInicio) * 100 : 0;
                }

                string queryNd = NotaDebitoConsolidadoCte + $@"
SELECT {MonedaCase} AS moneda, COUNT(*) AS cantidad
FROM NotaDebitoConsolidado
WHERE estado = 0 AND (@idSucursal = -1 OR idSucursal = @idSucursal)
  AND (@modulo = 'TODOS' OR modulo = @modulo)
  AND fechaGestion BETWEEN @start AND @end
GROUP BY {MonedaCase}";

                int totalUsd = 0;
                int totalBs = 0;
                using (SqlCommand command = new SqlCommand(queryNd, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@idSucursal", idSucursal);
                    command.Parameters.AddWithValue("@modulo", modulo);
                    command.Parameters.AddWithValue("@start", start);
                    command.Parameters.AddWithValue("@end", end);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            string moneda = reader.GetString(0);
                            int cantidad = reader.GetInt32(1);
                            if (moneda == "BS") { totalBs = cantidad; } else { totalUsd = cantidad; }
                        }
                    }
                }

                resultado.totalNd = totalUsd + totalBs;
                resultado.pctNdBolivianos = resultado.totalNd > 0 ? (totalBs * 100.0) / resultado.totalNd : 0;
                resultado.pctNdDolares = resultado.totalNd > 0 ? (totalUsd * 100.0) / resultado.totalNd : 0;

                string queryFormaPago = OrdenPagoConsolidadoCte + @"
SELECT TOP 1 FP.nombre, COUNT(*) AS cantidad
FROM OrdenPagoConsolidado OP
JOIN formaPago FP ON FP.id = OP.formaPago
WHERE OP.pagado = 1 AND OP.formaPago > 0
  AND (@idSucursal = -1 OR OP.idSucursal = @idSucursal)
  AND (@modulo = 'TODOS' OR OP.modulo = @modulo)
  AND OP.fechaPago BETWEEN @start AND @end
GROUP BY FP.nombre
ORDER BY cantidad DESC";

                using (SqlCommand command = new SqlCommand(queryFormaPago, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@idSucursal", idSucursal);
                    command.Parameters.AddWithValue("@modulo", modulo);
                    command.Parameters.AddWithValue("@start", start);
                    command.Parameters.AddWithValue("@end", end);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            resultado.formaPagoMasUsada = reader.GetString(0);
                            resultado.cantidadFormaPagoMasUsada = reader.GetInt32(1);
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
            return resultado;
        }

        public List<NdByCurrencyDto> getNdByCurrency(int idSucursal, string modulo, DateTime start, DateTime end)
        {
            List<NdByCurrencyDto> resultado = new List<NdByCurrencyDto>();
            base.sqlConnection.open();
            try
            {
                string query = NotaDebitoConsolidadoCte + $@"
SELECT {MonedaCase} AS moneda, COUNT(*) AS cantidad, SUM(total) AS montoTotalUsd
FROM NotaDebitoConsolidado
WHERE estado = 0 AND (@idSucursal = -1 OR idSucursal = @idSucursal)
  AND (@modulo = 'TODOS' OR modulo = @modulo)
  AND fechaGestion BETWEEN @start AND @end
GROUP BY {MonedaCase}";

                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@idSucursal", idSucursal);
                    command.Parameters.AddWithValue("@modulo", modulo);
                    command.Parameters.AddWithValue("@start", start);
                    command.Parameters.AddWithValue("@end", end);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            resultado.Add(new NdByCurrencyDto
                            {
                                moneda = reader.GetString(0),
                                cantidad = reader.GetInt32(1),
                                montoTotalUsd = reader.IsDBNull(2) ? 0 : reader.GetDouble(2)
                            });
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
            return resultado;
        }

        public List<NdByCurrencyPeriodDto> getNdByCurrencyOverTime(int idSucursal, string modulo, DateTime start, DateTime end)
        {
            List<NdByCurrencyPeriodDto> resultado = new List<NdByCurrencyPeriodDto>();
            base.sqlConnection.open();
            try
            {
                string query = NotaDebitoConsolidadoCte + $@"
SELECT DATEFROMPARTS(YEAR(fechaGestion), MONTH(fechaGestion), 1) AS periodo, {MonedaCase} AS moneda, COUNT(*) AS cantidad
FROM NotaDebitoConsolidado
WHERE estado = 0 AND (@idSucursal = -1 OR idSucursal = @idSucursal)
  AND (@modulo = 'TODOS' OR modulo = @modulo)
  AND fechaGestion BETWEEN @start AND @end
GROUP BY DATEFROMPARTS(YEAR(fechaGestion), MONTH(fechaGestion), 1), {MonedaCase}
ORDER BY periodo";

                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@idSucursal", idSucursal);
                    command.Parameters.AddWithValue("@modulo", modulo);
                    command.Parameters.AddWithValue("@start", start);
                    command.Parameters.AddWithValue("@end", end);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            resultado.Add(new NdByCurrencyPeriodDto
                            {
                                periodo = reader.GetDateTime(0),
                                moneda = reader.GetString(1),
                                cantidad = reader.GetInt32(2)
                            });
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
            return resultado;
        }

        public List<NdByCurrencyModuloDto> getNdByCurrencyByModulo(int idSucursal, string modulo, DateTime start, DateTime end)
        {
            List<NdByCurrencyModuloDto> resultado = new List<NdByCurrencyModuloDto>();
            base.sqlConnection.open();
            try
            {
                string query = NotaDebitoConsolidadoCte + $@"
SELECT modulo, {MonedaCase} AS moneda, COUNT(*) AS cantidad
FROM NotaDebitoConsolidado
WHERE estado = 0 AND (@idSucursal = -1 OR idSucursal = @idSucursal)
  AND (@modulo = 'TODOS' OR modulo = @modulo)
  AND fechaGestion BETWEEN @start AND @end
GROUP BY modulo, {MonedaCase}";

                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@idSucursal", idSucursal);
                    command.Parameters.AddWithValue("@modulo", modulo);
                    command.Parameters.AddWithValue("@start", start);
                    command.Parameters.AddWithValue("@end", end);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            resultado.Add(new NdByCurrencyModuloDto
                            {
                                modulo = reader.GetString(0),
                                moneda = reader.GetString(1),
                                cantidad = reader.GetInt32(2)
                            });
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
            return resultado;
        }

        public List<NdByCurrencyBranchDto> getNdByCurrencyByBranch(string modulo, DateTime start, DateTime end)
        {
            List<NdByCurrencyBranchDto> resultado = new List<NdByCurrencyBranchDto>();
            base.sqlConnection.open();
            try
            {
                string query = NotaDebitoConsolidadoCte + $@"
SELECT S.nombre AS sucursal, {MonedaCase} AS moneda, COUNT(*) AS cantidad
FROM NotaDebitoConsolidado V
JOIN sucursales S ON S.id = V.idSucursal
WHERE V.estado = 0 AND (@modulo = 'TODOS' OR V.modulo = @modulo)
  AND V.fechaGestion BETWEEN @start AND @end
GROUP BY S.nombre, {MonedaCase}
ORDER BY S.nombre";

                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@modulo", modulo);
                    command.Parameters.AddWithValue("@start", start);
                    command.Parameters.AddWithValue("@end", end);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            resultado.Add(new NdByCurrencyBranchDto
                            {
                                sucursal = reader.GetString(0),
                                moneda = reader.GetString(1),
                                cantidad = reader.GetInt32(2)
                            });
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
            return resultado;
        }

        public List<PaymentMethodUsageDto> getPaymentMethodUsage(int idSucursal, string modulo, DateTime start, DateTime end, int top)
        {
            List<PaymentMethodUsageDto> resultado = new List<PaymentMethodUsageDto>();
            base.sqlConnection.open();
            try
            {
                string query = OrdenPagoConsolidadoCte + @"
SELECT TOP (@top) FP.nombre, COUNT(*) AS cantidad, SUM(OP.montoAPagar) AS montoTotalUsd
FROM OrdenPagoConsolidado OP
JOIN formaPago FP ON FP.id = OP.formaPago
WHERE OP.pagado = 1 AND OP.formaPago > 0
  AND (@idSucursal = -1 OR OP.idSucursal = @idSucursal)
  AND (@modulo = 'TODOS' OR OP.modulo = @modulo)
  AND OP.fechaPago BETWEEN @start AND @end
GROUP BY FP.nombre
ORDER BY cantidad DESC";

                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@top", top);
                    command.Parameters.AddWithValue("@idSucursal", idSucursal);
                    command.Parameters.AddWithValue("@modulo", modulo);
                    command.Parameters.AddWithValue("@start", start);
                    command.Parameters.AddWithValue("@end", end);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            resultado.Add(new PaymentMethodUsageDto
                            {
                                formaPago = reader.GetString(0),
                                cantidad = reader.GetInt32(1),
                                montoTotalUsd = reader.IsDBNull(2) ? 0 : reader.GetDouble(2)
                            });
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
            return resultado;
        }

        public List<ExchangeRateHistoryDto> getExchangeRateHistory(DateTime start, DateTime end)
        {
            List<ExchangeRateHistoryDto> resultado = new List<ExchangeRateHistoryDto>();
            tipoCambioConfigManagement tcManagement = new tipoCambioConfigManagement();
            List<tipoCambioConfig> historial = tcManagement.getHistorial(start, end);
            historial.Reverse();
            foreach (tipoCambioConfig tc in historial)
            {
                resultado.Add(new ExchangeRateHistoryDto { fecha = tc.createDate, valor = tc.valor });
            }
            return resultado;
        }
    }
}
