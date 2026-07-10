using DataBase.model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataBase.management
{
    public class sucursalesManagement : gestorDB
    {
        public List<sucursales> getListSucursales()
        {
            sucursales lsucursal = new sucursales();
            List<sucursales> listSucursal = new List<sucursales>();
            base.sqlConnection.open();

            string query = string.Format("select * from sucursales");
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            lsucursal = new sucursales();
                            lsucursal.id = reader.GetInt32(0);
                            lsucursal.nombre = reader.GetString(1);
                            lsucursal.direccion = reader.GetString(2);
                            lsucursal.telefono = reader.GetString(3);
                            lsucursal.email = reader.GetString(4);
                            lsucursal.idEncargado = reader.GetInt32(5);
                            
                            try
                            {
                                lsucursal.createBy = reader.GetInt32(6);
                                lsucursal.modify = reader.GetInt32(7);
                                lsucursal.createDate = reader.GetDateTime(8);
                                lsucursal.modifyDate = reader.GetDateTime(9);
                            }
                            catch { }
                            listSucursal.Add(lsucursal);
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
            return listSucursal;
        }

        public sucursales getSucursal(int id)
        {
            sucursales lsucursal = new sucursales();
            base.sqlConnection.open();

            string query = string.Format("select * from sucursales where id="+id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            lsucursal = new sucursales();
                            lsucursal.id = reader.GetInt32(0);
                            lsucursal.nombre = reader.GetString(1);
                            lsucursal.direccion = reader.GetString(2);
                            lsucursal.telefono = reader.GetString(3);
                            lsucursal.email = reader.GetString(4);
                            lsucursal.idEncargado = reader.GetInt32(5);

                            try
                            {
                                lsucursal.createBy = reader.GetInt32(11);
                                lsucursal.modify = reader.GetInt32(12);
                                lsucursal.createDate = reader.GetDateTime(13);
                                lsucursal.modifyDate = reader.GetDateTime(14);
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
            return lsucursal;
        }


        public int createSucursal(sucursales sucursal)
        {
            string query = string.Format(@"Insert into sucursales 
                                        (nombre,direccion,telefonos,email,
                                        idEncargado,
                                        createdby,createdate)
                                        values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}')",
                                        sucursal.nombre, sucursal.direccion, sucursal.telefono, sucursal.email,
                                        sucursal.idEncargado,
                                        sucursal.createBy, sucursal.createDate);
            return base.insertUpdateExecute(query);
        }

        public int updateSucursal(sucursales sucursal)
        {
            string query = string.Format(@"Update sucursales 
                                        set nombre='{0}',direccion='{1}',telefonos='{2}',email='{3}',
                                        idEncargado='{4}',
                                        modifyBy={5},modifydate='{6}'
                                        where id={7}",
                                        sucursal.nombre, sucursal.direccion, sucursal.telefono, sucursal.email,
                                        sucursal.idEncargado,
                                        sucursal.modify, sucursal.modifyDate, sucursal.id);
            return insertUpdateExecute(query);
        }
    }
}
