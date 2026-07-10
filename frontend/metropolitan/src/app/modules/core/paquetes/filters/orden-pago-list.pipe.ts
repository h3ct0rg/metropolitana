import { Pipe, Injectable, PipeTransform } from '@angular/core';
import { OrdenPago } from '../../../../shared/model/orden-pago';

@Pipe({ name: 'ordenPagoFilter' })
@Injectable()
export class paqueteOrdenPagoFilter implements PipeTransform {
  transform(lista: OrdenPago[], textoB: string): any[] {
    let result = [];
    if (textoB != undefined) {
      result = lista.filter(data =>
        data['nombreCliente'].toLowerCase().includes(textoB.toLowerCase())        
      );
    }
    else {
      result = lista;
    }

    return result;
  }
}
