import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { IFilterPresetFormat } from '../ui/filter';
import { StorageService } from '../local-data/storage.service';

@Injectable()
export class FilterApiService extends BaseService<any> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }
  savePresetFilter = (preset: IFilterPresetFormat) => {
    // TODO call a real API
    
  }
  getPresetFilter = (id: string) => {
    // TODO call a real API
    
  }
}
