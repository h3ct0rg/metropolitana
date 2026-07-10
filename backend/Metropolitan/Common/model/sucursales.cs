using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataBase.model
{
    public class sucursales
    {
        public int id;
        public string nombre;
        public string direccion;
        public string telefono;
        public string email;
        public int idEncargado;
        public int createBy;
        public DateTime createDate;
        public int modify;
        public DateTime modifyDate;
    }
}
