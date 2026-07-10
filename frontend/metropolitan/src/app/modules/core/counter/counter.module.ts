import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CounterListComponent } from './counter-list/counter-list.component';
import { CounterRoutingModule } from './counter-routing.module';
import { CounterCreateComponent } from './counter-create/counter-create.component';


import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { counterFilter } from './filters/counter.pipe';
import { NzSpinModule } from 'ng-zorro-antd';
import { NzTransferModule } from 'ng-zorro-antd/transfer';





@NgModule({
  declarations: [CounterListComponent, CounterCreateComponent, counterFilter],
  imports: [NzSelectModule, NzAutocompleteModule, NzSpinModule, CommonModule,
    NzTableModule, NzGridModule, NzFormModule, NzButtonModule, NzTransferModule
    , FormsModule, ReactiveFormsModule, CounterRoutingModule],
  exports: [CounterListComponent]
})
export class CounterModule { }
