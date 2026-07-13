using DataBase.model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataBase.management
{
    public class OperadorManagement : gestorDB
    {
        private Operadores readOperadorRow(SqlDataReader reader)
        {
            Operadores operador = new Operadores();
            operador.id = GetInt32ByName(reader, "id");
            operador.name = GetStringByName(reader, "nombre");
            operador.direccion = GetStringByName(reader, "direccion");
            operador.telefono = GetStringByName(reader, "telefono");
            operador.porcentajeArgentina = GetDoubleByName(reader, "porcentageArgentina");
            operador.porcentajeAgencia = GetDoubleByName(reader, "porcentajeAgencia");
            operador.counterId = GetInt32ByName(reader, "counterId");
            operador.porcentajeMetropolitana = GetDoubleByName(reader, "porcentajeMetropolitan");
            operador.idSucursal = GetInt32ByName(reader, "idSucursal");
            operador.createBy = GetInt32ByName(reader, "createdBy");
            operador.modify = GetInt32ByName(reader, "modifyBy");
            operador.createDate = GetDateTimeByName(reader, "createdDate");
            operador.modifyDate = GetDateTimeByName(reader, "modifyDate");
            return operador;
        }

        public List<Operadores> getListoperadores()
        {
            List<Operadores> listP = new List<Operadores>();
            base.sqlConnection.open();

            string query = string.Format("select * from operador order by nombre");
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            listP.Add(readOperadorRow(reader));
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
            List<Operadores> listP = new List<Operadores>();
            base.sqlConnection.open();

            string query = string.Format("select * from operador where idSucursal='{0}' order by nombre", id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            listP.Add(readOperadorRow(reader));
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

            string query = string.Format("select * from operador where id = '{0}' order by nombre", id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            operador = readOperadorRow(reader);
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
            string query = string.Format(@"Insert into operador (nombre,direccion,telefono
                                        ,porcentageArgentina,porcentajeAgencia,counterId,porcentajeMetropolitan,idSucursal,
                                        createdBy,createdDate)
                                        values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}')",
                                        provee.name, provee.direccion, provee.telefono,
                                        provee.porcentajeArgentina, provee.porcentajeAgencia, provee.counterId, provee.porcentajeMetropolitana, provee.idSucursal,
                                        provee.createBy, provee.createDate);
            return base.insertUpdateExecute(query);
        }

        public int deleteOperador(string idOperator)
        {
            string query = string.Format(@"delete from operador where id = '{0}'",idOperator);
            return base.insertUpdateExecute(query);
        }

        public int updateoperador(Operadores provee)
        {
            string query = string.Format(@"Update operador 
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

    }
}
