using DataBase;
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
    public class ClienteCargaController : ControllerBase
    {
        cargaClientManagement gestordb = new cargaClientManagement();

        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<clients>> Get()
        {
            List<clients> Cliente = new List<clients>();
            Cliente = gestordb.getListClients();
            string json = JsonConvert.SerializeObject(Cliente);
            return Cliente;
        }

        // GET api/values
        [HttpGet("GetById")]
        public ActionResult<clients> GetById(int id)
        {
            clients Cliente = new clients();
            Cliente = gestordb.getListClients(id);
            string json = JsonConvert.SerializeObject(Cliente);
            return Cliente;
        }


        [HttpGet("GetByIdSucursal")]
        public ActionResult<IEnumerable<clients>> GetByIdSucursal(int id)
        {
            List<clients> Cliente = new List<clients>();
            Cliente = gestordb.getListClientsBySucursal(id);
            string json = JsonConvert.SerializeObject(Cliente);
            return Cliente;
        }

        [HttpPost("CreateClient")]
        public ActionResult<clients> CreateClient(clients newClient)
        {
            newClient.createDate = DateTime.Now;
            int result = gestordb.createClient(newClient);
            if (result > 0)
            {
                return newClient;
            }
            else
            {
                throw new Exception("Was not posible create the client");
            }
        }

        [HttpPost("UpdateClient")]
        public ActionResult<clients> UpdateClient(clients newClient)
        {
            newClient.modifyDate = DateTime.Now;
            int result = gestordb.updateClient(newClient);
            if (result >= 0)
            {
                return newClient;
            }
            else
            {
                throw new Exception("Was not posible update the client");
            }
        }

        [HttpGet("DeleteClient")]
        public ActionResult<int> DeleteClient(string idClient)
        {
            int result = gestordb.deleteClient(idClient);
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
