import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NotaDebitoCreateComponent } from './nota-debito/nota-debito-create/nota-debito-create.component';
import { NotaDebitoListComponent } from './nota-debito/nota-debito-list/nota-debito-list.component';
import { OrdenPagoCreateComponent } from './orden-pago/orden-pago-create/orden-pago-create.component';
import { OrdenPagoListComponent } from './orden-pago/orden-pago-list/orden-pago-list.component';
import { OrdenPagoNotaComponent } from './orden-pago/orden-pago-nota/orden-pago-nota.component';
import { NotaDebitoReporteListComponent } from './nota-debito-reporte/reporte-cliente/reporte-cliente.component';
import { CargarExccelNotaDebitoComponent } from './cargar-excel-nota-debito/cargar-excel.component';
import { TravelaceRoutingModule } from './travelace-routing.module';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';

import { OrdenPagoReporteComponent } from './orden-pago-reporte/orden-pago-reporte.component';
import { OrdenPagoEditComponent } from './orden-pago/orden-pago-edit/orden-pago-edit.component';
import { notaDebitoFilter } from './nota-debito/filters/nota-debito.pipe';
import { ordenPagoFilter } from './nota-debito/filters/orden-pago-list.pipe';
import { NotaDebitoProfileComponent } from './nota-debito/nota-debito-profile/nota-debito-profile.component';
import { OrdenPagoProfileComponent } from './orden-pago/orden-pago-profile/orden-pago-profile.component';
import { ReporteVentaComponent } from './reporteventa/reporte-venta/reporte-venta.component';
import { ReportProfitCounterComponent } from './report-profit-counter/report-profit-counter.component';
import { ReporteVentasFiltradasComponent } from './reporte-ventas-filtradas/reporte-ventas-filtradas.component';


@NgModule({
  declarations: [NotaDebitoReporteListComponent, NotaDebitoCreateComponent, NotaDebitoListComponent,
    OrdenPagoListComponent, OrdenPagoCreateComponent, CargarExccelNotaDebitoComponent,
    OrdenPagoNotaComponent, OrdenPagoReporteComponent, OrdenPagoEditComponent, notaDebitoFilter, ordenPagoFilter,
    NotaDebitoProfileComponent,
    OrdenPagoProfileComponent,
    ReporteVentaComponent,
    ReportProfitCounterComponent,
    ReporteVentasFiltradasComponent],
  imports: [NzModalModule, NzRadioModule, NzCheckboxModule, NzSpinModule, NzDatePickerModule, NzUploadModule, NzSelectModule, NzAutocompleteModule,
    CommonModule, TravelaceRoutingModule, NzTableModule, NzGridModule, NzFormModule, NzButtonModule
    , FormsModule, ReactiveFormsModule, NzInputModule],
  exports: [NotaDebitoListComponent, OrdenPagoListComponent, NotaDebitoReporteListComponent, OrdenPagoNotaComponent]
})
export class TravelaceModule { }
