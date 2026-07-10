import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './../security/services/authentication.guardian';
import { LayoutComponent } from './components/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '', // By default the router will fall back to the main dashboard
        loadChildren: () => import('../dashboards/dashboards.module').then(m => m.DashboardsModule)
      },
      {
        path: 'clients',
        loadChildren: () => import('./clientes/client.module').then(m => m.ClientModule)
      },
      {
        path: 'paquetes',
        loadChildren: () => import('./paquetes/paquetes.module').then(m => m.PaquetesModule)
      },
      {
        path: 'carga',
        loadChildren: () => import('./carga/carga.module').then(m => m.CargaModule)
      },
      {
        path: 'proveedor',
        loadChildren: () => import('./proveedor/proveedor.module').then(m => m.ProveedorModule)
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule)
      },
      {
        path: 'travelace',
        loadChildren: () => import('./travelace/travelace.module').then(m => m.TravelaceModule)
      },
      {
        path: 'operador',
        loadChildren: () => import('./operador/operador.module').then(m => m.OperadorModule)
      },
      {
        path: 'sucursales',
        loadChildren: () => import('./sucursales/sucursales.module').then(m => m.SucursalesModule)
      },
      {
        path: 'counter',
        loadChildren: () => import('./counter/counter.module').then(m => m.CounterModule)
      }],
    canActivate: [AuthGuardService],
    data: { roles: ['web.access'] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
