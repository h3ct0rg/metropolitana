import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { StorageService } from './../../../shared/services/local-data/storage.service';
import { Counter } from '../../../shared/model/counter';

@Injectable()
export class CounterService extends BaseService<Counter> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getCounterList = (): Observable<any> => {
    let data = this.get('/Counter');
    return data;
  }

  savetCounterItem(localCounter: Counter) {
    return this.post('/Counter/CreateCounter', localCounter)
  }

  deleteCounterItem(idCounter: string) {
    return this.get('/Counter/DeleteCounter?idCounter=' + idCounter);
  }

  updateCounter(counter: Counter) {
    return this.post('/Counter/UpdateCounter', counter)
  }

  getCounter(idCounter: string) {
    return this.get('/Counter/GetById/?id=' + idCounter) as Observable<Counter>;
  }

  getCounterBySucursal(idSucursal: string) {
    return this.get('/Counter/GetBySucursalId/?id=' + idSucursal) as Observable<Counter[]>;
  }

  getCounterClient(idCounterClient: string) {
    return this.get('/Counter/GetByClientId/?id=' + idCounterClient) as Observable<Counter[]>;
  }

  getCounterProfitByDate(startedDate: string, endedDate: string) {
    const dateRange = { startDate: startedDate, endDate: endedDate };
    return this.post('/Counter/GetReporteByCounter', dateRange) as Observable<any[]>;
  }

  getCounterProfitByDateByCity(startedDate: string, endedDate: string, idCityList: string) {
    const dateRange = { startDate: startedDate, endDate: endedDate, idCity: idCityList };
    return this.post('/Counter/GetReporteByCounterByCity', dateRange) as Observable<any[]>;
  }

  getCounterProfitByDateByCityDetalle(startedDate: string, endedDate: string, idCityList: string) {
    const dateRange = { startDate: startedDate, endDate: endedDate, idCity: idCityList };
    return this.post('/Counter/GetReporteByCounterByCityDetalle', dateRange) as Observable<any[]>;
  }



  //------------------------------------/ Paquetes /-----------------------------------------------------

  getCounterListPaquet = (): Observable<any> => {
    let data = this.get('/CounterPaquetes');
    return data;
  }

  savetCounterItemPaquet(localCounter: Counter) {
    return this.post('/CounterPaquetes/CreateCounter', localCounter)
  }

  updateCounterPaquet(counter: Counter) {
    return this.post('/CounterPaquetes/UpdateCounter', counter)
  }

  deleteCounterPaquetesItem(idCounter: string) {
    return this.get('/CounterPaquetes/DeleteCounter?idCounter=' + idCounter);
  }

  getCounterPaquet(idCounter: string) {
    return this.get('/CounterPaquetes/GetById/?id=' + idCounter) as Observable<Counter>;
  }

  getCounterBySucursalPaquet(idSucursal: string) {
    return this.get('/CounterPaquetes/GetBySucursalId/?id=' + idSucursal) as Observable<Counter[]>;
  }

  getCounterClientPaquet(idCounterClient: string) {
    return this.get('/CounterPaquetes/GetByClientId/?id=' + idCounterClient) as Observable<Counter[]>;
  }

  getCounterProfitByDatePaquet(startedDate: string, endedDate: string) {
    const dateRange = { startDate: startedDate, endDate: endedDate };
    return this.post('/CounterPaquetes/GetReporteByCounter', dateRange) as Observable<any[]>;
  }

  getCounterProfitByDatePaquetDetalle(startedDate: string, endedDate: string) {
    const dateRange = { startDate: startedDate, endDate: endedDate };
    return this.post('/CounterPaquetes/GetReporteByCounterDetalle', dateRange) as Observable<any[]>;
  }

  //------------------------------------/ Carga /-----------------------------------------------------

  getCounterListCarga = (): Observable<any> => {
    let data = this.get('/CounterCarga');
    return data;
  }

  savetCounterItemCarga(localCounter: Counter) {
    return this.post('/CounterCarga/CreateCounter', localCounter)
  }

  updateCounterCarga(counter: Counter) {
    return this.post('/CounterCarga/UpdateCounter', counter)
  }

  deleteCounterCargaItem(idCounter: string) {
    return this.get('/CounterCarga/DeleteCounter?idCounter=' + idCounter);
  }

  getCounterCarga(idCounter: string) {
    return this.get('/CounterCarga/GetById/?id=' + idCounter) as Observable<Counter>;
  }

  getCounterBySucursalCarga(idSucursal: string) {
    return this.get('/CounterCarga/GetBySucursalId/?id=' + idSucursal) as Observable<Counter[]>;
  }

  getCounterClientCarga(idCounterClient: string) {
    return this.get('/CounterCarga/GetByClientId/?id=' + idCounterClient) as Observable<Counter[]>;
  }

  getCounterProfitByDateCarga(startedDate: string, endedDate: string) {
    const dateRange = { startDate: startedDate, endDate: endedDate };
    return this.post('/CounterCarga/GetReporteByCounter', dateRange) as Observable<any[]>;
  }

  getCounterProfitByDateCargaDetalle(startedDate: string, endedDate: string) {
    const dateRange = { startDate: startedDate, endDate: endedDate };
    return this.post('/CounterCarga/GetReporteByCounterDetalle', dateRange) as Observable<any[]>;
  }
}
