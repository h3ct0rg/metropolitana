import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { LayoutComponent } from './components/layout/layout.component';
import { CoreRoutingModule } from './core-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { LanguageSelectorComponent } from './components/language/language-selector.component';
import { SharedModule } from './../../shared/shared.module';
import { SecurityModule } from '../security/security.module';
import { AuthGuardService } from './../security/services/authentication.guardian';
import { JwtModule } from '@auth0/angular-jwt';
import { ClientService } from './services/clientes.service';
import { ProveedorService } from './services/proveedor.services';
import { UsuarioService } from './services/usuario.service';
import { CounterService } from './services/counter.services';
import { NotaDebitoService } from './services/nota-debito.services';
import { OrdenPagoService } from './services/orden-pago.services';
import { OperadorService } from './services/operador.services';
import { FileService } from './services/file.services';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NotaDebitoCalculateService } from './services/nota-debito-calculate.services';
import { ListaOrdenPagoPendienteService } from './services/orden-pago-list.services';
import { ListaOrdenPagoReportService } from './services/orden-pago-list-report.services';
import { StorageService } from '../../shared/services/local-data/storage.service';
import { SucursalService } from './services/sucursal.services';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { FormaPagoService } from './services/forma-pago.services';
import { CuentaBancariaService } from './services/cuenta-bancaria.services';
import { TipoCambioService } from './services/tipo-cambio.services';
import { FlujoCajaService } from './services/flujo-caja.services';


@NgModule({
  declarations: [LayoutComponent, LanguageSelectorComponent],
  imports: [
    CoreRoutingModule,
    NgZorroAntdModule,
    CommonModule,
    FormsModule,
    SharedModule,
    SecurityModule,
    NzGridModule,
    NzAvatarModule
  ],
  exports: [LayoutComponent, TranslateModule, LanguageSelectorComponent],
  providers: [NotaDebitoCalculateService,
    FileService,
    OrdenPagoService,
    ListaOrdenPagoPendienteService,
    OperadorService, NotaDebitoService, CounterService, ClientService,
    ProveedorService, AuthGuardService, JwtModule, UsuarioService,
    ListaOrdenPagoReportService, StorageService, SucursalService,
    FormaPagoService, CuentaBancariaService, TipoCambioService, FlujoCajaService]
})
export class CoreModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
