import { Component, OnInit } from '@angular/core';
import { cargaOrdenPagoFilter } from '../filters/orden-pago-list.pipe';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { SucursalService } from '../../services/sucursal.services';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';
import { FormGroup, FormControl } from '@angular/forms';
import { CargaListaOrdenPagoPendienteService } from '../../services/carga/carga-orden-pago-list.services';

@Component({
  selector: 'app-cargaordendepagolist',
  templateUrl: './cargaordendepagolist.component.html',
  styleUrls: ['./cargaordendepagolist.component.css'],
  providers: [cargaOrdenPagoFilter]
})
export class CargaordendepagolistComponent implements OnInit {
  listOfData = [];
  public listSucursales = [];
  public form: FormGroup;
  public searchText: string;

  constructor(
    private ordenPagoListService: CargaListaOrdenPagoPendienteService,
    private storage: StorageService,
    private sucursalesService: SucursalService
  ) {

    this.form = new FormGroup({
      sucursal: new FormControl(null)
    });

    this.sucursalesService.getSucursalList().subscribe(result => {
      this.listSucursales = result;
      if (!this.getTokenUserIsAdmin()) {
        this.listSucursales = this.listSucursales.filter(item => item.id == this.getActualSucursal());
        this.form.get("sucursal").setValue(this.getActualSucursal());
        this.chargeDataCLient();
      }
      else {
        this.form.get("sucursal").setValue(result[0].id);
        this.chargeDataCLient();
      }
      this.form.get("sucursal").valueChanges.subscribe(item => {
        this.chargeDataCLient();
      });

      
    });
  }

  getTokenUserIsAdmin() {
    const token = this.storage.parse(IStorageKeys.Token);
    let userType = token['userType'];
    let arrayUserType = userType.split(',');
    if (arrayUserType.includes("1")) {
      return true;
    }
    else {
      return false;
    }
  }

  ngOnInit() {
    //this.chargeDataCLient();
  }

  getActualSucursal() {
    const token = this.storage.parse(IStorageKeys.Token);
    return token.sucursal;
  }

  chargeDataCLient() {
    this.ordenPagoListService.getOrdenPagoListPendienteGroupBySucursal(this.form.get("sucursal").value).subscribe((data: []) => {
      this.listOfData = data;
    });
  }

}
