using Common.model;
using DataBase;
using DataBase.management;
using DataBase.model;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Metropolitan.Controllers.carga
{
    [Route("api/[controller]")]
    [ApiController]
    public class CargaOrdenPagoController : ControllerBase
    {
        cargaOrdendePagoTravelaceManagement gestordb = new cargaOrdendePagoTravelaceManagement();

        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<operacionPagoTravelace>> Get()
        {
            List<operacionPagoTravelace> notaDebito = new List<operacionPagoTravelace>();
            notaDebito = gestordb.getListOrdenPago();
            string json = JsonConvert.SerializeObject(notaDebito);
            return notaDebito;
        }

        [HttpGet("GetOrdenesPendientes")]
        public ActionResult<IEnumerable<listaOrdenDePagoTravelace>> GetOrdenesPendientes()
        {
            List<listaOrdenDePagoTravelace> notaDebito = new List<listaOrdenDePagoTravelace>();
            notaDebito = gestordb.getListOrdenesPendientes();
            string json = JsonConvert.SerializeObject(notaDebito);
            return notaDebito;
        }

        [HttpGet("GetOrdenesPendientesBySucursal")]
        public ActionResult<IEnumerable<listaOrdenDePagoTravelace>> GetOrdenesPendientesBySucursal(int sucursal)
        {
            List<listaOrdenDePagoTravelace> notaDebito = new List<listaOrdenDePagoTravelace>();
            notaDebito = gestordb.getListOrdenesPendientes(sucursal);
            List<listaOrdenDePagoTravelace> res = notaDebito.GroupBy(l => l.nombreCliente)
                .Select(r => new listaOrdenDePagoTravelace
                {
                    idCliente = r.First().idCliente,
                    idNota = r.First().idNota,
                    idOrden = r.First().idOrden,
                    nombreCliente = r.First().nombreCliente,
                    ordenMontoPagar = r.Sum(f => f.ordenMontoPagar),
                    saldoDeudor = r.Sum(f => f.saldoDeudor)
                }).ToList();

            
            return res;
        }

        [HttpGet("GetOrdenesPendientesByClient")]
        public ActionResult<IEnumerable<listaOrdenDePagoTravelace>> GetOrdenesPendientesByClient(string idClient, string idSucursal)
        {
            List<listaOrdenDePagoTravelace> notaDebito = new List<listaOrdenDePagoTravelace>();
            notaDebito = gestordb.getListOrdenesPendientesByCodigoUnicoGroup(idClient, idSucursal);
            string json = JsonConvert.SerializeObject(notaDebito);
            return notaDebito;
        }

        [HttpGet("GetOrdenesPendientesGrouped")]
        public ActionResult<IEnumerable<listaOrdenDePagoTravelace>> GetOrdenesPendientesGrouped()
        {
            List<listaOrdenDePagoTravelace> notaDebito = new List<listaOrdenDePagoTravelace>();
            notaDebito = gestordb.getListOrdenesPendientesGroup();
            string json = JsonConvert.SerializeObject(notaDebito);
            return notaDebito;
        }

        // GET api/values
        [HttpGet("GetOrdenById")]
        public ActionResult<operacionPagoTravelace> GetOrdenById(int id)
        {
            operacionPagoTravelace notaDebito = new operacionPagoTravelace();
            notaDebito = gestordb.getOrdenPago(id);
            string json = JsonConvert.SerializeObject(notaDebito);
            return notaDebito;
        }

        [HttpGet("GetOrdenByCodProfile")]
        public ActionResult<List<operacionPagoTravelace>> GetOrdenByCodProfile(string id)
        {
            List<operacionPagoTravelace> notaDebito = new List<operacionPagoTravelace>();
            notaDebito = gestordb.getOrdenPagoByCodProfile(id);
            string json = JsonConvert.SerializeObject(notaDebito);
            return notaDebito;
        }

        [HttpGet("GetOrdenByCliendId")]
        public ActionResult<List<operacionPagoTravelace>> GetOrdenByCliendId(string id)
        {
            List<operacionPagoTravelace> notaDebito = new List<operacionPagoTravelace>();
            notaDebito = gestordb.getListOrdenPagoBiClientId(id);
            string json = JsonConvert.SerializeObject(notaDebito);
            return notaDebito;
        }

        [HttpPost("CreateOrdenPago")]
        public ActionResult<operacionPagoTravelace> CreateOrdenPago(operacionPagoTravelace newOperador)
        {
            newOperador.createDate = DateTime.Now;
            int result = gestordb.createOrdenPagoTravelace(newOperador);
            if (result > 0)
            {
                return newOperador;
            }
            else
            {
                throw new Exception("Was not posible create the client");
            }
        }

        [HttpPost("UpdateOrdenPago")]
        public ActionResult<operacionPagoTravelace> UpdateOrdenPago(operacionPagoTravelace newOperador)
        {
            newOperador.modifyDate = DateTime.Now;
            int result = gestordb.updateOrdenPagoTravelace(newOperador);
            if (result >= 0)
            {
                return newOperador;
            }
            else
            {
                throw new Exception("Was not posible update the client");
            }
        }

        [HttpPost("GetListOrdenPagoReport")]
        public ActionResult<List<ordenPagoReporteTravelace>> GetListOrdenPagoReport([FromBody] JObject actionRequest)//int filter, int codOrden = -1)
        {
            dynamic apRequest = (dynamic)actionRequest;
            var filt = (string)apRequest.filter;
            var codOrden = (string)apRequest.codOrden;
            var idSucursal = (string)apRequest.idSucursal;

            try
            {
                List<ordenPagoReporteTravelace> result = gestordb.getListOrdenPagos(Convert.ToInt32(filt), Convert.ToInt32(idSucursal), Convert.ToInt32(codOrden) );
                if (result.Count >= 0)
                {
                    return result;
                }
                else
                {
                    throw new Exception("Was not posible update the client");
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPost("GetReporteVentas")]
        public ActionResult<List<ReporteOperacionPagoTravelace>> GetReporteVentas([FromBody] JObject actionRequest)
        {
            dynamic apRequest = (dynamic)actionRequest;
            var starDate = (string)apRequest.startDate;
            var endDate = (string)apRequest.endDate;

            try
            {
                List<ReporteOperacionPagoTravelace> result = gestordb.getReportOrdenPago(Convert.ToDateTime(starDate), Convert.ToDateTime(endDate));
                if (result.Count >= 0)
                {
                    return result;
                }
                else
                {
                    throw new Exception("Was not posible update the client");
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPost("GetReporteTotales")]
        public ActionResult<List<double>> GetReporteTotales([FromBody] JObject actionRequest)
        {
            dynamic apRequest = (dynamic)actionRequest;
            var starDate = (string)apRequest.startDate;
            var endDate = (string)apRequest.endDate;
            var sucursal = (int)apRequest.sucursal;
            List<double> results = new List<double>();
            results = gestordb.getReportTotales(sucursal, Convert.ToDateTime(starDate), Convert.ToDateTime(endDate));
            return results;
        }

        [HttpPost("GetReporteVentasDetalle")]
        public ActionResult<List<ReporteOperacionPagoTravelaceDetalle>> GetReporteVentasDetalle([FromBody] JObject actionRequest)
        {
            dynamic apRequest = (dynamic)actionRequest;
            var starDate = (string)apRequest.startDate;
            var endDate = (string)apRequest.endDate;

            try
            {
                List<ReporteOperacionPagoTravelaceDetalle> result = gestordb.getReportOrdenPagoDetalle(Convert.ToDateTime(starDate), Convert.ToDateTime(endDate));
                if (result.Count >= 0)
                {
                    return result;
                }
                else
                {
                    throw new Exception("Was not posible update the client");
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPost("GetReporteVentasDetalleByCity")]
        public ActionResult<List<ReporteOperacionPagoTravelaceDetalle>> GetReporteVentasDetalleByCity([FromBody] JObject actionRequest)
        {
            dynamic apRequest = (dynamic)actionRequest;
            var starDate = (string)apRequest.startDate;
            var endDate = (string)apRequest.endDate;
            var idCity = (int)apRequest.idCity;

            try
            {
                List<ReporteOperacionPagoTravelaceDetalle> result = gestordb.getReportOrdenPagoDetalleByCity(Convert.ToDateTime(starDate), Convert.ToDateTime(endDate), idCity);
                if (result.Count >= 0)
                {
                    return result;
                }
                else
                {
                    throw new Exception("Was not posible update the client");
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPost("GetReporteVentasDetallePpf")]
        public ActionResult<List<ReporteOperacionPagoTravelaceDetalle>> GetReporteVentasDetallePpf([FromBody] JObject actionRequest)
        {
            dynamic apRequest = (dynamic)actionRequest;
            var sucursal = (int)apRequest.sucursal;
            var starDate = (string)apRequest.startDate;
            var endDate = (string)apRequest.endDate;

            try
            {
                List<ReporteOperacionPagoTravelaceDetalle> result = gestordb.getReportOrdenPagoDetallePpd(sucursal, Convert.ToDateTime(starDate), Convert.ToDateTime(endDate));
                if (result.Count >= 0)
                {
                    return result;
                }
                else
                {
                    throw new Exception("Was not posible update the client");
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPost("GetReporteVentasDetalleAnulacion")]
        public ActionResult<List<ReporteOperacionPagoTravelaceDetalle>> GetReporteVentasDetalleAnulacion([FromBody] JObject actionRequest)
        {
            dynamic apRequest = (dynamic)actionRequest;
            var sucursal = (int)apRequest.sucursal;
            var starDate = (string)apRequest.startDate;
            var endDate = (string)apRequest.endDate;

            try
            {
                List<ReporteOperacionPagoTravelaceDetalle> result = gestordb.getReportOrdenPagoDetalleAnulacion(sucursal, Convert.ToDateTime(starDate), Convert.ToDateTime(endDate), 1);
                if (result.Count >= 0)
                {
                    return result;
                }
                else
                {
                    throw new Exception("Was not posible update the client");
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        [HttpPost("GetReporteVentasDetalleRemision")]
        public ActionResult<List<ReporteOperacionPagoTravelaceDetalle>> GetReporteVentasDetalleRemision([FromBody] JObject actionRequest)
        {
            dynamic apRequest = (dynamic)actionRequest;
            var sucursal = (int)apRequest.sucursal;
            var starDate = (string)apRequest.startDate;
            var endDate = (string)apRequest.endDate;

            try
            {
                List<ReporteOperacionPagoTravelaceDetalle> result = gestordb.getReportOrdenPagoDetalleAnulacion(sucursal, Convert.ToDateTime(starDate), Convert.ToDateTime(endDate), 2);
                if (result.Count >= 0)
                {
                    return result;
                }
                else
                {
                    throw new Exception("Was not posible update the client");
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
