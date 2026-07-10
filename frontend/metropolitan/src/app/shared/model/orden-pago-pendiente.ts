export interface OrdenPagoPendiente {
  idCliente?: number;
  idNota?: number;
  idOrden?: number;
  nombreCliente: string;
  ordenMontoPagar: number;
  saldoDeudor: number;
}
