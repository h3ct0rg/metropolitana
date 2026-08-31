using System;

namespace Common.model
{
    public class cuentaBancaria
    {
        public int id;
        public string nombre;
        public string moneda; // 'USD' | 'BS'
        public bool activo;
        public int createBy;
        public DateTime createDate;
        public int modify;
        public DateTime modifyDate;
    }
}
