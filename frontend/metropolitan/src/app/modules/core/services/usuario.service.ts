import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { StorageService } from './../../../shared/services/local-data/storage.service';
import { User } from '../../../shared/model/user';

@Injectable()
export class UsuarioService extends BaseService<User> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getUsersList = (): Observable<any> => {
    let data = this.get('/user');
    return data;
  }

  saveUserItem(localClient: User) {
    return this.post('/user/CreateUser', localClient)
  }

  updateUser(proveedor: User) {
    return this.post('/user/updateUser', proveedor)
  }

  getUser(idProveedor: string) {
    return this.get('/user/GetById/?id=' + idProveedor) as Observable<User>;
  }
}
