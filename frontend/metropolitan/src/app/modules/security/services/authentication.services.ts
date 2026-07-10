import { Injectable, Self, Inject } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { environment } from './../../../../environments/environment';
import { StorageService, BROWSER_STORAGE } from './../../../shared/services/local-data/storage.service';
import { IStorageKeys } from './../../../shared/services/local-data/storage';

@Injectable()
export class AuthenticationService {
  userRoles: any;

  private loginUrl = environment.apiAuthenticationUrl + 'Login';
  private headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST'
  });
  private options = new RequestOptions({ headers: this.headers, withCredentials: false });
  constructor(private router: Router, private http: Http, private storage: StorageService) { }

  private errorHandler(error: any) { }

  login(username: string, password: string) {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);
    body.set('grant_type', 'password');
    body.set('client_id', 'angularApp');
    body.set('client_secret', 'secret');
    body.set('scope', 'ecomApi');
    let userpass = "{'user':'" + username + "','password':'" + password + "'}";
    return this.http.post(this.loginUrl, userpass, this.options);
  }

  logout() {
    Object.values(IStorageKeys).forEach(value => this.storage.remove(value));
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
}
