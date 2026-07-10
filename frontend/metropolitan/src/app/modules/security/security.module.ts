import { NgModule } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { AuthenticationService } from './services/authentication.services';
import { SharedModule } from './../../shared/shared.module';
import { NzMessageService } from 'ng-zorro-antd';
//import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';


@NgModule({
  declarations: [],
  exports: [],
  imports: [
    CommonModule,
    RouterModule,
    HttpModule,
    SharedModule
  ],
  providers: [AuthenticationService, JwtHelperService]
})
export class SecurityModule { }
