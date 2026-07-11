using Common.model.dashboard;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace DataBase.management.dashboard
{
    public class DashboardActivityManagement : gestorDB
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

        public ActivitySummaryDto getActivitySummary()
        {
            ActivitySummaryDto resultado = new ActivitySummaryDto();
            base.sqlConnection.open();
            try
            {
                using (SqlCommand command = new SqlCommand(
                    "SELECT COUNT(DISTINCT TRY_CAST(userEvent AS INT)) FROM logsManagement WHERE createDate >= DATEADD(DAY, -7, GETDATE())",
                    sqlConnection._sqlConnect))
                {
                    object result = command.ExecuteScalar();
                    resultado.usuariosActivos7d = result == null || result == DBNull.Value ? 0 : Convert.ToInt32(result);
                }

                using (SqlCommand command = new SqlCommand(
                    "SELECT COUNT(*) FROM logsManagement WHERE CAST(createDate AS DATE) = CAST(GETDATE() AS DATE)",
                    sqlConnection._sqlConnect))
                {
                    object result = command.ExecuteScalar();
                    resultado.eventosHoy = result == null || result == DBNull.Value ? 0 : Convert.ToInt32(result);
                }

                string queryNotasHoy = NotaDebitoConsolidadoCte + @"
SELECT COUNT(*) FROM NotaDebitoConsolidado WHERE CAST(createdDate AS DATE) = CAST(GETDATE() AS DATE)";
                using (SqlCommand command = new SqlCommand(queryNotasHoy, sqlConnection._sqlConnect))
                {
                    object result = command.ExecuteScalar();
                    resultado.notasHoy = result == null || result == DBNull.Value ? 0 : Convert.ToInt32(result);
                }

                using (SqlCommand command = new SqlCommand(@"
SELECT TOP 1 S.nombre
FROM logsManagement L
LEFT JOIN sucursales S ON S.id = TRY_CAST(L.idSucursal AS INT)
WHERE L.createDate >= DATEADD(DAY, -7, GETDATE()) AND S.nombre IS NOT NULL
GROUP BY S.nombre
ORDER BY COUNT(*) DESC", sqlConnection._sqlConnect))
                {
                    object result = command.ExecuteScalar();
                    resultado.sucursalMasActiva = result == null || result == DBNull.Value ? "" : Convert.ToString(result);
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

        public List<UserActivityDto> getNotesByUser(int idSucursal, DateTime start, DateTime end, int top)
        {
            List<UserActivityDto> resultado = new List<UserActivityDto>();
            base.sqlConnection.open();
            try
            {
                string query = NotaDebitoConsolidadoCte + @"
SELECT TOP (@top) U.nombre AS usuario, V.modulo, COUNT(*) AS cantidad
FROM NotaDebitoConsolidado V
LEFT JOIN usersCompany U ON U.id = V.createdBy
WHERE V.createdDate BETWEEN @start AND @end
  AND (@idSucursal = -1 OR V.idSucursal = @idSucursal)
GROUP BY U.nombre, V.modulo
ORDER BY cantidad DESC";

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
                            resultado.Add(new UserActivityDto
                            {
                                usuario = reader.IsDBNull(0) ? "(sin usuario)" : reader.GetString(0),
                                modulo = reader.GetString(1),
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

        public List<DailyActivityDto> getDailyActivity(int dias)
        {
            List<DailyActivityDto> resultado = new List<DailyActivityDto>();
            base.sqlConnection.open();
            try
            {
                string query = @"
SELECT CAST(createDate AS DATE) AS dia, COUNT(*) AS eventos
FROM logsManagement
WHERE createDate >= DATEADD(DAY, @dias, GETDATE())
GROUP BY CAST(createDate AS DATE)
ORDER BY dia";

                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@dias", -dias);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            resultado.Add(new DailyActivityDto
                            {
                                dia = reader.GetDateTime(0),
                                eventos = reader.GetInt32(1)
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

        public List<BranchActivityDto> getActivityByBranch(DateTime start, DateTime end)
        {
            List<BranchActivityDto> resultado = new List<BranchActivityDto>();
            base.sqlConnection.open();
            try
            {
                string query = @"
SELECT S.nombre AS sucursal, COUNT(*) AS eventos
FROM logsManagement L
LEFT JOIN sucursales S ON S.id = TRY_CAST(L.idSucursal AS INT)
WHERE L.createDate BETWEEN @start AND @end AND S.nombre IS NOT NULL
GROUP BY S.nombre
ORDER BY eventos DESC";

                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@start", start);
                    command.Parameters.AddWithValue("@end", end);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            resultado.Add(new BranchActivityDto
                            {
                                sucursal = reader.GetString(0),
                                eventos = reader.GetInt32(1)
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

        public List<RecentEventDto> getRecentEvents(int top)
        {
            List<RecentEventDto> resultado = new List<RecentEventDto>();
            base.sqlConnection.open();
            try
            {
                string query = @"
SELECT TOP (@top) L.createDate, U.nombre AS usuario, L.eventShoot,
  CASE
    WHEN L.fromEvent LIKE '%- UniversalAssistance' THEN 'Travelace'
    WHEN L.fromEvent LIKE '%- Carga' THEN 'Carga'
    WHEN L.fromEvent LIKE '%- Paquetes' THEN 'Paquetes'
    ELSE 'Otro'
  END AS modulo,
  S.nombre AS sucursal
FROM logsManagement L
LEFT JOIN usersCompany U ON U.id = TRY_CAST(L.userEvent AS INT)
LEFT JOIN sucursales S ON S.id = TRY_CAST(L.idSucursal AS INT)
ORDER BY L.createDate DESC";

                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@top", top);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            resultado.Add(new RecentEventDto
                            {
                                fecha = reader.GetDateTime(0),
                                usuario = reader.IsDBNull(1) ? "(sin usuario)" : reader.GetString(1),
                                evento = reader.IsDBNull(2) ? "" : reader.GetString(2),
                                modulo = reader.GetString(3),
                                sucursal = reader.IsDBNull(4) ? "(sin sucursal)" : reader.GetString(4)
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

        public List<EventTypeDistributionDto> getEventTypeDistribution(DateTime start, DateTime end)
        {
            List<EventTypeDistributionDto> resultado = new List<EventTypeDistributionDto>();
            base.sqlConnection.open();
            try
            {
                string query = @"
SELECT
  CASE
    WHEN fromEvent LIKE '%- UniversalAssistance' THEN 'Travelace'
    WHEN fromEvent LIKE '%- Carga' THEN 'Carga'
    WHEN fromEvent LIKE '%- Paquetes' THEN 'Paquetes'
    ELSE 'Otro'
  END AS modulo,
  COUNT(*) AS cantidad
FROM logsManagement
WHERE createDate BETWEEN @start AND @end
GROUP BY
  CASE
    WHEN fromEvent LIKE '%- UniversalAssistance' THEN 'Travelace'
    WHEN fromEvent LIKE '%- Carga' THEN 'Carga'
    WHEN fromEvent LIKE '%- Paquetes' THEN 'Paquetes'
    ELSE 'Otro'
  END";

                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@start", start);
                    command.Parameters.AddWithValue("@end", end);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            resultado.Add(new EventTypeDistributionDto
                            {
                                modulo = reader.GetString(0),
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
    }
}
