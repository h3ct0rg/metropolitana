import { Component, OnInit } from '@angular/core';
import { CuentaBancariaService } from '../../services/cuenta-bancaria.services';

@Component({
  selector: 'app-cuenta-bancaria-lista',
  templateUrl: './cuenta-bancaria-lista.component.html',
  styleUrls: ['./cuenta-bancaria-lista.component.css']
})
export class CuentaBancariaListaComponent implements OnInit {
  listOfData = [];
  waitAction: boolean;

  constructor(private cuentaBancariaService: CuentaBancariaService) {
    this.cuentaBancariaService.getCuentaBancariaList().subscribe(result => {
      this.listOfData = result;
    });
  }

  ngOnInit() { this.chargeData(); }
  chargeData() { this.waitAction = true; this.waitAction = false; }
}
