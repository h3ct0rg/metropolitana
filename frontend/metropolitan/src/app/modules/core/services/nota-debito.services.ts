import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { StorageService } from './../../../shared/services/local-data/storage.service';
import { NotaDebito } from '../../../shared/model/nota-debito';
import { NotaDebitoCalculate } from '../../../shared/model/nota-debito-calculate';
import { NotaDebitoFilter } from '../../../shared/model/filterNotaDevito';

@Injectable()
export class NotaDebitoService extends BaseService<NotaDebito> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getNotaDebitoList = (): Observable<any> => {
    let data = this.get('/NotaDebitoTravel');
    return data;
  }

  getNotaDebitoByClient(data: NotaDebitoFilter) {
    return this.post('/NotaDebitoTravel/ReporteNotaDebitoFiltrado', data)
  }

  getNotaDebitoByCodigoUnico(codUnico, idSucursal) {
    return this.get(`/NotaDebitoTravel/getNotaDebitoListCod/?id=${codUnico}&idSucursal=${idSucursal}`) as Observable<NotaDebito[]>;
  }

  saveNotaDebitoItem(localNotaDebito: NotaDebito) {
    return this.post('/NotaDebitoTravel/CreateNotaDebito', localNotaDebito)
  }

  updateNotaDebito(notaDebito: NotaDebito) {
    return this.post('/NotaDebitoTravel/UpdateNotaDebito', notaDebito)
  }

  deleteNotaDebito(id: number, idUser: string) {
    return this.get('/NotaDebitoTravel/DeleteNotaDebito?idNota=' + id + '&idUser=' + idUser) as Observable<any>;
  }
    
  getNotaDebito(idNotaDebito: string) {
    return this.get('/NotaDebitoTravel/GetById/?id=' + idNotaDebito) as Observable<NotaDebito>;
  }

  getNotaDebitoIdNegativo() {
    return this.get('/NotaDebitoTravel/getNotaDebitoLastNegative/') as Observable<any>;
  }

  getNotaDebitoBySucursal(idSucursal: string, pageIndex: number = 1, pageSize: number = 20, searchText: string = '') {
    return this.get('/NotaDebitoTravel/GetBySucursal/?id=' + idSucursal
      + '&pageIndex=' + pageIndex
      + '&pageSize=' + pageSize
      + '&searchText=' + encodeURIComponent(searchText || '')) as Observable<any>;
  }

  getNotaDebitoBySucursalComplete(idSucursal: string) {
    return this.get('/NotaDebitoTravel/GetBySucursalComplete/?id=' + idSucursal) as Observable<NotaDebito[]>;
  }

  getNotaDebitoBySucursalAndId(idSucursal: string, id: string) {
    return this.get('/NotaDebitoTravel/GetBySucursalAndId/?sucursal=' + idSucursal + '&id=' + id) as Observable<NotaDebito[]>;
  }

  getNotaDebitoBySucursalandDate(idSucursal: string, fecha: string) {
    return this.get('/NotaDebitoTravel/GetBySucursalDate/?id=' + idSucursal + '&fecha=' + fecha) as Observable<NotaDebito[]>;
  }

  getNotaDebitoEstadoByIdandSucursal(id: number, Sucursal: number) {
    return this.get('/NotaDebitoTravel/getNotaDebitoEstado/?id=' + id + '&idSucursal=' + Sucursal) as Observable<any>;
  }
}
