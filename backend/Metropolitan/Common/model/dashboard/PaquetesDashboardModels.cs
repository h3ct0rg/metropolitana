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
}
