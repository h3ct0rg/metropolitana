export interface Cliente {
  id?: number;
  name?: string;
  telefono: string;
  fax: string;
  contacto: string;
  ruc: string;
  direccion: string;
  casilla?: string;
  cargo: string;
  idSucursal: number;
  idCiudad: number;
  createBy?: number;
  modify?: number;
  createDate?: string;
  modifyDate?: string;
}
