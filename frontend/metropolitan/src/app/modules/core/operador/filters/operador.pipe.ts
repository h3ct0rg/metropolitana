import { Pipe, Injectable, PipeTransform } from '@angular/core';
import { Operador } from '../../../../shared/model/operador';

@Pipe({ name: 'operadorFilter' })
@Injectable()
export class operadorFilter implements PipeTransform {
  transform(lista: Operador[], texto: string): any[] {
    let result = [];
    if (texto != undefined) {
      result = lista.filter(data =>
        data.name.toLowerCase().includes(texto.toLowerCase()));
    }
    else {
      result = lista;
    }

    return result;
  }
}
