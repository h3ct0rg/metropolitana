import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperadorListComponent } from './operador-list/operador-list.component';
import { OperadorCreateComponent } from './operador-create/operador-create.component';

const routes: Routes = [
  {
    path: '',
    component: OperadorListComponent
  },
  {
    path: 'operadorCreate',
    component: OperadorCreateComponent
  },
  {
    path: 'edit-operador/:id',
    component: OperadorCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperadorRoutingModule { }
