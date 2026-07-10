using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.model
{
    public class LogsModel
    {
        public Guid id { get; set; }
        public string eventShoot { get; set; }
        public string fromEvent { get; set; }
        public string userEvent { get; set; }
        public string itemUsed { get; set; }
        public string idSucursal { get; set; }
        public DateTime createDate { get; set; }
    }
}
