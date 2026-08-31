import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CuentaBancariaListaComponent } from './cuenta-bancaria-lista/cuenta-bancaria-lista.component';
import { CuentaBancariaCreateComponent } from './cuenta-bancaria-create/cuenta-bancaria-create.component';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzSpinModule } from 'ng-zorro-antd';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { CuentaBancariaRoutingModule } from './cuenta-bancaria-routing.module';

@NgModule({
  declarations: [CuentaBancariaListaComponent, CuentaBancariaCreateComponent],
  imports: [
    CommonModule, NzButtonModule, NzFormModule, NzGridModule, NzTableModule, NzSpinModule, NzSelectModule, NzCheckboxModule,
    CuentaBancariaRoutingModule,
    FormsModule, ReactiveFormsModule
  ]
})
export class CuentaBancariaModule { }
