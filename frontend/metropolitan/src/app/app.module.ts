import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { LoginComponent } from './modules/security/components/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationService } from './modules/security/services/authentication.services';
import { SecurityModule } from './modules/security/security.module';
import { SharedModule } from './shared/shared.module';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { AppConfigService } from './shared/services/app-config.service';

registerLocaleData(en);

export function initAppConfig(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}

@NgModule({
  declarations: [
    AppComponent, LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SecurityModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    AuthenticationService,
    SecurityModule,
    {
      provide: APP_INITIALIZER,
      useFactory: initAppConfig,
      deps: [AppConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
