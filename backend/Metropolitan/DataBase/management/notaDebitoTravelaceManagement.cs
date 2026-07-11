using Common.model;
using DataBase.model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataBase.management
{
    public class NotaDebitoTravelManagement : gestorDB
    {
        public List<notaDebitoTravelace> getListNotaDebito()
        {
            notaDebitoTravelace notadebitoTravelace = new notaDebitoTravelace();
            List<notaDebitoTravelace> listP = new List<notaDebitoTravelace>();
            base.sqlConnection.open();

            string query = string.Format("select * from travelaceNotaDebito order by codigoUnicoNota DESC");
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            notadebitoTravelace = new notaDebitoTravelace();
                            notadebitoTravelace.id = reader.GetInt32(0);
                            notadebitoTravelace.codCliente = reader.GetInt32(1);
                            notadebitoTravelace.codCounter = reader.GetInt32(2);
                            notadebitoTravelace.codOperador = reader.GetInt32(3);
                            notadebitoTravelace.codTipoCambio = reader.GetInt32(4);
                            notadebitoTravelace.fechaGestion = reader.GetDateTime(5);
                            notadebitoTravelace.pasajero = reader.GetString(6);
                            notadebitoTravelace.servicio = reader.GetString(7);
                            notadebitoTravelace.voucher = reader.GetString(8);
                            notadebitoTravelace.fechaVencimiento = reader.GetDateTime(9);

                            notadebitoTravelace.totalArgentina = reader.GetDouble(10);
                            notadebitoTravelace.totalAgencia = reader.GetDouble(11);
                            notadebitoTravelace.totalCounter = reader.GetDouble(12);
                            notadebitoTravelace.totalMetropolitana = reader.GetDouble(13);
                            notadebitoTravelace.total = reader.GetDouble(14);
                            notadebitoTravelace.montoNeto = reader.GetDouble(15);
                            notadebitoTravelace.concepto = reader.GetString(16);
                            notadebitoTravelace.isEspecial = reader.GetInt32(17);
                            notadebitoTravelace.codigoUnico = reader.GetInt32(18);
                            notadebitoTravelace.estado = reader.GetInt32(19);
                            notadebitoTravelace.idSucursal = reader.GetInt32(20);
                            try
                            {
                                notadebitoTravelace.createBy = reader.GetInt32(21);
                                notadebitoTravelace.modify = reader.GetInt32(22);
                                notadebitoTravelace.createDate = reader.GetDateTime(23);
                                notadebitoTravelace.modifyDate = reader.GetDateTime(24);
                            }
                            catch { }
                            listP.Add(notadebitoTravelace);
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

        public List<notaDebitoListTable> getListNotaDebitoBySucursalAndId(int sucursal, int id)
        {
            notaDebitoListTable notadebitoTravelace = new notaDebitoListTable();
            List<notaDebitoListTable> listP = new List<notaDebitoListTable>();
            base.sqlConnection.open();

            string query = string.Format(@"
select ND.id, C.nombre, ND.pasajero, ND.servicios, ND.voucher, ND.total, ND.estado, ND.codigoUnicoNota 
from travelaceNotaDebito as  ND
left join clients as C
on C.id = ND.codCliente
where ND.idSucursal='{0}' 
and ND.codigoUnicoNota = '{1}' 
order by ND.codigoUnicoNota DESC
", sucursal, id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            notadebitoTravelace = new notaDebitoListTable();
                            notadebitoTravelace.id = reader.GetInt32(0);
                            notadebitoTravelace.codCliente = reader.GetString(1);
                            notadebitoTravelace.pasajero = reader.GetString(2);
                            notadebitoTravelace.servicio = reader.GetString(3);
                            notadebitoTravelace.voucher = reader.GetString(4);
                            notadebitoTravelace.total = reader.GetDouble(5);
                            notadebitoTravelace.estado = reader.GetInt32(6);
                            notadebitoTravelace.codigoUnico = reader.GetInt32(7);
                            listP.Add(notadebitoTravelace);
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

        public List<notaDebitoListTable> getListNotaDebitoBySucursal(int id)
        {
            notaDebitoListTable notadebitoTravelace = new notaDebitoListTable();
            List<notaDebitoListTable> listP = new List<notaDebitoListTable>();
            base.sqlConnection.open();

            //string query = string.Format("select * from travelaceNotaDebito where idSucursal='{0}' order by codigoUnicoNota DESC", id);
            string query = string.Format(@"
select ND.id, C.nombre, ND.pasajero, ND.servicios, ND.voucher, ND.total, ND.estado, ND.codigoUnicoNota 
from travelaceNotaDebito as  ND
left join clients as C
on C.id = ND.codCliente
where ND.idSucursal='{0}' order by ND.codigoUnicoNota DESC
", id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {

                            notadebitoTravelace = new notaDebitoListTable();
                            notadebitoTravelace.id = reader.GetInt32(0);
                            try
                            {
                                notadebitoTravelace.codCliente = reader.GetString(1);
                            }
                            catch { }
                            try
                            {
                                notadebitoTravelace.pasajero = reader.GetString(2);
                            }
                            catch { }
                            try
                            {
                                notadebitoTravelace.servicio = reader.GetString(3);
                            }
                            catch { }
                            notadebitoTravelace.voucher = reader.GetString(4);
                            notadebitoTravelace.total = reader.GetDouble(5);
                            notadebitoTravelace.estado = reader.GetInt32(6);
                            notadebitoTravelace.codigoUnico = reader.GetInt32(7);
                            listP.Add(notadebitoTravelace);

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

        public PagedResult<notaDebitoListTable> getListNotaDebitoBySucursalPaged(int idSucursal, int pageIndex, int pageSize, string searchText)
        {
            if (pageIndex < 1) pageIndex = 1;
            if (pageSize < 1) pageSize = 20;

            PagedResult<notaDebitoListTable> result = new PagedResult<notaDebitoListTable> { data = new List<notaDebitoListTable>(), total = 0 };
            base.sqlConnection.open();

            string query = @"
select ND.id, C.nombre, ND.pasajero, ND.servicios, ND.voucher, ND.total, ND.estado, ND.codigoUnicoNota,
       COUNT(*) OVER() as TotalRows
from travelaceNotaDebito as ND
left join clients as C
on C.id = ND.codCliente
where ND.idSucursal = @idSucursal
  and (@searchText is null
       or ND.pasajero like @searchLike
       or ND.servicios like @searchLike
       or ND.voucher like @searchLike
       or C.nombre like @searchLike
       or CAST(ND.codigoUnicoNota as varchar(20)) like @searchLike)
order by ND.codigoUnicoNota DESC
offset @offset rows fetch next @pageSize rows only";

            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    object searchTextParam = string.IsNullOrWhiteSpace(searchText) ? (object)DBNull.Value : searchText;
                    object searchLikeParam = string.IsNullOrWhiteSpace(searchText) ? (object)DBNull.Value : "%" + searchText + "%";
                    command.Parameters.AddWithValue("@idSucursal", idSucursal);
                    command.Parameters.AddWithValue("@searchText", searchTextParam);
                    command.Parameters.AddWithValue("@searchLike", searchLikeParam);
                    command.Parameters.AddWithValue("@offset", (pageIndex - 1) * pageSize);
                    command.Parameters.AddWithValue("@pageSize", pageSize);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            notaDebitoListTable notadebitoTravelace = new notaDebitoListTable();
                            notadebitoTravelace.id = reader.GetInt32(0);
                            try
                            {
                                notadebitoTravelace.codCliente = reader.GetString(1);
                            }
                            catch { }
                            try
                            {
                                notadebitoTravelace.pasajero = reader.GetString(2);
                            }
                            catch { }
                            try
                            {
                                notadebitoTravelace.servicio = reader.GetString(3);
                            }
                            catch { }
                            notadebitoTravelace.voucher = reader.GetString(4);
                            notadebitoTravelace.total = reader.GetDouble(5);
                            notadebitoTravelace.estado = reader.GetInt32(6);
                            notadebitoTravelace.codigoUnico = reader.GetInt32(7);
                            result.data.Add(notadebitoTravelace);
                            result.total = reader.GetInt32(8);
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
            return result;
        }

        public List<notaDebitoListTable> getListNotaDebitoBySucursalandDate(int id, DateTime fecha)
        {
            int monthReview = fecha.Month;
            notaDebitoListTable notadebitoTravelace = new notaDebitoListTable();
            List<notaDebitoListTable> listP = new List<notaDebitoListTable>();
            base.sqlConnection.open();

            //string query = string.Format("select * from travelaceNotaDebito where idSucursal='{0}' and MONTH(fechaGestion)='{1}' order by codigoUnicoNota DESC", id, fecha.Month);
            string query = string.Format(@"
select ND.id, C.nombre, ND.pasajero, ND.servicios, ND.voucher, ND.total, ND.estado, ND.codigoUnicoNota 
from travelaceNotaDebito as  ND
left join clients as C
on C.id = ND.codCliente
where ND.idSucursal='{0}' 
and MONTH(ND.fechaGestion)='{1}'
order by ND.codigoUnicoNota DESC
", id, monthReview);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            notadebitoTravelace = new notaDebitoListTable();
                            notadebitoTravelace.id = reader.GetInt32(0);
                            notadebitoTravelace.codCliente = reader.GetString(1);
                            notadebitoTravelace.pasajero = reader.GetString(2);
                            notadebitoTravelace.servicio = reader.GetString(3);
                            notadebitoTravelace.voucher = reader.GetString(4);
                            notadebitoTravelace.total = reader.GetDouble(5);
                            notadebitoTravelace.estado = reader.GetInt32(6);
                            notadebitoTravelace.codigoUnico = reader.GetInt32(7);
                            listP.Add(notadebitoTravelace);
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

        public List<notaDebitoTravelace> getListNotaDebito(int codUnico, int idSucursal)
        {
            notaDebitoTravelace notadebitoTravelace = new notaDebitoTravelace();
            List<notaDebitoTravelace> listP = new List<notaDebitoTravelace>();
            base.sqlConnection.open();

            string query = string.Format("select * from travelaceNotaDebito where codigoUnicoNota = '{0}' and idSucursal='{1}'", codUnico, idSucursal);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            notadebitoTravelace = new notaDebitoTravelace();
                            notadebitoTravelace.id = reader.GetInt32(0);
                            notadebitoTravelace.codCliente = reader.GetInt32(1);
                            notadebitoTravelace.codCounter = reader.GetInt32(2);
                            notadebitoTravelace.codOperador = reader.GetInt32(3);
                            notadebitoTravelace.codTipoCambio = reader.GetInt32(4);
                            notadebitoTravelace.fechaGestion = reader.GetDateTime(5);
                            notadebitoTravelace.pasajero = reader.GetString(6);
                            notadebitoTravelace.servicio = reader.GetString(7);
                            notadebitoTravelace.voucher = reader.GetString(8);
                            notadebitoTravelace.fechaVencimiento = reader.GetDateTime(9);

                            notadebitoTravelace.totalArgentina = reader.GetDouble(10);
                            notadebitoTravelace.totalAgencia = reader.GetDouble(11);
                            notadebitoTravelace.totalCounter = reader.GetDouble(12);
                            notadebitoTravelace.totalMetropolitana = reader.GetDouble(13);
                            notadebitoTravelace.total = reader.GetDouble(14);
                            notadebitoTravelace.montoNeto = reader.GetDouble(15);
                            notadebitoTravelace.concepto = reader.GetString(16);
                            notadebitoTravelace.isEspecial = reader.GetInt32(17);
                            notadebitoTravelace.codigoUnico = reader.GetInt32(18);
                            notadebitoTravelace.estado = reader.GetInt32(19);
                            notadebitoTravelace.idSucursal = reader.GetInt32(20);
                            try
                            {
                                notadebitoTravelace.createBy = reader.GetInt32(21);
                                notadebitoTravelace.modify = reader.GetInt32(22);
                                notadebitoTravelace.createDate = reader.GetDateTime(23);
                                notadebitoTravelace.modifyDate = reader.GetDateTime(24);
                            }
                            catch { }
                            listP.Add(notadebitoTravelace);
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

        public int getNotaDebitoEstado(int codUnico, int idSucursal)
        {
            base.sqlConnection.open();
            int result = 0;
            string query = string.Format("select estadoEditado from travelaceNotaDebito where id = '{0}' and idSucursal='{1}'", codUnico, idSucursal);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result = reader.GetInt32(0);
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
            return result;
        }

        public List<notaDebitoTravelace> getListNotaDebitoCompleteBySucursal(int idSucursal)
        {
            notaDebitoTravelace notadebitoTravelace = new notaDebitoTravelace();
            List<notaDebitoTravelace> listP = new List<notaDebitoTravelace>();
            base.sqlConnection.open();

            string query = string.Format("select top 20 * from travelaceNotaDebito where idSucursal='{0}'", idSucursal);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            notadebitoTravelace = new notaDebitoTravelace();
                            notadebitoTravelace.id = reader.GetInt32(0);
                            notadebitoTravelace.codCliente = reader.GetInt32(1);
                            notadebitoTravelace.codCounter = reader.GetInt32(2);
                            notadebitoTravelace.codOperador = reader.GetInt32(3);
                            notadebitoTravelace.codTipoCambio = reader.GetInt32(4);
                            notadebitoTravelace.fechaGestion = reader.GetDateTime(5);
                            notadebitoTravelace.pasajero = reader.GetString(6);
                            notadebitoTravelace.servicio = reader.GetString(7);
                            notadebitoTravelace.voucher = reader.GetString(8);
                            notadebitoTravelace.fechaVencimiento = reader.GetDateTime(9);

                            notadebitoTravelace.totalArgentina = reader.GetDouble(10);
                            notadebitoTravelace.totalAgencia = reader.GetDouble(11);
                            notadebitoTravelace.totalCounter = reader.GetDouble(12);
                            notadebitoTravelace.totalMetropolitana = reader.GetDouble(13);
                            notadebitoTravelace.total = reader.GetDouble(14);
                            notadebitoTravelace.montoNeto = reader.GetDouble(15);
                            notadebitoTravelace.concepto = reader.GetString(16);
                            notadebitoTravelace.isEspecial = reader.GetInt32(17);
                            notadebitoTravelace.codigoUnico = reader.GetInt32(18);
                            notadebitoTravelace.estado = reader.GetInt32(19);
                            notadebitoTravelace.idSucursal = reader.GetInt32(20);
                            try
                            {
                                notadebitoTravelace.createBy = reader.GetInt32(21);
                                notadebitoTravelace.modify = reader.GetInt32(22);
                                notadebitoTravelace.createDate = reader.GetDateTime(23);
                                notadebitoTravelace.modifyDate = reader.GetDateTime(24);
                            }
                            catch { }
                            listP.Add(notadebitoTravelace);
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



        public List<notaDebitoTravelace> getListNotaDebito(NotaDebitoFilter debitoFilter)
        {
            notaDebitoTravelace notadebitoTravelace = new notaDebitoTravelace();
            List<notaDebitoTravelace> listP = new List<notaDebitoTravelace>();
            base.sqlConnection.open();

            //string query = string.Format("select * from travelaceNotaDebito");
            string query = getQueryForNotaDebito(debitoFilter);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            notadebitoTravelace = new notaDebitoTravelace();
                            notadebitoTravelace.id = reader.GetInt32(0);
                            notadebitoTravelace.codCliente = reader.GetInt32(1);
                            notadebitoTravelace.codCounter = reader.GetInt32(2);
                            notadebitoTravelace.codOperador = reader.GetInt32(3);
                            notadebitoTravelace.codTipoCambio = reader.GetInt32(4);
                            notadebitoTravelace.fechaGestion = reader.GetDateTime(5);
                            notadebitoTravelace.pasajero = reader.GetString(6);
                            notadebitoTravelace.servicio = reader.GetString(7);
                            notadebitoTravelace.voucher = reader.GetString(8);
                            notadebitoTravelace.fechaVencimiento = reader.GetDateTime(9);

                            notadebitoTravelace.totalArgentina = reader.GetDouble(10);
                            notadebitoTravelace.totalAgencia = reader.GetDouble(11);
                            notadebitoTravelace.totalCounter = reader.GetDouble(12);
                            notadebitoTravelace.totalMetropolitana = reader.GetDouble(13);
                            notadebitoTravelace.total = reader.GetDouble(14);
                            notadebitoTravelace.montoNeto = reader.GetDouble(15);
                            notadebitoTravelace.concepto = reader.GetString(16);
                            notadebitoTravelace.isEspecial = reader.GetInt32(17);
                            notadebitoTravelace.codigoUnico = reader.GetInt32(18);
                            notadebitoTravelace.estado = reader.GetInt32(19);
                            notadebitoTravelace.idSucursal = reader.GetInt32(20);
                            try
                            {
                                notadebitoTravelace.createBy = reader.GetInt32(21);
                                notadebitoTravelace.modify = reader.GetInt32(22);
                                notadebitoTravelace.createDate = reader.GetDateTime(23);
                                notadebitoTravelace.modifyDate = reader.GetDateTime(24);
                            }
                            catch { }
                            listP.Add(notadebitoTravelace);
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

        private string getQueryForNotaDebito(NotaDebitoFilter debitoFilter)
        {
            string query = "";
            if (debitoFilter.allClientes && debitoFilter.allFechas)
            {
                query = string.Format("select * from travelaceNotaDebito order by codigoUnicoNota DESC");
            }
            else
            {
                if (!debitoFilter.allClientes && debitoFilter.allFechas)
                {
                    query = string.Format("select * from travelaceNotaDebito where codCliente = '{0}' order by codigoUnicoNota DESC", debitoFilter.idcliente);
                }
                else
                {
                    if (!debitoFilter.allFechas && debitoFilter.allClientes)
                    {
                        query = string.Format("select * from travelaceNotaDebito where Month(fechaGestion) = '{0}' order by codigoUnicoNota DESC", Convert.ToDateTime(debitoFilter.fechaMes).Month);
                    }
                    else
                    {
                        query = string.Format("select * from travelaceNotaDebito where codCliente = '{0}' and Month(fechaGestion) = '{1}' order by codigoUnicoNota DESC", debitoFilter.idcliente, Convert.ToDateTime(debitoFilter.fechaMes).Month);
                    }
                }
            }
            return query;
        }

        public calcularNotaDebitoTravelace calcularNotadebitoTravelace(calcularNotaDebitoTravelace calculos)
        {
            OperadorManagement localOperador = new OperadorManagement();
            Operadores lo = localOperador.getoperador(calculos.codOperador);

            counterManagement localCounter = new counterManagement();
            Counter co = localCounter.getCounter(calculos.codCounter);
            double porcentajeCounter = 1;
            calculos.totalArgentina = calculos.montoNeto * (lo.porcentajeArgentina / 100);
            calculos.totalAgencia = calculos.montoNeto * (lo.porcentajeAgencia / 100);
            if (co.id != 0)
            {
                switch (calculos.typeCounter)
                {
                    case 1:
                        {
                            calculos.totalCounter = calculos.montoNeto * (co.porcentajeNormal / 100);
                            porcentajeCounter = co.porcentajeNormal;
                            break;
                        }
                    case 2:
                        {
                            calculos.totalCounter = calculos.montoNeto * (co.porcentajeLow / 100);
                            porcentajeCounter = co.porcentajeLow;
                            break;
                        }
                    case 3:
                        {
                            calculos.totalCounter = calculos.montoNeto * (co.porcentajeCorp / 100);
                            porcentajeCounter = co.porcentajeCorp;
                            break;
                        }
                    case 4:
                        {
                            calculos.totalCounter = calculos.montoNeto * (co.porcentajeEspecial / 100);
                            porcentajeCounter = co.porcentajeEspecial;
                            break;
                        }
                    default:
                        break;
                }
            }
            else
            {
                porcentajeCounter = 0;
            }
            lo.porcentajeMetropolitana = 100 - (lo.porcentajeAgencia + lo.porcentajeArgentina + porcentajeCounter);
            calculos.totalMetropolitana = calculos.montoNeto * (lo.porcentajeMetropolitana / 100);
            calculos.total = calculos.totalArgentina + calculos.totalAgencia + calculos.totalCounter + calculos.totalMetropolitana;
            calculos.codCounter = lo.counterId;
            return calculos;
        }

        public notaDebitoTravelace calcularNotadebitoTravelace(notaDebitoTravelace calculos, int opNormal, int opLow, int AMP, int opNacional)
        {
            int codOperadorResult = getTypoOperador(calculos.servicio, opNormal, opLow, AMP, opNacional);
            calculos.codOperador = codOperadorResult;
            OperadorManagement localOperador = new OperadorManagement();
            Operadores lo = localOperador.getoperador(codOperadorResult);
            counterManagement localCounter = new counterManagement();
            Counter co = localCounter.getCounter(calculos.codCounter);

            calculos.totalArgentina = calculos.montoNeto * (lo.porcentajeArgentina / 100);
            calculos.totalAgencia = calculos.montoNeto * (lo.porcentajeAgencia / 100);
            double calculoCounter = calcularCounterFunction(calculos.montoNeto, co, calculos.servicio);
            calculos.totalCounter = calculoCounter;
            calculos.totalMetropolitana = calculos.montoNeto * (lo.porcentajeMetropolitana / 100);
            calculos.total = calculos.totalArgentina + calculos.totalAgencia + calculos.totalCounter + calculos.totalMetropolitana;

            return calculos;
        }

        private int getTypoOperador(string servicio, int opNormal, int opLow, int aMP, int opNacional)
        {
            if (servicio.ToLower().Contains("low cost"))
            {
                return opLow;
            }
            else
            {
                if (servicio.ToLower().Contains("amp"))
                {
                    return aMP;
                }
                else
                {
                    if (servicio.ToLower().Contains("nacional"))
                    {
                        return opNacional;
                    }
                    else
                    {
                        return opNormal;
                    }
                }
            }
        }

        private double calcularCounterFunction(double montoNeto, Counter co, string servicio)
        {
            double resultado = 0;
            if (servicio.ToLower().Contains("low cost"))
            {
                resultado = montoNeto * (co.porcentajeLow / 100);
            }
            else
            {
                if (servicio.ToLower().Contains("AMP"))
                {
                    resultado = montoNeto * (co.porcentajeCorp / 100);
                }
                else
                {
                    if (servicio.ToUpper().Contains("NACIONAL"))
                    {
                        resultado = montoNeto * (co.porcentajeEspecial / 100);
                    }
                    else
                    {
                        resultado = montoNeto * (co.porcentajeNormal / 100);
                    }
                }
            }
            return resultado;
        }

        public string deleteTravelAceNotaDebito(int id, int iduser)
        {
            try
            {
                notaDebitoTravelace notaD = getnotadebitoTravelace(id);

                string query = string.Format("delete from travelaceNotaDebito where id = '{0}'", notaD.id);
                int res = insertUpdateExecute(query);
                if (res > 0)
                {
                    query = string.Format(@"Insert into travelaceNotaDebitoAnulada 
                                        (codCliente,codCounter,codOperador,codTipoCambio,fechaGestion,
                                        pasajero,servicios,voucher,fechaVencimiento,totalArgentina,totalAgencia,
                                        totalCounter,totalMetropolitan,total,montoNeto,concepto,
                                        isEspecial,codigoUnicoNota,estado,idSucursal,estadoEditado,
                                        createdBy,createdDate, modifyBy, modifyDate)
                                        values ('{0}','{1}','{2}','{3}','{4}',
                                                '{5}','{6}','{7}','{8}','{9}','{10}',
                                                '{11}','{12}','{13}','{14}','{15}',
                                                '{16}','{17}','{18}','{19}','{20}',
                                                '{21}','{22}','{23}','{24}')",
                                            notaD.codCliente, notaD.codCounter, notaD.codOperador, notaD.codTipoCambio, notaD.fechaGestion,
                                            notaD.pasajero, notaD.servicio, notaD.voucher, notaD.fechaVencimiento, notaD.totalArgentina, notaD.totalAgencia,
                                            notaD.totalCounter, notaD.totalMetropolitana, notaD.total, notaD.montoNeto, notaD.concepto,
                                            notaD.isEspecial, notaD.codigoUnico, notaD.estado, notaD.idSucursal, 0,
                                            notaD.createBy, notaD.createDate, iduser, DateTime.Now);
                    res = insertUpdateExecute(query);
                }

                operacionPagoTravelace ordenPagoR = getOrdenPago(notaD.codigoUnico, notaD.idSucursal);

                query = string.Format("delete from travelOrdenPago where id = '{0}'", ordenPagoR.id);
                res = insertUpdateExecute(query);

                if (res > 0)
                {
                    query = string.Format(@"Insert into travelOrdenPagoAnulado 
                                        (fechaPago,montoAPagar,monedaPago,saldoDeudor,numeroPago,
                                        formaPago,numeroTarjeta,concepto,anulado,idNotaDebito,pagado,codProfile,idSucursal,
                                        createdBy,createDate, modifyBy, modifyDate)
                                        values ('{0}','{1}','{2}','{3}','{4}',
                                                '{5}','{6}','{7}','{8}','{9}',
                                                '{10}','{11}','{12}','{13}','{14}','{15}','{16}')",
                                            ordenPagoR.fechaPago, ordenPagoR.montoAPagar, ordenPagoR.monedaPago, ordenPagoR.saldoDeudor, ordenPagoR.numeroPago,
                                            ordenPagoR.formaPago, ordenPagoR.numeroTarjeta, ordenPagoR.concepto, ordenPagoR.anulado, ordenPagoR.numeroNotaDebito,
                                            ordenPagoR.pagado, ordenPagoR.codProfile, ordenPagoR.idSucursal,
                                            ordenPagoR.createBy, ordenPagoR.createDate, iduser, DateTime.Now);

                    res = insertUpdateExecute(query);
                }
                return res > 0 ? "borrado con excito." : "falla en el borrado.";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public operacionPagoTravelace getOrdenPago(int codUnico, int idSucursal)
        {
            operacionPagoTravelace ordenPago = new operacionPagoTravelace();
            base.sqlConnection.open();

            string query = string.Format(@"select * from travelOrdenPago where idNotaDebito = '{0}' and
                        idSucursal = '{1}'", codUnico, idSucursal);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            ordenPago = new operacionPagoTravelace();
                            ordenPago.id = reader.GetInt32(0);
                            ordenPago.fechaPago = reader.GetDateTime(1);
                            ordenPago.montoAPagar = reader.GetDouble(2);
                            ordenPago.monedaPago = reader.GetInt32(3);
                            ordenPago.saldoDeudor = reader.GetDouble(4);
                            ordenPago.numeroPago = reader.GetInt32(5);
                            ordenPago.formaPago = reader.GetInt32(6);
                            ordenPago.numeroTarjeta = reader.GetString(7);
                            ordenPago.concepto = reader.GetString(8);
                            ordenPago.anulado = reader.GetInt32(9);
                            ordenPago.numeroNotaDebito = reader.GetInt32(10);
                            ordenPago.pagado = reader.GetBoolean(11);
                            ordenPago.codProfile = reader.GetString(12);
                            ordenPago.idSucursal = reader.GetInt32(13);
                            try
                            {
                                ordenPago.createBy = reader.GetInt32(14);
                                ordenPago.modify = reader.GetInt32(15);
                                ordenPago.createDate = reader.GetDateTime(16);
                                ordenPago.modifyDate = reader.GetDateTime(17);
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
            return ordenPago;
        }

        public notaDebitoTravelace getnotadebitoTravelace(int id)
        {
            notaDebitoTravelace notadebitoTravelace = new notaDebitoTravelace();

            base.sqlConnection.open();

            string query = string.Format("select * from travelaceNotaDebito where id = '{0}'", id);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            notadebitoTravelace = new notaDebitoTravelace();
                            notadebitoTravelace.id = reader.GetInt32(0);
                            notadebitoTravelace.codCliente = reader.GetInt32(1);
                            notadebitoTravelace.codCounter = reader.GetInt32(2);
                            notadebitoTravelace.codOperador = reader.GetInt32(3);
                            notadebitoTravelace.codTipoCambio = reader.GetInt32(4);
                            notadebitoTravelace.fechaGestion = reader.GetDateTime(5);
                            notadebitoTravelace.pasajero = reader.GetString(6);
                            notadebitoTravelace.servicio = reader.GetString(7);
                            notadebitoTravelace.voucher = reader.GetString(8);
                            notadebitoTravelace.fechaVencimiento = reader.GetDateTime(9);

                            notadebitoTravelace.totalArgentina = reader.GetDouble(10);
                            notadebitoTravelace.totalAgencia = reader.GetDouble(11);
                            notadebitoTravelace.totalCounter = reader.GetDouble(12);
                            notadebitoTravelace.totalMetropolitana = reader.GetDouble(13);
                            notadebitoTravelace.total = reader.GetDouble(14);
                            notadebitoTravelace.montoNeto = reader.GetDouble(15);
                            notadebitoTravelace.concepto = reader.GetString(16);
                            notadebitoTravelace.isEspecial = reader.GetInt32(17);
                            notadebitoTravelace.codigoUnico = reader.GetInt32(18);
                            notadebitoTravelace.estado = reader.GetInt32(19);
                            notadebitoTravelace.idSucursal = reader.GetInt32(20);
                            try
                            {
                                notadebitoTravelace.createBy = reader.GetInt32(21);
                                notadebitoTravelace.modify = reader.GetInt32(22);
                                notadebitoTravelace.createDate = reader.GetDateTime(23);
                                notadebitoTravelace.modifyDate = reader.GetDateTime(24);
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
            return notadebitoTravelace;
        }

        public notaDebitoTravelace createnotadebitoTravelace(notaDebitoTravelace notaD)
        {
            if (notaD.codigoUnico == -1)
            {
                notaD.codigoUnico = generateCodigoUnico(notaD.idSucursal);
            }
            string query = string.Format(@"Insert into travelaceNotaDebito 
                                        (codCliente,codCounter,codOperador,codTipoCambio,fechaGestion,
                                        pasajero,servicios,voucher,fechaVencimiento,totalArgentina,totalAgencia,
                                        totalCounter,totalMetropolitan,total,montoNeto,concepto,
                                        isEspecial,codigoUnicoNota,estado,idSucursal,estadoEditado,
                                        createdBy,createdDate)
                                        values ('{0}','{1}','{2}','{3}','{4}',
                                                '{5}','{6}','{7}','{8}','{9}','{10}',
                                                '{11}','{12}','{13}','{14}','{15}',
                                                '{16}','{17}','{18}','{19}','{20}',
                                                '{21}','{22}')",
                                        notaD.codCliente, notaD.codCounter, notaD.codOperador, notaD.codTipoCambio, notaD.fechaGestion.ToString("MM/dd/yyy"),
                                        notaD.pasajero, notaD.servicio, notaD.voucher, notaD.fechaVencimiento.ToString("MM/dd/yyy"), notaD.totalArgentina, notaD.totalAgencia,
                                        notaD.totalCounter, notaD.totalMetropolitana, notaD.total, notaD.montoNeto, notaD.concepto,
                                        notaD.isEspecial, notaD.codigoUnico, notaD.estado, notaD.idSucursal, 0,
                                        notaD.createBy, notaD.createDate.ToString("MM/dd/yyy"));
            base.insertUpdateExecute(query);
            return getListNotaDebito(notaD.codigoUnico, notaD.idSucursal)[0];
        }

        public int generateCodigoUnico(int idSucursal)
        {
            string codigoName = "notaVenta";
            int numberNota = getNotaDebitoGenerada(codigoName, idSucursal);
            if (numberNota < 0)
            {
                numberNota = 1;
                setNotaDebitoGenerada(codigoName, numberNota, idSucursal);
            }
            else
            {
                numberNota++;
                updateNumberNotaDebitoGenerada(codigoName, numberNota, idSucursal);
            }
            return numberNota;
        }

        private void updateNumberNotaDebitoGenerada(string nombre, int numberNota, int idSucursal)
        {
            string query = string.Format(@"Update generalCode 
                                        set 
                                        numero='{0}' 
                                        where nombre='{1}' and sucursal='{2}'",
                                        numberNota, nombre, idSucursal);
            insertUpdateExecute(query);
        }

        private void setNotaDebitoGenerada(string nombre, int numberNota, int idSucursal)
        {
            string query = string.Format(@"Insert into generalCode
                                        (nombre,numero,sucursal)
                                        values ('{0}','{1}','{2}')",
                                        nombre, numberNota, idSucursal);
            base.insertUpdateExecute(query);
        }

        private int getNotaDebitoGenerada(string nombre, int idSucursal)
        {
            int numeroDevuelto = -1;
            base.sqlConnection.open();
            string query = string.Format("select numero from generalCode where nombre='{0}' and sucursal='{1}'", nombre, idSucursal);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            try
                            {
                                numeroDevuelto = reader.GetInt32(0);
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
            return numeroDevuelto;
        }

        public int updatenotadebitoTravelace(notaDebitoTravelace notaD)
        {
            string query = string.Format(@"Update travelaceNotaDebito 
                                        set 
                                        codCliente='{0}',codCounter='{1}',codOperador='{2}',codTipoCambio='{3}',fechaGestion='{4}',
                                        pasajero='{5}',servicios='{6}',voucher='{7}',fechaVencimiento='{8}',totalArgentina='{9}',totalAgencia='{10}',
                                        totalCounter='{11}',totalMetropolitan='{12}',total='{13}',montoNeto='{14}',concepto='{15}',
                                        isEspecial='{16}',codigoUnicoNota='{17}',estado='{18}', idSucursal='{19}',
                                        modifyBy={20},modifyDate='{21}', estadoEditado = '{22}'
                                        where id={23}",
                                        notaD.codCliente, notaD.codCounter, notaD.codOperador,
                                        notaD.codTipoCambio, notaD.fechaGestion,
                                        notaD.pasajero, notaD.servicio, notaD.voucher, notaD.fechaVencimiento, notaD.totalArgentina, notaD.totalAgencia,
                                        notaD.totalCounter, notaD.totalMetropolitana, notaD.total, notaD.montoNeto, notaD.concepto,
                                        notaD.isEspecial, notaD.codigoUnico, notaD.estado, notaD.idSucursal,
                                        notaD.modify, notaD.modifyDate, notaD.estadoEditado, notaD.id);
            return insertUpdateExecute(query);
        }

        //      public void updateData()
        //      {
        //          List<(int, int)> resultND1 = new List<(int, int)>();
        //          List<(int, int)> resultND2 = new List<(int, int)>();
        //          base.sqlConnection.open();

        //          int count = 1;

        //          string query1 = string.Format(@"SELECT idNotaDebito
        //FROM travelOrdenPago where idSucursal = 1 and idNotaDebito>0 group by idNotaDebito");

        //          string query2 = string.Format(@"SELECT idNotaDebito
        //FROM travelOrdenPago where idSucursal = 2 and idNotaDebito>0 group by idNotaDebito");

        //          try
        //          {
        //              using (SqlCommand command = new SqlCommand(query1, sqlConnection._sqlConnect))
        //              {
        //                  using (SqlDataReader reader = command.ExecuteReader())
        //                  {
        //                      while (reader.Read())
        //                      {
        //                          resultND1.Add((reader.GetInt32(0), count));
        //                          count++;
        //                      }
        //                  }
        //              }
        //              count = 1;

        //              using (SqlCommand command = new SqlCommand(query2, sqlConnection._sqlConnect))
        //              {
        //                  using (SqlDataReader reader = command.ExecuteReader())
        //                  {
        //                      while (reader.Read())
        //                      {
        //                          resultND2.Add((reader.GetInt32(0),count));
        //                          count++;
        //                      }
        //                  }
        //              }
        //              base.sqlConnection.close();
        //              string queryUpdateND = "";
        //              string queryUpdateOP = "";
        //              foreach (var item in resultND1)
        //              {
        //                  //queryUpdateND = string.Format(@"update travelaceNotaDebito set codigoUnicoNota='{0}' where codigoUnicoNota = '{1}' and idSucursal = '1'", item.Item2,item.Item1);
        //                  //queryUpdateOP = string.Format(@"update travelOrdenPago set idNotaDebito = '{0}' , idSucursal = '1' where idNotaDebito = '{1}' and idSucursal is NULL", item.Item2, item.Item1);
        //                  //insertUpdateExecute(queryUpdateND);
        //                  //insertUpdateExecute(queryUpdateOP);

        //                  queryUpdateOP = string.Format(@"update travelOrdenPago set numeroPago = '{0}' , idSucursal = '1' where idNotaDebito = '{1}' and idSucursal = '1'", item.Item2, item.Item1);
        //                  insertUpdateExecute(queryUpdateOP);
        //              }

        //              foreach (var item in resultND2)
        //              {
        //                  //queryUpdateND = string.Format(@"update travelaceNotaDebito set codigoUnicoNota='{0}' where codigoUnicoNota = '{1}' and idSucursal = '2'", item.Item2, item.Item1);
        //                  //queryUpdateOP = string.Format(@"update travelOrdenPago set idNotaDebito = '{0}' , idSucursal = '2' where idNotaDebito = '{1}' and idSucursal is NULL", item.Item2, item.Item1);
        //                  //insertUpdateExecute(queryUpdateND);
        //                  //insertUpdateExecute(queryUpdateOP);

        //                  queryUpdateOP = string.Format(@"update travelOrdenPago set numeroPago = '{0}' , idSucursal = '2' where idNotaDebito = '{1}' and idSucursal = '2'", item.Item2, item.Item1);
        //                  insertUpdateExecute(queryUpdateOP);
        //              }

        //          }
        //          catch (Exception ex)
        //          {
        //              base.sqlConnection.close();
        //              throw new Exception(ex.Message);
        //          }

        //      }
    }
}
