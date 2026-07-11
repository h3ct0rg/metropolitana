import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseService } from '../../../shared/services/base.service';
import { StorageService } from '../../../shared/services/local-data/storage.service';

@Injectable()
export class DashboardActivityService extends BaseService<any> {

  constructor(protected httpClient: HttpClient, protected storageService: StorageService) {
    super(httpClient, storageService);
  }

  private fmt(date: Date): string {
    return date.toISOString();
  }

  getSummary(): Observable<any> {
    return this.get(`/DashboardActivity/Summary`);
  }

  getNotesByUser(idSucursal: number, start: Date, end: Date, top: number = 10): Observable<any> {
    return this.get(`/DashboardActivity/NotesByUser?idSucursal=${idSucursal}&start=${this.fmt(start)}&end=${this.fmt(end)}&top=${top}`);
  }

  getDailyActivity(dias: number = 30): Observable<any> {
    return this.get(`/DashboardActivity/DailyActivity?dias=${dias}`);
  }

  getActivityByBranch(start: Date, end: Date): Observable<any> {
    return this.get(`/DashboardActivity/ActivityByBranch?start=${this.fmt(start)}&end=${this.fmt(end)}`);
  }

  getRecentEvents(top: number = 50): Observable<any> {
    return this.get(`/DashboardActivity/RecentEvents?top=${top}`);
  }

  getEventTypeDistribution(start: Date, end: Date): Observable<any> {
    return this.get(`/DashboardActivity/EventTypeDistribution?start=${this.fmt(start)}&end=${this.fmt(end)}`);
  }
}
