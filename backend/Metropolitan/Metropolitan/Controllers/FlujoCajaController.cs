using Common.model;
using DataBase.management;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace Metropolitan.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlujoCajaController : ControllerBase
    {
        flujoCajaManagement gestordb = new flujoCajaManagement();

        // POST api/FlujoCaja/GetFlujoCaja  { startDate, endDate }
        [HttpPost("GetFlujoCaja")]
        public ActionResult<IEnumerable<FlujoCajaResumen>> GetFlujoCaja([FromBody] JObject filtro)
        {
            DateTime startDate = filtro["startDate"].ToObject<DateTime>();
            DateTime endDate = filtro["endDate"].ToObject<DateTime>();
            return gestordb.getResumen(startDate, endDate);
        }

        // POST api/FlujoCaja/GetFlujoCajaDetalle  { startDate, endDate }
        [HttpPost("GetFlujoCajaDetalle")]
        public ActionResult<IEnumerable<FlujoCajaMovimiento>> GetFlujoCajaDetalle([FromBody] JObject filtro)
        {
            DateTime startDate = filtro["startDate"].ToObject<DateTime>();
            DateTime endDate = filtro["endDate"].ToObject<DateTime>();
            return gestordb.getMovimientos(startDate, endDate);
        }
    }
}
