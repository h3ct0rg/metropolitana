import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProveedorListComponent } from './lsit-proveedor/list-proveedor.component';
import { ProveedorCreateComponent } from './create-proveedor/proveedor-create.component';

const routes: Routes = [
  {
    path: '',
    component: ProveedorListComponent
  },
  {
    path: 'proveedorCreate',
    component: ProveedorCreateComponent
  },
  {
    path: 'edit-proveedor/:id',
    component: ProveedorCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProveedorRoutingModule { }
