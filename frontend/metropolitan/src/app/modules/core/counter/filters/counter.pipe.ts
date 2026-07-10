import { Pipe, Injectable, PipeTransform } from '@angular/core';
import { Counter } from '../../../../shared/model/counter';

@Pipe({ name: 'counterFilter' })
@Injectable()
export class counterFilter implements PipeTransform {
  transform(lista: Counter[], texto: string): any[] {
    let result = [];
    if (texto != undefined) {
      result = lista.filter(data =>
        data.name.toLowerCase().includes(texto.toLowerCase()) ||
        data.nombreCod.toLowerCase().includes(texto.toLowerCase()));
    }
    else {
      result = lista;
    }

    return result;
  }
}
