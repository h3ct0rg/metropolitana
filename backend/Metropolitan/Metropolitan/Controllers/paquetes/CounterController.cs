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
    public class CounterPaquetesController : ControllerBase
    {
        paquetesCounterManagement gestordb = new paquetesCounterManagement();

        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<Counter>> Get()
        {
            List<Counter> provee = new List<Counter>();
            provee = gestordb.getListCounter();
            return provee;
        }

        [HttpPost("GetReporteByCounter")]
        public ActionResult<List<reportByCounter>> GetReporteByCounter([FromBody] JObject actionRequest)
        {
            dynamic apRequest = (dynamic)actionRequest;
            var starDate = (string)apRequest.startDate;
            var endDate = (string)apRequest.endDate;
            List<reportByCounter> results = new List<reportByCounter>();
            results = gestordb.getProfitByCounter(Convert.ToDateTime(starDate), Convert.ToDateTime(endDate));
            return results;
        }

        // GET api/values
        [HttpGet("GetById")]
        public ActionResult<Counter> GetById(int id)
        {
            Counter provee = new Counter();
            provee = gestordb.getCounter(id);
            return provee;
        }

        [HttpGet("GetByClientId")]
        public ActionResult<List<Counter>> GetByClientId(int id)
        {
            List<Counter> provee = new List<Counter>();
            provee = gestordb.getCounterByClient(id);
            return provee;
        }

        [HttpGet("GetBySucursalId")]
        public ActionResult<List<Counter>> GetBySucursalId(int id)
        {
            List<Counter> provee = new List<Counter>();
            provee = gestordb.getCounterBySucursal(id);
            return provee;
        }

        [HttpPost("CreateCounter")]
        public ActionResult<Counter> CreateProveedor(Counter newCounter)
        {
            newCounter.createDate = DateTime.Now;
            int result = gestordb.createCounter(newCounter);
            if (result > 0)
            {
                return newCounter;
            }
            else
            {
                throw new Exception("Was not posible create the client");
            }
        }

        [HttpPost("UpdateCounter")]
        public ActionResult<Counter> UpdateProveedor(Counter newClient)
        {
            newClient.modifyDate = DateTime.Now;
            int result = gestordb.updateCounter(newClient);
            if (result >= 0)
            {
                return newClient;
            }
            else
            {
                throw new Exception("Was not posible update the client");
            }
        }

        [HttpGet("DeleteCounter")]
        public ActionResult<int> DeleteCounter(string idCounter)
        {
            int result = gestordb.deleteCounter(idCounter);
            if (result > 0)
            {
                return result;
            }
            else
            {
                throw new Exception("Was not posible create the client");
            }
        }
    }
}
