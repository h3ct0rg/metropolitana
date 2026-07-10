import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { StorageService } from './../../../shared/services/local-data/storage.service';

@Injectable()
export class FileService extends BaseService<""> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  uploadFile(fileValue: any)
  {
    return this.postFile('/File/uploadFile', fileValue);
  } 
}


 
