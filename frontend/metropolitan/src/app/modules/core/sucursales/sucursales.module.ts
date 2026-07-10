import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SucursalListaComponent } from './sucursal-lista/sucursal-lista.component';
import { SucursalCreateComponent } from './sucursal-create/sucursal-create.component';


import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzSpinModule } from 'ng-zorro-antd';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { SucursalesRoutingModule } from './sucursales-routing.module';



@NgModule({
  declarations: [SucursalListaComponent, SucursalCreateComponent],
  imports: [
    CommonModule, NzButtonModule, NzFormModule, NzGridModule, NzTableModule, NzSpinModule, NzSelectModule,
    SucursalesRoutingModule,
    FormsModule, ReactiveFormsModule
  ]
})
export class SucursalesModule { }
