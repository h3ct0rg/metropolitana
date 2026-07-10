import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../../shared/services/base.service';
import { StorageService } from './../../../../shared/services/local-data/storage.service';
import { OrdenPago } from '../../../../shared/model/orden-pago';

@Injectable()
export class CargaOrdenPagoService extends BaseService<OrdenPago> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getOrdenPagoList = (): Observable<any> => {
    let data = this.get('/CargaOrdenPago');
    return data;
  }

  saveOrdenPagoItem(localOrdenPago: OrdenPago) {
    return this.post('/CargaOrdenPago/CreateOrdenPago', localOrdenPago)
  }

  updateOrdenPago(OrdenPago: OrdenPago) {
    return this.post('/CargaOrdenPago/UpdateOrdenPago', OrdenPago)
  }

  getOrdenPago(idORdenPago: string) {
    return this.get('/CargaOrdenPago/GetOrdenById/?id=' + idORdenPago) as Observable<OrdenPago>;
  }

  getOrdenPagoByCodProfile(codProfile: string) {
    return this.get('/CargaOrdenPago/GetOrdenByCodProfile/?id=' + codProfile) as Observable<any>;
  }

  getOrdenPagoByCliente(idORdenPago: string) {
    const dataResult = this.get('/CargaOrdenPago/GetOrdenByCliendId/?id=' + idORdenPago);
    return dataResult as Observable<any>;
  }

  getReportOrdenPagoByDate(startedDate: string, endedDate: string) {
    const dateRange = { startDate: startedDate, endDate: endedDate };
    return this.post('/CargaOrdenPago/GetReporteVentas', dateRange) as Observable<any[]>;
  }

  getReportOrdenPagoByDateDetailByCity(startedDate: string, endedDate: string, idCityData: string) {
    const dateRange = { startDate: startedDate, endDate: endedDate, idCity: idCityData };
    return this.post('/CargaOrdenPago/GetReporteVentasDetalleByCity', dateRange) as Observable<any[]>;
  }

  getReportOrdenPagoByDateDetail(startedDate: string, endedDate: string) {
    const dateRange = { startDate: startedDate, endDate: endedDate };
    return this.post('/CargaOrdenPago/GetReporteVentasDetalle', dateRange) as Observable<any[]>;
  }

  getReportOrdenPagoByDateDetailPpf(sucursal: string, startedDate: string, endedDate: string) {
    const dateRange = { sucursal: sucursal, startDate: startedDate, endDate: endedDate };
    return this.post('/CargaOrdenPago/GetReporteVentasDetallePpf', dateRange) as Observable<any[]>;
  }

  getReportOrdenPagoByDateTotalesRest(Sucursal: string, startedDate: string, endedDate: string) {
    const dateRange = { sucursal: Sucursal, startDate: startedDate, endDate: endedDate };
    return this.post('/CargaOrdenPago/GetReporteTotales', dateRange) as Observable<[any]>;
  }

  getReportOrdenPagoByDateDetailAnulacion(sucursal: string, startedDate: string, endedDate: string) {
    const dateRange = { sucursal: sucursal, startDate: startedDate, endDate: endedDate };
    return this.post('/CargaOrdenPago/GetReporteVentasDetalleAnulacion', dateRange) as Observable<any[]>;
  }

  getReportOrdenPagoByDateDetailRemision(sucursal: string, startedDate: string, endedDate: string) {
    const dateRange = { sucursal: sucursal, startDate: startedDate, endDate: endedDate };
    return this.post('/CargaOrdenPago/GetReporteVentasDetalleRemision', dateRange) as Observable<any[]>;
  }
}
