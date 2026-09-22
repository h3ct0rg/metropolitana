import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// Carga assets/env.json una sola vez, antes de que arranque el resto de la app
// (ver el APP_INITIALIZER en app.module.ts). Ese archivo se copia tal cual al
// build (no lo procesa TypeScript/webpack), así que se puede reemplazar después
// de compilar -- por ejemplo desde el entrypoint de un contenedor Docker -- sin
// tener que volver a correr `ng build`.
@Injectable({ providedIn: 'root' })
export class AppConfigService {
  static baseUrlApi: string = environment.baseUrlApi;

  constructor(private http: HttpClient) { }

  load(): Promise<void> {
    return this.http.get<{ baseUrlApi: string }>('assets/env.json')
      .toPromise()
      .then(config => {
        if (config && config.baseUrlApi) {
          AppConfigService.baseUrlApi = config.baseUrlApi;
        }
      })
      .catch(() => {
        // Si falta env.json o no carga, se sigue usando el fallback de environment.ts.
      });
  }
}
