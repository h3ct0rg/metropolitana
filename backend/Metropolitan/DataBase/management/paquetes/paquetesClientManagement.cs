using DataBase.model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataBase
{
    public class paquetesClientManagement
    {
        public connectionDB sqlConnection = new connectionDB();
                
        public int updateClient(clients Client)
        {
            string query = string.Format(@"Update clientePaquetes 
                                        set nombre='{0}',telefonos='{1}',fax='{2}',contacto='{3}',ruc='{4}',
                                            direccion='{5}',casilla='{6}',cargo='{7}'
                                            ,idSucursal='{8}', idCiudad='{9}'
                                        ,modifyBy={10},modifydate='{11}'
                                        where id={12}",
                                        Client.name, Client.telefono, Client.fax, Client.contacto, Client.ruc, Client.direccion, Client.casilla, Client.cargo,
                                        Client.idSucursal, Client.idCiudad,
                                         Client.modify, Client.modifyDate, Client.id);
            return insertUpdateExecute(query);

        }

        public int deleteClient(string Client)
        {
            string query = string.Format(@"delete from clientePaquetes where id='{0}'", Client);
            return insertUpdateExecute(query);

        }

        public int insertUpdateExecute(string query)
        {
            clients Client = new clients();
            sqlConnection.open();

            int result = -1;
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    result = command.ExecuteNonQuery();
                }
            }
            catch (Exception ex)
            {
                sqlConnection.close();
                throw new Exception(ex.Message);
            }
            sqlConnection.close();
            return result;
        }

        public int createClient(clients Client)
        {
            string query = string.Format(@"Insert into clientePaquetes (
                                            nombre,telefonos,fax,contacto,ruc,
                                            direccion,casilla,cargo,idSucursal,idCiudad,
                                            createdby,createdate)
                                        values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}')",
                                        Client.name, Client.telefono, Client.fax, Client.contacto, Client.ruc,
                                        Client.direccion, Client.casilla, Client.cargo, Client.idSucursal, Client.idCiudad
                                        , Client.createBy, Client.createDate);
            return insertUpdateExecute(query);

        }

        public clients getListClients(int id)
        {
            clients Client = new clients();
            sqlConnection.open();
            string query = string.Format("select * from clientePaquetes where id = " + id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Client.id = reader.GetInt32(0);
                            Client.name = reader.GetString(1);
                            Client.telefono = reader.GetString(2);
                            Client.fax = reader.GetString(3);
                            Client.contacto = reader.GetString(4);
                            Client.ruc = reader.GetString(5);
                            Client.direccion = reader.GetString(6);
                            try
                            {
                                Client.casilla = reader.GetString(7);
                            }
                            catch { }
                            Client.cargo = reader.GetString(8);
                            Client.idSucursal = reader.GetInt32(9);
                            Client.idCiudad = reader.GetInt32(10);
                            try
                            {
                                Client.createBy = reader.GetInt32(11);
                                Client.modify = reader.GetInt32(12);
                                Client.createDate = reader.GetDateTime(13);
                                Client.modifyDate = reader.GetDateTime(14);
                            }
                            catch { }
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
            return Client;
        }

        public List<clients> getListClients()
        {
            clients Client = new clients();
            List<clients> lclient = new List<clients>();
            sqlConnection.open();
            string query = string.Format("select * from clientePaquetes order by nombre");
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        int count = 0;
                        while (reader.Read())
                        {
                            Client = new clients();
                            Client.id = reader.GetInt32(0);
                            Client.name = reader.GetString(1);
                            Client.telefono = reader.GetString(2);
                            Client.fax = reader.GetString(3);
                            Client.contacto = reader.GetString(4);
                            Client.ruc = reader.GetString(5);
                            Client.direccion = reader.GetString(6);
                            try
                            {
                                Client.casilla = reader.GetString(7);
                            }
                            catch { }
                            Client.cargo = reader.GetString(8);
                            Client.idSucursal = reader.GetInt32(9);
                            try
                            {
                                Client.createBy = reader.GetInt32(10);
                                Client.modify = reader.GetInt32(11);
                                Client.createDate = reader.GetDateTime(12);
                                Client.modifyDate = reader.GetDateTime(13);
                            }
                            catch { }
                            lclient.Add(Client);
                            //if (count > 10)
                            //    break;
                            count++;
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
            return lclient;
        }

        public List<clients> getListClientsBySucursal(int id)
        {
            clients Client = new clients();
            List<clients> lclient = new List<clients>();
            sqlConnection.open();
            string query = string.Format("select * from clientePaquetes where idSucursal = '{0}' order by nombre", id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        int count = 0;
                        while (reader.Read())
                        {
                            Client = new clients();
                            Client.id = reader.GetInt32(0);
                            Client.name = reader.GetString(1);
                            Client.telefono = reader.GetString(2);
                            Client.fax = reader.GetString(3);
                            Client.contacto = reader.GetString(4);
                            Client.ruc = reader.GetString(5);
                            Client.direccion = reader.GetString(6);
                            try
                            {
                                Client.casilla = reader.GetString(7);
                            }
                            catch { }
                            Client.cargo = reader.GetString(8);
                            Client.idSucursal = reader.GetInt32(9);
                            Client.idCiudad = reader.GetInt32(10);
                            try
                            {
                                Client.createBy = reader.GetInt32(11);
                                Client.modify = reader.GetInt32(12);
                                Client.createDate = reader.GetDateTime(13);
                                Client.modifyDate = reader.GetDateTime(14);
                            }
                            catch { }
                            lclient.Add(Client);
                            count++;
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
            return lclient;
        }
    }
}
