import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { StorageService } from './../../../shared/services/local-data/storage.service';
import { TipoCambio } from '../../../shared/model/tipo-cambio';

@Injectable()
export class TipoCambioService extends BaseService<TipoCambio> {
  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getActual = (): Observable<TipoCambio> => this.getSingle('/TipoCambio/GetActual');

  getHistorial = (): Observable<any> => this.get('/TipoCambio/GetHistorial');

  crearTipoCambio(item: TipoCambio) {
    return this.post('/TipoCambio/CreateTipoCambio', item);
  }
}
