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

        // POST api/FlujoCaja/GetFlujoCaja  { startDate, endDate, area, sucursal }
        [HttpPost("GetFlujoCaja")]
        public ActionResult<IEnumerable<FlujoCajaResumen>> GetFlujoCaja([FromBody] JObject filtro)
        {
            DateTime startDate = filtro["startDate"].ToObject<DateTime>();
            DateTime endDate = filtro["endDate"].ToObject<DateTime>();
            string area = filtro["area"] != null ? filtro["area"].ToObject<string>() : "TODAS";
            int sucursal = filtro["sucursal"] != null ? filtro["sucursal"].ToObject<int>() : 0;
            return gestordb.getResumen(startDate, endDate, area, sucursal);
        }

        // POST api/FlujoCaja/GetFlujoCajaDetalle  { startDate, endDate, area, sucursal }
        [HttpPost("GetFlujoCajaDetalle")]
        public ActionResult<IEnumerable<FlujoCajaMovimiento>> GetFlujoCajaDetalle([FromBody] JObject filtro)
        {
            DateTime startDate = filtro["startDate"].ToObject<DateTime>();
            DateTime endDate = filtro["endDate"].ToObject<DateTime>();
            string area = filtro["area"] != null ? filtro["area"].ToObject<string>() : "TODAS";
            int sucursal = filtro["sucursal"] != null ? filtro["sucursal"].ToObject<int>() : 0;
            return gestordb.getMovimientos(startDate, endDate, area, sucursal);
        }
    }
}
