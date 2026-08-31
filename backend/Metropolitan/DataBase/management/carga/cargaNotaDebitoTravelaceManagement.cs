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
    public class cargaNotaDebitoTravelManagement : gestorDB
    {
        public List<notaDebitoTravelace> getListNotaDebito()
        {
            notaDebitoTravelace notadebitoTravelace = new notaDebitoTravelace();
            List<notaDebitoTravelace> listP = new List<notaDebitoTravelace>();
            base.sqlConnection.open();

            string query = string.Format("select * from cargaNotaDebito order by codigoUnicoNota DESC");
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
                            notadebitoTravelace.monedaNota = GetNullableInt32ByName(reader, "monedaNota");
                            notadebitoTravelace.tipoCambioValor = GetNullableDoubleByName(reader, "tipoCambioValor");
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

            string query = string.Format(@"select ND.id, C.nombre, ND.pasajero, ND.servicios, ND.voucher, ND.total, ND.estado, ND.codigoUnicoNota 
            from cargaNotaDebito as ND
            left join clienteCarga as C
            on C.id = ND.codCliente
            where ND.idSucursal='{0}' 
            and ND.codigoUnicoNota = '{1}' 
            order by ND.codigoUnicoNota DESC", sucursal, id);
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

            string query = string.Format(@"select ND.id, C.nombre, ND.pasajero, ND.servicios, ND.voucher, ND.total, ND.estado, ND.codigoUnicoNota 
from cargaNotaDebito as ND
left join clienteCarga as C
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

        public PagedResult<notaDebitoListTable> getListNotaDebitoBySucursalPaged(int idSucursal, int pageIndex, int pageSize, string searchText)
        {
            if (pageIndex < 1) pageIndex = 1;
            if (pageSize < 1) pageSize = 20;

            PagedResult<notaDebitoListTable> result = new PagedResult<notaDebitoListTable> { data = new List<notaDebitoListTable>(), total = 0 };
            base.sqlConnection.open();

            string query = @"
select ND.id, C.nombre, ND.pasajero, ND.servicios, ND.voucher, ND.total, ND.estado, ND.codigoUnicoNota,
       COUNT(*) OVER() as TotalRows, ND.monedaNota, ND.tipoCambioValor
from cargaNotaDebito as ND
left join clienteCarga as C
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
                            notadebitoTravelace.codCliente = reader.GetString(1);
                            notadebitoTravelace.pasajero = reader.GetString(2);
                            notadebitoTravelace.servicio = reader.GetString(3);
                            notadebitoTravelace.voucher = reader.GetString(4);
                            notadebitoTravelace.total = reader.GetDouble(5);
                            notadebitoTravelace.estado = reader.GetInt32(6);
                            notadebitoTravelace.codigoUnico = reader.GetInt32(7);
                            notadebitoTravelace.monedaNota = GetNullableInt32ByName(reader, "monedaNota");
                            notadebitoTravelace.tipoCambioValor = GetNullableDoubleByName(reader, "tipoCambioValor");
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
            notaDebitoListTable notadebitoTravelace = new notaDebitoListTable();
            List<notaDebitoListTable> listP = new List<notaDebitoListTable>();
            base.sqlConnection.open();

            string query = string.Format(@"
select ND.id, C.nombre, ND.pasajero, ND.servicios, ND.voucher, ND.total, ND.estado, ND.codigoUnicoNota 
from cargaNotaDebito as ND
left join clienteCarga as C
on C.id = ND.codCliente
where ND.idSucursal='{0}' 
and MONTH(ND.fechaGestion)='{1}'
order by ND.codigoUnicoNota DESC
", id, fecha.Month);
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

            string query = string.Format("select * from cargaNotaDebito where codigoUnicoNota = '{0}'and idSucursal='{1}'", codUnico, idSucursal);
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
                            notadebitoTravelace.monedaNota = GetNullableInt32ByName(reader, "monedaNota");
                            notadebitoTravelace.tipoCambioValor = GetNullableDoubleByName(reader, "tipoCambioValor");
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

            //string query = string.Format("select * from cargaNotaDebito");
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
                            notadebitoTravelace.monedaNota = GetNullableInt32ByName(reader, "monedaNota");
                            notadebitoTravelace.tipoCambioValor = GetNullableDoubleByName(reader, "tipoCambioValor");
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
                query = string.Format("select * from cargaNotaDebito order by codigoUnicoNota DESC");
            }
            else
            {
                if (!debitoFilter.allClientes && debitoFilter.allFechas)
                {
                    query = string.Format("select * from cargaNotaDebito where codCliente = '{0}' order by codigoUnicoNota DESC", debitoFilter.idcliente);
                }
                else
                {
                    if (!debitoFilter.allFechas && debitoFilter.allClientes)
                    {
                        query = string.Format("select * from cargaNotaDebito where Month(fechaGestion) = '{0}' order by codigoUnicoNota DESC", Convert.ToDateTime(debitoFilter.fechaMes).Month);
                    }
                    else
                    {
                        query = string.Format("select * from cargaNotaDebito where codCliente = '{0}' and Month(fechaGestion) = '{1}' order by codigoUnicoNota DESC", debitoFilter.idcliente, Convert.ToDateTime(debitoFilter.fechaMes).Month);
                    }
                }
            }
            return query;
        }

        public calcularNotaDebitoTravelace calcularNotadebitoTravelace(calcularNotaDebitoTravelace calculos)
        {
            cargaOperadorManagement localOperador = new cargaOperadorManagement();
            Operadores lo = localOperador.getoperador(calculos.codOperador);

            cargaCounterManagement localCounter = new cargaCounterManagement();
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
            cargaOperadorManagement localOperador = new cargaOperadorManagement();
            Operadores lo = localOperador.getoperador(codOperadorResult);
            cargaCounterManagement localCounter = new cargaCounterManagement();
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
                    resultado = montoNeto * (co.porcentajeNormal / 100);
                }
            }
            return resultado;
        }

        public notaDebitoTravelace getnotadebitoTravelace(int id)
        {
            notaDebitoTravelace notadebitoTravelace = new notaDebitoTravelace();

            base.sqlConnection.open();

            string query = string.Format("select * from cargaNotaDebito where id = '{0}'", id);
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
                            notadebitoTravelace.monedaNota = GetNullableInt32ByName(reader, "monedaNota");
                            notadebitoTravelace.tipoCambioValor = GetNullableDoubleByName(reader, "tipoCambioValor");
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
            string query = string.Format(@"Insert into cargaNotaDebito
                                        (codCliente,codCounter,codOperador,codTipoCambio,fechaGestion,
                                        pasajero,servicios,voucher,fechaVencimiento,totalArgentina,totalAgencia,
                                        totalCounter,totalMetropolitan,total,montoNeto,concepto,
                                        isEspecial,codigoUnicoNota,estado,idSucursal,
                                        createdBy,createdDate,monedaNota,tipoCambioValor)
                                        values ('{0}','{1}','{2}','{3}','{4}',
                                                '{5}','{6}','{7}','{8}','{9}',
                                                '{10}','{11}','{12}','{13}','{14}',
                                                '{15}','{16}','{17}','{18}','{19}','{20}','{21}',{22},{23})",
                                        notaD.codCliente, notaD.codCounter, notaD.codOperador, notaD.codTipoCambio, notaD.fechaGestion,
                                        notaD.pasajero, notaD.servicio, notaD.voucher, notaD.fechaVencimiento, notaD.totalArgentina, notaD.totalAgencia,
                                        notaD.totalCounter, notaD.totalMetropolitana, notaD.total, notaD.montoNeto, notaD.concepto,
                                        notaD.isEspecial, notaD.codigoUnico, notaD.estado, notaD.idSucursal,
                                        notaD.createBy, notaD.createDate,
                                        notaD.monedaNota.HasValue ? notaD.monedaNota.Value.ToString() : "NULL",
                                        notaD.tipoCambioValor.HasValue ? notaD.tipoCambioValor.Value.ToString(System.Globalization.CultureInfo.InvariantCulture) : "NULL");
            base.insertUpdateExecute(query);
            return getListNotaDebito(notaD.codigoUnico, notaD.idSucursal)[0];
        }

        public int generateCodigoUnico(int idSucursal)
        {
            string codigoName = "notaVentaCarga";
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

        public bool tieneOrdenPagoPagada(int codigoUnico, int idSucursal)
        {
            bool tienePagada = false;
            base.sqlConnection.open();
            string query = string.Format(
                "select count(*) from cargaOrdenPago where idNotaDebito = '{0}' and idSucursal = '{1}' and pagado = 1",
                codigoUnico, idSucursal);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    object result = command.ExecuteScalar();
                    tienePagada = result != null && Convert.ToInt32(result) > 0;
                }
            }
            catch (Exception ex)
            {
                base.sqlConnection.close();
                throw new Exception(ex.Message);
            }
            base.sqlConnection.close();
            return tienePagada;
        }

        public int updatenotadebitoTravelace(notaDebitoTravelace notaD)
        {
            if (tieneOrdenPagoPagada(notaD.codigoUnico, notaD.idSucursal))
            {
                notaDebitoTravelace actual = getnotadebitoTravelace(notaD.id);
                if (notaD.monedaNota != actual.monedaNota || notaD.tipoCambioValor != actual.tipoCambioValor)
                {
                    throw new Exception("No se puede modificar la moneda ni el tipo de cambio de una Nota de Débito que ya tiene una Orden de Pago pagada.");
                }
            }

            string query = string.Format(@"Update cargaNotaDebito
                                        set
                                        codCliente='{0}',codCounter='{1}',codOperador='{2}',codTipoCambio='{3}',fechaGestion='{4}',
                                        pasajero='{5}',servicios='{6}',voucher='{7}',fechaVencimiento='{8}',totalArgentina='{9}',totalAgencia='{10}',
                                        totalCounter='{11}',totalMetropolitan='{12}',total='{13}',montoNeto='{14}',concepto='{15}',
                                        isEspecial='{16}',codigoUnicoNota='{17}',estado='{18}', idSucursal='{19}',
                                        modifyBy={20},modifyDate='{21}',monedaNota={23},tipoCambioValor={24}
                                        where id={22}",
                                        notaD.codCliente, notaD.codCounter, notaD.codOperador,
                                        notaD.codTipoCambio, notaD.fechaGestion,
                                        notaD.pasajero, notaD.servicio, notaD.voucher, notaD.fechaVencimiento, notaD.totalArgentina, notaD.totalAgencia,
                                        notaD.totalCounter, notaD.totalMetropolitana, notaD.total, notaD.montoNeto, notaD.concepto,
                                        notaD.isEspecial, notaD.codigoUnico, notaD.estado, notaD.idSucursal,
                                        notaD.modify, notaD.modifyDate, notaD.id,
                                        notaD.monedaNota.HasValue ? notaD.monedaNota.Value.ToString() : "NULL",
                                        notaD.tipoCambioValor.HasValue ? notaD.tipoCambioValor.Value.ToString(System.Globalization.CultureInfo.InvariantCulture) : "NULL");
            return insertUpdateExecute(query);
        }

        public operacionPagoTravelace getOrdenPago(int codUnico, int idSucursal)
        {
            operacionPagoTravelace ordenPago = new operacionPagoTravelace();
            base.sqlConnection.open();

            string query = string.Format("select * from cargaOrdenPago where idNotaDebito = '{0}' and idSucursal = '{1}'", codUnico,idSucursal);
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
                            ordenPago.tipoCambioValor = GetNullableDoubleByName(reader, "tipoCambioValor");
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

        public string deleteCargaNotaDebito(int id, int iduser)
        {
            try
            {
                notaDebitoTravelace notaD = getnotadebitoTravelace(id);

                string query = string.Format("delete from cargaNotaDebito where id = '{0}'", notaD.id);
                int res = insertUpdateExecute(query);
                if (res > 0)
                {
                    query = string.Format(@"Insert into cargaNotaDebitoAnulado
                                        (codCliente,codCounter,codOperador,codTipoCambio,fechaGestion,
                                        pasajero,servicios,voucher,fechaVencimiento,totalArgentina,totalAgencia,
                                        totalCounter,totalMetropolitan,total,montoNeto,concepto,
                                        isEspecial,codigoUnicoNota,estado,idSucursal,estadoEditado,
                                        createdBy,createdDate, modifyBy, modifyDate,monedaNota,tipoCambioValor)
                                        values ('{0}','{1}','{2}','{3}','{4}',
                                                '{5}','{6}','{7}','{8}','{9}','{10}',
                                                '{11}','{12}','{13}','{14}','{15}',
                                                '{16}','{17}','{18}','{19}','{20}',
                                                '{21}','{22}','{23}','{24}',{25},{26})",
                                            notaD.codCliente, notaD.codCounter, notaD.codOperador, notaD.codTipoCambio, notaD.fechaGestion,
                                            notaD.pasajero, notaD.servicio, notaD.voucher, notaD.fechaVencimiento, notaD.totalArgentina, notaD.totalAgencia,
                                            notaD.totalCounter, notaD.totalMetropolitana, notaD.total, notaD.montoNeto, notaD.concepto,
                                            notaD.isEspecial, notaD.codigoUnico, notaD.estado, notaD.idSucursal, 0,
                                            notaD.createBy, notaD.createDate, iduser, DateTime.Now,
                                            notaD.monedaNota.HasValue ? notaD.monedaNota.Value.ToString() : "NULL",
                                            notaD.tipoCambioValor.HasValue ? notaD.tipoCambioValor.Value.ToString(System.Globalization.CultureInfo.InvariantCulture) : "NULL");
                    res = insertUpdateExecute(query);
                }

                operacionPagoTravelace ordenPagoR = getOrdenPago(notaD.codigoUnico, notaD.idSucursal);

                query = string.Format("delete from cargaOrdenPago where id = '{0}'", ordenPagoR.id);
                res = insertUpdateExecute(query);

                if (res > 0)
                {
                    query = string.Format(@"Insert into cargaOrdenPagoAnulado
                                        (fechaPago,montoAPagar,monedaPago,saldoDeudor,numeroPago,
                                        formaPago,numeroTarjeta,concepto,anulado,idNotaDebito,pagado,codProfile,idSucursal,
                                        createdBy,createDate, modifyBy, modifyDate,tipoCambioValor)
                                        values ('{0}','{1}','{2}','{3}','{4}',
                                                '{5}','{6}','{7}','{8}','{9}',
                                                '{10}','{11}','{12}','{13}','{14}','{15}','{16}',{17})",
                                            ordenPagoR.fechaPago, ordenPagoR.montoAPagar, ordenPagoR.monedaPago, ordenPagoR.saldoDeudor, ordenPagoR.numeroPago,
                                            ordenPagoR.formaPago, ordenPagoR.numeroTarjeta, ordenPagoR.concepto, ordenPagoR.anulado, ordenPagoR.numeroNotaDebito,
                                            ordenPagoR.pagado, ordenPagoR.codProfile, ordenPagoR.idSucursal,
                                            ordenPagoR.createBy, ordenPagoR.createDate, iduser, DateTime.Now,
                                            ordenPagoR.tipoCambioValor.HasValue ? ordenPagoR.tipoCambioValor.Value.ToString(System.Globalization.CultureInfo.InvariantCulture) : "NULL");

                    res = insertUpdateExecute(query);
                }
                return res > 0 ? "borrado con excito." : "falla en el borrado.";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}
