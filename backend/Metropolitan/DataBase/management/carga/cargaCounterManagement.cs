using DataBase.model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataBase.management
{
    public class cargaCounterManagement : gestorDB
    {
        public List<reportByCounter> getProfitByCounter(DateTime startDate, DateTime endDate)
        {
            startDate = new DateTime(startDate.Year, startDate.Month, startDate.Day, 1, 1, 0);
            endDate = new DateTime(endDate.Year, endDate.Month, endDate.Day, 23, 59, 0);
            reportByCounter lCounter = new reportByCounter();
            List<reportByCounter> listP = new List<reportByCounter>();
            base.sqlConnection.open();

            string query = string.Format(@"select ND.codCounter, CO.nombre,
Sum(ND.totalCounter) as totalCounter, sum(ND.total) as totalSales 
                                    from cargaNotaDebito as ND, cargaOrdenPago as OP 
									, counterCarga as CO
									where 
									ND.codigoUnicoNota = OP.idNotaDebito
									and ND.codCounter = CO.id
                                    and '{1}' > OP.fechaPago and OP.fechaPago > '{0}'
									and ND.codigoUnicoNota>0
									group by ND.codCounter, CO.nombre
									order by ND.codCounter", startDate, endDate);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            lCounter = new reportByCounter();
                            lCounter.id = reader.GetInt32(0);
                            lCounter.nombre = reader.GetString(1);
                            lCounter.total = reader.GetDouble(2);
                            lCounter.totalSales = reader.GetDouble(3);
                            listP.Add(lCounter);
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


        public List<Counter> getListCounter()
        {
            Counter lCounter = new Counter();
            List<Counter> listP = new List<Counter>();
            base.sqlConnection.open();

            string query = string.Format("select * from counterCarga order by nombre");
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            lCounter = new Counter();
                            lCounter.id = reader.GetInt32(0);
                            lCounter.name = reader.GetString(1);
                            lCounter.nombreCod = reader.GetString(2);
                            lCounter.direccion = reader.GetString(3);
                            lCounter.telefono = reader.GetString(4);
                            try
                            {
                                lCounter.porcentajeNormal = reader.GetDouble(5);
                            }
                            catch
                            {
                                lCounter.porcentajeNormal = 10;
                            }
                            try
                            {
                                lCounter.porcentajeLow = reader.GetDouble(6);
                            }
                            catch
                            {
                                lCounter.porcentajeLow = 10;
                            }
                            try
                            {
                                lCounter.porcentajeCorp = reader.GetDouble(7);
                            }
                            catch
                            {
                                lCounter.porcentajeCorp = 10;
                            }
                            try
                            {
                                lCounter.porcentajeEspecial = reader.GetDouble(8);
                            }
                            catch
                            {
                                lCounter.porcentajeEspecial = 10;
                            }
                            try
                            {
                                lCounter.idAgencia = reader.GetInt32(9);
                            }
                            catch
                            {

                            }
                            lCounter.idsProveedores = reader.GetString(10);
                            lCounter.idSucursal = reader.GetInt32(11);
                            try
                            {
                                lCounter.createBy = reader.GetInt32(12);
                                lCounter.modify = reader.GetInt32(13);
                                lCounter.createDate = reader.GetDateTime(14);
                                lCounter.modifyDate = reader.GetDateTime(15);
                            }
                            catch { }
                            listP.Add(lCounter);
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

        public List<Counter> getCounterBySucursal(int id)
        {
            List<Counter> listCounter = new List<Counter>();
            Counter lCounter = new Counter();

            base.sqlConnection.open();

            string query = string.Format("select * from counterCarga where idSucursal = '{0}' order by nombre", id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            lCounter = new Counter();
                            lCounter.id = reader.GetInt32(0);
                            lCounter.name = reader.GetString(1);
                            lCounter.nombreCod = reader.GetString(2);
                            lCounter.direccion = reader.GetString(3);
                            lCounter.telefono = reader.GetString(4);
                            try
                            {
                                lCounter.porcentajeNormal = reader.GetDouble(5);
                            }
                            catch
                            {
                                lCounter.porcentajeNormal = 10;
                            }
                            try
                            {
                                lCounter.porcentajeLow = reader.GetDouble(6);
                            }
                            catch
                            {
                                lCounter.porcentajeLow = 10;
                            }
                            try
                            {
                                lCounter.porcentajeCorp = reader.GetDouble(7);
                            }
                            catch
                            {
                                lCounter.porcentajeCorp = 10;
                            }
                            try
                            {
                                lCounter.porcentajeEspecial = reader.GetDouble(8);
                            }
                            catch
                            {
                                lCounter.porcentajeEspecial = 10;
                            }
                            try
                            {
                                lCounter.idAgencia = reader.GetInt32(9);
                            }
                            catch
                            {

                            }
                            lCounter.idsProveedores = reader.GetString(10);
                            lCounter.idSucursal = reader.GetInt32(11);
                            try
                            {
                                lCounter.createBy = reader.GetInt32(12);
                                lCounter.modify = reader.GetInt32(13);
                                lCounter.createDate = reader.GetDateTime(14);
                                lCounter.modifyDate = reader.GetDateTime(15);
                            }
                            catch { }

                            listCounter.Add(lCounter);
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
            return listCounter;
        }


        public List<Counter> getCounterByProveedor(int id)
        {
            List<Counter> listCounter = new List<Counter>();
            Counter lCounter = new Counter();

            base.sqlConnection.open();

            string query = string.Format("select * from counterCarga where CHARINDEX('{0}',counter.idsProveedores)>0 order by nombre", id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            lCounter = new Counter();
                            lCounter.id = reader.GetInt32(0);
                            lCounter.name = reader.GetString(1);
                            lCounter.nombreCod = reader.GetString(2);
                            lCounter.direccion = reader.GetString(3);
                            lCounter.telefono = reader.GetString(4);
                            try
                            {
                                lCounter.porcentajeNormal = reader.GetDouble(5);
                            }
                            catch
                            {
                                lCounter.porcentajeNormal = 10;
                            }
                            try
                            {
                                lCounter.porcentajeLow = reader.GetDouble(6);
                            }
                            catch
                            {
                                lCounter.porcentajeLow = 10;
                            }
                            try
                            {
                                lCounter.porcentajeCorp = reader.GetDouble(7);
                            }
                            catch
                            {
                                lCounter.porcentajeCorp = 10;
                            }
                            try
                            {
                                lCounter.porcentajeEspecial = reader.GetDouble(8);
                            }
                            catch
                            {
                                lCounter.porcentajeEspecial = 10;
                            }
                            try
                            {
                                lCounter.idAgencia = reader.GetInt32(9);
                            }
                            catch
                            {

                            }
                            lCounter.idsProveedores = reader.GetString(10);
                            lCounter.idSucursal = reader.GetInt32(11);
                            try
                            {
                                lCounter.createBy = reader.GetInt32(12);
                                lCounter.modify = reader.GetInt32(13);
                                lCounter.createDate = reader.GetDateTime(14);
                                lCounter.modifyDate = reader.GetDateTime(15);
                            }
                            catch { }

                            listCounter.Add(lCounter);
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
            return listCounter;
        }


        public List<Counter> getCounterByClient(int id)
        {
            List<Counter> listCounter = new List<Counter>();
            Counter lCounter = new Counter();

            base.sqlConnection.open();

            string query = string.Format("select * from counterCarga where idAgencia='{0}' order by nombre", id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            lCounter = new Counter();
                            lCounter.id = reader.GetInt32(0);
                            lCounter.name = reader.GetString(1);
                            lCounter.nombreCod = reader.GetString(2);
                            lCounter.direccion = reader.GetString(3);
                            lCounter.telefono = reader.GetString(4);
                            try
                            {
                                lCounter.porcentajeNormal = reader.GetDouble(5);
                            }
                            catch
                            {
                                lCounter.porcentajeNormal = 10;
                            }
                            try
                            {
                                lCounter.porcentajeLow = reader.GetDouble(6);
                            }
                            catch
                            {
                                lCounter.porcentajeLow = 10;
                            }
                            try
                            {
                                lCounter.porcentajeCorp = reader.GetDouble(7);
                            }
                            catch
                            {
                                lCounter.porcentajeCorp = 10;
                            }
                            try
                            {
                                lCounter.porcentajeEspecial = reader.GetDouble(8);
                            }
                            catch
                            {
                                lCounter.porcentajeEspecial = 10;
                            }
                            try
                            {
                                lCounter.idAgencia = reader.GetInt32(9);
                            }
                            catch
                            {

                            }
                            lCounter.idsProveedores = reader.GetString(10);
                            lCounter.idSucursal = reader.GetInt32(11);
                            try
                            {
                                lCounter.createBy = reader.GetInt32(12);
                                lCounter.modify = reader.GetInt32(13);
                                lCounter.createDate = reader.GetDateTime(14);
                                lCounter.modifyDate = reader.GetDateTime(15);
                            }
                            catch { }

                            listCounter.Add(lCounter);
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
            return listCounter;
        }

        public Counter getCounter(int id)
        {
            Counter lCounter = new Counter();

            base.sqlConnection.open();

            string query = string.Format("select * from counterCarga where id = '{0}' order by nombre", id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            lCounter = new Counter();
                            lCounter.id = reader.GetInt32(0);
                            lCounter.name = reader.GetString(1);
                            lCounter.nombreCod = reader.GetString(2);
                            lCounter.direccion = reader.GetString(3);
                            lCounter.telefono = reader.GetString(4);
                            try
                            {
                                lCounter.porcentajeNormal = reader.GetDouble(5);
                            }
                            catch
                            {
                                lCounter.porcentajeNormal = 10;
                            }
                            try
                            {
                                lCounter.porcentajeLow = reader.GetDouble(6);
                            }
                            catch
                            {
                                lCounter.porcentajeLow = 10;
                            }
                            try
                            {
                                lCounter.porcentajeCorp = reader.GetDouble(7);
                            }
                            catch
                            {
                                lCounter.porcentajeCorp = 10;
                            }
                            try
                            {
                                lCounter.porcentajeEspecial = reader.GetDouble(8);
                            }
                            catch
                            {
                                lCounter.porcentajeEspecial = 10;
                            }
                            try
                            {
                                lCounter.idAgencia = reader.GetInt32(9);
                            }
                            catch
                            {

                            }
                            lCounter.idsProveedores = reader.GetString(10);
                            lCounter.idSucursal = reader.GetInt32(11);
                            try
                            {
                                lCounter.createBy = reader.GetInt32(12);
                                lCounter.modify = reader.GetInt32(13);
                                lCounter.createDate = reader.GetDateTime(14);
                                lCounter.modifyDate = reader.GetDateTime(15);
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
            return lCounter;
        }

        public Counter getCounterByName(string counterName)
        {
            Counter lCounter = new Counter();

            base.sqlConnection.open();

            string query = string.Format("select * from counterCarga where nombreCod = '{0}' order by nombre", counterName);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            lCounter = new Counter();
                            lCounter.id = reader.GetInt32(0);
                            lCounter.name = reader.GetString(1);
                            lCounter.nombreCod = reader.GetString(2);
                            lCounter.direccion = reader.GetString(3);
                            lCounter.telefono = reader.GetString(4);
                            try
                            {
                                lCounter.porcentajeNormal = reader.GetDouble(5);
                            }
                            catch
                            {
                                lCounter.porcentajeNormal = 10;
                            }
                            try
                            {
                                lCounter.porcentajeLow = reader.GetDouble(6);
                            }
                            catch
                            {
                                lCounter.porcentajeLow = 10;
                            }
                            try
                            {
                                lCounter.porcentajeCorp = reader.GetDouble(7);
                            }
                            catch
                            {
                                lCounter.porcentajeCorp = 10;
                            }
                            try
                            {
                                lCounter.porcentajeEspecial = reader.GetDouble(8);
                            }
                            catch
                            {
                                lCounter.porcentajeEspecial = 10;
                            }
                            try
                            {
                                lCounter.idAgencia = reader.GetInt32(9);
                            }
                            catch
                            {

                            }
                            lCounter.idsProveedores = reader.GetString(10);
                            lCounter.idSucursal = reader.GetInt32(11);
                            try
                            {
                                lCounter.createBy = reader.GetInt32(12);
                                lCounter.modify = reader.GetInt32(13);
                                lCounter.createDate = reader.GetDateTime(14);
                                lCounter.modifyDate = reader.GetDateTime(15);
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
            return lCounter;
        }

        public Counter getCounterByNombreCod(string counterName)
        {
            Counter lCounter = new Counter();

            base.sqlConnection.open();

            string query = string.Format("select * from counterCarga where nombreCod = '{0}' order by nombre", counterName);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            lCounter = new Counter();
                            lCounter.id = reader.GetInt32(0);
                            lCounter.name = reader.GetString(1);
                            lCounter.nombreCod = reader.GetString(2);
                            lCounter.direccion = reader.GetString(3);
                            lCounter.telefono = reader.GetString(4);
                            try
                            {
                                lCounter.porcentajeNormal = reader.GetDouble(5);
                            }
                            catch
                            {
                                lCounter.porcentajeNormal = 10;
                            }
                            try
                            {
                                lCounter.porcentajeLow = reader.GetDouble(6);
                            }
                            catch
                            {
                                lCounter.porcentajeLow = 10;
                            }
                            try
                            {
                                lCounter.porcentajeCorp = reader.GetDouble(7);
                            }
                            catch
                            {
                                lCounter.porcentajeCorp = 10;
                            }
                            try
                            {
                                lCounter.porcentajeEspecial = reader.GetDouble(8);
                            }
                            catch
                            {
                                lCounter.porcentajeEspecial = 10;
                            }
                            try
                            {
                                lCounter.idAgencia = reader.GetInt32(9);
                            }
                            catch
                            {

                            }
                            lCounter.idsProveedores = reader.GetString(10);
                            lCounter.idSucursal = reader.GetInt32(11);
                            try
                            {
                                lCounter.createBy = reader.GetInt32(12);
                                lCounter.modify = reader.GetInt32(13);
                                lCounter.createDate = reader.GetDateTime(14);
                                lCounter.modifyDate = reader.GetDateTime(15);
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
            return lCounter;
        }

        public int createCounter(Counter provee)
        {
            string query = string.Format(@"Insert into counterCarga (nombre,nombreCod,direccion,telefono,
                                        porcentajeNormal,porcentajeLowCost,porcentajeCorp,
                                        porcentajeEspecial,idAgencia,idsProveedores,idSucursal,
                                        createdBy,createdDate)
                                        values ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}','{12}')",
                                        provee.name, provee.nombreCod, provee.direccion, provee.telefono,
                                        provee.porcentajeNormal, provee.porcentajeLow, provee.porcentajeCorp,
                                        provee.porcentajeEspecial, provee.idAgencia, provee.idsProveedores, provee.idSucursal,
                                        provee.createBy, provee.createDate);
            return base.insertUpdateExecute(query);
        }

        public int updateCounter(Counter provee)
        {
            string query = string.Format(@"Update counterCarga 
                                        set nombre='{0}',nombreCod='{1}',direccion='{2}',telefono='{3}',
                                        porcentajeNormal='{4}', porcentajeLowCost='{5}', porcentajeCorp='{6}', 
                                        porcentajeEspecial='{7}',idAgencia='{8}',idsProveedores='{9}',idSucursal='{10}',
                                        modifyBy={11},modifyDate='{12}'
                                        where id={13}",
                                        provee.name, provee.nombreCod, provee.direccion, provee.telefono, provee.porcentajeNormal,
                                        provee.porcentajeLow, provee.porcentajeCorp, provee.porcentajeEspecial, provee.idAgencia, provee.idsProveedores, provee.idSucursal,
                                        provee.modify, provee.modifyDate, provee.id);
            return insertUpdateExecute(query);
        }

        public int deleteCounter(string provee)
        {
            string query = string.Format(@"delete from counterCarga where id={0}", provee);
            return insertUpdateExecute(query);
        }
    }
}
