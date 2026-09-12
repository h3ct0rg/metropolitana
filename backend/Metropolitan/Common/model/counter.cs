using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataBase.model
{
    public class Counter
    {
        public int id;
        public string name;
        public string nombreCod;
        public string direccion;
        public string telefono;
        public double porcentajeNormal;
        public double porcentajeLow;
        public double porcentajeCorp;
        public double porcentajeEspecial;
        public int idAgencia;
        public string idsProveedores;
        public int idSucursal;
        public int createBy;
        public int modify;
        public DateTime createDate;
        public DateTime modifyDate;
    }

    public class reportByCounter
    {
        public int id;
        public string agencia;
        public string nombre;
        public double total;
        public double totalSales;
    }

    public class reportByCounterDetalle
    {
        public int idNota;
        public string agencia;
        public string nombreCounter;
        public double totalCounter;
        public double totalSales;
        public double? tipoCambioValor;
    }
}
