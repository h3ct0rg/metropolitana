import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { StorageService } from './../../../shared/services/local-data/storage.service';
import { FormaPago } from '../../../shared/model/forma-pago';

@Injectable()
export class FormaPagoService extends BaseService<FormaPago> {
  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getFormaPagoList = (): Observable<any> => this.get('/FormaPago');

  getFormaPagoActivos = (): Observable<any> => this.get('/FormaPago/GetActivos');

  saveFormaPago(item: FormaPago) {
    return this.post('/FormaPago/CreateFormaPago', item);
  }

  updateFormaPago(item: FormaPago) {
    return this.post('/FormaPago/UpdateFormaPago', item);
  }

  getFormaPago(id: string) {
    return this.get('/FormaPago/GetById/?id=' + id) as Observable<FormaPago>;
  }
}
