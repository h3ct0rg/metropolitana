export interface OrdenPagoAdelanto {
  id?: number;
  idOrdenPago: number;
  idNotaDebito: number;
  monto: number;
  concepto?: string;
  fechaPago?: string;
  idSucursal: number;
  createBy?: number;
  createDate?: string;
}
