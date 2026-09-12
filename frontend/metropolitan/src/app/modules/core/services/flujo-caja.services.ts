import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { StorageService } from './../../../shared/services/local-data/storage.service';
import { FlujoCajaResumen, FlujoCajaMovimiento } from '../../../shared/model/flujo-caja';

@Injectable()
export class FlujoCajaService extends BaseService<FlujoCajaResumen> {
  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getResumen(startDate: string, endDate: string, area: string = 'TODAS', sucursal: number = 0): Observable<FlujoCajaResumen[]> {
    return this.post('/FlujoCaja/GetFlujoCaja', { startDate, endDate, area, sucursal }) as Observable<any[]>;
  }

  getDetalle(startDate: string, endDate: string, area: string = 'TODAS', sucursal: number = 0): Observable<FlujoCajaMovimiento[]> {
    return this.post('/FlujoCaja/GetFlujoCajaDetalle', { startDate, endDate, area, sucursal }) as Observable<any[]>;
  }
}
