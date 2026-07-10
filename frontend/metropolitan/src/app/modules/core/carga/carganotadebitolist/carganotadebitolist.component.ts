import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { ClientService } from '../../services/clientes.service';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';
import { SucursalService } from '../../services/sucursal.services';
import { FormControl, FormGroup } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { carganotaDebitoFilter } from '../filters/nota-debito.pipe';
import { CargaNotaDebitoService } from '../../services/carga/carga-nota-debito.services';
import { Logs } from '../../../../shared/model/Logs';
import { LogsService } from '../../services/Logs/logs.services';

@Component({
  selector: 'app-carganotadebitolist',
  templateUrl: './carganotadebitolist.component.html',
  styleUrls: ['./carganotadebitolist.component.css'],
  providers: [carganotaDebitoFilter]
})
export class CarganotadebitolistComponent implements OnInit {
  listOfData = [];
  public listSucursales = [];
  public searchText: string;
  public idSearch: string;
  public dateSearch: string;
  public form: FormGroup;
  public isAdmin: boolean = false;
  public waitAction: boolean = true;
  public actualSucursal: string;
  logs: Logs;

  constructor(
    private notaDebitoService: CargaNotaDebitoService,
    private storage: StorageService,
    private clienteServicio: ClientService,
    private usuarioService: UsuarioService,
    private sucursalesService: SucursalService,
    private logService: LogsService
  ) { }

  ngOnInit() {

    this.setUserName();

    this.form = new FormGroup({
      sucursal: new FormControl(null)
    });

    this.getSucursales();
    this.getActualSucursal();
    this.chargeDataCLient();

    this.logs = {
      id: "00000000-0000-0000-0000-000000000000",
      eventShoot: "Filter List Nota Debito",
      fromEvent: "List Nota Debito",
      idSucursal: parseInt(this.actualSucursal),
      itemUsed: "",
      userEvent: this.storage.parse(IStorageKeys.Token)["userId"],
      createDate: "1/1/2020 01:01:00"
    }
    
  }

  getSucursales() {
    this.sucursalesService.getSucursalList().subscribe(result => {
      this.listSucursales = result;
      if (!this.getTokenUserIsAdmin()) {
        this.getActualSucursal();
        this.listSucursales = this.listSucursales.filter(item => item.id == this.actualSucursal);
        this.form.get("sucursal").setValue(this.actualSucursal);
      }
      else {
        this.form.get("sucursal").setValue(result[0].id);
      }
      this.form.get("sucursal").valueChanges.subscribe(item => {        
        this.actualSucursal = item;
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

  onChange($event) {
    this.waitAction = true;
    let actualDate = $event;
    const mon = parseInt(actualDate.getMonth()) + 1;
    let sDateNow = mon + "/" + actualDate.getDate() + "/" + actualDate.getFullYear();
    this.listOfData = [];
    this.clienteServicio.getClientCargaList().subscribe(clientes => {
      this.notaDebitoService.getNotaDebitoBySucursalandDate(this.actualSucursal, sDateNow).subscribe((data: []) => {
        this.listOfData = data;
        this.waitAction = false;
        this.logs.eventShoot = "Select Fecha";
        this.logService.saveLogItemCarga(this.logs).subscribe(success => {
        });
      });
    });
  }

  resetDate() {
    this.waitAction = true;
    this.dateSearch = "";
    this.chargeDataCLient();
    this.logs.eventShoot = "Click sin Fecha";
    this.logService.saveLogItemCarga(this.logs).subscribe(success => {
    });
  }

  filter() {

  }

  chargeDataCLient() {
    this.listOfData = [];
    this.waitAction = true;
    this.clienteServicio.getClientCargaList().subscribe(clientes => {
      this.notaDebitoService.getNotaDebitoBySucursal(this.actualSucursal).subscribe((data: []) => {
        this.listOfData = data;
        this.waitAction = false;
      });
    });

  }

  filterId() {
    if (this.idSearch === null) {
      this.listOfData = [];
      this.chargeDataCLient();
    }
    else {
      this.listOfData = [];
      this.clienteServicio.getClientCargaList().subscribe(clientes => {
        this.notaDebitoService.getNotaDebitoBySucursalAndId(this.actualSucursal, this.idSearch).subscribe((data: []) => {
          this.logs.eventShoot = "click filter";
          this.listOfData = data;
          this.waitAction = false;
          this.logService.saveLogItemCarga(this.logs).subscribe(success => {
          });
        });
      });
    }
  }

  stateTranslate(estado) {
    switch (estado) {
      case 0:
        {
          return "Normal";
        }
      case 1:
        {
          return "Anulado";
        }
      case 2:
        {
          return "Remitido";
        }
    }
  }

  getActualSucursal() {
    const token = this.storage.parse(IStorageKeys.Token);
    this.actualSucursal = token.sucursal;
  }

  setUserName = () => {
    const token = this.storage.parse(IStorageKeys.Token);
    this.usuarioService.getUser(token['userId']).subscribe(item => {
      let listRole = item.idRole;
      listRole.forEach(l => {
        if (l == 1) {
          this.isAdmin = true;
        }
      });
    });
  }
}
