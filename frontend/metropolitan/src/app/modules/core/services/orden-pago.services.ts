import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { StorageService } from './../../../shared/services/local-data/storage.service';
import { OrdenPago } from '../../../shared/model/orden-pago';

@Injectable()
export class OrdenPagoService extends BaseService<OrdenPago> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getOrdenPagoList = (): Observable<any> => {
    let data = this.get('/OrdenPago');
    return data;
  }

  saveOrdenPagoItem(localOrdenPago: OrdenPago) {
    return this.post('/OrdenPago/CreateOrdenPago', localOrdenPago)
  }

  updateOrdenPago(OrdenPago: OrdenPago) {
    return this.post('/OrdenPago/UpdateOrdenPago', OrdenPago)
  }

  updateOrdenPagoNegative(idOrdenPago: number, numberNota: string, idSucursal: number) {
    return this.get(`/OrdenPago/UpdateOrdenPagoNegative/?idOrdenPago=${idOrdenPago}&numberNota=${numberNota}&idSucursal=${idSucursal}`);
  }


  getOrdenPago(idORdenPago: string) {
    return this.get('/OrdenPago/GetOrdenById/?id=' + idORdenPago) as Observable<OrdenPago>;
  }

  getOrdenPagoByIDNotaIDSucursal(idNota: number, idSucursal: number) {
    return this.get('/OrdenPago/GetOrdenByIdNotaDebitoSucursal/?idNota=' + idNota + '&idsucursal=' + idSucursal) as Observable<OrdenPago>;
  }

  getOrdenPagoByCodProfile(codProfile: string) {
    return this.get('/OrdenPago/GetOrdenByCodProfile/?id=' + codProfile) as Observable<any>;
  }

  getOrdenPagoByCliente(idORdenPago: string) {
    const dataResult = this.get('/OrdenPago/GetOrdenByCliendId/?id=' + idORdenPago);
    return dataResult as Observable<any>;
  }

  getReportOrdenPagoByDate(startedDate: string, endedDate: string) {
    const dateRange = { startDate: startedDate, endDate: endedDate };
    return this.post('/OrdenPago/GetReporteVentas', dateRange) as Observable<any[]>;
  }

  getReportOrdenPagoByDateDetail(startedDate: string, endedDate: string) {
    const dateRange = { startDate: startedDate, endDate: endedDate };
    return this.post('/OrdenPago/GetReporteVentasDetalle', dateRange) as Observable<any[]>;
  }

  getReportOrdenPagoByDateDetailByCity(startedDate: string, endedDate: string, idCityData: string) {
    const dateRange = { startDate: startedDate, endDate: endedDate, idCity: idCityData };
    return this.post('/OrdenPago/GetReporteVentasDetalleByCity', dateRange) as Observable<any[]>;
  }

  getReportOrdenPagoByDateDetailPpf(sucursal: string, startedDate: string, endedDate: string) {
    const dateRange = { sucursal: sucursal, startDate: startedDate, endDate: endedDate };
    return this.post('/OrdenPago/GetReporteVentasDetallePpf', dateRange) as Observable<any[]>;
  }

  getReportOrdenPagoByDateDetailAnulacion(sucursal: string, startedDate: string, endedDate: string) {
    const dateRange = { sucursal: sucursal, startDate: startedDate, endDate: endedDate };
    return this.post('/OrdenPago/GetReporteVentasDetalleAnulacion', dateRange) as Observable<any[]>;
  }

  getReportOrdenPagoByDateDetailRemision(sucursal: string, startedDate: string, endedDate: string) {
    const dateRange = { sucursal: sucursal, startDate: startedDate, endDate: endedDate };
    return this.post('/OrdenPago/GetReporteVentasDetalleRemision', dateRange) as Observable<any[]>;
  }

  getReportOrdenPagoByDateTotalesRest(Sucursal: string, startedDate: string, endedDate: string) {
    const dateRange = { sucursal: Sucursal, startDate: startedDate, endDate: endedDate };
    return this.post('/OrdenPago/GetReporteTotales', dateRange) as Observable<[any]>;
  }

  getReportOrdenPagoByDateDetailByCityFiltered(startedDate: string, endedDate: string, idCityData: string, voucher: string, codOperator: string) {
    const dateRange = { startDate: startedDate, endDate: endedDate, idCity: idCityData, voucher: voucher, codOperator: codOperator };
    return this.post('/OrdenPago/GetReporteVentasDetalleByCityFiltrada', dateRange) as Observable<any[]>;
  }
}
