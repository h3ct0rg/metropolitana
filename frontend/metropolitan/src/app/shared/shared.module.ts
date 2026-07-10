import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ApolloModule } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { FilterService } from './services/ui/filter.service';
import { FilterApiService } from './services/api/filter-api.service';
import { InterpolateValuesPipe } from './services/ui/pipes/interpolate-values.pipe';
import { GraphqlClientService } from './services/graphql-client.service';
import { FilterGqlService } from './services/api/graphql/filter-gql.service';
import { GenericFormFieldService } from './services/ui/generic-form-field.service';
import { ConvertService } from './services/utility/convert.service';
import { ImageGalleryComponent } from './../modules/security/components/image-gallery/image-gallery.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { LogsService } from '../modules/core/services/Logs/logs.services';


@NgModule({
  declarations: [
    ImageGalleryComponent,
    InterpolateValuesPipe
  ],
  entryComponents: [
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    NzTableModule,
    NzGridModule
  ],
  exports: [
    InterpolateValuesPipe,
    ImageGalleryComponent
  ],
  providers: [
    GraphqlClientService,
    GenericFormFieldService,
    FilterService,
    FilterApiService,
    FilterGqlService,
    ConvertService,
    LogsService
  ]
})

export class SharedModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
