import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../../shared/services/base.service';
import { StorageService } from './../../../../shared/services/local-data/storage.service';
import { NotaDebito } from '../../../../shared/model/nota-debito';
import { NotaDebitoFilter } from '../../../../shared/model/filterNotaDevito';

@Injectable()
export class CargaNotaDebitoService extends BaseService<NotaDebito> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getNotaDebitoList = (): Observable<any> => {
    let data = this.get('/NotaDebitoCarga');
    return data;
  }

  getNotaDebitoByClient(data: NotaDebitoFilter) {
    return this.post('/NotaDebitoCarga/ReporteNotaDebitoFiltrado', data)
  }

  getNotaDebitoByCodigoUnico(codUnico, idSucursal) {
    return this.get(`/NotaDebitoCarga/getNotaDebitoListCod/?id=${codUnico}&idSucursal=${idSucursal}`) as Observable<NotaDebito[]>;
  }

  saveNotaDebitoItem(localNotaDebito: NotaDebito) {
    return this.post('/NotaDebitoCarga/CreateNotaDebito', localNotaDebito)
  }

  updateNotaDebito(notaDebito: NotaDebito) {
    return this.post('/NotaDebitoCarga/UpdateNotaDebito', notaDebito)
  }

  deleteNotaDebito(idNota: number, idUser: string) {
    return this.get('/NotaDebitoCarga/DeleteNotaDebito?idNota=' + idNota + '&idUser=' + idUser) as Observable<any>;
  }

  getNotaDebito(idNotaDebito: string) {
    return this.get('/NotaDebitoCarga/GetById/?id=' + idNotaDebito) as Observable<NotaDebito>;
  }

  getNotaDebitoBySucursal(idSucursal: string) {    
    return this.get('/NotaDebitoCarga/GetBySucursal/?id=' + idSucursal) as Observable<NotaDebito[]>;
  }

  getNotaDebitoBySucursalAndId(idSucursal: string, id: string) {
    return this.get('/NotaDebitoCarga/GetBySucursalAndId/?sucursal=' + idSucursal + '&id=' + id) as Observable<NotaDebito[]>;
  }

  getNotaDebitoBySucursalandDate(idSucursal: string, fecha: string) {
    return this.get('/NotaDebitoCarga/GetBySucursalDate/?id=' + idSucursal + '&fecha=' + fecha) as Observable<NotaDebito[]>;
  }
}
