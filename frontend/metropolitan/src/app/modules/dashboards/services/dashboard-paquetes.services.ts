import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { StorageService } from '../../../shared/services/local-data/storage.service';

@Injectable()
export class DashboardPaquetesService extends BaseService<any> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  private fmt(date: Date): string {
    return date.toISOString();
  }

  getNdPorFecha(idSucursal: number, start: Date, end: Date): Observable<any> {
    return this.get(`/DashboardPaquetes/NdPorFecha?idSucursal=${idSucursal}&start=${this.fmt(start)}&end=${this.fmt(end)}`);
  }

  getNdPorSucursal(start: Date, end: Date): Observable<any> {
    return this.get(`/DashboardPaquetes/NdPorSucursal?start=${this.fmt(start)}&end=${this.fmt(end)}`);
  }
}
