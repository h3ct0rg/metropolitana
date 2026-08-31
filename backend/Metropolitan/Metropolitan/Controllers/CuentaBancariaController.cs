using Common.model;
using DataBase.management;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Metropolitan.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CuentaBancariaController : ControllerBase
    {
        cuentaBancariaManagement gestordb = new cuentaBancariaManagement();

        // GET api/CuentaBancaria
        [HttpGet]
        public ActionResult<IEnumerable<cuentaBancaria>> Get()
        {
            return gestordb.getListCuentaBancaria();
        }

        // GET api/CuentaBancaria/GetActivas?moneda=USD
        [HttpGet("GetActivas")]
        public ActionResult<IEnumerable<cuentaBancaria>> GetActivas(string moneda = null)
        {
            return gestordb.getListCuentaBancariaActivas(moneda);
        }

        // GET api/CuentaBancaria/GetById
        [HttpGet("GetById")]
        public ActionResult<cuentaBancaria> GetById(int id)
        {
            return gestordb.getCuentaBancaria(id);
        }

        [HttpPost("CreateCuentaBancaria")]
        public ActionResult<cuentaBancaria> CreateCuentaBancaria(cuentaBancaria newCuentaBancaria)
        {
            newCuentaBancaria.createDate = DateTime.Now;
            int result = gestordb.createCuentaBancaria(newCuentaBancaria);
            if (result > 0)
            {
                return newCuentaBancaria;
            }
            else
            {
                throw new Exception("Was not posible create the cuenta bancaria");
            }
        }

        // Nunca borra: solo permite editar metadata / desactivar (activo=0).
        [HttpPost("UpdateCuentaBancaria")]
        public ActionResult<cuentaBancaria> UpdateCuentaBancaria(cuentaBancaria newCuentaBancaria)
        {
            newCuentaBancaria.modifyDate = DateTime.Now;
            int result = gestordb.updateCuentaBancaria(newCuentaBancaria);
            if (result >= 0)
            {
                return newCuentaBancaria;
            }
            else
            {
                throw new Exception("Was not posible update the cuenta bancaria");
            }
        }
    }
}
