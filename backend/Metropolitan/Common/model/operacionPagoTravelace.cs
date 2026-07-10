using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.model
{
    public class operacionPagoTravelace
    {
        public int id;
        public DateTime fechaPago; 
        public double montoAPagar;
        public int monedaPago;
        public double saldoDeudor;
        public int numeroPago;
        public int formaPago;
        public string numeroTarjeta;
        public string concepto;
        public int anulado;
        public int numeroNotaDebito;
        public bool pagado;
        public string codProfile;
        public int idSucursal;
        public int createBy;
        public int modify;
        public DateTime createDate;
        public DateTime modifyDate;

        public operacionPagoTravelace()
        {
            numeroPago = -1;
        }
    }

    public class operacionPagoTravelaceReport
    {
        public int id;
        public string fechaPago;
        public double montoAPagar;
        public int monedaPago;
        public double saldoDeudor;
        public int numeroPago;
        public int formaPago;
        public string numeroTarjeta;
        public string concepto;
        public int anulado;
        public int numeroNotaDebito;
        public bool pagado;
        public string codProfile;
        public int idSucursal;
        public int createBy;
        public int modify;
        public DateTime createDate;
        public DateTime modifyDate;

        public operacionPagoTravelaceReport()
        {
            numeroPago = -1;
        }
    }

}
