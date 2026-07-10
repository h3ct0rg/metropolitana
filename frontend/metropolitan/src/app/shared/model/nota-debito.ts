export interface NotaDebito {
  id?: number;
  codCliente: number;
  codOperador: number;
  codCounter: number;
  codTipoCambio: number;
  fechaGestion: string;
  pasajero: string;
  servicio: string;
  voucher: string;
  fechaVencimiento: string;
  totalArgentina: number;
  totalAgencia: number;
  totalCounter: number;
  totalMetropolitana: number;
  total: number;
  montoNeto: number;
  concepto: string;
  isEspecial: number;
  codigoUnico: number;
  estado: number;
  idSucursal?: number;
  createBy: number;
  modify: number;
  createDate: string;
  modifyDate: string;
  estadoEditado?: number;
}

export interface NotaDebitoList {
  id?: number;
  codCliente: string;
  pasajero: string;
  servicio: string;
  voucher: string;
  total: number;
  estado: number;
  codigoUnico: number;
}
