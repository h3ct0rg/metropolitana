using System;

namespace Common.model.dashboard
{
    public class ActivitySummaryDto
    {
        public int usuariosActivos7d { get; set; }
        public int eventosHoy { get; set; }
        public int notasHoy { get; set; }
        public string sucursalMasActiva { get; set; }
    }

    public class UserActivityDto
    {
        public string usuario { get; set; }
        public string modulo { get; set; }
        public int cantidad { get; set; }
    }

    public class DailyActivityDto
    {
        public DateTime dia { get; set; }
        public int eventos { get; set; }
    }

    public class BranchActivityDto
    {
        public string sucursal { get; set; }
        public int eventos { get; set; }
    }

    public class RecentEventDto
    {
        public DateTime fecha { get; set; }
        public string usuario { get; set; }
        public string evento { get; set; }
        public string modulo { get; set; }
        public string sucursal { get; set; }
    }

    public class EventTypeDistributionDto
    {
        public string modulo { get; set; }
        public int cantidad { get; set; }
    }
}
