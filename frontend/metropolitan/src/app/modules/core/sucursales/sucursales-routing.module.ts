import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SucursalCreateComponent } from './sucursal-create/sucursal-create.component';
import { SucursalListaComponent } from './sucursal-lista/sucursal-lista.component';

const routes: Routes = [
  {
    path: '',
    component: SucursalListaComponent
  },
  {
    path: 'sucursalCreate',
    component: SucursalCreateComponent
  },
  {
    path: 'sucursalEdit/:id',
    component: SucursalCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SucursalesRoutingModule { }
