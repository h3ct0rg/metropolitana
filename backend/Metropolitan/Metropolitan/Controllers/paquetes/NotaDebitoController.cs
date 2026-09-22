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

namespace Metropolitan.Controllers.paquetes
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotaDebitoPaquetesController : ControllerBase
    {
        paquetesNotaDebitoTravelManagement gestordb = new paquetesNotaDebitoTravelManagement();

        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<notaDebitoTravelace>> Get()
        {
            List<notaDebitoTravelace> notaDebito = new List<notaDebitoTravelace>();
            notaDebito = gestordb.getListNotaDebito();
            string json = JsonConvert.SerializeObject(notaDebito);
            return notaDebito;
        }

        [HttpGet("GetBySucursal")]
        public ActionResult<PagedResult<notaDebitoListTable>> GetBySucursal(int id, int pageIndex = 1, int pageSize = 20, string searchText = null)
        {
            PagedResult<notaDebitoListTable> notaDebito = gestordb.getListNotaDebitoBySucursalPaged(id, pageIndex, pageSize, searchText);
            return notaDebito;
        }

        [HttpGet("GetBySucursalAndId")]
        public ActionResult<IEnumerable<notaDebitoListTable>> GetBySucursalAndId(int sucursal, int id)
        {
            List<notaDebitoListTable> notaDebito = new List<notaDebitoListTable>();
            notaDebito = gestordb.getListNotaDebitoBySucursalAndId(sucursal, id);
            string json = JsonConvert.SerializeObject(notaDebito);
            return notaDebito;
        }

        [HttpGet("GetBySucursalDate")]
        public ActionResult<IEnumerable<notaDebitoListTable>> GetBySucursalDate(int id, DateTime fecha)
        {
            List<notaDebitoListTable> notaDebito = new List<notaDebitoListTable>();
            notaDebito = gestordb.getListNotaDebitoBySucursalandDate(id, fecha);
            string json = JsonConvert.SerializeObject(notaDebito);
            return notaDebito;
        }

        [HttpGet("GetById")]
        public ActionResult<notaDebitoTravelace> GetById(int id)
        {
            notaDebitoTravelace notaDebito = new notaDebitoTravelace();
            notaDebito = gestordb.getnotadebitoTravelace(id);
            string json = JsonConvert.SerializeObject(notaDebito);
            return notaDebito;
        }

        [HttpGet("getNotaDebitoListCod")]
        public ActionResult<List<notaDebitoTravelace>> getNotaDebitoListCod(int id, int idSucursal)
        {
            List<notaDebitoTravelace> notaDebito = new List<notaDebitoTravelace>();
            notaDebito = gestordb.getListNotaDebito(id, idSucursal);
            string json = JsonConvert.SerializeObject(notaDebito);
            return notaDebito;
        }

        [HttpPost("CreateNotaDebito")]
        public ActionResult<notaDebitoTravelace> CreateNotaDebito(notaDebitoTravelace newOperador)
        {
            newOperador.createDate = DateTime.Now;
            notaDebitoTravelace result = gestordb.createnotadebitoTravelace(newOperador);
            if (result != null)
            {
                return result;
            }
            else
            {
                throw new Exception("Was not posible create the client");
            }
        }

        [HttpPost("ReporteNotaDebitoFiltrado")]
        public ActionResult<List<notaDebitoTravelace>> ReporteNotaDebitoFiltrado(NotaDebitoFilter notaDebitoFilter)
        {
            List<notaDebitoTravelace> result = new List<notaDebitoTravelace>();

            result = gestordb.getListNotaDebito(notaDebitoFilter);
            return result;

        }

        [HttpPost("ReporteFechaSalida")]
        public ActionResult<List<notaDebitoFechaSalidaDto>> ReporteFechaSalida([FromBody] JObject actionRequest)
        {
            dynamic apRequest = (dynamic)actionRequest;
            var starDate = (string)apRequest.startDate;
            var endDate = (string)apRequest.endDate;
            var idSucursal = (int)apRequest.idSucursal;

            List<notaDebitoFechaSalidaDto> result = gestordb.getNotaDebitoByFechaSalida(Convert.ToDateTime(starDate), Convert.ToDateTime(endDate), idSucursal);
            return result;
        }

        [HttpPost("UpdateNotaDebito")]
        public ActionResult<notaDebitoTravelace> UpdateNotaDebito(notaDebitoTravelace newOperador)
        {
            newOperador.modifyDate = DateTime.Now;
            int result = gestordb.updatenotadebitoTravelace(newOperador);
            if (result >= 0)
            {
                return newOperador;
            }
            else
            {
                throw new Exception("Was not posible update the client");
            }
        }

        [HttpPost("CalcularNotaDebito")]
        public ActionResult<calcularNotaDebitoTravelace> CalcularNotaDebito(calcularNotaDebitoTravelace calculos)
        {
            if (calculos.codOperador != 0)
            {
                calcularNotaDebitoTravelace result = gestordb.calcularNotadebitoTravelace(calculos);
                if (result.totalArgentina != 0)
                {
                    return calculos;
                }
                else
                {
                    if (calculos.codCounter == 0)
                    {
                        return calculos;
                    }
                    else
                    {
                        throw new Exception("Was not posible to calculate");
                    }
                }
            }
            else
            {
                throw new Exception("Was not selected an Operator");
            }
        }

        [HttpGet("DeleteNotaDebito")]
        public ActionResult<string> DeleteNotaDebito(int idNota, int idUser)
        {
            string result = gestordb.deletePaqueteNotaDebito(idNota, idUser);
            return new JsonResult(result);
        }
    }
}
