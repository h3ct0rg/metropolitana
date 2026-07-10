import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../../shared/services/base.service';
import { StorageService } from './../../../../shared/services/local-data/storage.service';
import { OrdenPagoPendiente } from '../../../../shared/model/orden-pago-pendiente';

@Injectable()
export class PaqueteListaOrdenPagoPendienteService extends BaseService<OrdenPagoPendiente> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getOrdenPagoListPendiente = (): Observable<any> => {
    let data = this.get('/PaquetesOrdenPago/GetOrdenesPendientes');
    return data;
  }

  getOrdenPagoListPendienteGroupBySucursal = (idSucursal): Observable<any> => {
    let data = this.get('/PaquetesOrdenPago/GetOrdenesPendientesBySucursal?sucursal=' + idSucursal);
    return data;
  }

  getOrdenPagoListPendienteByClient = (idClient: string, idSucursal: string): Observable<any> => {
    let data = this.get(`/PaquetesOrdenPago/GetOrdenesPendientesByClient/?idClient=${idClient}&idSucursal=${idSucursal}`);
    return data;
  }
}
