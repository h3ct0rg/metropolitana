using Common.model.dashboard;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace DataBase.management.dashboard
{
    public class DashboardPaquetesManagement : gestorDB
    {
        public List<NdPorFechaDto> getNdPorFechaSalida(DateTime start, DateTime end, int idSucursal)
        {
            List<NdPorFechaDto> resultado = new List<NdPorFechaDto>();
            base.sqlConnection.open();
            try
            {
                string query = @"
SELECT CAST(fechaSalida AS DATE) AS fecha, COUNT(*) AS cantidad
FROM paquetesNotaDebito
WHERE fechaSalida IS NOT NULL
  AND fechaSalida BETWEEN @start AND @end
  AND (@idSucursal = -1 OR idSucursal = @idSucursal)
GROUP BY CAST(fechaSalida AS DATE)
ORDER BY fecha";

                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@start", start);
                    command.Parameters.AddWithValue("@end", end);
                    command.Parameters.AddWithValue("@idSucursal", idSucursal);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            resultado.Add(new NdPorFechaDto
                            {
                                fecha = reader.GetDateTime(0),
                                cantidad = reader.GetInt32(1)
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

        public List<NdPorSucursalDto> getNdPorFechaSalidaBySucursal(DateTime start, DateTime end)
        {
            List<NdPorSucursalDto> resultado = new List<NdPorSucursalDto>();
            base.sqlConnection.open();
            try
            {
                string query = @"
SELECT S.nombre AS sucursal, COUNT(*) AS cantidad
FROM paquetesNotaDebito ND
JOIN sucursales S ON S.id = ND.idSucursal
WHERE ND.fechaSalida IS NOT NULL
  AND ND.fechaSalida BETWEEN @start AND @end
GROUP BY S.nombre
ORDER BY cantidad DESC";

                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@start", start);
                    command.Parameters.AddWithValue("@end", end);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            resultado.Add(new NdPorSucursalDto
                            {
                                sucursal = reader.GetString(0),
                                cantidad = reader.GetInt32(1)
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

        // "Sin ningún pago realizado" = saldoDeudor sigue igual al total original
        // de la ND (montoNeto - totalAgencia): no bajó por un adelanto, y la OP
        // no está marcada como pagada. Ordenado por fechaSalida ascendente, o
        // sea las más urgentes (más cercanas) primero.
        public List<NdAlertaCobroDto> getNdPendientesDeCobro(int idSucursal)
        {
            List<NdAlertaCobroDto> resultado = new List<NdAlertaCobroDto>();
            base.sqlConnection.open();
            try
            {
                string query = @"
SELECT ND.codigoUnicoNota, ND.voucher, ND.pasajero, CL.nombre as nombreAgencia, ND.fechaSalida,
       (ND.montoNeto - ND.totalAgencia) as saldoPendiente, ND.monedaNota, ND.tipoCambioValor,
       DATEDIFF(day, CAST(GETDATE() AS DATE), CAST(ND.fechaSalida AS DATE)) as diasRestantes
FROM paquetesNotaDebito ND
JOIN paquetesOrdenPago OP ON OP.idNotaDebito = ND.codigoUnicoNota
LEFT JOIN clientePaquetes CL ON CL.id = ND.codCliente
WHERE ND.fechaSalida IS NOT NULL
  AND OP.pagado = 0
  AND OP.saldoDeudor = (ND.montoNeto - ND.totalAgencia)
  AND (@idSucursal = -1 OR ND.idSucursal = @idSucursal)
ORDER BY ND.fechaSalida ASC";

                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@idSucursal", idSucursal);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            resultado.Add(new NdAlertaCobroDto
                            {
                                codigoUnico = reader.GetInt32(0),
                                voucher = reader.IsDBNull(1) ? "" : reader.GetString(1),
                                pasajero = reader.IsDBNull(2) ? "" : reader.GetString(2),
                                nombreAgencia = reader.IsDBNull(3) ? "" : reader.GetString(3),
                                fechaSalida = reader.GetDateTime(4),
                                saldoPendiente = reader.GetDouble(5),
                                monedaNota = GetNullableInt32ByName(reader, "monedaNota"),
                                tipoCambioValor = GetNullableDoubleByName(reader, "tipoCambioValor"),
                                diasRestantes = reader.GetInt32(reader.GetOrdinal("diasRestantes"))
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
    }
}
