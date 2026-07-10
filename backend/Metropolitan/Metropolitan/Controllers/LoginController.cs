using DataBase;
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
    public class LoginController : ControllerBase
    {
        gestorDB gestordb = new gestorDB();

        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            Login dasd = new Login();
            dasd.User = "asd";
            dasd.Password = "asd";
            string json = JsonConvert.SerializeObject(dasd);
            return new string[] { json };
        }

        [Route("/api/login")]
        [HttpPost]
        public ActionResult<IEnumerable<string>> Login(Login userCredentials)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            User loged = gestordb.verifyLogin(userCredentials);
            if (loged.id == 0)
            {
                return BadRequest("User or password incorrect");
            }

            string accessTokenResource = generateTokenJson(loged);
            return Ok(accessTokenResource);
        }

        private string generateTokenJson(User userCredentials)
        {
            User userLoged = userCredentials;
            //userLoged = gestordb.getUserData(userCredentials);
            LToken token = new LToken();
            token.userName = userLoged.nombre;
            string roles = "";
            foreach (int item in userLoged.idRole)
            {
                roles += item.ToString()+",";
            }
            roles += "-1";
            token.userType = roles;
            token.userId = userLoged.id.ToString();
            token.minutesValid = 60;
            token.sucursal = userLoged.idSucursal;
            string json = JsonConvert.SerializeObject(token);
            return json;
        }
    }
}
