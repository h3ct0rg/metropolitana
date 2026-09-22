import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientespaquetesComponent } from './clientespaquetes/clientespaquetes.component';
import { ClienteslistpaquetesComponent } from './clienteslistpaquetes/clienteslistpaquetes.component';
import { ProveedoreslistpaquetesComponent } from './proveedoreslistpaquetes/proveedoreslistpaquetes.component';
import { ProveedorespaquetesComponent } from './proveedorespaquetes/proveedorespaquetes.component';
import { CounterlistpaquetesComponent } from './counterlistpaquetes/counterlistpaquetes.component';
import { CounterpaquetesComponent } from './counterpaquetes/counterpaquetes.component';
import { PaquetesnotadebitolistComponent } from './paquetesnotadebitolist/paquetesnotadebitolist.component';
import { PaquetesnotadebitoComponent } from './paquetesnotadebito/paquetesnotadebito.component';
import { PaquetesnotadebitoprofileComponent } from './paquetesnotadebitoprofile/paquetesnotadebitoprofile.component';
import { PaquetesordendepagolistComponent } from './paquetesordendepagolist/paquetesordendepagolist.component';
import { PaquetesordendepagoeditComponent } from './paquetesordendepagoedit/paquetesordendepagoedit.component';
import { PaquetesordendepagocreateComponent } from './paquetesordendepagocreate/paquetesordendepagocreate.component';
import { PaquetesordendepareporteComponent } from './paquetesordendepareporte/paquetesordendepareporte.component';
import { PaquetesordendepagoprofileComponent } from './paquetesordendepagoprofile/paquetesordendepagoprofile.component';
import { PaquetesReporteVentasComponent } from './reportes/paquetes-reporte-ventas/paquetes-reporte-ventas.component';
import { PaquetesReporteProfitCounterComponent } from './reportes/paquetes-reporte-profit-counter/paquetes-reporte-profit-counter.component';
import { PaquetesReporteVentasFiltradasComponent } from './reportes/paquetes-reporte-ventas-filtradas/paquetes-reporte-ventas-filtradas.component';
import { PaquetesReporteFechaSalidaComponent } from './reportes/paquetes-reporte-fecha-salida/paquetes-reporte-fecha-salida.component';

const routes: Routes = [  
  {
    path: 'clientesList',
    component: ClienteslistpaquetesComponent
  },
  {
    path: 'clienteCreate',
    component: ClientespaquetesComponent
  },
  {
    path: 'edit-cliente/:id',
    component: ClientespaquetesComponent
  },
  {
    path: 'proveedorList',
    component: ProveedoreslistpaquetesComponent
  },
  {
    path: 'proveedorCreate',
    component: ProveedorespaquetesComponent
  },
  {
    path: 'edit-proveedor/:id',
    component: ProveedorespaquetesComponent
  },
  {
    path: 'counterList',
    component: CounterlistpaquetesComponent
  },
  {
    path: 'counterCreate',
    component: CounterpaquetesComponent
  },
  {
    path: 'edit-counter/:id',
    component: CounterpaquetesComponent
  },
  {
    path: 'nota-debito',
    component: PaquetesnotadebitolistComponent
  },
  {
    path: 'nota-debito-Create',
    component: PaquetesnotadebitoComponent
  },
  {
    path: 'edit-nota-debito/:id',
    component: PaquetesnotadebitoComponent
  },
  {
    path: 'profile-nota-debito/:id',
    component: PaquetesnotadebitoprofileComponent
  },
  {
    path: 'orden-pago',
    component: PaquetesordendepagolistComponent
  },
  {
    path: 'edit-orden-create/:id',
    component: PaquetesordendepagocreateComponent
  },
  {
    path: 'edit-orden-pago/:id',
    component: PaquetesordendepagoeditComponent
  },
  {
    path: 'reporte-orden-pago',
    component: PaquetesordendepareporteComponent
  },
  {
    path: 'profile-orden-pago/:id',
    component: PaquetesordendepagoprofileComponent
  },
  {
    path: 'reporte-ventas',
    component: PaquetesReporteVentasComponent
  },
  {
    path: 'reporte-ventas-counter',
    component: PaquetesReporteProfitCounterComponent
  },
  {
    path: 'reporte-ventas-filtradas',
    component: PaquetesReporteVentasFiltradasComponent
  },
  {
    path: 'reporte-fecha-salida',
    component: PaquetesReporteFechaSalidaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaquetesRoutingModule { }
