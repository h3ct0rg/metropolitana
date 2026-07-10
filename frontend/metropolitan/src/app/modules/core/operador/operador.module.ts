import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OperadorListComponent } from './operador-list/operador-list.component';
import { OperadorRoutingModule } from './operador-routing.module';
import { OperadorCreateComponent } from './operador-create/operador-create.component';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button'
import { NzSelectModule } from 'ng-zorro-antd/select';
import { operadorFilter } from './filters/operador.pipe';

@NgModule({
  declarations: [OperadorListComponent, OperadorCreateComponent, operadorFilter],
  imports: [CommonModule, OperadorRoutingModule, NzTableModule, NzGridModule, NzFormModule, NzButtonModule
    , FormsModule, ReactiveFormsModule, NzSelectModule],
  exports: [OperadorListComponent]
})
export class OperadorModule { }
