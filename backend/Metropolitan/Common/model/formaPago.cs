using System;

namespace Common.model
{
    public class formaPago
    {
        public int id;
        public string nombre;
        public string moneda; // 'USD' | 'BS' | 'AMBOS'
        public string areasAplicables; // e.g. 'TRAVELACE,PAQUETES,CARGA'
        public bool requiereCuentaBancaria;
        public bool activo;
        public int orden;
        public int createBy;
        public DateTime createDate;
        public int modify;
        public DateTime modifyDate;
    }
}
