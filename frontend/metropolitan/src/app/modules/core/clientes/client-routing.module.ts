import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientListComponent } from './list-clients/client-list.component';
import { ClientCreateComponent } from './create-client/client-create.component';

const routes: Routes = [
  {
    path: '',
    component: ClientListComponent
  },
  {
    path: 'clientCreate',
    component: ClientCreateComponent
  },
  {
    path: 'edit-client/:id',
    component: ClientCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
