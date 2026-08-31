import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormaPagoCreateComponent } from './forma-pago-create/forma-pago-create.component';
import { FormaPagoListaComponent } from './forma-pago-lista/forma-pago-lista.component';

const routes: Routes = [
  { path: '', component: FormaPagoListaComponent },
  { path: 'formaPagoCreate', component: FormaPagoCreateComponent },
  { path: 'formaPagoEdit/:id', component: FormaPagoCreateComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormaPagoRoutingModule { }
