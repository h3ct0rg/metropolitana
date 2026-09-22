using Common.model.dashboard;
using DataBase.management.dashboard;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Metropolitan.Controllers.dashboard
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardPaquetesController : ControllerBase
    {
        DashboardPaquetesManagement gestordb = new DashboardPaquetesManagement();

        [HttpGet("NdPorFecha")]
        public ActionResult<List<NdPorFechaDto>> NdPorFecha(int idSucursal, DateTime start, DateTime end)
        {
            return gestordb.getNdPorFechaSalida(start, end, idSucursal);
        }

        [HttpGet("NdPorSucursal")]
        public ActionResult<List<NdPorSucursalDto>> NdPorSucursal(DateTime start, DateTime end)
        {
            return gestordb.getNdPorFechaSalidaBySucursal(start, end);
        }
    }
}
