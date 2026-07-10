import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/clientes.service';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';

@Component({
  selector: 'app-clienteslistpaquetes',
  templateUrl: './clienteslistpaquetes.component.html',
  styleUrls: ['./clienteslistpaquetes.component.css']
})
export class ClienteslistpaquetesComponent implements OnInit {
  listOfData = [];
  waitAction: boolean;
  public searchText: string;

  constructor(
    private clienteService: ClientService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.chargeDataCLient();
  }

  chargeDataCLient() {
    this.waitAction = true;
    this.clienteService.getClientPaquetesBySucursal(this.getActualSucursal()).subscribe((data: []) => {
      this.listOfData = data;
      this.waitAction = false;
    });
  }

  getActualSucursal() {
    const token = this.storageService.parse(IStorageKeys.Token);
    return token.sucursal;
  }

  deleteClient(idElement) {
    this.clienteService.deleteClientPaquetesItem(idElement).subscribe(result => {
      this.chargeDataCLient();
    });
  }
}
