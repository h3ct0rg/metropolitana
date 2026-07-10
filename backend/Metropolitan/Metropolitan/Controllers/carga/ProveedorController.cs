using DataBase;
using DataBase.management;
using DataBase.model;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Metropolitan.Controllers.carga
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProveedorCargaController : ControllerBase
    {
        cargaOperadorManagement gestordb = new cargaOperadorManagement();

        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<Operadores>> Get()
        {
            List<Operadores> Operador = new List<Operadores>();
            Operador = gestordb.getListoperadores();
            string json = JsonConvert.SerializeObject(Operador);
            return Operador;
        }

        // GET api/values
        [HttpGet("GetById")]
        public ActionResult<Operadores> GetById(int id)
        {
            Operadores Operador = new Operadores();
            Operador = gestordb.getoperador(id);
            string json = JsonConvert.SerializeObject(Operador);
            return Operador;
        }

        [HttpGet("GetBySucursal")]
        public ActionResult<IEnumerable<Operadores>> GetBySucursal(int id)
        {
            List<Operadores> Operador = new List<Operadores>();
            Operador = gestordb.getListoperadoresBySucursal(id);
            string json = JsonConvert.SerializeObject(Operador);
            return Operador;
        }

        [HttpPost("CreateOperador")]
        public ActionResult<Operadores> CreateOperador(Operadores newOperador)
        {
            newOperador.createDate = DateTime.Now;
            int result = gestordb.createoperador(newOperador);
            if (result > 0)
            {
                return newOperador;
            }
            else
            {
                throw new Exception("Was not posible create the client");
            }
        }

        [HttpPost("UpdateOperador")]
        public ActionResult<Operadores> UpdateOperador(Operadores newOperador)
        {
            newOperador.modifyDate = DateTime.Now;
            int result = gestordb.updateoperador(newOperador);
            if (result >= 0)
            {
                return newOperador;
            }
            else
            {
                throw new Exception("Was not posible update the client");
            }
        }

        [HttpGet("DeleteOperador")]
        public ActionResult<int> DeleteOperador(string idOperator)
        {
            int result = gestordb.deleteOperador(idOperator);
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
