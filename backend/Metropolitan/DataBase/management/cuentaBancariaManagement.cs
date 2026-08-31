using Common.model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace DataBase.management
{
    public class cuentaBancariaManagement : gestorDB
    {
        private cuentaBancaria readRow(SqlDataReader reader)
        {
            cuentaBancaria cb = new cuentaBancaria();
            cb.id = GetInt32ByName(reader, "id");
            cb.nombre = GetStringByName(reader, "nombre");
            cb.moneda = GetStringByName(reader, "moneda");
            cb.activo = GetBooleanByName(reader, "activo");
            cb.createBy = GetInt32ByName(reader, "createdBy");
            cb.createDate = GetDateTimeByName(reader, "createdDate");
            cb.modify = GetInt32ByName(reader, "modifyBy");
            cb.modifyDate = GetDateTimeByName(reader, "modifyDate");
            return cb;
        }

        public List<cuentaBancaria> getListCuentaBancaria()
        {
            List<cuentaBancaria> lista = new List<cuentaBancaria>();
            sqlConnection.open();
            string query = "select * from cuentaBancaria order by id";
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

        public List<cuentaBancaria> getListCuentaBancariaActivas(string moneda = null)
        {
            List<cuentaBancaria> lista = new List<cuentaBancaria>();
            sqlConnection.open();
            string query = string.IsNullOrEmpty(moneda)
                ? "select * from cuentaBancaria where activo = 1 order by id"
                : string.Format("select * from cuentaBancaria where activo = 1 and moneda = '{0}' order by id", moneda);
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

        public cuentaBancaria getCuentaBancaria(int id)
        {
            cuentaBancaria cb = null;
            sqlConnection.open();
            string query = string.Format("select * from cuentaBancaria where id = {0}", id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            cb = readRow(reader);
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
            return cb;
        }

        public int createCuentaBancaria(cuentaBancaria cb)
        {
            string query = string.Format(@"Insert into cuentaBancaria
                                        (nombre,moneda,activo,createdBy,createdDate)
                                        values ('{0}','{1}','{2}','{3}','{4}')",
                                        cb.nombre, cb.moneda, cb.activo ? 1 : 0, cb.createBy, cb.createDate);
            return insertUpdateExecute(query);
        }

        public int updateCuentaBancaria(cuentaBancaria cb)
        {
            string query = string.Format(@"Update cuentaBancaria
                                        set nombre='{0}',moneda='{1}',activo='{2}',modifyBy='{3}',modifyDate='{4}'
                                        where id={5}",
                                        cb.nombre, cb.moneda, cb.activo ? 1 : 0, cb.modify, cb.modifyDate, cb.id);
            return insertUpdateExecute(query);
        }
    }
}
