import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../../shared/services/base.service';
import { StorageService } from './../../../../shared/services/local-data/storage.service';
import { OrdenPago } from '../../../../shared/model/orden-pago';

@Injectable()
export class PaqueteOrdenPagoService extends BaseService<OrdenPago> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getOrdenPagoList = (): Observable<any> => {
    let data = this.get('/PaquetesOrdenPago');
    return data;
  }

  saveOrdenPagoItem(localOrdenPago: OrdenPago) {
    return this.post('/PaquetesOrdenPago/CreateOrdenPago', localOrdenPago)
  }

  updateOrdenPago(OrdenPago: OrdenPago) {
    return this.post('/PaquetesOrdenPago/UpdateOrdenPago', OrdenPago)
  }

  getOrdenPago(idORdenPago: string) {
    return this.get('/PaquetesOrdenPago/GetOrdenById/?id=' + idORdenPago) as Observable<OrdenPago>;
  }

  getOrdenPagoByCodProfile(codProfile: string) {
    return this.get('/PaquetesOrdenPago/GetOrdenByCodProfile/?id=' + codProfile) as Observable<any>;
  }

  getOrdenPagoByCliente(idORdenPago: string) {
    const dataResult = this.get('/PaquetesOrdenPago/GetOrdenByCliendId/?id=' + idORdenPago);
    return dataResult as Observable<any>;
  }

  getReportOrdenPagoByDate(startedDate: string, endedDate: string) {
    const dateRange = { startDate: startedDate, endDate: endedDate };
    return this.post('/PaquetesOrdenPago/GetReporteVentas', dateRange) as Observable<any[]>;
  }

  getReportOrdenPagoByDateDetailByCity(startedDate: string, endedDate: string, idCityData: string) {
    const dateRange = { startDate: startedDate, endDate: endedDate, idCity: idCityData };
    return this.post('/PaquetesOrdenPago/GetReporteVentasDetalleByCity', dateRange) as Observable<any[]>;
  }

  getReportOrdenPagoByDateDetail(startedDate: string, endedDate: string) {
    const dateRange = { startDate: startedDate, endDate: endedDate };
    return this.post('/PaquetesOrdenPago/GetReporteVentasDetalle', dateRange) as Observable<any[]>;
  }

  getReportOrdenPagoByDateDetailPpf(sucursal: string, startedDate: string, endedDate: string) {
    const dateRange = { sucursal: sucursal, startDate: startedDate, endDate: endedDate };
    return this.post('/PaquetesOrdenPago/GetReporteVentasDetallePpf', dateRange) as Observable<any[]>;
  }

  getReportOrdenPagoByDateTotalesRest(Sucursal: string, startedDate: string, endedDate: string) {
    const dateRange = { sucursal: Sucursal, startDate: startedDate, endDate: endedDate };
    return this.post('/PaquetesOrdenPago/GetReporteTotales', dateRange) as Observable<[any]>;
  }

  getReportOrdenPagoByDateDetailAnulacion(sucursal: string, startedDate: string, endedDate: string) {
    const dateRange = { sucursal: sucursal, startDate: startedDate, endDate: endedDate };
    return this.post('/PaquetesOrdenPago/GetReporteVentasDetalleAnulacion', dateRange) as Observable<any[]>;
  }

  getReportOrdenPagoByDateDetailRemision(sucursal: string, startedDate: string, endedDate: string) {
    const dateRange = { sucursal: sucursal, startDate: startedDate, endDate: endedDate };
    return this.post('/PaquetesOrdenPago/GetReporteVentasDetalleRemision', dateRange) as Observable<any[]>;
  }

  getReportOrdenPagoByDateDetailByCityFiltered(startedDate: string, endedDate: string, idCityData: string, voucher: string, codOperator: string) {
    const dateRange = { startDate: startedDate, endDate: endedDate, idCity: idCityData, voucher: voucher, codOperator: codOperator };
    return this.post('/PaquetesOrdenPago/GetReporteVentasDetalleByCityFiltrada', dateRange) as Observable<any[]>;
  }

  getReportOrdenPagoByDateDetailByCityFilteredAnulado(startedDate: string, endedDate: string, idCityData: string, voucher: string, codOperator: string) {
    const dateRange = { startDate: startedDate, endDate: endedDate, idCity: idCityData, voucher: voucher, codOperator: codOperator };
    return this.post('/PaquetesOrdenPago/GetReporteVentasDetalleByCityFiltradaAnulado', dateRange) as Observable<any[]>;
  }

}
