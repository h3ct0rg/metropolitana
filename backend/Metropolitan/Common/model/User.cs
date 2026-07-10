using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataBase.model
{
    public class User
    {
        public int id;
        public string nombre;
        public string ci;
        public string email;
        public string usuarioCompany;
        public string password;
        public List<int> idRole = new List<int>();
        public int idSucursal;
        public int createdBy;
        public DateTime createdDate;
        public int modifyBy;
        public DateTime modifieDate;
    }
}
