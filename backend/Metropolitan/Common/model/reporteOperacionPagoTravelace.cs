using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.model
{
    public class ReporteOperacionPagoTravelace
    {
        public int idNota;
        public int idOrden;
        public int codCliente;
        public string pasajero;
        public string servicios;
        public int codCounter;
        public double montoNeto;
        public double totalArgentina;
        public double totalCounter;
        public double totalAgencia;
        public DateTime fechaPago;
        public int formaPago;
        public double? tipoCambioValor; // tasa propia de la ND; null = legacy, el reporte la trata como USD.
    }

    //    from travelaceNotaDebito as ND, travelOrdenPago as OP where ND.codigoUnicoNota = OP.idNotaDebito
    //and '2020-07-11' > OP.fechaPago and OP.fechaPago > '2020-07-07'
    //  and OP.pagado='1'

    public class ReporteOperacionPagoTravelaceDetalle
    {
        public int codUnicoNota;
        public int numeroPago;
        public int codOperador;
        public string nombreOperador;
        public int codCounter;
        public string pasajero;
        public string servicios;
        public double montoNeto;
        public double totalArgentina;
        public double totalCounter;
        public double totalAgencia;
        public double totalMetro;
        public DateTime fechaPago;
        public int formaPago;
        public string nombreAgencia;
        public double? tipoCambioValor;
    }

    public class ReporteOperacionPagoTravelaceDetalleFiltrado
    {
        public string nombreOperador { get; set; }
        public int idNota { get; set; }
        public DateTime fechaPago { get; set; }
        public string voucher { get; set; }
        public int numeroPago { get; set; }
        public double precio { get; set; }
        public double totalArgentina { get; set; }
        public double pagoMetro { get; set; }
        public double totalCounter { get; set; }
        public double totalMetro { get; set; }
        public double totalAgencia { get; set; }
    }

}
