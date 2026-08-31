import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TipoCambioConfigComponent } from './tipo-cambio-config/tipo-cambio-config.component';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzSpinModule } from 'ng-zorro-antd';

import { TipoCambioRoutingModule } from './tipo-cambio-routing.module';

@NgModule({
  declarations: [TipoCambioConfigComponent],
  imports: [
    CommonModule, NzButtonModule, NzFormModule, NzGridModule, NzTableModule, NzSpinModule,
    TipoCambioRoutingModule,
    FormsModule, ReactiveFormsModule
  ]
})
export class TipoCambioModule { }
