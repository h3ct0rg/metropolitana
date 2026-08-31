import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlujoCajaReportComponent } from './flujo-caja-report/flujo-caja-report.component';

const routes: Routes = [
  { path: '', component: FlujoCajaReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlujoCajaRoutingModule { }
