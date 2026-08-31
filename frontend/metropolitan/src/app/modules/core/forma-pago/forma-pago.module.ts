import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormaPagoListaComponent } from './forma-pago-lista/forma-pago-lista.component';
import { FormaPagoCreateComponent } from './forma-pago-create/forma-pago-create.component';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzSpinModule } from 'ng-zorro-antd';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { FormaPagoRoutingModule } from './forma-pago-routing.module';

@NgModule({
  declarations: [FormaPagoListaComponent, FormaPagoCreateComponent],
  imports: [
    CommonModule, NzButtonModule, NzFormModule, NzGridModule, NzTableModule, NzSpinModule, NzSelectModule, NzCheckboxModule,
    FormaPagoRoutingModule,
    FormsModule, ReactiveFormsModule
  ]
})
export class FormaPagoModule { }
