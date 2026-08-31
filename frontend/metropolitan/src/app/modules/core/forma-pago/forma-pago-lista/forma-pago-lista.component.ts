import { Component, OnInit } from '@angular/core';
import { FormaPagoService } from '../../services/forma-pago.services';

@Component({
  selector: 'app-forma-pago-lista',
  templateUrl: './forma-pago-lista.component.html',
  styleUrls: ['./forma-pago-lista.component.css']
})
export class FormaPagoListaComponent implements OnInit {
  listOfData = [];
  waitAction: boolean;

  constructor(private formaPagoService: FormaPagoService) {
    this.formaPagoService.getFormaPagoList().subscribe(result => {
      this.listOfData = result;
    });
  }

  ngOnInit() { this.chargeData(); }
  chargeData() { this.waitAction = true; this.waitAction = false; }
}
