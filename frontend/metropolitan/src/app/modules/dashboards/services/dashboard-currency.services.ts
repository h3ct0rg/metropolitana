import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { StorageService } from '../../../shared/services/local-data/storage.service';

@Injectable()
export class DashboardCurrencyService extends BaseService<any> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  private fmt(date: Date): string {
    return date.toISOString();
  }

  getSummary(idSucursal: number, modulo: string, start: Date, end: Date): Observable<any> {
    return this.get(`/DashboardCurrency/Summary?idSucursal=${idSucursal}&modulo=${modulo}&start=${this.fmt(start)}&end=${this.fmt(end)}`);
  }

  getExchangeRateHistory(start: Date, end: Date): Observable<any> {
    return this.get(`/DashboardCurrency/ExchangeRateHistory?start=${this.fmt(start)}&end=${this.fmt(end)}`);
  }

  getNdByCurrency(idSucursal: number, modulo: string, start: Date, end: Date): Observable<any> {
    return this.get(`/DashboardCurrency/NdByCurrency?idSucursal=${idSucursal}&modulo=${modulo}&start=${this.fmt(start)}&end=${this.fmt(end)}`);
  }

  getNdByCurrencyOverTime(idSucursal: number, modulo: string, start: Date, end: Date): Observable<any> {
    return this.get(`/DashboardCurrency/NdByCurrencyOverTime?idSucursal=${idSucursal}&modulo=${modulo}&start=${this.fmt(start)}&end=${this.fmt(end)}`);
  }

  getNdByCurrencyByModulo(idSucursal: number, modulo: string, start: Date, end: Date): Observable<any> {
    return this.get(`/DashboardCurrency/NdByCurrencyByModulo?idSucursal=${idSucursal}&modulo=${modulo}&start=${this.fmt(start)}&end=${this.fmt(end)}`);
  }

  getNdByCurrencyByBranch(modulo: string, start: Date, end: Date): Observable<any> {
    return this.get(`/DashboardCurrency/NdByCurrencyByBranch?modulo=${modulo}&start=${this.fmt(start)}&end=${this.fmt(end)}`);
  }

  getPaymentMethodUsage(idSucursal: number, modulo: string, start: Date, end: Date, top: number = 8): Observable<any> {
    return this.get(`/DashboardCurrency/PaymentMethodUsage?idSucursal=${idSucursal}&modulo=${modulo}&start=${this.fmt(start)}&end=${this.fmt(end)}&top=${top}`);
  }
}
