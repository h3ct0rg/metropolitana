using Common.model;
using DataBase.management.Logs;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Metropolitan.Controllers.logs
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogsController : ControllerBase
    {
        LogsManagement logsManagement = new LogsManagement();

        [HttpPost("CreateLog")]
        public ActionResult<bool> CreateLog(LogsModel log)
        {
            try
            {
                logsManagement.saveLogEvent(log);
                return Ok();
            }
            catch(Exception ex)
            {
                return BadRequest();
            }
            
        }
    }
}
