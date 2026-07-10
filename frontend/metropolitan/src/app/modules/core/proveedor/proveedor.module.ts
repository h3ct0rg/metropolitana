import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProveedorListComponent } from './lsit-proveedor/list-proveedor.component';
import { ProveedorRoutingModule } from './proveedor-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button'

import { ProveedorCreateComponent } from './create-proveedor/proveedor-create.component';

@NgModule({
  declarations: [ProveedorListComponent, ProveedorCreateComponent],
  imports: [CommonModule, ProveedorRoutingModule, NzTableModule, NzGridModule, NzFormModule, NzButtonModule
    , FormsModule, ReactiveFormsModule],
  exports: [ProveedorListComponent]
})
export class ProveedorModule { }
