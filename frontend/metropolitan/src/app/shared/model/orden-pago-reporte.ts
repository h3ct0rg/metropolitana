export interface OrdenPagoReport {
  idCliente?: number;
  id?: number;

  fechaPago: string;
  montoAPagar: number;
  monedaPago: number;
  saldoDeudor: number;
  numeroPago: number;
  formaPago: number;
  numeroTarjeta: string;
  concepto: string;
  anulado: boolean;
  numeroNotaDebito: number;
  pagado: boolean;

  createBy?: number;
  modify?: number;
  createDate?: string;
  modifyDate?: string;
}
