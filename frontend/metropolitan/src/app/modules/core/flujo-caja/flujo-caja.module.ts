import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlujoCajaReportComponent } from './flujo-caja-report/flujo-caja-report.component';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzSpinModule } from 'ng-zorro-antd';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { FlujoCajaRoutingModule } from './flujo-caja-routing.module';

@NgModule({
  declarations: [FlujoCajaReportComponent],
  imports: [
    CommonModule, NzButtonModule, NzFormModule, NzGridModule, NzTableModule, NzSpinModule, NzDatePickerModule, NzSelectModule,
    FlujoCajaRoutingModule,
    FormsModule, ReactiveFormsModule
  ]
})
export class FlujoCajaModule { }
