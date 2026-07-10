using DataBase;
using DataBase.management;
using DataBase.model;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Metropolitan.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProveedorController : ControllerBase
    {
        ProvedorManagement gestordb = new ProvedorManagement();

        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<proveedor>> Get()
        {
            List<proveedor> provee = new List<proveedor>();
            provee = gestordb.getListProveedores();
            string json = JsonConvert.SerializeObject(provee);
            return provee;
        }

        // GET api/values
        [HttpGet("GetById")]
        public ActionResult<proveedor> GetById(int id)
        {
            proveedor provee = new proveedor();
            provee = gestordb.getProveedor(id);
            string json = JsonConvert.SerializeObject(provee);
            return provee;
        }

        [HttpPost("CreateProveedor")]
        public ActionResult<proveedor> CreateProveedor(proveedor newClient)
        {
            newClient.createDate = DateTime.Now;
            int result = gestordb.createProveedor(newClient);
            if (result > 0)
            {
                return newClient;
            }
            else
            {
                throw new Exception("Was not posible create the client");
            }
        }

        [HttpPost("UpdateProveedor")]
        public ActionResult<proveedor> UpdateProveedor(proveedor newClient)
        {
            newClient.modifyDate = DateTime.Now;
            int result = gestordb.updateProveedor(newClient);
            if (result >= 0)
            {
                return newClient;
            }
            else
            {
                throw new Exception("Was not posible update the client");
            }
        }
    }
}
