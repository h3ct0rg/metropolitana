export interface FlujoCajaResumen {
  cuenta: string;
  moneda: string;
  totalIngresos: number;
  cantidadOperaciones: number;
}

export interface FlujoCajaMovimiento {
  fechaPago: string;
  modulo: string;
  idOrdenPago: number;
  idNotaDebito: number;
  cuenta: string;
  formaPago: string;
  moneda: string;
  monto: number;
  concepto: string;
  tipoCambioValor?: number;
}
