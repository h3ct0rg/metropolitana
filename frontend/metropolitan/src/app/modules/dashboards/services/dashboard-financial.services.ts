import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { StorageService } from '../../../shared/services/local-data/storage.service';

@Injectable()
export class DashboardFinancialService extends BaseService<any> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  private fmt(date: Date): string {
    return date.toISOString();
  }

  getSummary(idSucursal: number, start: Date, end: Date): Observable<any> {
    return this.get(`/DashboardFinancial/Summary?idSucursal=${idSucursal}&start=${this.fmt(start)}&end=${this.fmt(end)}`);
  }

  getMonthlyRevenue(idSucursal: number, meses: number = 12): Observable<any> {
    return this.get(`/DashboardFinancial/MonthlyRevenue?idSucursal=${idSucursal}&meses=${meses}`);
  }

  getRevenueByBranch(mes: number, anio: number): Observable<any> {
    return this.get(`/DashboardFinancial/RevenueByBranch?mes=${mes}&anio=${anio}`);
  }

  getReceivables(idSucursal: number): Observable<any> {
    return this.get(`/DashboardFinancial/Receivables?idSucursal=${idSucursal}`);
  }

  getTopClients(idSucursal: number, start: Date, end: Date, top: number = 5): Observable<any> {
    return this.get(`/DashboardFinancial/TopClients?idSucursal=${idSucursal}&start=${this.fmt(start)}&end=${this.fmt(end)}&top=${top}`);
  }

  getModuleDistribution(idSucursal: number, start: Date, end: Date): Observable<any> {
    return this.get(`/DashboardFinancial/ModuleDistribution?idSucursal=${idSucursal}&start=${this.fmt(start)}&end=${this.fmt(end)}`);
  }
}
