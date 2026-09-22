using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.model
{
    public class notaDebitoTravelace
    {
        public int id;
        public int codCliente;
        public int codOperador;
        public int codCounter;
        public int codTipoCambio;
        public DateTime fechaGestion;
        public string pasajero;
        public string servicio;
        public string voucher;
        public DateTime fechaVencimiento;
        public double totalArgentina;
        public double totalAgencia;
        public double totalCounter;
        public double totalMetropolitana;
        public double total;
        public double montoNeto;
        public string concepto;
        public int isEspecial;
        public int codigoUnico;
        public int estado;
        public int idSucursal;
        public int createBy;
        public int modify;
        public DateTime createDate;
        public DateTime modifyDate;
        public int estadoEditado;
        public int? monedaNota; // 1 = USD, 2 = BS. null = legacy, mostrar como USD.
        public double? tipoCambioValor; // tasa USD->Bs usada al crear/editar esta ND.
        public DateTime? fechaSalida; // solo Paquetes -- fecha de viaje. null en travelace/carga.
    }

    // Fila de resultado del reporte de Paquetes "ND por Fecha de Salida".
    public class notaDebitoFechaSalidaDto
    {
        public int id;
        public int codigoUnico;
        public string voucher;
        public string pasajero;
        public string nombreAgencia;
        public string nombreOperador;
        public DateTime fechaSalida;
        public DateTime fechaGestion;
        public double montoNeto;
        public double total;
        public int estado;
        public int idSucursal;
    }

    public class notaDebitoListTable
    {
        public int id;
        public string codCliente;
        public string pasajero;
        public string servicio;
        public string voucher;
        public double total;
        public int estado;
        public int codigoUnico;
        public int? monedaNota;
        public double? tipoCambioValor;
        public DateTime? fechaSalida;
    }
}
