using DataBase.model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataBase.management
{
    public class paquetesOperadorManagement : gestorDB
    {
        public List<Operadores> getListoperadores()
        {
            Operadores operador = new Operadores();
            List<Operadores> listP = new List<Operadores>();
            base.sqlConnection.open();

            string query = string.Format("select * from operadorPaquetes order by nombre");
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            operador = new Operadores();
                            operador.id = reader.GetInt32(0);
                            operador.name = reader.GetString(1);
                            operador.direccion = reader.GetString(2);
                            operador.telefono = reader.GetString(3);
                            operador.porcentajeArgentina = reader.GetDouble(4);
                            operador.porcentajeAgencia = reader.GetDouble(5);
                            operador.counterId = reader.GetInt32(6);
                            operador.porcentajeMetropolitana = reader.GetDouble(7);
                            operador.idSucursal = reader.GetInt32(8);
                            try
                            {
                                operador.createBy = reader.GetInt32(9);
                                operador.modify = reader.GetInt32(10);
                                operador.createDate = reader.GetDateTime(11);
                                operador.modifyDate = reader.GetDateTime(12);
                            }
                            catch { }
                            listP.Add(operador);
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

        public List<Operadores> getListoperadoresBySucursal(int id)
        {
            Operadores operador = new Operadores();
            List<Operadores> listP = new List<Operadores>();
            base.sqlConnection.open();

            string query = string.Format("select * from operadorPaquetes where idSucursal='{0}' order by nombre", id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            operador = new Operadores();
                            operador.id = reader.GetInt32(0);
                            operador.name = reader.GetString(1);
                            operador.direccion = reader.GetString(2);
                            operador.telefono = reader.GetString(3);
                            operador.porcentajeArgentina = reader.GetDouble(4);
                            operador.porcentajeAgencia = reader.GetDouble(5);
                            operador.counterId = reader.GetInt32(6);
                            operador.porcentajeMetropolitana = reader.GetDouble(7);
                            operador.idSucursal = reader.GetInt32(8);
                            try
                            {
                                operador.createBy = reader.GetInt32(9);
                                operador.modify = reader.GetInt32(10);
                                operador.createDate = reader.GetDateTime(11);
                                operador.modifyDate = reader.GetDateTime(12);
                            }
                            catch { }
                            listP.Add(operador);
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

        public Operadores getoperador(int id)
        {
            Operadores operador = new Operadores();

            base.sqlConnection.open();

            string query = string.Format("select * from operadorPaquetes where id = '{0}' order by nombre", id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            operador = new Operadores();
                            operador.id = reader.GetInt32(0);
                            operador.name = reader.GetString(1);
                            operador.direccion = reader.GetString(2);
                            operador.telefono = reader.GetString(3);
                            operador.porcentajeArgentina = reader.GetDouble(4);
                            operador.porcentajeAgencia = reader.GetDouble(5);
                            operador.counterId = reader.GetInt32(6);
                            operador.porcentajeMetropolitana = reader.GetDouble(7);
                            operador.idSucursal = reader.GetInt32(8);
                            try
                            {
                                operador.createBy = reader.GetInt32(9);
                                operador.modify = reader.GetInt32(10);
                                operador.createDate = reader.GetDateTime(11);
                                operador.modifyDate = reader.GetDateTime(12);
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
            return operador;
        }

        public int createoperador(Operadores provee)
        {
            string query = string.Format(@"Insert into operadorPaquetes (nombre,direccion,telefono
                                        ,porcentageArgentina,porcentajeAgencia,counterId,porcentajeMetropolitan,idSucursal,
                                        createdBy,createdDate)
                                        values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}')",
                                        provee.name, provee.direccion, provee.telefono,
                                        provee.porcentajeArgentina, provee.porcentajeAgencia, provee.counterId, provee.porcentajeMetropolitana, provee.idSucursal,
                                        provee.createBy, provee.createDate);
            return base.insertUpdateExecute(query);
        }

        public int updateoperador(Operadores provee)
        {
            string query = string.Format(@"Update operadorPaquetes 
                                        set nombre='{0}',direccion='{1}',telefono='{2}'
                                        ,porcentageArgentina='{3}',porcentajeAgencia='{4}',counterId='{5}'
                                        ,porcentajeMetropolitan='{6}',idSucursal = '{7}'
                                        ,modifyBy={8},modifyDate='{9}'
                                        where id={10}",
                                        provee.name, provee.direccion, provee.telefono,
                                        provee.porcentajeArgentina, provee.porcentajeAgencia, provee.counterId, provee.porcentajeMetropolitana, provee.idSucursal,
                                        provee.modify, provee.modifyDate, provee.id);
            return insertUpdateExecute(query);
        }

        public int deleteOperador(string provee)
        {
            string query = string.Format(@"delete from operadorPaquetes where id={0}", provee);
            return insertUpdateExecute(query);
        }

    }
}
