import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { StorageService } from './../../../shared/services/local-data/storage.service';
import { NotaDebitoCalculate } from '../../../shared/model/nota-debito-calculate';

@Injectable()
export class NotaDebitoCalculateService extends BaseService<NotaDebitoCalculate> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  getNotaDebitoCalculate(notacalculate: NotaDebitoCalculate) {
    return this.post('/NotaDebitoTravel/CalcularNotaDebito', notacalculate) as Observable<NotaDebitoCalculate>;
  }
  
}
