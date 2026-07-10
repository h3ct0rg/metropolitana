import { Pipe, Injectable, PipeTransform } from '@angular/core';
import { Cliente } from '../../../../shared/model/cliente';

@Pipe({ name: 'agenciaFilter' })
@Injectable()
export class agenciaFilter implements PipeTransform {
  transform(lista: Cliente[], texto: string): any[] {
    let result = [];
    if (texto != undefined) {
      result = lista.filter(data => data.name.toLowerCase().includes(texto.toLowerCase()));
    }
    else {
      result = lista;
    }

    return result;
  }
}
