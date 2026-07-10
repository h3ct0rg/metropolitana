import { Component, OnInit } from '@angular/core';
import { OperadorService } from '../../services/operador.services';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';
import { StorageService } from '../../../../shared/services/local-data/storage.service';

@Component({
  selector: 'operador-list',
  templateUrl: './operador-list.component.html',
  styleUrls: ['./operador-list.component.css']
})
export class OperadorListComponent implements OnInit {
  listOfData: any[];
  public buscarOperador: string;

  constructor(
    private operadorService: OperadorService,
    private storageService: StorageService
  ) {

  }

  ngOnInit() {
    this.chargeDataCLient();
  }
  chargeDataCLient() {
    this.operadorService.getOperadorBySucursal(this.getActualSucursal()).subscribe(result => {
      this.listOfData = result;
    });
  }

  getActualSucursal() {
    const token = this.storageService.parse(IStorageKeys.Token);
    return token.sucursal;
  }

  deleteOperator(idOperator) {
    this.operadorService.deleteOperadorItem(idOperator).subscribe(resut => {
      this.chargeDataCLient();
    });
  }

}
