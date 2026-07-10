import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ILocationOption } from './../../../../shared/model/usertenant';

@Injectable({
  providedIn: 'root'
})
export class CoreUiService {
  languageList$: BehaviorSubject<ILocationOption[]> = new BehaviorSubject([]);
  showSettingsMenu$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }
  private removeDuplicates = (property: string, data: any[]) => {
    return data.filter((item, index, arr) => {
      return arr.findIndex(el => el[property] === item[property]) === index;
    });
  }

  private removeDuplicateTenantsLocales = (data: ILocationOption[]) => {
    return this.removeDuplicates('locale', data);
  }
}
