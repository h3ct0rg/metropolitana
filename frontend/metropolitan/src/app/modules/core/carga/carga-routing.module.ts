import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarganotadebitoComponent } from './carganotadebito/carganotadebito.component';
import { CarganotadebitolistComponent } from './carganotadebitolist/carganotadebitolist.component';
import { CarganotadebitoprofileComponent } from './carganotadebitoprofile/carganotadebitoprofile.component';
import { CargaordendepagocreateComponent } from './cargaordendepagocreate/cargaordendepagocreate.component';
import { CargaordendepagoeditComponent } from './cargaordendepagoedit/cargaordendepagoedit.component';
import { CargaordendepagolistComponent } from './cargaordendepagolist/cargaordendepagolist.component';
import { CargaordendepagoprofileComponent } from './cargaordendepagoprofile/cargaordendepagoprofile.component';
import { CargaordendepareporteComponent } from './cargaordendepareporte/cargaordendepareporte.component';
import { ClientesCargaComponent } from './clientescarga/clientescarga.component';
import { ClienteslistcargasComponent } from './clienteslistcarga/clienteslistcarga.component';
import { CountercargaComponent } from './countercarga/countercarga.component';
import { CounterlistcargaComponent } from './counterlistcarga/counterlistcarga.component';
import { ProveedorescargaComponent } from './proveedorescarga/proveedorescarga.component';
import { ProveedoreslistcargaComponent } from './proveedoreslistcarga/proveedoreslistcarga.component';
import { CargaReporteProfitCounterComponent } from './reportes/carga-reporte-profit-counter/carga-reporte-profit-counter.component';
import { CargaReporteVentasComponent } from './reportes/carga-reporte-ventas/carga-reporte-ventas.component';


const routes: Routes = [  
  {
    path: 'clientesList',
    component: ClienteslistcargasComponent
  },
  {
    path: 'clienteCreate',
    component: ClientesCargaComponent
  },
  {
    path: 'edit-cliente/:id',
    component: ClientesCargaComponent
  },
  {
    path: 'proveedorList',
    component: ProveedoreslistcargaComponent
  },
  {
    path: 'proveedorCreate',
    component: ProveedorescargaComponent
  },
  {
    path: 'edit-proveedor/:id',
    component: ProveedorescargaComponent
  },
  {
    path: 'counterList',
    component: CounterlistcargaComponent
  },
  {
    path: 'counterCreate',
    component: CountercargaComponent
  },
  {
    path: 'edit-counter/:id',
    component: CountercargaComponent
  },
  {
    path: 'nota-debito',
    component: CarganotadebitolistComponent
  },
  {
    path: 'nota-debito-Create',
    component: CarganotadebitoComponent
  },
  {
    path: 'edit-nota-debito/:id',
    component: CarganotadebitoComponent
  },
  {
    path: 'profile-nota-debito/:id',
    component: CarganotadebitoprofileComponent
  },
  {
    path: 'orden-pago',
    component: CargaordendepagolistComponent
  },
  {
    path: 'edit-orden-create/:id',
    component: CargaordendepagocreateComponent
  },
  {
    path: 'edit-orden-pago/:id',
    component: CargaordendepagoeditComponent
  },
  {
    path: 'reporte-orden-pago',
    component: CargaordendepareporteComponent
  },
  {
    path: 'profile-orden-pago/:id',
    component: CargaordendepagoprofileComponent
  },
  {
    path: 'reporte-ventas',
    component: CargaReporteVentasComponent
  },
  {
    path: 'reporte-ventas-counter',
    component: CargaReporteProfitCounterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaRoutingModule { }
