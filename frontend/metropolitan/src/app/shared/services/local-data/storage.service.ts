import { Injectable, InjectionToken, Inject } from '@angular/core';

export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => sessionStorage
});

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(@Inject(BROWSER_STORAGE) public storage: Storage) { }
  get = (key: string) => {
    return this.storage.getItem(key);
  }
  set = (key: string, value: string) => {
    this.storage.setItem(key, value);
  }
  remove = (key: string) => {
    this.storage.removeItem(key);
  }
  clear = () => {
    this.storage.clear();
  }
  parse = (name: string) => {
    return JSON.parse(this.get(name));
  }
  parseByValue = (value: string) => {
    return JSON.parse(value);
  }
  stringify = (value: any) => {
    return JSON.stringify(value);
  }
}
