import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { StorageService } from './../../../shared/services/local-data/storage.service';
import { Operador } from '../../../shared/model/operador';

@Injectable()
export class OperadorService extends BaseService<Operador> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getOperadorList = (): Observable<any> => {
    let data = this.get('/Operador');
    return data;
  }

  saveOperadorItem(localOperador: Operador) {
    return this.post('/Operador/CreateOperador', localOperador)
  }

  deleteOperadorItem(idOperator: string) {
    return this.get('/Operador/DeleteOperador?idOperator=' + idOperator);
  }

  updateOperador(operador: Operador) {
    return this.post('/Operador/UpdateOperador', operador)
  }

  getOperador(idOperador: string) {
    return this.get('/Operador/GetById/?id=' + idOperador) as Observable<Operador>;
  }

  getOperadorBySucursal(idOperador: string) {
    return this.get('/Operador/GetBySucursal/?id=' + idOperador) as Observable<any[]>;
  }

  //-------------------------------------------------/ Paquetes /--------------------------------------------

  getOperadorListPaquetes = (): Observable<any> => {
    let data = this.get('/ProveedorPaquetes');
    return data;
  }

  saveOperadorItemPaquetes(localOperador: Operador) {
    return this.post('/ProveedorPaquetes/CreateOperador', localOperador)
  }

  updateOperadorPaquetes(operador: Operador) {
    return this.post('/ProveedorPaquetes/UpdateOperador', operador)
  }

  deleteOperadorPaquetesItem(idOperator: string) {
    return this.get('/ProveedorPaquetes/DeleteOperador?idOperator=' + idOperator);
  }

  getOperadorPaquetes(idOperador: string) {
    return this.get('/ProveedorPaquetes/GetById/?id=' + idOperador) as Observable<Operador>;
  }

  getOperadorBySucursalPaquetes(idOperador: string) {
    return this.get('/ProveedorPaquetes/GetBySucursal/?id=' + idOperador) as Observable<any[]>;
  }


  //-------------------------------------------------/ Carga /--------------------------------------------

  getOperadorListCarga = (): Observable<any> => {
    let data = this.get('/ProveedorCarga');
    return data;
  }

  saveOperadorItemCarga(localOperador: Operador) {
    return this.post('/ProveedorCarga/CreateOperador', localOperador)
  }

  updateOperadorCarga(operador: Operador) {
    return this.post('/ProveedorCarga/UpdateOperador', operador)
  }

  deleteOperadorCargaItem(idOperator: string) {
    return this.get('/ProveedorCarga/DeleteOperador?idOperator=' + idOperator);
  }

  getOperadorCarga(idOperador: string) {
    return this.get('/ProveedorCarga/GetById/?id=' + idOperador) as Observable<Operador>;
  }

  getOperadorBySucursalCarga(idOperador: string) {
    return this.get('/ProveedorCarga/GetBySucursal/?id=' + idOperador) as Observable<any[]>;
  }


}
