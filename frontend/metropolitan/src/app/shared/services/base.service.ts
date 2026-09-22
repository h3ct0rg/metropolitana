import { HttpClient, HttpHeaders } from '@angular/common/http';

// import { appConfig } from 'src/app/app.config';

import { Observable } from 'rxjs';
import { StorageService } from './local-data/storage.service';
import { IStorageKeys } from './local-data/storage';
import { AppConfigService } from './app-config.service';

export class BaseService<T> {
  protected get baseUrl(): string {
    return AppConfigService.baseUrlApi;
  }

  constructor(protected http: HttpClient, protected storageService: StorageService) { }

  private getAuthHeader = (): HttpHeaders => {
    const token: string = this.storageService.parse(IStorageKeys.Token);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json, text/plain, */*');
  }

  private getAuthFileHeader = (): HttpHeaders => {
    const token: string = this.storageService.parse(IStorageKeys.Token);
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  protected get = (url: string): Observable<T[] | T> => {
    return this.http.get<T[] | T>(`${this.baseUrl}${url}`, { headers: this.getAuthHeader() });
  }

  protected getSingle = (url: string): Observable<T> => {
    return this.http.get<T>(`${this.baseUrl}${url}`, { headers: this.getAuthHeader() });
  }

  protected post = (url: string, body: any): Observable<T[] | T> => {
    return this.http.post<T[] | T>(`${this.baseUrl}${url}`, body, { headers: this.getAuthHeader() });
  }

  protected postFile = (url: string, body: any): Observable<T[] | T> => {
    return this.http.post<T[] | T>(`${this.baseUrl}${url}`, body, { headers: this.getAuthFileHeader() });
  }

  protected put = (url: string, body: any): Observable<T> => {
    return this.http.put<T>(`${this.baseUrl}${url}`, body, { headers: this.getAuthHeader() });
  }

  protected patch = (url: string, body: any) => {
    return this.http.patch(`${this.baseUrl}${url}`, body, { headers: this.getAuthHeader() });
  }

  protected delete = (url: string): Observable<T> => {
    return this.http.delete<T>(`${this.baseUrl}${url}`, { headers: this.getAuthHeader() });
  }
}
