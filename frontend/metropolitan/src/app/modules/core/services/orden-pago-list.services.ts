import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { StorageService } from './../../../shared/services/local-data/storage.service';
import { OrdenPagoPendiente } from '../../../shared/model/orden-pago-pendiente';

@Injectable()
export class ListaOrdenPagoPendienteService extends BaseService<OrdenPagoPendiente> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getOrdenPagoListPendiente = (): Observable<any> => {
    let data = this.get('/OrdenPago/GetOrdenesPendientes');
    return data;
  }

  getOrdenPagoListPendienteGroup = (): Observable<any> => {
    let data = this.get('/OrdenPago/GetOrdenesPendientesGrouped');
    return data;
  }

  getOrdenPagoListPendienteGroupBySucursal = (idSucursal): Observable<any> => {
    let data = this.get('/OrdenPago/GetOrdenesPendientesGroupedBySucursal?sucursal='+idSucursal);
    return data;
  }

  getOrdenPagoListPendienteByClient = (idClient: string, idSucursal: string): Observable<any> => {
    let data = this.get(`/OrdenPago/GetOrdenesPendientesByClient/?idClient=${idClient}&idSucursal=${idSucursal}`);
    return data;
  }
}
