import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaquetesRoutingModule } from './paquetes-routing.module';
import { ClientespaquetesComponent } from './clientespaquetes/clientespaquetes.component';
import { ClienteslistpaquetesComponent } from './clienteslistpaquetes/clienteslistpaquetes.component';
import { NzSpinModule, NzTableModule, NzGridModule, NzFormModule, NzButtonModule, NzSelectModule, NzAutocompleteModule, NzTransferModule, NzDatePickerModule, NzCheckboxModule, NzModalModule, NzRadioModule } from 'ng-zorro-antd';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProveedoreslistpaquetesComponent } from './proveedoreslistpaquetes/proveedoreslistpaquetes.component';
import { ProveedorespaquetesComponent } from './proveedorespaquetes/proveedorespaquetes.component';
import { CounterpaquetesComponent } from './counterpaquetes/counterpaquetes.component';
import { CounterlistpaquetesComponent } from './counterlistpaquetes/counterlistpaquetes.component';
import { PaquetesnotadebitoComponent } from './paquetesnotadebito/paquetesnotadebito.component';
import { PaquetesnotadebitolistComponent } from './paquetesnotadebitolist/paquetesnotadebitolist.component';
import { PaquetesnotadebitoprofileComponent } from './paquetesnotadebitoprofile/paquetesnotadebitoprofile.component';
import { notaDebitoFilter } from './filters/nota-debito.pipe';
import { PaquetesNotaDebitoService } from '../services/paquetes/paquete-nota-debito.services';
import { PaqueteOrdenPagoService } from '../services/paquetes/paquete-orden-pago.services';
import { PaqueteNotaDebitoCalculateService } from '../services/paquetes/paquete-nota-debito-calculate.services';
import { PaquetesordendepagolistComponent } from './paquetesordendepagolist/paquetesordendepagolist.component';
import { paqueteOrdenPagoFilter } from './filters/orden-pago-list.pipe';
import { PaqueteListaOrdenPagoPendienteService } from '../services/paquetes/paquete-orden-pago-list.services';
import { PaquetesordendepagoeditComponent } from './paquetesordendepagoedit/paquetesordendepagoedit.component';
import { PaquetesordendepagocreateComponent } from './paquetesordendepagocreate/paquetesordendepagocreate.component';
import { PaquetesordendepagonotaComponent } from './paquetesordendepagonota/paquetesordendepagonota.component';
import { PaquetesordendepareporteComponent } from './paquetesordendepareporte/paquetesordendepareporte.component';
import { PaqueteListaOrdenPagoReportService } from '../services/paquetes/paquete-orden-pago-list-report.services';
import { PaquetesordendepagoprofileComponent } from './paquetesordendepagoprofile/paquetesordendepagoprofile.component';
import { PaquetesReporteVentasComponent } from './reportes/paquetes-reporte-ventas/paquetes-reporte-ventas.component';
import { PaquetesReporteProfitCounterComponent } from './reportes/paquetes-reporte-profit-counter/paquetes-reporte-profit-counter.component';
import { PaquetesReporteVentasFiltradasComponent } from './reportes/paquetes-reporte-ventas-filtradas/paquetes-reporte-ventas-filtradas.component';



@NgModule({
  declarations: [ClientespaquetesComponent, ClienteslistpaquetesComponent, ProveedoreslistpaquetesComponent,
    ProveedorespaquetesComponent, CounterpaquetesComponent, CounterlistpaquetesComponent, PaquetesnotadebitoComponent,
    PaquetesnotadebitolistComponent, PaquetesnotadebitoprofileComponent, notaDebitoFilter, paqueteOrdenPagoFilter, PaquetesordendepagolistComponent, PaquetesordendepagoeditComponent, PaquetesordendepagocreateComponent, PaquetesordendepagonotaComponent, PaquetesordendepareporteComponent, PaquetesordendepagoprofileComponent, PaquetesReporteVentasComponent, PaquetesReporteProfitCounterComponent, PaquetesReporteVentasFiltradasComponent],
  imports: [
    CommonModule, PaquetesRoutingModule,
    NzSpinModule, NzTableModule, NzGridModule, NzFormModule, NzButtonModule
    , FormsModule, ReactiveFormsModule, NzSelectModule,
    NzAutocompleteModule, NzTransferModule, NzDatePickerModule, NzCheckboxModule, NzModalModule, NzRadioModule, NzInputModule,
    NzTagModule, NzIconModule
  ],
  providers: [
    PaquetesNotaDebitoService, PaqueteOrdenPagoService, PaqueteNotaDebitoCalculateService,
    PaqueteListaOrdenPagoPendienteService, PaqueteListaOrdenPagoReportService
  ]
})
export class PaquetesModule { }
