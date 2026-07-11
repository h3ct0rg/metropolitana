import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { ClientService } from '../../services/clientes.service';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';
import { PaquetesNotaDebitoService } from '../../services/paquetes/paquete-nota-debito.services';
import { SucursalService } from '../../services/sucursal.services';
import { FormControl, FormGroup } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Logs } from '../../../../shared/model/Logs';
import { LogsService } from '../../services/Logs/logs.services';

@Component({
  selector: 'app-paquetesnotadebitolist',
  templateUrl: './paquetesnotadebitolist.component.html',
  styleUrls: ['./paquetesnotadebitolist.component.css']
})
export class PaquetesnotadebitolistComponent implements OnInit {
  listOfData = [];
  public listSucursales = [];
  public searchText: string;
  public idSearch: string;
  public dateSearch: string;
  public pageIndex: number = 1;
  public pageSize: number = 20;
  public total: number = 0;
  public form: FormGroup;
  public isAdmin: boolean = false;
  public waitAction: boolean = true;
  public actualSucursal: string;
  logs: Logs;

  constructor(
    private notaDebitoService: PaquetesNotaDebitoService,
    private storage: StorageService,
    private clienteServicio: ClientService,
    private usuarioService: UsuarioService,
    private sucursalesService: SucursalService,
    private logsService: LogsService
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
        this.pageIndex = 1;
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
    this.clienteServicio.getClientPaqueteList().subscribe(clientes => {
      this.notaDebitoService.getNotaDebitoBySucursalandDate(this.actualSucursal, sDateNow).subscribe((data: []) => {
        this.listOfData = data;
        this.pageIndex = 1;
        this.total = data.length;
        this.waitAction = false;
      });
    });
  }

  resetDate() {
    this.waitAction = true;
    this.dateSearch = "";
    this.pageIndex = 1;
    this.chargeDataCLient();
  }

  filter() {
    this.waitAction = true;
    this.pageIndex = 1;
    this.chargeDataCLient();
  }

  chargeDataCLient() {
    this.listOfData = [];
    this.waitAction = true;
    this.clienteServicio.getClientPaqueteList().subscribe(clientes => {
      this.notaDebitoService.getNotaDebitoBySucursal(this.actualSucursal, this.pageIndex, this.pageSize, this.searchText).subscribe((result: any) => {
        this.listOfData = result.data;
        this.total = result.total;
        this.waitAction = false;
      });
    });

  }

  onPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.chargeDataCLient();
  }

  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.chargeDataCLient();
  }

  filterId() {
    if (this.idSearch === null) {
      this.listOfData = [];
      this.pageIndex = 1;
      this.chargeDataCLient();
    }
    else {
      this.listOfData = [];
      this.clienteServicio.getClientPaqueteList().subscribe(clientes => {
        this.notaDebitoService.getNotaDebitoBySucursalAndId(this.actualSucursal, this.idSearch).subscribe((data: []) => {
          this.logs.eventShoot = "click filter";
          this.listOfData = data;
          this.pageIndex = 1;
          this.total = data.length;
          this.waitAction = false;
          this.logsService.saveLogItemPaquetes(this.logs).subscribe(success => {
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
