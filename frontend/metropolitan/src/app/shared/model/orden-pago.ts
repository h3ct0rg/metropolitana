export interface OrdenPago {  
  id?: number;
  fechaPago: string;
  montoAPagar: number;
  monedaPago: number;
  saldoDeudor: number;
  numeroPago: number;
  formaPago: number;
  formaPagoDescripcion: string;
  numeroTarjeta: string;
  concepto: string;
  anulado: number;
  numeroNotaDebito: number;
  pagado: boolean;
  codProfile: string;
  idSucursal: string;
  createBy?: number;
  modify?: number;
  createDate?: string;
  modifyDate?: string;
}
