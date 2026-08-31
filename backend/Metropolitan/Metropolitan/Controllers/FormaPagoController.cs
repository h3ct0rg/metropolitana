using Common.model;
using DataBase.management;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Metropolitan.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FormaPagoController : ControllerBase
    {
        formaPagoManagement gestordb = new formaPagoManagement();

        // GET api/FormaPago
        [HttpGet]
        public ActionResult<IEnumerable<formaPago>> Get()
        {
            return gestordb.getListFormaPago();
        }

        // GET api/FormaPago/GetActivos
        [HttpGet("GetActivos")]
        public ActionResult<IEnumerable<formaPago>> GetActivos()
        {
            return gestordb.getListFormaPagoActivos();
        }

        // GET api/FormaPago/GetById
        [HttpGet("GetById")]
        public ActionResult<formaPago> GetById(int id)
        {
            return gestordb.getFormaPago(id);
        }

        [HttpPost("CreateFormaPago")]
        public ActionResult<formaPago> CreateFormaPago(formaPago newFormaPago)
        {
            newFormaPago.createDate = DateTime.Now;
            int result = gestordb.createFormaPago(newFormaPago);
            if (result > 0)
            {
                return newFormaPago;
            }
            else
            {
                throw new Exception("Was not posible create the forma de pago");
            }
        }

        // Nunca borra: solo permite editar metadata / desactivar (activo=0).
        [HttpPost("UpdateFormaPago")]
        public ActionResult<formaPago> UpdateFormaPago(formaPago newFormaPago)
        {
            newFormaPago.modifyDate = DateTime.Now;
            int result = gestordb.updateFormaPago(newFormaPago);
            if (result >= 0)
            {
                return newFormaPago;
            }
            else
            {
                throw new Exception("Was not posible update the forma de pago");
            }
        }
    }
}
