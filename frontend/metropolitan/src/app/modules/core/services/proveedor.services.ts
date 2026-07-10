import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { StorageService } from './../../../shared/services/local-data/storage.service';
import { Proveedor } from '../../../shared/model/proveedor';

@Injectable()
export class ProveedorService extends BaseService<Proveedor> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getProveedorList = (): Observable<any> => {
    let data = this.get('/Proveedor');
    return data;
  }

  savetProveedorItem(localClient: Proveedor) {
    return this.post('/Proveedor/CreateProveedor', localClient)
  }

  updateProveedor(proveedor: Proveedor) {
    return this.post('/Proveedor/UpdateProveedor', proveedor)
  }

  getProveedor(idProveedor: string) {
    return this.get('/Proveedor/GetById/?id=' + idProveedor) as Observable<Proveedor>;
  }
}
