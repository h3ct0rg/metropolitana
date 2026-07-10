import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../../shared/services/base.service';
import { StorageService } from './../../../../shared/services/local-data/storage.service';
import { OrdenPagoReport } from '../../../../shared/model/orden-pago-reporte';

@Injectable()
export class PaqueteListaOrdenPagoReportService extends BaseService<OrdenPagoReport> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getOrdenPagoListReport = (itemFilter, sucursal,itemCodOden?): Observable<any> => {
    let data = this.post('/PaquetesOrdenPago/GetListOrdenPagoReport', { filter: itemFilter, codOrden: itemCodOden, idSucursal: sucursal });
    return data;
  }
}
