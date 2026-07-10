import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UsuarioListComponent } from './list-usuario/list-usuario.component';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';


import { UsuarioCreateComponent } from './create-usuario/create-usuario.component';

@NgModule({
  declarations: [UsuarioListComponent, UsuarioCreateComponent],
  imports: [CommonModule, UsuarioRoutingModule, NzTableModule, NzGridModule, NzFormModule, NzButtonModule
    , FormsModule, ReactiveFormsModule, NzSelectModule],
  exports: [UsuarioListComponent]
})
export class UsuarioModule { }
