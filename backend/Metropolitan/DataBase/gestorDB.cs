using DataBase.model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataBase
{
    public class gestorDB
    {
        public connectionDB sqlConnection = new connectionDB();

        public User verifyLogin(Login userCredentials)
        {
            User result = getUserData(userCredentials);
            if (result != null)
            {
                return result;
            }
            return null;
        }

        public User getUserData(Login userCredentials)
        {
            User localUser = new User();
            sqlConnection.open();
            string query = string.Format("select * from usersCompany where usuario = '{0}' and pass = '{1}'", userCredentials.User, userCredentials.Password);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            localUser.id = reader.GetInt32(0);
                            localUser.nombre = reader.GetString(1);
                            localUser.ci = reader.GetString(2);
                            localUser.email = reader.GetString(3);
                            localUser.usuarioCompany = reader.GetString(4);
                            localUser.password = reader.GetString(5);
                            localUser.idRole.AddRange(getListRoles(reader.GetString(6).Split(',')));
                            localUser.idSucursal = reader.GetInt32(7);

                            try
                            {
                                localUser.createdBy = reader.GetInt32(8);
                                localUser.createdDate = reader.GetDateTime(9);
                                localUser.modifyBy = reader.GetInt32(10);
                                localUser.modifieDate = reader.GetDateTime(11);
                            }
                            catch (Exception ex) { }
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
            return localUser;
        }

        private List<int> getListRoles(string[] listRoles)
        {
            List<int> rl = new List<int>();
            foreach (string item in listRoles)
            {
                rl.Add(Convert.ToInt32(item));
            }
            return rl;
        }

        public int updateClient(clients Client)
        {
            string query = string.Format(@"Update clients 
                                        set nombre='{0}',telefonos='{1}',fax='{2}',contacto='{3}',ruc='{4}',
                                            direccion='{5}',casilla='{6}',cargo='{7}'
                                            ,idSucursal='{8}', idCiudad='{9}',
                                        ,modifyBy={10},modifydate='{11}'
                                        where id={12}",
                                        Client.name, Client.telefono, Client.fax, Client.contacto, Client.ruc, Client.direccion, Client.casilla, Client.cargo,
                                        Client.idSucursal, Client.idCiudad,
                                         Client.modify, Client.modifyDate, Client.id);
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
            string query = string.Format(@"Insert into clients (
                                            nombre,telefonos,fax,contacto,ruc,
                                            direccion,casilla,cargo,idSucursal,idCiudad,
                                            createdby,createdate)
                                        values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}')",
                                        Client.name, Client.telefono, Client.fax, Client.contacto, Client.ruc,
                                        Client.direccion, Client.casilla, Client.cargo, Client.idSucursal, Client.idCiudad
                                        , Client.createBy, Client.createDate);
            return insertUpdateExecute(query);

        }

        public int deleteClient(string Client)
        {
            string query = string.Format(@"delete from clients where id = '{0}'",Client);
            return insertUpdateExecute(query);
        }

        protected static int GetOrdinalOrDefault(SqlDataReader reader, string columnName)
        {
            try
            {
                return reader.GetOrdinal(columnName);
            }
            catch (IndexOutOfRangeException)
            {
                return -1;
            }
        }

        protected string GetStringByName(SqlDataReader reader, string columnName)
        {
            int i = GetOrdinalOrDefault(reader, columnName);
            return (i < 0 || reader.IsDBNull(i)) ? "" : reader.GetString(i);
        }

        protected int GetInt32ByName(SqlDataReader reader, string columnName)
        {
            int i = GetOrdinalOrDefault(reader, columnName);
            return (i < 0 || reader.IsDBNull(i)) ? 0 : reader.GetInt32(i);
        }

        protected double GetDoubleByName(SqlDataReader reader, string columnName)
        {
            int i = GetOrdinalOrDefault(reader, columnName);
            return (i < 0 || reader.IsDBNull(i)) ? 0 : reader.GetDouble(i);
        }

        protected DateTime GetDateTimeByName(SqlDataReader reader, string columnName)
        {
            int i = GetOrdinalOrDefault(reader, columnName);
            return (i < 0 || reader.IsDBNull(i)) ? default(DateTime) : reader.GetDateTime(i);
        }

        private clients readClientRow(SqlDataReader reader)
        {
            clients Client = new clients();
            Client.id = GetInt32ByName(reader, "id");
            Client.name = GetStringByName(reader, "nombre");
            Client.telefono = GetStringByName(reader, "telefonos");
            Client.fax = GetStringByName(reader, "fax");
            Client.contacto = GetStringByName(reader, "contacto");
            Client.ruc = GetStringByName(reader, "ruc");
            Client.direccion = GetStringByName(reader, "direccion");
            Client.casilla = GetStringByName(reader, "casilla");
            Client.cargo = GetStringByName(reader, "cargo");
            Client.idSucursal = GetInt32ByName(reader, "idSucursal");
            Client.idCiudad = GetInt32ByName(reader, "idCiudad");
            Client.createBy = GetInt32ByName(reader, "createdby");
            Client.modify = GetInt32ByName(reader, "modifyBy");
            Client.createDate = GetDateTimeByName(reader, "createdate");
            Client.modifyDate = GetDateTimeByName(reader, "modifydate");
            return Client;
        }

        public clients getListClients(int id)
        {
            clients Client = new clients();
            sqlConnection.open();
            string query = string.Format("select * from clients where id = " + id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Client = readClientRow(reader);
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
            List<clients> lclient = new List<clients>();
            sqlConnection.open();
            string query = string.Format("select * from clients order by nombre");
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            lclient.Add(readClientRow(reader));
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
            List<clients> lclient = new List<clients>();
            sqlConnection.open();
            string query = string.Format("select * from clients where idSucursal = '{0}' order by nombre", id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            lclient.Add(readClientRow(reader));
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
