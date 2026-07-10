export interface Operador {
  id?: number;
  name?: string;
  direccion: string;
  telefono: string;
  tipoOperador: number;
  porcentajeArgentina: number;
  porcentajeAgencia: number;
  counterId: number;
  porcentajeMetropolitana: number;
  idSucursal: number;
  createBy?: number;
  modify?: number;
  createDate?: string;
  modifyDate?: string;
}
