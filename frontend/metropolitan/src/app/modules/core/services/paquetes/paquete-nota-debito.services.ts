import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../../shared/services/base.service';
import { StorageService } from './../../../../shared/services/local-data/storage.service';
import { NotaDebito } from '../../../../shared/model/nota-debito';
import { NotaDebitoFilter } from '../../../../shared/model/filterNotaDevito';

@Injectable()
export class PaquetesNotaDebitoService extends BaseService<NotaDebito> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getNotaDebitoList = (): Observable<any> => {
    let data = this.get('/NotaDebitoPaquetes');
    return data;
  }

  getNotaDebitoByClient(data: NotaDebitoFilter) {
    return this.post('/NotaDebitoPaquetes/ReporteNotaDebitoFiltrado', data)
  }

  getNotaDebitoByCodigoUnico(codUnico, idSucursal) {
    return this.get(`/NotaDebitoPaquetes/getNotaDebitoListCod/?id=${codUnico}&idSucursal=${idSucursal}`) as Observable<NotaDebito[]>;
  }

  saveNotaDebitoItem(localNotaDebito: NotaDebito) {
    return this.post('/NotaDebitoPaquetes/CreateNotaDebito', localNotaDebito)
  }

  updateNotaDebito(notaDebito: NotaDebito) {
    return this.post('/NotaDebitoPaquetes/UpdateNotaDebito', notaDebito)
  }

  deleteNotaDebito(idNota: number, idUser: string) {
    return this.get('/NotaDebitoPaquetes/DeleteNotaDebito?idNota=' + idNota + '&idUser=' + idUser) as Observable<any>;
  }

  getNotaDebito(idNotaDebito: string) {
    return this.get('/NotaDebitoPaquetes/GetById/?id=' + idNotaDebito) as Observable<NotaDebito>;
  }

  getNotaDebitoBySucursal(idSucursal: string, pageIndex: number = 1, pageSize: number = 20, searchText: string = '') {
    return this.get('/NotaDebitoPaquetes/GetBySucursal/?id=' + idSucursal
      + '&pageIndex=' + pageIndex
      + '&pageSize=' + pageSize
      + '&searchText=' + encodeURIComponent(searchText || '')) as Observable<any>;
  }

  getNotaDebitoBySucursalAndId(idSucursal: string, id: string) {
    return this.get('/NotaDebitoPaquetes/GetBySucursalAndId/?sucursal=' + idSucursal + '&id=' + id) as Observable<NotaDebito[]>;
  }

  getNotaDebitoBySucursalandDate(idSucursal: string, fecha: string) {
    return this.get('/NotaDebitoPaquetes/GetBySucursalDate/?id=' + idSucursal + '&fecha=' + fecha) as Observable<NotaDebito[]>;
  }
}
