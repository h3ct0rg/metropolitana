using System;

namespace Common.model
{
    // Pago parcial (adelanto) contra una Orden de Pago pendiente. Resta de
    // saldoDeudor pero nunca marca la OP como pagada -- eso solo ocurre por
    // el flujo normal de "Pagar" cuando se liquida el 100% restante.
    public class OrdenPagoAdelanto
    {
        public int id;
        public int idOrdenPago;
        public int idNotaDebito;
        public double monto;
        public string concepto;
        public DateTime fechaPago;
        public int idSucursal;
        public int createBy;
        public DateTime createDate;
    }
}
