using System;

namespace Common.model.dashboard
{
    public class FinancialSummaryDto
    {
        public double ingresosActivos { get; set; }
        public double totalAnulado { get; set; }
        public int notasActivas { get; set; }
        public int notasAnuladas { get; set; }
        public double totalArgentina { get; set; }
        public double totalAgencia { get; set; }
        public double totalCounter { get; set; }
        public double totalMetropolitana { get; set; }
        public double saldoDeudorTotal { get; set; }
        public double ticketPromedio { get; set; }
        public double variacionPorcentualMesAnterior { get; set; }
    }

    public class MonthlyRevenueDto
    {
        public DateTime mes { get; set; }
        public double facturado { get; set; }
        public double cobrado { get; set; }
        public bool esProyeccion { get; set; }
    }

    public class BranchRevenueDto
    {
        public string sucursal { get; set; }
        public double ingresos { get; set; }
    }

    public class TopClientDto
    {
        public string clienteNombre { get; set; }
        public double total { get; set; }
    }

    public class ModuleDistributionDto
    {
        public string modulo { get; set; }
        public double total { get; set; }
        public int cantidad { get; set; }
    }

    public class ReceivablesSummaryDto
    {
        public double totalPagado { get; set; }
        public double totalPendiente { get; set; }
        public int cantidadPagado { get; set; }
        public int cantidadPendiente { get; set; }
    }
}
