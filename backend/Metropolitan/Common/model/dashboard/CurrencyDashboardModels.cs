using System;

namespace Common.model.dashboard
{
    public class CurrencySummaryDto
    {
        public double tipoCambioActual { get; set; }
        public DateTime fechaTipoCambioActual { get; set; }
        public double variacionPorcentual { get; set; }
        public int totalNd { get; set; }
        public double pctNdBolivianos { get; set; }
        public double pctNdDolares { get; set; }
        public string formaPagoMasUsada { get; set; }
        public int cantidadFormaPagoMasUsada { get; set; }
    }

    public class ExchangeRateHistoryDto
    {
        public DateTime fecha { get; set; }
        public double valor { get; set; }
    }

    public class NdByCurrencyDto
    {
        public string moneda { get; set; }
        public int cantidad { get; set; }
        public double montoTotalUsd { get; set; }
    }

    public class NdByCurrencyPeriodDto
    {
        public DateTime periodo { get; set; }
        public string moneda { get; set; }
        public int cantidad { get; set; }
    }

    public class NdByCurrencyModuloDto
    {
        public string modulo { get; set; }
        public string moneda { get; set; }
        public int cantidad { get; set; }
    }

    public class NdByCurrencyBranchDto
    {
        public string sucursal { get; set; }
        public string moneda { get; set; }
        public int cantidad { get; set; }
    }

    public class PaymentMethodUsageDto
    {
        public string formaPago { get; set; }
        public int cantidad { get; set; }
        public double montoTotalUsd { get; set; }
    }
}
