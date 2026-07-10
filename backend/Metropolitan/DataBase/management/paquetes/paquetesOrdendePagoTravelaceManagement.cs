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
    public class paquetesOrdendePagoTravelaceManagement : gestorDB
    {
        public List<operacionPagoTravelace> getListOrdenPago()
        {
            operacionPagoTravelace ordenPago = new operacionPagoTravelace();
            List<operacionPagoTravelace> listP = new List<operacionPagoTravelace>();
            base.sqlConnection.open();

            string query = string.Format("select * from paquetesOrdenPago");
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
                            listP.Add(ordenPago);
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

        public List<ordenPagoReporteTravelace> getListOrdenPagos(int filter, int idSucursal, int codOrden = -1)
        {
            ordenPagoReporteTravelace ordenPago = new ordenPagoReporteTravelace();
            List<ordenPagoReporteTravelace> listP = new List<ordenPagoReporteTravelace>();
            base.sqlConnection.open();

            string query = getListOperacionPorCondiciones(filter, idSucursal, codOrden);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            ordenPago = new ordenPagoReporteTravelace();
                            ordenPago.nameCliente = reader.GetString(0);
                            ordenPago.numeroND = reader.GetInt32(1).ToString();
                            ordenPago.pasajero = reader.GetString(2);
                            ordenPago.id = reader.GetInt32(3);
                            ordenPago.fechaPago = reader.GetDateTime(4).ToShortDateString();
                            ordenPago.montoAPagar = reader.GetDouble(5);
                            ordenPago.monedaPago = reader.GetInt32(6);
                            ordenPago.saldoDeudor = reader.GetDouble(7);
                            ordenPago.numeroPago = reader.GetInt32(8);
                            ordenPago.formaPago = reader.GetInt32(9);
                            ordenPago.numeroTarjeta = reader.GetString(10);
                            ordenPago.concepto = reader.GetString(11);
                            ordenPago.anulado = reader.GetInt32(12);
                            ordenPago.numeroNotaDebito = reader.GetInt32(13);
                            ordenPago.pagado = reader.GetBoolean(14);
                            ordenPago.codProfile = reader.GetString(15);
                            try
                            {
                                ordenPago.createBy = reader.GetInt32(16);
                            }
                            catch { };

                            try
                            {
                                ordenPago.modify = reader.GetInt32(17);
                            }
                            catch { };

                            try
                            {
                                ordenPago.createDate = reader.GetDateTime(18);
                            }
                            catch { };

                            try
                            {
                                ordenPago.modifyDate = reader.GetDateTime(19);
                            }
                            catch { };

                            listP.Add(ordenPago);
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

            List<ordenPagoReporteTravelace> filtered = listP.GroupBy(l => l.numeroPago).Select(r => new ordenPagoReporteTravelace()
            {
                anulado = r.First().anulado,
                numeroPago = r.First().numeroPago,
                concepto = r.First().concepto,
                createBy = r.First().createBy,
                createDate = r.First().createDate,
                fechaPago = r.First().fechaPago,
                formaPago = r.First().formaPago,
                id = r.First().id,
                nameCliente = r.First().nameCliente,
                numeroND = r.First().numeroND,
                modify = r.First().modify,
                modifyDate = r.First().modifyDate,
                monedaPago = r.First().monedaPago,
                montoAPagar = r.First().montoAPagar,
                numeroNotaDebito = r.First().numeroNotaDebito,
                numeroTarjeta = r.First().numeroTarjeta,
                pagado = r.First().pagado,
                saldoDeudor = r.First().saldoDeudor,
                pasajero = r.First().pasajero
            }).ToList();

            return filtered;
        }

        public string getListOperacionPorCondiciones(int filter, int idSucursal, int codOrden = -1)
        {
            string query = "";
            switch (filter)
            {
                case 1:
                    {
                        if (codOrden > 0)
                        {
                            query = string.Format(@"
                                        SELECT cl.nombre, nd.codigoUnicoNota, nd.pasajero, hh.* 
                                        FROM paquetesOrdenPago as hh 
                                        inner join paquetesNotaDebito as nd 
                                        on hh.idNotaDebito = nd.codigoUnicoNota and hh.idSucursal = nd.idSucursal
                                        inner join clientePaquetes as cl
                                        on cl.id = nd.codCliente
                                        where 
                                        nd.idSucursal ='{1}' 
                                        and hh.numeroPago = '{0}'
                                        order by numeroPago DESC
", codOrden, idSucursal);
                        }
                        else
                        {
                            query = string.Format(@"
                                        SELECT cl.nombre, nd.codigoUnicoNota, nd.pasajero, hh.* 
                                        FROM paquetesOrdenPago as hh 
                                        inner join paquetesNotaDebito as nd 
                                        on hh.idNotaDebito = nd.codigoUnicoNota and hh.idSucursal = nd.idSucursal
                                        inner join clientePaquetes as cl
                                        on cl.id = nd.codCliente
                                        where 
                                        nd.idSucursal ='{0}' 
                                        order by numeroPago DESC

", idSucursal);
                        }
                        break;
                    }
                case 2:
                    {
                        if (codOrden > 0)
                        {
                            query = string.Format(@"
                                            SELECT cl.nombre, nd.codigoUnicoNota, nd.pasajero, hh.* 
                                            FROM paquetesOrdenPago as hh
                                            inner join paquetesNotaDebito as nd 
                                            on hh.idNotaDebito = nd.codigoUnicoNota and hh.idSucursal = nd.idSucursal
                                            inner join clientePaquetes as cl
                                            on cl.id = nd.codCliente
                                            where 
                                            pagado = '1' and nd.idSucursal ='{1}'
                                            and numeroPago='{0}'
                                            order by numeroPago DESC
                                            ", codOrden, idSucursal);
                        }
                        else
                        {
                            query = string.Format(@"
                                            SELECT cl.nombre, nd.codigoUnicoNota, nd.pasajero, hh.* 
                                            FROM paquetesOrdenPago as hh
                                            inner join paquetesNotaDebito as nd 
                                            on hh.idNotaDebito = nd.codigoUnicoNota and hh.idSucursal = nd.idSucursal
                                            inner join clientePaquetes as cl
                                            on cl.id = nd.codCliente
                                            where 
                                            pagado = '1' and nd.idSucursal ='{0}'
                                            order by numeroPago DESC
                                            ", idSucursal);
                        }
                        break;
                    }
                case 3:
                    {
                        if (codOrden > 0)
                        {
                            query = string.Format(@"
                                            SELECT cl.nombre, nd.codigoUnicoNota, nd.pasajero, hh.* 
                                            FROM paquetesOrdenPago as hh
                                            inner join paquetesNotaDebito as nd 
                                            on hh.idNotaDebito = nd.codigoUnicoNota and hh.idSucursal = nd.idSucursal
                                            inner join clientePaquetes as cl
                                            on cl.id = nd.codCliente
                                            where 
                                            pagado = '0' and nd.idSucursal ='{1}'
                                            and numeroPago='{0}'
                                            order by numeroPago DESC
                                            ", codOrden, idSucursal);
                        }
                        else
                        {
                            query = string.Format(@"
                                            SELECT cl.nombre, nd.codigoUnicoNota, nd.pasajero, hh.* 
                                            FROM paquetesOrdenPago as hh
                                            inner join paquetesNotaDebito as nd 
                                            on hh.idNotaDebito = nd.codigoUnicoNota and hh.idSucursal = nd.idSucursal
                                            inner join clientePaquetes as cl
                                            on cl.id = nd.codCliente
                                            where 
                                            pagado = '0' and nd.idSucursal ='{0}'
                                            order by numeroPago DESC
                                            ", idSucursal);
                        }
                        break;
                    }
                default:
                    break;
            }
            return query;
        }

        public List<operacionPagoTravelace> getListOrdenPagoBiClientId(string id)
        {
            operacionPagoTravelace ordenPago = new operacionPagoTravelace();
            List<operacionPagoTravelace> listP = new List<operacionPagoTravelace>();
            base.sqlConnection.open();

            string query = string.Format(@"SELECT op.* 
                                        FROM paquetesOrdenPago as op, paquetesNotaDebito as nd, clientePaquetes as cl
                                        where op.idNotaDebito = nd.id and nd.codCliente = cl.id and cl.id = '{0}' and op.pagado = '0'", id);
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
                            listP.Add(ordenPago);
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


        public operacionPagoTravelace getOrdenPago(int codUnico)
        {
            operacionPagoTravelace ordenPago = new operacionPagoTravelace();
            base.sqlConnection.open();

            string query = string.Format("select * from paquetesOrdenPago where id = '{0}'", codUnico);
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

        public List<operacionPagoTravelace> getOrdenPagoByCodProfile(string codProfile)
        {
            List<operacionPagoTravelace> listOP = new List<operacionPagoTravelace>();
            operacionPagoTravelace ordenPago = new operacionPagoTravelace();
            base.sqlConnection.open();

            string query = string.Format("select * from paquetesOrdenPago where codProfile = '{0}' and codProfile not like ''", codProfile);
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
                            listOP.Add(ordenPago);
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
            return listOP;
        }

        public int createOrdenPagoTravelace(operacionPagoTravelace notaD)
        {
            if (notaD.numeroPago == -1)
            {
                notaD.numeroPago = generateCodigoUnico(notaD.idSucursal);
            }
            string query = string.Format(@"Insert into paquetesOrdenPago 
                                        (fechaPago,montoAPagar,monedaPago,saldoDeudor,numeroPago,
                                        formaPago,numeroTarjeta,concepto,anulado,idNotaDebito,pagado,codProfile,idSucursal,
                                        createdBy,createDate)
                                        values ('{0}','{1}','{2}','{3}','{4}',
                                                '{5}','{6}','{7}','{8}','{9}',
                                                '{10}','{11}','{12}','{13}','{14}')",
                                        notaD.fechaPago, notaD.montoAPagar, notaD.monedaPago, notaD.saldoDeudor, notaD.numeroPago,
                                        notaD.formaPago, notaD.numeroTarjeta, notaD.concepto, notaD.anulado, notaD.numeroNotaDebito, notaD.pagado, notaD.codProfile, notaD.idSucursal,
                                        notaD.createBy, DateTime.Now);
            return base.insertUpdateExecute(query);
        }

        public int updateOrdenPagoTravelace(operacionPagoTravelace notaD)
        {
            string query = string.Format(@"Update paquetesOrdenPago 
                                        set 
                                        fechaPago='{0}',montoAPagar='{1}',monedaPago='{2}',saldoDeudor='{3}',
                                        formaPago='{4}',numeroTarjeta='{5}',concepto='{6}',anulado='{7}',pagado='{8}',codProfile='{9}',idSucursal='{10}',
                                        modifyBy='{11}',modifyDate='{12}'
                                        where id={13}",
                                        notaD.fechaPago, notaD.montoAPagar, notaD.monedaPago, notaD.saldoDeudor,
                                        notaD.formaPago, notaD.numeroTarjeta, notaD.concepto, notaD.anulado, notaD.pagado, notaD.codProfile, notaD.idSucursal,
                                        notaD.modify, DateTime.Now, notaD.id);
            return insertUpdateExecute(query);
        }
        public int generateCodigoUnico(int idSucursal)
        {
            string codigoName = "ordenPagoPaquete";
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

        public List<listaOrdenDePagoTravelace> getListOrdenesPendientes(int sucursal = -1, string clientID = "-1")
        {
            listaOrdenDePagoTravelace listaOrdenPagos = new listaOrdenDePagoTravelace();
            List<listaOrdenDePagoTravelace> listOrden = new List<listaOrdenDePagoTravelace>();
            base.sqlConnection.open();
            string query = "";
            if (clientID != null && Convert.ToInt32(clientID) > -1)
            {
                if (sucursal == -1)
                {
                    query = string.Format(@"SELECT cl.id, nd.codigoUnicoNota, op.id, cl.nombre, nd.montoNeto, (nd.montoNeto-nd.totalAgencia)
                                            FROM paquetesOrdenPago as op, paquetesNotaDebito as nd, clientePaquetes as cl
                                            where nd.codigoUnicoNota = op.idNotaDebito  and nd.codCliente = cl.id and op.pagado='false' and cl.id = '{0}'", clientID);
                }
                else
                {
                    query = string.Format(@"SELECT cl.id, nd.codigoUnicoNota, op.id, cl.nombre, nd.montoNeto, (nd.montoNeto-nd.totalAgencia)
                                            FROM paquetesOrdenPago as op, paquetesNotaDebito as nd, clientePaquetes as cl
                                            where nd.codigoUnicoNota = op.idNotaDebito  and nd.codCliente = cl.id and op.pagado='false' and cl.id = '{0}' and nd.idSucursal = '{1}' and op.idSucursal='{1}'", clientID, sucursal);
                }
            }
            else
            {
                if (sucursal == -1)
                {
                    query = string.Format(@"SELECT cl.id, nd.codigoUnicoNota, op.id, cl.nombre, nd.montoNeto, (nd.montoNeto-nd.totalAgencia)
                                            FROM paquetesOrdenPago as op, paquetesNotaDebito as nd, clientePaquetes as cl
                                            where nd.codigoUnicoNota = op.idNotaDebito  and nd.codCliente = cl.id and op.pagado='false'");
                }
                else
                {
                    query = string.Format(@"SELECT cl.id, nd.codigoUnicoNota, op.id, cl.nombre, nd.montoNeto, (nd.montoNeto-nd.totalAgencia)
                                            FROM paquetesOrdenPago as op, paquetesNotaDebito as nd, clientePaquetes as cl
                                            where nd.codigoUnicoNota = op.idNotaDebito  and nd.codCliente = cl.id and op.pagado='false' and nd.idSucursal = '{0}' and op.idSucursal='{0}'", sucursal);
                }
            }
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            listaOrdenPagos = new listaOrdenDePagoTravelace();
                            listaOrdenPagos.idCliente = reader.GetInt32(0);
                            listaOrdenPagos.idNota = reader.GetInt32(1);
                            listaOrdenPagos.idOrden = reader.GetInt32(2);
                            listaOrdenPagos.nombreCliente = reader.GetString(3);
                            listaOrdenPagos.ordenMontoPagar = reader.GetDouble(4);
                            listaOrdenPagos.saldoDeudor = reader.GetDouble(5);
                            listOrden.Add(listaOrdenPagos);
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


            return listOrden;
        }

        public List<listaOrdenDePagoTravelace> getListOrdenesPendientesGroup()
        {
            List<listaOrdenDePagoTravelace> result = getListOrdenesPendientes()
                .GroupBy(l => l.nombreCliente)
                .Select(r => new listaOrdenDePagoTravelace
                {
                    idCliente = r.First().idCliente,
                    idNota = r.First().idNota,
                    idOrden = r.First().idOrden,
                    nombreCliente = r.First().nombreCliente,
                    ordenMontoPagar = r.Sum(f => f.ordenMontoPagar),
                    saldoDeudor = r.Sum(f => f.saldoDeudor)
                }).ToList();

            return result;
        }

        public List<listaOrdenDePagoTravelace> getListOrdenesPendientesByCodigoUnicoGroup(string idCliente, string idSucursal)
        {
            List<listaOrdenDePagoTravelace> result = getListOrdenesPendientes(Convert.ToInt32(idSucursal), idCliente)
                .GroupBy(l => l.idNota)
                .Select(r => new listaOrdenDePagoTravelace
                {
                    idCliente = r.First().idCliente,
                    idNota = r.First().idNota,
                    idOrden = r.First().idOrden,
                    nombreCliente = r.First().nombreCliente,
                    ordenMontoPagar = r.Sum(f => f.ordenMontoPagar),
                    saldoDeudor = r.Sum(f => f.saldoDeudor)
                }).ToList();

            return result;
        }

        public List<ReporteOperacionPagoTravelace> getReportOrdenPago(DateTime startDate, DateTime endDate)
        {
            startDate = new DateTime(startDate.Year, startDate.Month, startDate.Day, 1, 1, 0);
            endDate = new DateTime(endDate.Year, endDate.Month, endDate.Day, 23, 59, 0);
            ReporteOperacionPagoTravelace listaOrdenPagos = new ReporteOperacionPagoTravelace();
            List<ReporteOperacionPagoTravelace> listOrden = new List<ReporteOperacionPagoTravelace>();
            base.sqlConnection.open();
            string query = "";

            query = string.Format(@"
                                    select ND.codigoUnicoNota, OP.numeroPago, ND.codCliente, ND.pasajero, ND.servicios, ND.codCounter, ND.montoNeto,ND.totalArgentina,ND.totalCounter,(ND.total-ND.totalAgencia),OP.fechaPago,OP.formaPago
                                    from paquetesNotaDebito as ND, paquetesOrdenPago as OP where ND.codigoUnicoNota = OP.idNotaDebito
                                    and '{0}' > OP.fechaPago and OP.fechaPago > '{1}'
                                    and OP.pagado='1'
                                    ", endDate, startDate);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            listaOrdenPagos = new ReporteOperacionPagoTravelace();
                            listaOrdenPagos.idNota = reader.GetInt32(0);
                            listaOrdenPagos.idOrden = reader.GetInt32(1);
                            listaOrdenPagos.codCliente = reader.GetInt32(2);
                            listaOrdenPagos.pasajero = reader.GetString(3);
                            listaOrdenPagos.servicios = reader.GetString(4);
                            listaOrdenPagos.codCounter = reader.GetInt32(5);
                            listaOrdenPagos.montoNeto = reader.GetDouble(6);
                            listaOrdenPagos.totalArgentina = reader.GetDouble(7);
                            listaOrdenPagos.totalCounter = reader.GetDouble(8);
                            listaOrdenPagos.totalAgencia = reader.GetDouble(9);
                            listaOrdenPagos.fechaPago = reader.GetDateTime(10);
                            listaOrdenPagos.formaPago = reader.GetInt32(11);
                            listOrden.Add(listaOrdenPagos);
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


            return listOrden;
        }

        public List<ReporteOperacionPagoTravelaceDetalleFiltrado> getReportOrdenPagoDetalleByCityFiltrado(DateTime startDate, DateTime endDate, int idCity, string voucher, string clID, int estado = 0)
        {
            startDate = new DateTime(startDate.Year, startDate.Month, startDate.Day, 1, 1, 0);
            endDate = new DateTime(endDate.Year, endDate.Month, endDate.Day, 23, 59, 0);
            ReporteOperacionPagoTravelaceDetalleFiltrado listaOrdenPagos = new ReporteOperacionPagoTravelaceDetalleFiltrado();
            List<ReporteOperacionPagoTravelaceDetalleFiltrado> listOrden = new List<ReporteOperacionPagoTravelaceDetalleFiltrado>();
            base.sqlConnection.open();
            string query = "";

            query = string.Format(@"
                                    select PR.nombre, ND.codigoUnicoNota, OP.fechaPago, ND.voucher, OP.numeroPago, 
ROUND((ND.montoNeto),2) as Precio,
ROUND(ND.totalArgentina,2) as totalArgentina,
ROUND((ND.montoNeto-ND.totalArgentina),2) as PagadoMetro,
ROUND(ND.totalCounter,2) as totalCounter,
ROUND(ND.totalMetropolitan,2) as totalMetropolitana,
ROUND(ND.totalAgencia,2) as totalAgencia
                                    from paquetesNotaDebito as ND, 
									paquetesOrdenPago as OP, 
									operadorPaquetes as PR, 
									clientePaquetes as CL											
									where 
									ND.codigoUnicoNota = OP.idNotaDebito
									and PR.id=ND.codOperador
                                    and ND.codCliente = CL.id
                                    and '{0}' > OP.fechaPago and OP.fechaPago > '{1}'
                                    and OP.pagado='1'
									and ND.codigoUnicoNota>0
									and ND.voucher like '%{2}%'
                                    and OP.idSucursal = ND.idSucursal
                                    and ND.idSucursal = '{3}'
                                    and ND.estado = '{5}'
									AND (CL.id = '{4}' OR '' = '{4}')
									order by OP.fechaPago, ND.codOperador, voucher
                                    ", endDate, startDate, voucher, idCity, clID, estado);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            listaOrdenPagos = new ReporteOperacionPagoTravelaceDetalleFiltrado();
                            listaOrdenPagos.nombreOperador = reader.GetString(0);
                            listaOrdenPagos.idNota = reader.GetInt32(1);
                            listaOrdenPagos.fechaPago = reader.GetDateTime(2);
                            listaOrdenPagos.voucher = reader.GetString(3);
                            listaOrdenPagos.numeroPago = reader.GetInt32(4);
                            listaOrdenPagos.precio = reader.GetDouble(5);
                            listaOrdenPagos.totalArgentina = reader.GetDouble(6);
                            listaOrdenPagos.pagoMetro = reader.GetDouble(7);
                            listaOrdenPagos.totalCounter = reader.GetDouble(8);
                            listaOrdenPagos.totalMetro = reader.GetDouble(9);
                            listaOrdenPagos.totalAgencia = reader.GetDouble(10);
                            listOrden.Add(listaOrdenPagos);
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


            return listOrden;
        }

        public List<ReporteOperacionPagoTravelaceDetalle> getReportOrdenPagoDetallePpd(int sucursal, DateTime startDate, DateTime endDate)
        {
            startDate = new DateTime(startDate.Year, startDate.Month, startDate.Day, 1, 1, 0);
            endDate = new DateTime(endDate.Year, endDate.Month, endDate.Day, 23, 59, 0);
            ReporteOperacionPagoTravelaceDetalle listaOrdenPagos = new ReporteOperacionPagoTravelaceDetalle();
            List<ReporteOperacionPagoTravelaceDetalle> listOrden = new List<ReporteOperacionPagoTravelaceDetalle>();
            base.sqlConnection.open();
            string query = "";

            query = string.Format(@"
                                    select
                                    codigoUnicoNota, PR.nombre, codCounter,pasajero,servicios,montoNeto,totalArgentina,totalCounter,totalAgencia, fechaGestion
  FROM paquetesNotaDebito as ND, operadorPaquetes as PR where 
  ND.codOperador = PR.id
  and Nd.idSucursal = '{0}' 
  and ND.concepto like '%ppf%' 
  and ND.estado = '1'
  and ND.fechaGestion between  '{2}' and '{1}'
                                    ", sucursal, endDate, startDate);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            listaOrdenPagos = new ReporteOperacionPagoTravelaceDetalle();
                            listaOrdenPagos.codUnicoNota = reader.GetInt32(0);
                            listaOrdenPagos.nombreOperador = reader.GetString(1);
                            listaOrdenPagos.codCounter = reader.GetInt32(2);
                            listaOrdenPagos.pasajero = reader.GetString(3);
                            listaOrdenPagos.servicios = reader.GetString(4);
                            listaOrdenPagos.montoNeto = reader.GetDouble(5);
                            listaOrdenPagos.totalArgentina = reader.GetDouble(6);
                            listaOrdenPagos.totalCounter = reader.GetDouble(7);
                            listaOrdenPagos.totalAgencia = reader.GetDouble(8);
                            listaOrdenPagos.fechaPago = reader.GetDateTime(9);
                            listOrden.Add(listaOrdenPagos);
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


            return listOrden;
        }

        public List<ReporteOperacionPagoTravelaceDetalle> getReportOrdenPagoDetalleAnulacion(int sucursal, DateTime startDate, DateTime endDate, int estado = 1)
        {
            startDate = new DateTime(startDate.Year, startDate.Month, startDate.Day, 1, 1, 0);
            endDate = new DateTime(endDate.Year, endDate.Month, endDate.Day, 23, 59, 0);
            ReporteOperacionPagoTravelaceDetalle listaOrdenPagos = new ReporteOperacionPagoTravelaceDetalle();
            List<ReporteOperacionPagoTravelaceDetalle> listOrden = new List<ReporteOperacionPagoTravelaceDetalle>();
            base.sqlConnection.open();
            string query = "";

            query = string.Format(@"
                                    select ND.codigoUnicoNota,ND.fechaVencimiento, ND.codOperador,PR.nombre, ND.codCounter, ND.pasajero,  ND.servicios, 
ND.montoNeto,ND.totalArgentina,ND.totalCounter,ND.totalAgencia, ND.totalMetropolitan,
CL.nombre
from paquetesNotaDebito as ND, operador as PR, clients as CL
									where 									
									PR.id=ND.codOperador
                                    and ND.codCliente = CL.id
                                    and '{0}' >= ND.fechaVencimiento and ND.fechaVencimiento >= '{1}'
                                    and ND.estado = {2}
									and ND.codigoUnicoNota>0
                                    and ND.idSucursal = '{3}'
                                    and (ND.concepto like '%Remitido de Nota de Debito%' or ND.concepto like '%Anulado de Nota de Debito N°%')
									order by ND.codOperador
                                    ", endDate, startDate, estado, sucursal);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            listaOrdenPagos = new ReporteOperacionPagoTravelaceDetalle();
                            listaOrdenPagos.codUnicoNota = reader.GetInt32(0);
                            listaOrdenPagos.codOperador = reader.GetInt32(2);
                            listaOrdenPagos.nombreOperador = reader.GetString(3);
                            listaOrdenPagos.codCounter = reader.GetInt32(4);
                            listaOrdenPagos.pasajero = reader.GetString(5);
                            listaOrdenPagos.servicios = reader.GetString(6);
                            listaOrdenPagos.montoNeto = reader.GetDouble(7);
                            listaOrdenPagos.totalArgentina = reader.GetDouble(8);
                            listaOrdenPagos.totalCounter = reader.GetDouble(9);
                            listaOrdenPagos.totalAgencia = reader.GetDouble(10);
                            listaOrdenPagos.totalMetro = reader.GetDouble(11);
                            listaOrdenPagos.nombreAgencia = reader.GetString(12);
                            listOrden.Add(listaOrdenPagos);
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


            return listOrden;
        }


        public List<ReporteOperacionPagoTravelaceDetalle> getReportOrdenPagoDetalle(DateTime startDate, DateTime endDate)
        {
            startDate = new DateTime(startDate.Year, startDate.Month, startDate.Day, 1, 1, 0);
            endDate = new DateTime(endDate.Year, endDate.Month, endDate.Day, 23, 59, 0);
            ReporteOperacionPagoTravelaceDetalle listaOrdenPagos = new ReporteOperacionPagoTravelaceDetalle();
            List<ReporteOperacionPagoTravelaceDetalle> listOrden = new List<ReporteOperacionPagoTravelaceDetalle>();
            base.sqlConnection.open();
            string query = "";

            query = string.Format(@"
                                    select ND.codigoUnicoNota, OP.numeroPago, ND.codOperador,PR.nombre, ND.codCounter, ND.pasajero,  ND.servicios, ND.montoNeto,ND.totalArgentina,ND.totalCounter,ND.totalAgencia,OP.fechaPago,OP.formaPago, CL.nombre
                                    from paquetesNotaDebito as ND, paquetesOrdenPago as OP 
									, operadorPaquetes as PR, clientePaquetes as CL
									where 
									ND.codigoUnicoNota = OP.idNotaDebito
									and PR.id=ND.codOperador
                                    and ND.codCliente = CL.id
                                    and '{0}' > OP.fechaPago and OP.fechaPago > '{1}'
                                    and OP.pagado='1'
									and ND.codigoUnicoNota>0
									order by ND.codOperador
                                    ", endDate, startDate);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            listaOrdenPagos = new ReporteOperacionPagoTravelaceDetalle();
                            listaOrdenPagos.codUnicoNota = reader.GetInt32(0);
                            listaOrdenPagos.numeroPago = reader.GetInt32(1);
                            listaOrdenPagos.codOperador = reader.GetInt32(2);
                            listaOrdenPagos.nombreOperador = reader.GetString(3);
                            listaOrdenPagos.codCounter = reader.GetInt32(4);
                            listaOrdenPagos.pasajero = reader.GetString(5);
                            listaOrdenPagos.servicios = reader.GetString(6);
                            listaOrdenPagos.montoNeto = reader.GetDouble(7);
                            listaOrdenPagos.totalArgentina = reader.GetDouble(8);
                            listaOrdenPagos.totalCounter = reader.GetDouble(9);
                            listaOrdenPagos.totalAgencia = reader.GetDouble(10);
                            listaOrdenPagos.fechaPago = reader.GetDateTime(11);
                            listaOrdenPagos.formaPago = reader.GetInt32(12);
                            listaOrdenPagos.nombreAgencia = reader.GetString(13);
                            listOrden.Add(listaOrdenPagos);
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


            return listOrden;
        }

        public List<ReporteOperacionPagoTravelaceDetalle> getReportOrdenPagoDetalleByCity(DateTime startDate, DateTime endDate, int idCity)
        {
            startDate = new DateTime(startDate.Year, startDate.Month, startDate.Day, 1, 1, 0);
            endDate = new DateTime(endDate.Year, endDate.Month, endDate.Day, 23, 59, 0);
            ReporteOperacionPagoTravelaceDetalle listaOrdenPagos = new ReporteOperacionPagoTravelaceDetalle();
            List<ReporteOperacionPagoTravelaceDetalle> listOrden = new List<ReporteOperacionPagoTravelaceDetalle>();
            base.sqlConnection.open();
            string query = "";

            query = string.Format(@"
                                    select ND.codigoUnicoNota, OP.numeroPago, ND.codOperador,PR.nombre, ND.codCounter, ND.pasajero,  ND.servicios, ND.montoNeto,ND.totalArgentina,ND.totalCounter,ND.totalAgencia,OP.fechaPago,OP.formaPago, CL.nombre
                                    from paquetesNotaDebito as ND, paquetesOrdenPago as OP 
									, operadorPaquetes as PR, clientePaquetes as CL
									where 
									ND.codigoUnicoNota = OP.idNotaDebito
									and PR.id=ND.codOperador
                                    and ND.codCliente = CL.id
                                    and '{0}' > OP.fechaPago and OP.fechaPago > '{1}'
                                    and OP.pagado='1'
									and ND.codigoUnicoNota>0
                                    and OP.idSucursal = '{2}'
                                    and ND.idSucursal = '{2}'
									order by ND.codOperador
                                    ", endDate, startDate, idCity);
            try
            {
                using (SqlCommand command = new SqlCommand(query, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            listaOrdenPagos = new ReporteOperacionPagoTravelaceDetalle();
                            listaOrdenPagos.codUnicoNota = reader.GetInt32(0);
                            listaOrdenPagos.numeroPago = reader.GetInt32(1);
                            listaOrdenPagos.codOperador = reader.GetInt32(2);
                            listaOrdenPagos.nombreOperador = reader.GetString(3);
                            listaOrdenPagos.codCounter = reader.GetInt32(4);
                            listaOrdenPagos.pasajero = reader.GetString(5);
                            listaOrdenPagos.servicios = reader.GetString(6);
                            listaOrdenPagos.montoNeto = reader.GetDouble(7);
                            listaOrdenPagos.totalArgentina = reader.GetDouble(8);
                            listaOrdenPagos.totalCounter = reader.GetDouble(9);
                            listaOrdenPagos.totalAgencia = reader.GetDouble(10);
                            listaOrdenPagos.fechaPago = reader.GetDateTime(11);
                            listaOrdenPagos.formaPago = reader.GetInt32(12);
                            listaOrdenPagos.nombreAgencia = reader.GetString(13);
                            listOrden.Add(listaOrdenPagos);
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


            return listOrden;
        }



        public List<double> getReportTotales(int sucursal, DateTime startDate, DateTime endDate)
        {
            startDate = new DateTime(startDate.Year, startDate.Month, startDate.Day, 1, 1, 0);
            endDate = new DateTime(endDate.Year, endDate.Month, endDate.Day, 23, 59, 0);
            List<double> resultados = new List<double>();
            string query1 = string.Format(@"select sum(total) from paquetesNotaDebito where idSucursal = '{2}' and estado=1 and concepto like '%Anulado de Nota de Debito N°%' and concepto not like '%ppf%'  and '{0}' >= fechaGestion and fechaGestion >= '{1}'", endDate, startDate, sucursal);
            string query2 = string.Format(@"select sum(total) from paquetesNotaDebito where idSucursal = '{2}' and concepto like '%Remitido%' and estado=2 and '{0}' >= fechaGestion and fechaGestion >= '{1}'", endDate, startDate, sucursal);

            string query3 = string.Format(@"
                                            select sum(total)
                                            from paquetesNotaDebito as P
                                            left join paquetesOrdenPago as PO
                                            on PO.idNotaDebito = P.codigoUnicoNota and PO.idSucursal = P.idSucursal
                                            where PO.pagado = 1 and P.idSucursal = '{2}' 
                                            and P.estado=0 
                                            and (P.codOperador ='99' or P.codOperador = '100') and '{0}' >= P.fechaGestion and P.fechaGestion >= '{1}'
                                        ", endDate, startDate, sucursal);

            string query4 = "";
            query4 = string.Format(@"
                                    select sum(total) 
                                    from paquetesNotaDebito as P
                                    left join paquetesOrdenPago as PO
                                    on PO.idNotaDebito = P.codigoUnicoNota and PO.idSucursal = P.idSucursal
                                    where P.idSucursal = '{2}' 
                                    and P.codOperador='10' 
                                    and P.servicios like '%anulacion%' 
                                    and '{0}' >= P.fechaGestion and P.fechaGestion >= '{1}'
                                    ", endDate, startDate, sucursal);

            string query5 = string.Format(@"select sum(total) from paquetesNotaDebito where idSucursal = '{2}' and estado=3 and concepto like '%ppf%' and '{0}' >= fechaGestion and fechaGestion >= '{1}'", endDate, startDate, sucursal);


            string query6 = string.Format(@"select sum(totalMetropolitan) from paquetesNotaDebito where idSucursal = '{2}' and estado=1  and concepto not like '%ppf%' and concepto not like '%(ANULADO)%' and '{0}' >= fechaGestion and fechaGestion >= '{1}'", endDate, startDate, sucursal);
            string query7 = string.Format(@"select sum(totalMetropolitan) from paquetesNotaDebito where idSucursal = '{2}' and estado=1  and concepto like '%ppf%'  and '{0}' >= fechaGestion and fechaGestion >= '{1}'", endDate, startDate, sucursal);
            try
            {
                base.sqlConnection.open();

                using (SqlCommand command = new SqlCommand(query1, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            try
                            {
                                resultados.Add(reader.GetDouble(0));
                            }
                            catch
                            {
                                resultados.Add(0);
                            }
                        }
                    }
                }

                using (SqlCommand command = new SqlCommand(query2, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            try
                            {
                                resultados.Add(reader.GetDouble(0));
                            }
                            catch
                            {
                                resultados.Add(0);
                            }
                        }
                    }
                }

                using (SqlCommand command = new SqlCommand(query3, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            try
                            {
                                resultados.Add(reader.GetDouble(0));
                            }
                            catch
                            {
                                resultados.Add(0);
                            }
                        }
                    }
                }

                using (SqlCommand command = new SqlCommand(query4, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            try
                            {
                                resultados.Add(reader.GetDouble(0));
                            }
                            catch
                            {
                                resultados.Add(0);
                            }
                        }
                    }
                }

                using (SqlCommand command = new SqlCommand(query5, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            try
                            {
                                resultados.Add(reader.GetDouble(0));
                            }
                            catch
                            {
                                resultados.Add(0);
                            }
                        }
                    }
                }

                using (SqlCommand command = new SqlCommand(query6, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            try
                            {
                                resultados.Add(reader.GetDouble(0));
                            }
                            catch
                            {
                                resultados.Add(0);
                            }
                        }
                    }
                }

                using (SqlCommand command = new SqlCommand(query7, sqlConnection._sqlConnect))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            try
                            {
                                resultados.Add(reader.GetDouble(0));
                            }
                            catch
                            {
                                resultados.Add(0);
                            }
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


            return resultados;
        }
    }
}
