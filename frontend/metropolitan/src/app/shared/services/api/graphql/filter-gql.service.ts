import { Injectable } from '@angular/core';
import { GqlBase } from '../../gql-base';
import { GraphqlClientService } from '../../graphql-client.service';
import { IFilterPresetFormat } from '../../ui/filter';

@Injectable()
export class FilterGqlService extends GqlBase<any> {

  constructor(protected graphQlClientService: GraphqlClientService) {
    super(graphQlClientService);
  }
  savePresetFilter = (preset: IFilterPresetFormat) => {
    // TODO call a real API
    
  }
  getPresetFilter = (id: string) => {
    // TODO call a real API
    
  }
}
