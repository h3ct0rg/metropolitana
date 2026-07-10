import { Component, OnInit } from '@angular/core';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';
import { OperadorService } from '../../services/operador.services';
import { StorageService } from '../../../../shared/services/local-data/storage.service';

@Component({
  selector: 'app-proveedoreslistcarga',
  templateUrl: './proveedoreslistcarga.component.html',
  styleUrls: ['./proveedoreslistcarga.component.css']
})
export class ProveedoreslistcargaComponent implements OnInit {
  listOfData: any[];
  public buscarOperador: string;

  constructor(
    private operadorService: OperadorService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.chargeDataCLient();
  }

  chargeDataCLient() {
    this.operadorService.getOperadorBySucursalCarga(this.getActualSucursal()).subscribe(result => {
      this.listOfData = result;
    });
  }

  getActualSucursal() {
    const token = this.storageService.parse(IStorageKeys.Token);
    return token.sucursal;
  }

  deleteOperator(idOperator) {
    this.operadorService.deleteOperadorCargaItem(idOperator).subscribe(resut => {
      this.chargeDataCLient();
    });
  }

}
