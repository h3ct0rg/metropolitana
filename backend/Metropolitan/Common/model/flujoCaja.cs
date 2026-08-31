using System;

namespace Common.model
{
    public class FlujoCajaResumen
    {
        public string cuenta;
        public string moneda;
        public double totalIngresos;
        public int cantidadOperaciones;
    }

    public class FlujoCajaMovimiento
    {
        public DateTime fechaPago;
        public string modulo; // TRAVELACE | PAQUETES | CARGA
        public int idOrdenPago;
        public int idNotaDebito;
        public string cuenta;
        public string formaPago;
        public string moneda;
        public double monto;
        public string concepto;
    }
}
