import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CuentaBancariaCreateComponent } from './cuenta-bancaria-create/cuenta-bancaria-create.component';
import { CuentaBancariaListaComponent } from './cuenta-bancaria-lista/cuenta-bancaria-lista.component';

const routes: Routes = [
  { path: '', component: CuentaBancariaListaComponent },
  { path: 'cuentaBancariaCreate', component: CuentaBancariaCreateComponent },
  { path: 'cuentaBancariaEdit/:id', component: CuentaBancariaCreateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentaBancariaRoutingModule { }
