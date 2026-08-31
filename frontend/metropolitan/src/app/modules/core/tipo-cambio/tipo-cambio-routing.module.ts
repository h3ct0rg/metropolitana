import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipoCambioConfigComponent } from './tipo-cambio-config/tipo-cambio-config.component';

const routes: Routes = [
  { path: '', component: TipoCambioConfigComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoCambioRoutingModule { }
