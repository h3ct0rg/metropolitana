export interface Counter {
  id?: number;
  name?: string;
  nombreCod?: string;
  telefono: string;
  direccion: string;
  porcentajeNormal: number;
  porcentajeLow: number;
  porcentajeCorp: number;
  porcentajeEspecial: number;
  idAgencia?: string;
  idsProveedores?: string;
  idSucursal: number;
  createBy?: number;
  modify?: number;
  createDate?: string;
  modifyDate?: string;
}
