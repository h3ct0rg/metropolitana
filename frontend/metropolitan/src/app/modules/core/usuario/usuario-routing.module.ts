import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioListComponent } from './list-usuario/list-usuario.component';
import { UsuarioCreateComponent } from './create-usuario/create-usuario.component';

const routes: Routes = [
  {
    path: '',
    component: UsuarioListComponent
  },
  {
    path: 'usuarioCreate',
    component: UsuarioCreateComponent
  },
  {
    path: 'edit-usuario/:id',
    component: UsuarioCreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
