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
    }
}
