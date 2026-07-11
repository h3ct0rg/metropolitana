import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { StorageService } from './../../../shared/services/local-data/storage.service';
import { Cliente } from '../../../shared/model/cliente';

@Injectable()
export class ClientService extends BaseService<Cliente> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getClientList = (): Observable<any> => {
    let data = this.get('/cliente');
    return data;
  }

  getClientListCod = (codUnico): Observable<any> => {
    let data = this.get('/cliente/?id=' + codUnico);
    return data;
  }

  savetClientItem(localClient: Cliente) {
    return this.post('/cliente/CreateClient', localClient)
  }

  deleteClientItem(idClient: string) {
    return this.get('/cliente/DeleteClient?idClient=' + idClient)
  }

  updateCliente(cliente: Cliente) {
    return this.post('/cliente/UpdateClient', cliente)
  }

  getClient(idClient: string) {
    return this.get('/cliente/GetById/?id='+ idClient) as Observable<Cliente>;
  }

  getClientBySucursal(idSucursal: string) {
    return this.get('/cliente/GetByIdSucursal/?id=' + idSucursal) as Observable<Cliente[]>;
  }

  //--------------------------- Gestor Servicio Paquetes -------------------------------------

  getClientPaqueteList = (): Observable<any> => {
    const data = this.get('/ClientePaquetes');
    return data;
  }

  getClientPaqueteListCod = (codUnico): Observable<any> => {
    const data = this.get('/ClientePaquetes/?id=' + codUnico);
    return data;
  }

  deleteClientPaquetesItem(idClient: string) {
    return this.get('/clientePaquetes/DeleteClient?idClient=' + idClient)
  }

  saveClientPaqueteItem(localClient: Cliente) {
    return this.post('/ClientePaquetes/CreateClient', localClient)
  }

  updatePaqueteCliente(cliente: Cliente) {
    return this.post('/ClientePaquetes/UpdateClient', cliente)
  }


  getClientPaquetes(idClient: string) {
    return this.get('/ClientePaquetes/GetById/?id=' + idClient) as Observable<Cliente>;
  }

  getClientPaquetesBySucursal(idSucursal: string) {
    return this.get('/ClientePaquetes/GetByIdSucursal/?id=' + idSucursal) as Observable<Cliente[]>;
  }

  //--------------------------- Gestor Servicio Carga -------------------------------------

  getClientCargaList = (): Observable<any> => {
    const data = this.get('/ClienteCarga');
    return data;
  }

  getClientCargaListCod = (codUnico): Observable<any> => {
    const data = this.get('/ClienteCarga/?id=' + codUnico);
    return data;
  }

  deleteClientCargaItem(idClient: string) {
    return this.get('/clienteCarga/DeleteClient?idClient=' + idClient)
  }

  saveClientCargaItem(localClient: Cliente) {
    return this.post('/ClienteCarga/CreateClient', localClient)
  }

  updateCargaCliente(cliente: Cliente) {
    return this.post('/ClienteCarga/UpdateClient', cliente)
  }


  getClientCarga(idClient: string) {
    return this.get('/ClienteCarga/GetById/?id=' + idClient) as Observable<Cliente>;
  }

  getClientCargaBySucursal(idSucursal: string) {
    return this.get('/ClienteCarga/GetByIdSucursal/?id=' + idSucursal) as Observable<Cliente[]>;
  }
}
