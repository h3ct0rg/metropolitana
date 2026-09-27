using System;

namespace Common.model.dashboard
{
    public class NdPorFechaDto
    {
        public DateTime fecha { get; set; }
        public int cantidad { get; set; }
    }

    public class NdPorSucursalDto
    {
        public string sucursal { get; set; }
        public int cantidad { get; set; }
    }

    // ND de Paquetes sin ningún pago realizado (ni total ni adelanto), para la
    // alerta de "por cobrar" en el dashboard, ordenada por proximidad a la
    // fecha de salida.
    public class NdAlertaCobroDto
    {
        public int codigoUnico { get; set; }
        public string voucher { get; set; }
        public string pasajero { get; set; }
        public string nombreAgencia { get; set; }
        public DateTime fechaSalida { get; set; }
        public double saldoPendiente { get; set; }
        public int? monedaNota { get; set; }
        public double? tipoCambioValor { get; set; }
        public int diasRestantes { get; set; }
    }
}
