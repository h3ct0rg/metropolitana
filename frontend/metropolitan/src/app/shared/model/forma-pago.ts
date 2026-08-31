export interface FormaPago {
  id?: number;
  nombre: string;
  moneda: string; // 'USD' | 'BS' | 'AMBOS'
  areasAplicables?: string; // e.g. 'TRAVELACE,PAQUETES,CARGA'
  requiereCuentaBancaria: boolean;
  activo: boolean;
  orden?: number;
  createBy?: number;
  modify?: number;
  createDate?: string;
  modifyDate?: string;
}
