export interface Sucursal {
  id?: number;
  nombre?: string;
  direccion?: string;
  telefonos: string;
  email: string;
  idEncargado: number;
  createBy?: number;
  modify?: number;
  createDate?: string;
  modifyDate?: string;
}
