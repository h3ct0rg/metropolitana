import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/clientes.service';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';
import { subscribe } from 'graphql';

@Component({
  selector: 'client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  listOfData = [];
  waitAction: boolean;
  public searchText: string;

  constructor(
    private clienteService: ClientService,
    private storageService: StorageService
  ) {

  }

  ngOnInit() {
    this.chargeDataCLient();
  }
  chargeDataCLient() {
    this.waitAction = true;
    this.clienteService.getClientBySucursal(this.getActualSucursal()).subscribe((data: []) => {
      this.listOfData = data;
      this.waitAction = false;
    });
  }

  getActualSucursal() {
    const token = this.storageService.parse(IStorageKeys.Token);
    return token.sucursal;
  }

  deleteClient(idElement) {
    this.clienteService.deleteClientItem(idElement).subscribe(result => {
      this.chargeDataCLient();
    });
  }

}
