import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../../../../shared/services/base.service';
import { Logs } from '../../../../shared/model/Logs';
import { StorageService } from '../../../../shared/services/local-data/storage.service';



@Injectable()
export class LogsService extends BaseService<Logs> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  saveLogItem(localLog: Logs) {
    localLog.fromEvent += " - UniversalAssistance";
    return this.post('/Logs/CreateLog', localLog)
  }

  saveLogItemPaquetes(localLog: Logs) {
    localLog.fromEvent += " - Paquetes";
    return this.post('/Logs/CreateLog', localLog)
  }

  saveLogItemCarga(localLog: Logs) {
    localLog.fromEvent += " - Carga";
    return this.post('/Logs/CreateLog', localLog)
  }

}
