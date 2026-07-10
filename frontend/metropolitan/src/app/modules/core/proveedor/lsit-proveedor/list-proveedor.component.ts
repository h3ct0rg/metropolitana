import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../../services/proveedor.services';

@Component({
  selector: 'client-list',
  templateUrl: './list-proveedor.component.html',
  styleUrls: ['./list-proveedor.component.css']
})
export class ProveedorListComponent implements OnInit {
  listOfData = [];

  constructor(private proveedorService: ProveedorService) {

  }

  ngOnInit() {
    this.chargeDataCLient();
  }
  chargeDataCLient() {
    this.proveedorService.getProveedorList().subscribe((data: []) => {
      this.listOfData = data;
    });
  }

}
