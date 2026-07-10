using DataBase.model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataBase.management
{
    public class userManagement : gestorDB
    {
        public int createUser(User userD)
        {
            string query = string.Format(@"Insert into usersCompany (nombre,ci,email,usuario,pass,
                                        idRole,idSucursal,
                                        createdBy, createdDate)
                                        values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}')",
                                        userD.nombre, userD.ci, userD.email, userD.usuarioCompany, userD.password,
                                        getListRole(userD.idRole), userD.idSucursal,
                                        userD.createdBy, userD.createdDate);
            return base.insertUpdateExecute(query);
        }

        public int updateUser(User userD)
        {
            string query = string.Format(@"Update usersCompany 
                                        set nombre='{0}',ci='{1}',email='{2}',usuario='{3}',pass='{4}',
                                        idRole='{5}',idSucursal='{6}',
                                        modifyBy = '{7}', modifieDate='{8}'
                                        where id={9}",
                                        userD.nombre, userD.ci, userD.email, userD.usuarioCompany, userD.password, 
                                        getListRole(userD.idRole), userD.idSucursal,
                                        userD.modifyBy, userD.modifieDate,
                                        userD.id
                                        );
            return insertUpdateExecute(query);
        }

        public List<User> getUserList()
        {
            List<User> listR = new List<User>();
            User usuario = new User();
            base.sqlConnection.open();

            string query = string.Format("select * from usersCompany");
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            usuario = new User();
                            usuario.id = reader.GetInt32(0);
                            usuario.nombre = reader.GetString(1);
                            usuario.ci = reader.GetString(2);
                            usuario.email = reader.GetString(3);
                            usuario.usuarioCompany = reader.GetString(4);
                            usuario.password = reader.GetString(5);
                            usuario.idRole.AddRange(getListRoles(reader.GetString(6).Split(',')));
                            usuario.idSucursal = (reader.GetInt32(7));
                            try
                            {
                                usuario.createdBy = reader.GetInt32(8);
                                usuario.createdDate = reader.GetDateTime(9);
                                usuario.modifyBy = reader.GetInt32(10);
                                usuario.modifieDate = reader.GetDateTime(11);
                            }
                            catch { }
                            listR.Add(usuario);
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
            return listR;
        }

        public string getListRole(List<int> roles)
        {
            string role = roles[0].ToString();
            for (int i = 1; i < roles.Count; i++)
            {
                role += ',' + roles[i].ToString();
            }

            return role;
        }

        public User getUser(int id)
        {
            User usuario = new User();
            base.sqlConnection.open();

            string query = string.Format("select * from usersCompany where id ={0}", id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            usuario = new User();
                            usuario.id = reader.GetInt32(0);
                            usuario.nombre = reader.GetString(1);
                            usuario.ci = reader.GetString(2);
                            usuario.email = reader.GetString(3);
                            usuario.usuarioCompany = reader.GetString(4);
                            usuario.password = reader.GetString(5);
                            usuario.idRole.AddRange(getListRoles(reader.GetString(6).Split(',')));
                            usuario.idSucursal = reader.GetInt32(7);
                            
                            try
                            {
                                usuario.createdBy = reader.GetInt32(8);
                                usuario.createdDate = reader.GetDateTime(9);
                                usuario.modifyBy = reader.GetInt32(10);
                                usuario.modifieDate = reader.GetDateTime(11);
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
            return usuario;
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
    }
}
