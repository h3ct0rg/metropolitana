import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { StorageService } from './../../../shared/services/local-data/storage.service';
import { CuentaBancaria } from '../../../shared/model/cuenta-bancaria';

@Injectable()
export class CuentaBancariaService extends BaseService<CuentaBancaria> {
  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getCuentaBancariaList = (): Observable<any> => this.get('/CuentaBancaria');

  getCuentaBancariaActivas = (moneda?: string): Observable<any> =>
    this.get('/CuentaBancaria/GetActivas' + (moneda ? '?moneda=' + moneda : ''));

  saveCuentaBancaria(item: CuentaBancaria) {
    return this.post('/CuentaBancaria/CreateCuentaBancaria', item);
  }

  updateCuentaBancaria(item: CuentaBancaria) {
    return this.post('/CuentaBancaria/UpdateCuentaBancaria', item);
  }

  getCuentaBancaria(id: string) {
    return this.get('/CuentaBancaria/GetById/?id=' + id) as Observable<CuentaBancaria>;
  }
}
