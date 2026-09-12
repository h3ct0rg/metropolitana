using Common.model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace DataBase.management
{
    // Tabla de solo-INSERT: nunca se hace update sobre una fila existente.
    // "El valor actual" es siempre la fila más reciente (mayor id).
    public class tipoCambioConfigManagement : gestorDB
    {
        private tipoCambioConfig readRow(SqlDataReader reader)
        {
            tipoCambioConfig tc = new tipoCambioConfig();
            tc.id = GetInt32ByName(reader, "id");
            tc.valor = GetDoubleByName(reader, "valor");
            tc.createBy = GetInt32ByName(reader, "createdBy");
            tc.createDate = GetDateTimeByName(reader, "createdDate");
            return tc;
        }

        public tipoCambioConfig getUltimo()
        {
            tipoCambioConfig tc = null;
            sqlConnection.open();
            string query = "select top 1 * from tipoCambioConfig order by id desc";
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            tc = readRow(reader);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                sqlConnection.close();
                throw new Exception(ex.Message);
            }
            sqlConnection.close();
            return tc;
        }

        public List<tipoCambioConfig> getHistorial()
        {
            List<tipoCambioConfig> lista = new List<tipoCambioConfig>();
            sqlConnection.open();
            string query = "select * from tipoCambioConfig order by id desc";
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            lista.Add(readRow(reader));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                sqlConnection.close();
                throw new Exception(ex.Message);
            }
            sqlConnection.close();
            return lista;
        }

        public List<tipoCambioConfig> getHistorial(DateTime start, DateTime end)
        {
            List<tipoCambioConfig> lista = new List<tipoCambioConfig>();
            sqlConnection.open();
            string query = "select * from tipoCambioConfig where createdDate between @start and @end order by id desc";
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    command.Parameters.AddWithValue("@start", start);
                    command.Parameters.AddWithValue("@end", end);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            lista.Add(readRow(reader));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                sqlConnection.close();
                throw new Exception(ex.Message);
            }
            sqlConnection.close();
            return lista;
        }

        public int create(tipoCambioConfig tc)
        {
            string query = string.Format(@"Insert into tipoCambioConfig
                                        (valor,createdBy,createdDate)
                                        values ('{0}','{1}','{2}')",
                                        tc.valor, tc.createBy, tc.createDate);
            return insertUpdateExecute(query);
        }
    }
}
