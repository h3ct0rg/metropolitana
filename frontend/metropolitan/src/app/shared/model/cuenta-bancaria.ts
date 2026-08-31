export interface CuentaBancaria {
  id?: number;
  nombre: string;
  moneda: string; // 'USD' | 'BS'
  activo: boolean;
  createBy?: number;
  modify?: number;
  createDate?: string;
  modifyDate?: string;
}
