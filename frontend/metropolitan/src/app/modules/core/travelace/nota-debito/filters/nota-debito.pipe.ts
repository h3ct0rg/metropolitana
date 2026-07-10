import { Pipe, Injectable, PipeTransform } from '@angular/core';
import { NotaDebito, NotaDebitoList } from '../../../../../shared/model/nota-debito';

@Pipe({ name: 'notaDebitoFilter' })
@Injectable()
export class notaDebitoFilter implements PipeTransform {
  transform(lista: NotaDebitoList[], textoB: string): any[] {
    let result = [];
    if (textoB != undefined) {
      result = lista.filter(data =>
        
        data['pasajero'].toLowerCase().includes(textoB.toLowerCase()) ||
        data['codCliente'].toLowerCase().includes(textoB.toLowerCase()) ||
        data['servicio'].toString().toLowerCase().includes(textoB.toLowerCase()) ||
        data['voucher'].toLowerCase().includes(textoB.toLowerCase()) ||
        data['codigoUnico'].toString().includes(textoB.toLowerCase())
      );
    }
    else {
      result = lista;
    }

    return result;
  }
}
