import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotaDebitoListComponent } from './nota-debito/nota-debito-list/nota-debito-list.component';
import { NotaDebitoCreateComponent } from './nota-debito/nota-debito-create/nota-debito-create.component';
import { OrdenPagoListComponent } from './orden-pago/orden-pago-list/orden-pago-list.component';
import { OrdenPagoCreateComponent } from './orden-pago/orden-pago-create/orden-pago-create.component';
import { CargarExccelNotaDebitoComponent } from './cargar-excel-nota-debito/cargar-excel.component';
import { NotaDebitoReporteListComponent } from './nota-debito-reporte/reporte-cliente/reporte-cliente.component';
import { OrdenPagoReporteComponent } from './orden-pago-reporte/orden-pago-reporte.component';
import { OrdenPagoEditComponent } from './orden-pago/orden-pago-edit/orden-pago-edit.component';
import { NotaDebitoProfileComponent } from './nota-debito/nota-debito-profile/nota-debito-profile.component';
import { OrdenPagoProfileComponent } from './orden-pago/orden-pago-profile/orden-pago-profile.component';
import { ReporteVentaComponent } from './reporteventa/reporte-venta/reporte-venta.component';
import { ReportProfitCounterComponent } from './report-profit-counter/report-profit-counter.component';
import { ReporteVentasFiltradasComponent } from './reporte-ventas-filtradas/reporte-ventas-filtradas.component';


const routes: Routes = [
  {
    path: 'nota-debito',
    component: NotaDebitoListComponent
  },
  {
    path: 'nota-debito-Create',
    component: NotaDebitoCreateComponent
  },
  {
    path: 'edit-nota-debito/:id',
    component: NotaDebitoCreateComponent
  },
  {
    path: 'profile-nota-debito/:id',
    component: NotaDebitoProfileComponent
  },
  {
    path: 'orden-pago',
    component: OrdenPagoListComponent
  },
  {
    path: 'orden-pago-create',
    component: OrdenPagoCreateComponent
  },
  {
    path: 'edit-orden-create/:id',
    component: OrdenPagoCreateComponent
  },
  {
    path: 'cargar-excel',
    component: CargarExccelNotaDebitoComponent
  },
  {
    path: 'reporte-nota-debito',
    component: NotaDebitoReporteListComponent
  },
  {
    path: 'reporte-orden-pago',
    component: OrdenPagoReporteComponent
  },
  {
    path: 'edit-orden-pago/:id',
    component: OrdenPagoEditComponent
  },
  {
    path: 'profile-orden-pago/:id',
    component: OrdenPagoProfileComponent
  },
  {
    path: 'reporte-ventas',
    component: ReporteVentaComponent
  },
  {
    path: 'reporte-ventas-counter',
    component: ReportProfitCounterComponent
  },
  {
    path: 'reporte-ventas-filtradas',
    component: ReporteVentasFiltradasComponent
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelaceRoutingModule { }
