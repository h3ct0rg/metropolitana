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
    public class cargaOrdendePagoTravelaceManagement : gestorDB
    {
        public List<operacionPagoTravelace> getListOrdenPago()
        {
            operacionPagoTravelace ordenPago = new operacionPagoTravelace();
            List<operacionPagoTravelace> listP = new List<operacionPagoTravelace>();
            base.sqlConnection.open();

            string query = string.Format("select * from cargaOrdenPago");
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
                numeroND=r.First().numeroND,
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
                                        FROM cargaOrdenPago as hh 
                                        inner join cargaNotaDebito as nd 
                                        on hh.idNotaDebito = nd.codigoUnicoNota and hh.idSucursal = nd.idSucursal
                                        inner join clienteCarga as cl
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
                                        FROM cargaOrdenPago as hh 
                                        inner join cargaNotaDebito as nd 
                                        on hh.idNotaDebito = nd.codigoUnicoNota and hh.idSucursal = nd.idSucursal
                                        inner join clienteCarga as cl
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
                                            FROM cargaOrdenPago as hh
                                            inner join cargaNotaDebito as nd 
                                            on hh.idNotaDebito = nd.codigoUnicoNota and hh.idSucursal = nd.idSucursal
                                            inner join clienteCarga as cl
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
                                            FROM cargaOrdenPago as hh
                                            inner join cargaNotaDebito as nd 
                                            on hh.idNotaDebito = nd.codigoUnicoNota and hh.idSucursal = nd.idSucursal
                                            inner join clienteCarga as cl
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
                                            FROM cargaOrdenPago as hh
                                            inner join cargaNotaDebito as nd 
                                            on hh.idNotaDebito = nd.codigoUnicoNota and hh.idSucursal = nd.idSucursal
                                            inner join clienteCarga as cl
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
                                            FROM cargaOrdenPago as hh
                                            inner join cargaNotaDebito as nd 
                                            on hh.idNotaDebito = nd.codigoUnicoNota and hh.idSucursal = nd.idSucursal
                                            inner join clienteCarga as cl
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
                                        FROM cargaOrdenPago as op, cargaNotaDebito as nd, clienteCarga as cl
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
                            ordenPago.tipoCambioValor = GetNullableDoubleByName(reader, "tipoCambioValor");
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

            string query = string.Format("select * from cargaOrdenPago where id = '{0}'", codUnico);
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

        public List<operacionPagoTravelace> getOrdenPagoByCodProfile(string codProfile)
        {
            List<operacionPagoTravelace> listOP = new List<operacionPagoTravelace>();
            operacionPagoTravelace ordenPago = new operacionPagoTravelace();
            base.sqlConnection.open();

            string query = string.Format("select * from cargaOrdenPago where codProfile = '{0}' and codProfile not like ''", codProfile);
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

            // formaPago=0 es el sentinel "aún no elegida" que se usa al crear la OP
            // pendiente junto con la ND -- no validar contra el catálogo en ese caso.
            if (notaD.formaPago > 0)
            {
                formaPagoManagement formaPagoGestor = new formaPagoManagement();
                formaPago fp = formaPagoGestor.getFormaPago(notaD.formaPago);
                if (fp == null || !fp.activo)
                {
                    throw new Exception("La forma de pago seleccionada no está disponible.");
                }
            }

            string query = string.Format(@"Insert into cargaOrdenPago
                                        (fechaPago,montoAPagar,monedaPago,saldoDeudor,numeroPago,
                                        formaPago,numeroTarjeta,concepto,anulado,idNotaDebito,pagado,codProfile,idSucursal,
                                        createdBy,createDate,tipoCambioValor)
                                        values ('{0}','{1}','{2}','{3}','{4}',
                                                '{5}','{6}','{7}','{8}','{9}',
                                                '{10}','{11}','{12}','{13}','{14}',{15})",
                                        notaD.fechaPago, notaD.montoAPagar, notaD.monedaPago, notaD.saldoDeudor, notaD.numeroPago,
                                        notaD.formaPago, notaD.numeroTarjeta, notaD.concepto, notaD.anulado, notaD.numeroNotaDebito, notaD.pagado, notaD.codProfile, notaD.idSucursal,
                                        notaD.createBy, DateTime.Now,
                                        notaD.tipoCambioValor.HasValue ? notaD.tipoCambioValor.Value.ToString(System.Globalization.CultureInfo.InvariantCulture) : "NULL");
            return base.insertUpdateExecute(query);
        }

        public int updateOrdenPagoTravelace(operacionPagoTravelace notaD)
        {
            operacionPagoTravelace actual = getOrdenPago(notaD.id);
            if (actual != null && actual.pagado)
            {
                if (notaD.monedaPago != actual.monedaPago || notaD.tipoCambioValor != actual.tipoCambioValor || notaD.formaPago != actual.formaPago)
                {
                    throw new Exception("No se puede modificar la moneda, el tipo de cambio ni la forma de pago de una Orden de Pago ya pagada.");
                }
            }
            else if (notaD.formaPago > 0)
            {
                formaPagoManagement formaPagoGestor = new formaPagoManagement();
                formaPago fp = formaPagoGestor.getFormaPago(notaD.formaPago);
                if (fp == null || !fp.activo)
                {
                    throw new Exception("La forma de pago seleccionada no está disponible.");
                }
            }

            string query = string.Format(@"Update cargaOrdenPago
                                        set
                                        fechaPago='{0}',montoAPagar='{1}',monedaPago='{2}',saldoDeudor='{3}',
                                        formaPago='{4}',numeroTarjeta='{5}',concepto='{6}',anulado='{7}',pagado='{8}',codProfile='{9}',idSucursal='{10}',
                                        modifyBy='{11}',modifyDate='{12}',tipoCambioValor={14}
                                        where id={13}",
                                        notaD.fechaPago, notaD.montoAPagar, notaD.monedaPago, notaD.saldoDeudor,
                                        notaD.formaPago, notaD.numeroTarjeta, notaD.concepto, notaD.anulado, notaD.pagado, notaD.codProfile, notaD.idSucursal,
                                        notaD.modify, DateTime.Now, notaD.id,
                                        notaD.tipoCambioValor.HasValue ? notaD.tipoCambioValor.Value.ToString(System.Globalization.CultureInfo.InvariantCulture) : "NULL");
            return insertUpdateExecute(query);
        }
        public int generateCodigoUnico(int idSucursal)
        {
            string codigoName = "ordenPagoCarga";
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
                    query = string.Format(@"SELECT cl.id, nd.codigoUnicoNota, op.id, cl.nombre, nd.montoNeto, (nd.montoNeto-nd.totalAgencia), nd.monedaNota, nd.tipoCambioValor
                                            FROM cargaOrdenPago as op, cargaNotaDebito as nd, clienteCarga as cl
                                            where nd.codigoUnicoNota = op.idNotaDebito  and nd.codCliente = cl.id and op.pagado='false' and cl.id = '{0}'", clientID);
                }
                else
                {
                    query = string.Format(@"SELECT cl.id, nd.codigoUnicoNota, op.id, cl.nombre, nd.montoNeto, (nd.montoNeto-nd.totalAgencia), nd.monedaNota, nd.tipoCambioValor
                                            FROM cargaOrdenPago as op, cargaNotaDebito as nd, clienteCarga as cl
                                            where nd.codigoUnicoNota = op.idNotaDebito  and nd.codCliente = cl.id and op.pagado='false' and cl.id = '{0}' and nd.idSucursal = '{1}' and op.idSucursal='{1}'", clientID, sucursal);
                }
            }
            else
            {
                if (sucursal == -1)
                {
                    query = string.Format(@"SELECT cl.id, nd.codigoUnicoNota, op.id, cl.nombre, nd.montoNeto, (nd.montoNeto-nd.totalAgencia), nd.monedaNota, nd.tipoCambioValor
                                            FROM cargaOrdenPago as op, cargaNotaDebito as nd, clienteCarga as cl
                                            where nd.codigoUnicoNota = op.idNotaDebito  and nd.codCliente = cl.id and op.pagado='false'");
                }
                else
                {
                    query = string.Format(@"SELECT cl.id, nd.codigoUnicoNota, op.id, cl.nombre, nd.montoNeto, (nd.montoNeto-nd.totalAgencia), nd.monedaNota, nd.tipoCambioValor
                                            FROM cargaOrdenPago as op, cargaNotaDebito as nd, clienteCarga as cl
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
                            listaOrdenPagos.monedaNota = GetNullableInt32ByName(reader, "monedaNota");
                            listaOrdenPagos.tipoCambioValor = GetNullableDoubleByName(reader, "tipoCambioValor");
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
                    monedaNota = r.First().monedaNota,
                    tipoCambioValor = r.First().tipoCambioValor,
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
                    monedaNota = r.First().monedaNota,
                    tipoCambioValor = r.First().tipoCambioValor,
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
                                    from cargaNotaDebito as ND, cargaOrdenPago as OP where ND.codigoUnicoNota = OP.idNotaDebito
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
                                    codigoUnicoNota, PR.nombre, codCounter,pasajero,servicios,montoNeto,totalArgentina,totalCounter,totalAgencia, fechaGestion, ND.tipoCambioValor
  FROM cargaNotaDebito as ND, operadorCarga as PR where
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
                            listaOrdenPagos.tipoCambioValor = GetNullableDoubleByName(reader, "tipoCambioValor");
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
CL.nombre, ND.tipoCambioValor
from cargaNotaDebito as ND, operador as PR, clients as CL
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
                            listaOrdenPagos.tipoCambioValor = GetNullableDoubleByName(reader, "tipoCambioValor");
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
                                    select ND.codigoUnicoNota, OP.numeroPago, ND.codOperador,PR.nombre, ND.codCounter, ND.pasajero,  ND.servicios, ND.montoNeto,ND.totalArgentina,ND.totalCounter,ND.totalAgencia,OP.fechaPago,OP.formaPago, CL.nombre, ND.tipoCambioValor
                                    from cargaNotaDebito as ND, cargaOrdenPago as OP
									, operadorCarga as PR, clienteCarga as CL
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
                            listaOrdenPagos.tipoCambioValor = GetNullableDoubleByName(reader, "tipoCambioValor");
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
                                    select ND.codigoUnicoNota, OP.numeroPago, ND.codOperador,PR.nombre, ND.codCounter, ND.pasajero,  ND.servicios, ND.montoNeto,ND.totalArgentina,ND.totalCounter,ND.totalAgencia,OP.fechaPago,OP.formaPago, CL.nombre, ND.tipoCambioValor
                                    from cargaNotaDebito as ND, cargaOrdenPago as OP
									, operadorCarga as PR, clienteCarga as CL
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
                            listaOrdenPagos.tipoCambioValor = GetNullableDoubleByName(reader, "tipoCambioValor");
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
            string query1 = string.Format(@"select sum(total) from cargaNotaDebito where idSucursal = '{2}' and estado=1  and concepto not like '%ppf%'  and '{0}' >= fechaGestion and fechaGestion >= '{1}'", endDate, startDate, sucursal);
            string query2 = string.Format(@"select sum(total) from cargaNotaDebito where idSucursal = '{2}' and concepto like '%Remitido%' and estado=2 and '{0}' >= fechaGestion and fechaGestion >= '{1}'", endDate, startDate, sucursal);
            string query3 = string.Format(@"select sum(total) from cargaNotaDebito where idSucursal = '{2}' and estado=0 and (codOperador ='99' or codOperador = '100') and '{0}' >= fechaGestion and fechaGestion >= '{1}'", endDate, startDate, sucursal);
            string query4 = string.Format(@"select sum(total) from cargaNotaDebito where idSucursal = '{2}' and codOperador='10' and servicios like '%anulacion%' and '{0}' >= fechaGestion and fechaGestion >= '{1}'", endDate, startDate, sucursal);
            string query5 = string.Format(@"select sum(total) from cargaNotaDebito where idSucursal = '{2}' and estado=3 and concepto like '%ppf%' and '{0}' >= fechaGestion and fechaGestion >= '{1}'", endDate, startDate, sucursal);


            string query6 = string.Format(@"select sum(totalMetropolitan) from cargaNotaDebito where idSucursal = '{2}' and estado=1  and concepto not like '%ppf%'  and '{0}' >= fechaGestion and fechaGestion >= '{1}'", endDate, startDate, sucursal);
            string query7 = string.Format(@"select sum(totalMetropolitan) from cargaNotaDebito where idSucursal = '{2}' and estado=1  and concepto like '%ppf%'  and '{0}' >= fechaGestion and fechaGestion >= '{1}'", endDate, startDate, sucursal);
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
