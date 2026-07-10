import { Component, OnInit, ViewChild } from '@angular/core';
import { OrdenPagoNotaComponent } from '../orden-pago-nota/orden-pago-nota.component';
import { OrdenPagoService } from '../../../services/orden-pago.services';

@Component({
  selector: 'app-orden-pago-profile',
  templateUrl: './orden-pago-profile.component.html',
  styleUrls: ['./orden-pago-profile.component.css']
})
export class OrdenPagoProfileComponent implements OnInit {

  @ViewChild('listPays', { static: false }) childPays: OrdenPagoNotaComponent;

  constructor(
    private ordenPagoService: OrdenPagoService
  ) {
  }

  ngOnInit() {
  }

}
