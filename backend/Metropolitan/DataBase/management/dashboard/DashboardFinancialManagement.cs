using Common;
using Common.model.dashboard;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace DataBase.management.dashboard
{
    public class DashboardFinancialManagement : gestorDB
    {
        private const string NotaDebitoConsolidadoCte = @"
;WITH NotaDebitoConsolidado AS (
    SELECT 'Travelace' AS modulo, ND.id, ND.codCliente, CL.nombre AS clienteNombre, ND.pasajero,
           ND.total, ND.totalArgentina, ND.totalAgencia, ND.totalCounter, ND.totalMetropolitan,
           ND.estado, ND.idSucursal, ND.fechaGestion, ND.createdBy, ND.createdDate, ND.codigoUnicoNota
    FROM travelaceNotaDebito ND LEFT JOIN clients CL ON CL.id = ND.codCliente
    UNION ALL
    SELECT 'Carga', ND.id, ND.codCliente, CL.nombre, ND.pasajero,
           ND.total, ND.totalArgentina, ND.totalAgencia, ND.totalCounter, ND.totalMetropolitan,
           ND.estado, ND.idSucursal, ND.fechaGestion, ND.createdBy, ND.createdDate, ND.codigoUnicoNota
    FROM cargaNotaDebito ND LEFT JOIN clienteCarga CL ON CL.id = ND.codCliente
    UNION ALL
    SELECT 'Paquetes', ND.id, ND.codCliente, CL.nombre, ND.pasajero,
           ND.total, ND.totalArgentina, ND.totalAgencia, ND.totalCounter, ND.totalMetropolitan,
           ND.estado, ND.idSucursal, ND.fechaGestion, ND.createdBy, ND.createdDate, ND.codigoUnicoNota
    FROM paquetesNotaDebito ND LEFT JOIN clientePaquetes CL ON CL.id = ND.codCliente
)
";

        private const string OrdenPagoConsolidadoCte = @"
;WITH OrdenPagoConsolidado AS (
    SELECT 'Travelace' AS modulo, OP.id, OP.idNotaDebito, OP.montoAPagar, OP.saldoDeudor, OP.pagado, OP.fechaPago, OP.idSucursal
    FROM travelOrdenPago OP
    UNION ALL
    SELECT 'Carga', OP.id, OP.idNotaDebito, OP.montoAPagar, OP.saldoDeudor, OP.pagado, OP.fechaPago, OP.idSucursal
    FROM cargaOrdenPago OP
    UNION ALL
    SELECT 'Paquetes', OP.id, OP.idNotaDebito, OP.montoAPagar, OP.saldoDeudor, OP.pagado, OP.fechaPago, OP.idSucursal
    FROM paquetesOrdenPago OP
)
";

        public FinancialSummaryDto getFinancialSummary(int idSucursal, DateTime start, DateTime end)
        {
            FinancialSummaryDto summary = new FinancialSummaryDto();
            base.sqlConnection.open();
            try
            {
                string query = NotaDebitoConsolidadoCte + @"
SELECT
  SUM(CASE WHEN estado = 0 THEN total ELSE 0 END) AS ingresosActivos,
  SUM(CASE WHEN estado = 1 THEN total ELSE 0 END) AS totalAnulado,
  COUNT(CASE WHEN estado = 0 THEN 1 END) AS notasActivas,
  COUNT(CASE WHEN estado = 1 THEN 1 END) AS notasAnuladas,
  SUM(CASE WHEN estado = 0 THEN totalArgentina ELSE 0 END) AS totalArgentina,
  SUM(CASE WHEN estado = 0 THEN totalAgencia ELSE 0 END) AS totalAgencia,
  SUM(CASE WHEN estado = 0 THEN totalCounter ELSE 0 END) AS totalCounter,
  SUM(CASE WHEN estado = 0 THEN totalMetropolitan ELSE 0 END) AS totalMetropolitana
FROM NotaDebitoConsolidado
WHERE (@idSucursal = -1 OR idSucursal = @idSucursal)
  AND fechaGestion BETWEEN @start AND @end";

                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@idSucursal", idSucursal);
                    command.Parameters.AddWithValue("@start", start);
                    command.Parameters.AddWithValue("@end", end);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            summary.ingresosActivos = reader.IsDBNull(0) ? 0 : reader.GetDouble(0);
                            summary.totalAnulado = reader.IsDBNull(1) ? 0 : reader.GetDouble(1);
                            summary.notasActivas = reader.GetInt32(2);
                            summary.notasAnuladas = reader.GetInt32(3);
                            summary.totalArgentina = reader.IsDBNull(4) ? 0 : reader.GetDouble(4);
                            summary.totalAgencia = reader.IsDBNull(5) ? 0 : reader.GetDouble(5);
                            summary.totalCounter = reader.IsDBNull(6) ? 0 : reader.GetDouble(6);
                            summary.totalMetropolitana = reader.IsDBNull(7) ? 0 : reader.GetDouble(7);
                        }
                    }
                }

                summary.ticketPromedio = summary.notasActivas > 0 ? summary.ingresosActivos / summary.notasActivas : 0;

                TimeSpan periodo = end - start;
                DateTime startAnterior = start.AddDays(-(periodo.TotalDays + 1));
                DateTime endAnterior = start.AddDays(-1);
                double ingresosMesAnterior = getIngresosActivos(idSucursal, startAnterior, endAnterior);
                summary.variacionPorcentualMesAnterior = ingresosMesAnterior > 0
                    ? ((summary.ingresosActivos - ingresosMesAnterior) / ingresosMesAnterior) * 100
                    : 0;

                string queryPendiente = OrdenPagoConsolidadoCte + @"
SELECT SUM(saldoDeudor) FROM OrdenPagoConsolidado
WHERE pagado = 0 AND (@idSucursal = -1 OR idSucursal = @idSucursal)";
                using (SqlCommand command = new SqlCommand(queryPendiente, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@idSucursal", idSucursal);
                    object result = command.ExecuteScalar();
                    summary.saldoDeudorTotal = result == null || result == DBNull.Value ? 0 : Convert.ToDouble(result);
                }
            }
            catch (Exception ex)
            {
                base.sqlConnection.close();
                throw new Exception(ex.Message);
            }
            base.sqlConnection.close();
            return summary;
        }

        private double getIngresosActivos(int idSucursal, DateTime start, DateTime end)
        {
            string query = NotaDebitoConsolidadoCte + @"
SELECT SUM(CASE WHEN estado = 0 THEN total ELSE 0 END) AS ingresosActivos
FROM NotaDebitoConsolidado
WHERE (@idSucursal = -1 OR idSucursal = @idSucursal)
  AND fechaGestion BETWEEN @start AND @end";

            using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
            {
                command.Parameters.AddWithValue("@idSucursal", idSucursal);
                command.Parameters.AddWithValue("@start", start);
                command.Parameters.AddWithValue("@end", end);
                object result = command.ExecuteScalar();
                return result == null || result == DBNull.Value ? 0 : Convert.ToDouble(result);
            }
        }

        public List<MonthlyRevenueDto> getMonthlyRevenue(int idSucursal, int meses)
        {
            List<MonthlyRevenueDto> resultado = new List<MonthlyRevenueDto>();
            base.sqlConnection.open();
            try
            {
                DateTime desde = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(-(meses - 1));
                Dictionary<DateTime, MonthlyRevenueDto> porMes = new Dictionary<DateTime, MonthlyRevenueDto>();
                for (int i = 0; i < meses; i++)
                {
                    DateTime mes = desde.AddMonths(i);
                    porMes[mes] = new MonthlyRevenueDto { mes = mes, facturado = 0, cobrado = 0, esProyeccion = false };
                }

                string queryFacturado = NotaDebitoConsolidadoCte + @"
SELECT DATEFROMPARTS(YEAR(fechaGestion), MONTH(fechaGestion), 1) AS mes, SUM(total) AS facturado
FROM NotaDebitoConsolidado
WHERE estado = 0 AND (@idSucursal = -1 OR idSucursal = @idSucursal) AND fechaGestion >= @desde
GROUP BY DATEFROMPARTS(YEAR(fechaGestion), MONTH(fechaGestion), 1)";

                using (SqlCommand command = new SqlCommand(queryFacturado, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@idSucursal", idSucursal);
                    command.Parameters.AddWithValue("@desde", desde);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            DateTime mes = reader.GetDateTime(0);
                            double facturado = reader.IsDBNull(1) ? 0 : reader.GetDouble(1);
                            if (porMes.ContainsKey(mes))
                            {
                                porMes[mes].facturado = facturado;
                            }
                        }
                    }
                }

                string queryCobrado = OrdenPagoConsolidadoCte + @"
SELECT DATEFROMPARTS(YEAR(fechaPago), MONTH(fechaPago), 1) AS mes, SUM(montoAPagar) AS cobrado
FROM OrdenPagoConsolidado
WHERE pagado = 1 AND (@idSucursal = -1 OR idSucursal = @idSucursal) AND fechaPago >= @desde
GROUP BY DATEFROMPARTS(YEAR(fechaPago), MONTH(fechaPago), 1)";

                using (SqlCommand command = new SqlCommand(queryCobrado, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@idSucursal", idSucursal);
                    command.Parameters.AddWithValue("@desde", desde);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            DateTime mes = reader.GetDateTime(0);
                            double cobrado = reader.IsDBNull(1) ? 0 : reader.GetDouble(1);
                            if (porMes.ContainsKey(mes))
                            {
                                porMes[mes].cobrado = cobrado;
                            }
                        }
                    }
                }

                resultado = porMes.Values.OrderBy(m => m.mes).ToList();

                List<(DateTime mes, double valor)> historicoFacturado = resultado
                    .Skip(Math.Max(0, resultado.Count - 6))
                    .Select(m => (m.mes, m.facturado))
                    .ToList();

                List<(DateTime mes, double valor)> proyeccion = ForecastHelper.LinearForecast(historicoFacturado, 3);
                foreach ((DateTime mes, double valor) item in proyeccion)
                {
                    resultado.Add(new MonthlyRevenueDto { mes = item.mes, facturado = item.valor, cobrado = 0, esProyeccion = true });
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

        public List<BranchRevenueDto> getRevenueByBranch(int mes, int anio)
        {
            List<BranchRevenueDto> resultado = new List<BranchRevenueDto>();
            base.sqlConnection.open();
            try
            {
                string query = NotaDebitoConsolidadoCte + @"
SELECT S.nombre AS sucursal, SUM(V.total) AS ingresos
FROM NotaDebitoConsolidado V
JOIN sucursales S ON S.id = V.idSucursal
WHERE V.estado = 0 AND MONTH(V.fechaGestion) = @mes AND YEAR(V.fechaGestion) = @anio
GROUP BY S.nombre
ORDER BY ingresos DESC";

                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@mes", mes);
                    command.Parameters.AddWithValue("@anio", anio);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            resultado.Add(new BranchRevenueDto
                            {
                                sucursal = reader.GetString(0),
                                ingresos = reader.IsDBNull(1) ? 0 : reader.GetDouble(1)
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

        public ReceivablesSummaryDto getReceivablesSummary(int idSucursal)
        {
            ReceivablesSummaryDto resultado = new ReceivablesSummaryDto();
            base.sqlConnection.open();
            try
            {
                string query = OrdenPagoConsolidadoCte + @"
SELECT
  SUM(CASE WHEN pagado = 1 THEN montoAPagar ELSE 0 END) AS totalPagado,
  SUM(CASE WHEN pagado = 0 THEN saldoDeudor ELSE 0 END) AS totalPendiente,
  COUNT(CASE WHEN pagado = 1 THEN 1 END) AS cantidadPagado,
  COUNT(CASE WHEN pagado = 0 THEN 1 END) AS cantidadPendiente
FROM OrdenPagoConsolidado
WHERE (@idSucursal = -1 OR idSucursal = @idSucursal)";

                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@idSucursal", idSucursal);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            resultado.totalPagado = reader.IsDBNull(0) ? 0 : reader.GetDouble(0);
                            resultado.totalPendiente = reader.IsDBNull(1) ? 0 : reader.GetDouble(1);
                            resultado.cantidadPagado = reader.GetInt32(2);
                            resultado.cantidadPendiente = reader.GetInt32(3);
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

        public List<TopClientDto> getTopClients(int idSucursal, DateTime start, DateTime end, int top)
        {
            List<TopClientDto> resultado = new List<TopClientDto>();
            base.sqlConnection.open();
            try
            {
                string query = NotaDebitoConsolidadoCte + @"
SELECT TOP (@top) clienteNombre, SUM(total) AS total
FROM NotaDebitoConsolidado
WHERE estado = 0 AND (@idSucursal = -1 OR idSucursal = @idSucursal)
  AND fechaGestion BETWEEN @start AND @end
  AND clienteNombre IS NOT NULL
GROUP BY clienteNombre
ORDER BY total DESC";

                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@top", top);
                    command.Parameters.AddWithValue("@idSucursal", idSucursal);
                    command.Parameters.AddWithValue("@start", start);
                    command.Parameters.AddWithValue("@end", end);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            resultado.Add(new TopClientDto
                            {
                                clienteNombre = reader.GetString(0),
                                total = reader.IsDBNull(1) ? 0 : reader.GetDouble(1)
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

        public List<ModuleDistributionDto> getModuleDistribution(int idSucursal, DateTime start, DateTime end)
        {
            List<ModuleDistributionDto> resultado = new List<ModuleDistributionDto>();
            base.sqlConnection.open();
            try
            {
                string query = NotaDebitoConsolidadoCte + @"
SELECT modulo, SUM(total) AS total, COUNT(*) AS cantidad
FROM NotaDebitoConsolidado
WHERE estado = 0 AND (@idSucursal = -1 OR idSucursal = @idSucursal)
  AND fechaGestion BETWEEN @start AND @end
GROUP BY modulo";

                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@idSucursal", idSucursal);
                    command.Parameters.AddWithValue("@start", start);
                    command.Parameters.AddWithValue("@end", end);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            resultado.Add(new ModuleDistributionDto
                            {
                                modulo = reader.GetString(0),
                                total = reader.IsDBNull(1) ? 0 : reader.GetDouble(1),
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
    }
}
