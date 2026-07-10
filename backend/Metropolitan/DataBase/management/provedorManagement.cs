using DataBase.model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataBase.management
{
    public class ProvedorManagement : gestorDB
    {
        public List<proveedor> getListProveedores()
        {
            proveedor proveedor = new proveedor();
            List<proveedor> listP = new List<proveedor>();
            base.sqlConnection.open();

            string query = string.Format("select * from proveedor");
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            proveedor = new proveedor();
                            proveedor.id = reader.GetInt32(0);
                            proveedor.name = reader.GetString(1);
                            proveedor.direccion = reader.GetString(2);
                            proveedor.telefono = reader.GetString(3);
                            try
                            {
                                proveedor.createBy = reader.GetInt32(4);
                                proveedor.modify = reader.GetInt32(5);
                                proveedor.createDate = reader.GetDateTime(6);
                                proveedor.modifyDate = reader.GetDateTime(7);
                            }
                            catch { }
                            listP.Add(proveedor);
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
            return listP;
        }

        public proveedor getProveedor(int id)
        {
            proveedor proveedor = new proveedor();
            
            base.sqlConnection.open();

            string query = string.Format("select * from proveedor where id = '{0}'",id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            proveedor = new proveedor();
                            proveedor.id = reader.GetInt32(0);
                            proveedor.name = reader.GetString(1);
                            proveedor.direccion = reader.GetString(2);
                            proveedor.telefono = reader.GetString(3);
                            try
                            {
                                proveedor.createBy = reader.GetInt32(4);
                                proveedor.modify = reader.GetInt32(5);
                                proveedor.createDate = reader.GetDateTime(6);
                                proveedor.modifyDate = reader.GetDateTime(7);
                            }
                            catch { }
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
            return proveedor;
        }

        public int createProveedor(proveedor provee)
        {
            string query = string.Format(@"Insert into proveedor (nombre,direccion,telefono,createdBy,createdDate)
                                        values ('{0}','{1}','{2}','{3}','{4}')",
                                        provee.name, provee.direccion, provee.telefono, provee.createBy, provee.createDate);
            return base.insertUpdateExecute(query);
        }

        public int updateProveedor(proveedor provee)
        {
            string query = string.Format(@"Update proveedor 
                                        set nombre='{0}',direccion='{1}',telefono='{2}',modifyBy={3},modifyDate='{4}'
                                        where id={5}",
                                        provee.name, provee.direccion, provee.telefono, provee.modify, provee.modifyDate, provee.id);
            return insertUpdateExecute(query);
        }
    }
}
