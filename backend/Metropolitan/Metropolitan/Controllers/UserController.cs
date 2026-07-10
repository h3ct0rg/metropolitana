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
    public class UserController : ControllerBase
    {
        userManagement gestordb = new userManagement();

        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<User>> Get()
        {
            List<User> provee = new List<User>();
            provee = gestordb.getUserList();
            string json = JsonConvert.SerializeObject(provee);
            return provee;
        }

        // GET api/values
        [HttpGet("GetById")]
        public ActionResult<User> GetById(int id)
        {
            User provee = new User();
            provee = gestordb.getUser(id);
            string json = JsonConvert.SerializeObject(provee);
            return provee;
        }

        [HttpPost("CreateUser")]
        public ActionResult<User> CreateUser(User newClient)
        {
            newClient.modifieDate = DateTime.Now;
            int result = gestordb.createUser(newClient);
            if (result > 0)
            {
                return newClient;
            }
            else
            {
                throw new Exception("Was not posible create the client");
            }
        }

        [HttpPost("UpdateUser")]
        public ActionResult<User> UpdateUser(User newClient)
        {
            newClient.modifieDate = DateTime.Now;
            int result = gestordb.updateUser(newClient);
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
