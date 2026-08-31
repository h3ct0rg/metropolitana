using Common.model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace DataBase.management
{
    public class formaPagoManagement : gestorDB
    {
        private formaPago readRow(SqlDataReader reader)
        {
            formaPago fp = new formaPago();
            fp.id = GetInt32ByName(reader, "id");
            fp.nombre = GetStringByName(reader, "nombre");
            fp.moneda = GetStringByName(reader, "moneda");
            fp.areasAplicables = GetStringByName(reader, "areasAplicables");
            fp.requiereCuentaBancaria = GetBooleanByName(reader, "requiereCuentaBancaria");
            fp.activo = GetBooleanByName(reader, "activo");
            fp.orden = GetInt32ByName(reader, "orden");
            fp.createBy = GetInt32ByName(reader, "createdBy");
            fp.createDate = GetDateTimeByName(reader, "createdDate");
            fp.modify = GetInt32ByName(reader, "modifyBy");
            fp.modifyDate = GetDateTimeByName(reader, "modifyDate");
            return fp;
        }

        public List<formaPago> getListFormaPago()
        {
            List<formaPago> lista = new List<formaPago>();
            sqlConnection.open();
            string query = "select * from formaPago order by orden, id";
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

        public List<formaPago> getListFormaPagoActivos()
        {
            List<formaPago> lista = new List<formaPago>();
            sqlConnection.open();
            string query = "select * from formaPago where activo = 1 order by orden, id";
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

        public formaPago getFormaPago(int id)
        {
            formaPago fp = null;
            sqlConnection.open();
            string query = string.Format("select * from formaPago where id = {0}", id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            fp = readRow(reader);
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
            return fp;
        }

        // No physical delete: id=3 (Cheque) y cualquier forma de pago retirada
        // se desactivan (activo=0), nunca se borran, porque ND/OP históricas
        // ya los referencian.
        public int createFormaPago(formaPago fp)
        {
            string query = string.Format(@"Insert into formaPago
                                        (nombre,moneda,areasAplicables,requiereCuentaBancaria,activo,orden,createdBy,createdDate)
                                        values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}')",
                                        fp.nombre, fp.moneda, fp.areasAplicables, fp.requiereCuentaBancaria ? 1 : 0,
                                        fp.activo ? 1 : 0, fp.orden, fp.createBy, fp.createDate);
            return insertUpdateExecute(query);
        }

        public int updateFormaPago(formaPago fp)
        {
            string query = string.Format(@"Update formaPago
                                        set nombre='{0}',moneda='{1}',areasAplicables='{2}',requiereCuentaBancaria='{3}',
                                        activo='{4}',orden='{5}',modifyBy='{6}',modifyDate='{7}'
                                        where id={8}",
                                        fp.nombre, fp.moneda, fp.areasAplicables, fp.requiereCuentaBancaria ? 1 : 0,
                                        fp.activo ? 1 : 0, fp.orden, fp.modify, fp.modifyDate, fp.id);
            return insertUpdateExecute(query);
        }
    }
}
