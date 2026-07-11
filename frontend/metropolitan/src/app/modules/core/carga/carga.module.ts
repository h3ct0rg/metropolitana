import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSpinModule, NzTableModule, NzGridModule, NzFormModule, NzButtonModule, NzSelectModule, NzAutocompleteModule, NzTransferModule, NzDatePickerModule, NzCheckboxModule, NzModalModule, NzRadioModule } from 'ng-zorro-antd';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientesCargaComponent } from './clientescarga/clientescarga.component';
import { ClienteslistcargasComponent } from './clienteslistcarga/clienteslistcarga.component';
import { ProveedoreslistcargaComponent } from './proveedoreslistcarga/proveedoreslistcarga.component';
import { ProveedorescargaComponent } from './proveedorescarga/proveedorescarga.component';
import { CountercargaComponent } from './countercarga/countercarga.component';
import { CounterlistcargaComponent } from './counterlistcarga/counterlistcarga.component';
import { CarganotadebitoComponent } from './carganotadebito/carganotadebito.component';
import { CarganotadebitolistComponent } from './carganotadebitolist/carganotadebitolist.component';
import { CarganotadebitoprofileComponent } from './carganotadebitoprofile/carganotadebitoprofile.component';
import { carganotaDebitoFilter } from './filters/nota-debito.pipe';
import { CargaordendepagolistComponent } from './cargaordendepagolist/cargaordendepagolist.component';
import { CargaordendepagoeditComponent } from './cargaordendepagoedit/cargaordendepagoedit.component';
import { CargaordendepagocreateComponent } from './cargaordendepagocreate/cargaordendepagocreate.component';
import { CargaordendepagonotaComponent } from './cargaordendepagonota/cargaordendepagonota.component';
import { CargaordendepareporteComponent } from './cargaordendepareporte/cargaordendepareporte.component';
import { CargaordendepagoprofileComponent } from './cargaordendepagoprofile/cargaordendepagoprofile.component';
import { CargaReporteVentasComponent } from './reportes/carga-reporte-ventas/carga-reporte-ventas.component';
import { CargaReporteProfitCounterComponent } from './reportes/carga-reporte-profit-counter/carga-reporte-profit-counter.component';
import { CargaRoutingModule } from './carga-routing.module';
import { CargaNotaDebitoService } from '../services/carga/carga-nota-debito.services';
import { CargaOrdenPagoService } from '../services/carga/carga-orden-pago.services';
import { CargaNotaDebitoCalculateService } from '../services/carga/carga-nota-debito-calculate.services';
import { CargaListaOrdenPagoPendienteService } from '../services/carga/carga-orden-pago-list.services';
import { CargaListaOrdenPagoReportService } from '../services/carga/carga-orden-pago-list-report.services';
import { cargaOrdenPagoFilter } from './filters/orden-pago-list.pipe';



@NgModule({
  declarations: [ClientesCargaComponent, ClienteslistcargasComponent, ProveedoreslistcargaComponent,
    ProveedorescargaComponent, CountercargaComponent, CounterlistcargaComponent, CarganotadebitoComponent,
    CarganotadebitolistComponent, CarganotadebitoprofileComponent, carganotaDebitoFilter, cargaOrdenPagoFilter, CargaordendepagolistComponent,
    CargaordendepagoeditComponent, CargaordendepagocreateComponent, CargaordendepagonotaComponent, CargaordendepareporteComponent,
    CargaordendepagoprofileComponent, CargaReporteVentasComponent, CargaReporteProfitCounterComponent],
  imports: [
    CommonModule, CargaRoutingModule,
    NzSpinModule, NzTableModule, NzGridModule, NzFormModule, NzButtonModule
    , FormsModule, ReactiveFormsModule, NzSelectModule,
    NzAutocompleteModule, NzTransferModule, NzDatePickerModule, NzCheckboxModule, NzModalModule, NzRadioModule, NzInputModule
  ],
  providers: [
    CargaNotaDebitoService, CargaOrdenPagoService, CargaNotaDebitoCalculateService,
    CargaListaOrdenPagoPendienteService, CargaListaOrdenPagoReportService
  ]
})
export class CargaModule { }
