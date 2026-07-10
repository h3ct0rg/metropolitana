import { Component, OnInit } from '@angular/core';
import { SucursalService } from '../../services/sucursal.services';

@Component({
  selector: 'app-sucursal-lista',
  templateUrl: './sucursal-lista.component.html',
  styleUrls: ['./sucursal-lista.component.css']
})
export class SucursalListaComponent implements OnInit {
  listOfData = [];
  waitAction: boolean;

  constructor(
    private sucursalService: SucursalService
  ) {
    this.sucursalService.getSucursalList().subscribe(result => {
      this.listOfData = result;
    });
  }

  ngOnInit() {
    this.chargeDataCLient();
  }
  chargeDataCLient() {
    this.waitAction = true;
    this.waitAction = false;
  }

}
