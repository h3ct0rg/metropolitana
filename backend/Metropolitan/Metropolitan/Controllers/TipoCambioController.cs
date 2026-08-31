using Common.model;
using DataBase.management;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Metropolitan.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TipoCambioController : ControllerBase
    {
        tipoCambioConfigManagement gestordb = new tipoCambioConfigManagement();

        // GET api/TipoCambio/GetActual
        // Valor vigente (tasa del día), usado por el frontend para prellenar
        // el campo de tipo de cambio al crear una ND o una OP. Cualquier
        // usuario autenticado puede leerlo.
        [HttpGet("GetActual")]
        public ActionResult<tipoCambioConfig> GetActual()
        {
            return gestordb.getUltimo();
        }

        // GET api/TipoCambio/GetHistorial
        [HttpGet("GetHistorial")]
        public ActionResult<IEnumerable<tipoCambioConfig>> GetHistorial()
        {
            return gestordb.getHistorial();
        }

        // POST api/TipoCambio/CreateTipoCambio
        // Fija un nuevo tipo de cambio del día insertando una fila nueva
        // (nunca se edita una fila existente). Pensado para ser llamado solo
        // desde la pantalla de Configuración gateada a rol administrador en
        // el frontend (mismo patrón que el resto de pantallas admin de esta
        // app; no hay autorización real a nivel backend hoy en ningún
        // endpoint existente).
        [HttpPost("CreateTipoCambio")]
        public ActionResult<tipoCambioConfig> CreateTipoCambio(tipoCambioConfig nuevo)
        {
            nuevo.createDate = DateTime.Now;
            int result = gestordb.create(nuevo);
            if (result > 0)
            {
                return nuevo;
            }
            else
            {
                throw new Exception("Was not posible create the tipo de cambio");
            }
        }
    }
}
