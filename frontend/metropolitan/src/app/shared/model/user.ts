export interface User {
  id: number;
  nombre: string;
  ci: string;
  email: string;
  usuarioCompany: string;
  password: string;
  idRole: number[];
  idSucursal: number;
  createdBy: number;
  createdDate: string;
  modifyBy: number;
  modifieDate: string;
}
