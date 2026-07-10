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
    public class SucursalesController : ControllerBase
    {
        sucursalesManagement gestordb = new sucursalesManagement();

        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<sucursales>> Get()
        {
            List<sucursales> listaSucursales = new List<sucursales>();
            listaSucursales = gestordb.getListSucursales();
            return listaSucursales;
        }

        // GET api/values
        [HttpGet("GetById")]
        public ActionResult<sucursales> GetById(int id)
        {
            sucursales sucursal = new sucursales();
            sucursal = gestordb.getSucursal(id);
            return sucursal;
        }

        [HttpPost("CreateSucursal")]
        public ActionResult<sucursales> CreateSucursal(sucursales newSucursal)
        {
            newSucursal.createDate = DateTime.Now;
            int result = gestordb.createSucursal(newSucursal);
            if (result > 0)
            {
                return newSucursal;
            }
            else
            {
                throw new Exception("Was not posible create the client");
            }
        }

        [HttpPost("UpdateSucursal")]
        public ActionResult<sucursales> UpdateSucursal(sucursales newSucursal)
        {
            newSucursal.modifyDate = DateTime.Now;
            int result = gestordb.updateSucursal(newSucursal);
            if (result >= 0)
            {
                return newSucursal;
            }
            else
            {
                throw new Exception("Was not posible update the client");
            }
        }
    }
}
