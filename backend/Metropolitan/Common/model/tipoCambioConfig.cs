using System;

namespace Common.model
{
    // Historial de tipo de cambio del día (USD -> Bs). Tabla de solo-INSERT:
    // "el valor actual" siempre es la fila más reciente (mayor id).
    public class tipoCambioConfig
    {
        public int id;
        public double valor;
        public int createBy;
        public DateTime createDate;
    }
}
