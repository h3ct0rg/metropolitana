import { Component, OnInit } from '@angular/core';
import { OrdenPagoService } from '../../../services/orden-pago.services';
import { ListaOrdenPagoPendienteService } from '../../../services/orden-pago-list.services';
import { ordenPagoFilter } from '../../nota-debito/filters/orden-pago-list.pipe';
import { StorageService } from '../../../../../shared/services/local-data/storage.service';
import { SucursalService } from '../../../services/sucursal.services';
import { IStorageKeys } from '../../../../../shared/services/local-data/storage';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'orden-pago-list',
  templateUrl: './orden-pago-list.component.html',
  styleUrls: ['./orden-pago-list.component.css'],
  providers: [ordenPagoFilter]
})
export class OrdenPagoListComponent implements OnInit {
  listOfData = [];
  public listSucursales = [];
  public form: FormGroup;

  public searchText: string;

  constructor(
    private ordenPagoListService: ListaOrdenPagoPendienteService,
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
      }
      else {
        this.form.get("sucursal").setValue(result[0].id);
      }
      this.form.get("sucursal").valueChanges.subscribe(item => {
        this.chargeDataCLient();
      });
      this.chargeDataCLient();
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

  getActualSucursal() {
    const token = this.storage.parse(IStorageKeys.Token);
    return token.sucursal;
  }


  ngOnInit() {
    
  }

  chargeDataCLient() {
    this.ordenPagoListService.getOrdenPagoListPendienteGroupBySucursal(this.form.get("sucursal").value).subscribe((data: []) => {
      this.listOfData = data;
    });
  }

}
