import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { StorageService } from './../../../shared/services/local-data/storage.service';
import { Counter } from '../../../shared/model/counter';
import { Sucursal } from '../../../shared/model/sucursales';

@Injectable()
export class SucursalService extends BaseService<Sucursal> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getSucursalList = (): Observable<any> => {
    let data = this.get('/Sucursales');
    return data;
  }

  saveSucursalItem(localCounter: Sucursal) {
    return this.post('/Sucursales/CreateSucursal', localCounter)
  }

  updateSucursal(counter: Sucursal) {
    return this.post('/Sucursales/UpdateSucursal', counter)
  }

  getSucursal(idCounter: string) {
    return this.get('/Sucursales/GetById/?id=' + idCounter) as Observable<Sucursal>;
  }
}
