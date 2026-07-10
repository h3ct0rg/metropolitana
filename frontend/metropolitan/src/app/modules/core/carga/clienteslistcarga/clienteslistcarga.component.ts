import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/clientes.service';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';

@Component({
  selector: 'app-clienteslistcarga',
  templateUrl: './clienteslistcarga.component.html',
  styleUrls: ['./clienteslistcarga.component.css']
})
export class ClienteslistcargasComponent implements OnInit {
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
    this.clienteService.getClientCargaBySucursal(this.getActualSucursal()).subscribe((data: []) => {
      this.listOfData = data;
      this.waitAction = false;
    });
  }

  getActualSucursal() {
    const token = this.storageService.parse(IStorageKeys.Token);
    return token.sucursal;
  }

  deleteClient(idElement) {
    this.clienteService.deleteClientCargaItem(idElement).subscribe(result => {
      this.chargeDataCLient();
    });
  }
}
