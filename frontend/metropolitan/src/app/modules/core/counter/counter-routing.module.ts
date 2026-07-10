import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CounterListComponent } from './counter-list/counter-list.component';
import { CounterCreateComponent } from './counter-create/counter-create.component';

const routes: Routes = [  
  {
    path: '',
    component: CounterListComponent
  },
  {
    path: 'counterList',
    component: CounterListComponent
  },
  {
    path: 'counterCreate',
    component: CounterCreateComponent
  },
  {
    path: 'edit-counter/:id',
    component: CounterCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CounterRoutingModule { }
