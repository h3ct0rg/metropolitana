import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClientListComponent } from './list-clients/client-list.component';
import { ClientRoutingModule } from './client-routing.module';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button'

import { ClientCreateComponent } from './create-client/client-create.component';
import { agenciaFilter } from './filters/cliente.pipe';
import { NzSpinModule } from 'ng-zorro-antd';

@NgModule({
  declarations: [ClientListComponent, ClientCreateComponent, agenciaFilter],
  imports: [CommonModule, ClientRoutingModule, NzSpinModule, NzTableModule, NzGridModule, NzFormModule, NzButtonModule
    , FormsModule, ReactiveFormsModule, NzSelectModule],
  exports: [ClientListComponent]
})
export class ClientModule { }
