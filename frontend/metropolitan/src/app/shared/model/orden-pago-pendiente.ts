export interface OrdenPagoPendiente {
  idCliente?: number;
  idNota?: number;
  idOrden?: number;
  nombreCliente: string;
  ordenMontoPagar: number;
  saldoDeudor: number;
  monedaNota?: number; // 1 = USD, 2 = BS; null = legacy, tratar como USD.
  tipoCambioValor?: number;
}
