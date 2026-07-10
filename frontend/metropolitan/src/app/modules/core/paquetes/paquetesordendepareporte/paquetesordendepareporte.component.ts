import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PaqueteListaOrdenPagoReportService } from '../../services/paquetes/paquete-orden-pago-list-report.services';
import { ClientService } from '../../services/clientes.service';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';
import { SucursalService } from '../../services/sucursal.services';

@Component({
  selector: 'app-paquetesordendepareporte',
  templateUrl: './paquetesordendepareporte.component.html',
  styleUrls: ['./paquetesordendepareporte.component.css']
})
export class PaquetesordendepareporteComponent implements OnInit {
  form: FormGroup;
  disabled = true;
  pagados = false;
  listOfData = [];
  listClient = [];
  public listSucursales = [];
  public actualSucursal = 1;
  isVisible = false;
  public isSpinning = true;

  constructor(
    private listReportOrdenPago: PaqueteListaOrdenPagoReportService,
    private clienteService: ClientService,
    private storage: StorageService,
    private sucursalesService: SucursalService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      isCheckedAll: new FormControl(),
      radioValue: new FormControl(),
      codigoOrdenPago: new FormControl(),
      sucursal: new FormControl(null)
    });

    this.actualSucursal = this.getActualSucursal();

    this.sucursalesService.getSucursalList().subscribe(result => {
      this.listSucursales = result;

      if (!this.getTokenUserIsAdmin()) {
        console.log("entre aca")
        this.listSucursales = this.listSucursales.filter(item => item.id == this.getActualSucursal());
        this.form.get("sucursal").setValue(this.getActualSucursal());
      }
      else {
        console.log("es admin")
        this.form.get("sucursal").setValue(result[0].id);
      }

      this.form.get("sucursal").valueChanges.subscribe(item => {
        this.actualSucursal = item;
        this.listOfData = [];
        this.isSpinning = true;
        console.log(this.actualSucursal);
        this.loadGridOrdenPago(this.actualSucursal);
      });

      this.form.get("radioValue").setValue("1");

      this.form.get("codigoOrdenPago").valueChanges.subscribe(result => {
        console.log(this.actualSucursal);
        this.loadGridOrdenPago(this.actualSucursal);
      });
    })
  }

  chargeDataCLient() {
    this.listReportOrdenPago.getOrdenPagoListReport("1", this.form.get("sucursal").value, "-1").subscribe((data: []) => {
      this.listOfData = data;
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

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  onPrint() {
    window.print();
  }

  updateCheckClientes() {
    this.disabled = !this.disabled;
  }

  updateCheckVariable() {
    this.actualSucursal = this.getActualSucursal()
    let valorFiltro = this.form.get("radioValue").value;
    this.loadGridOrdenPago(valorFiltro);
  }

  loadGridOrdenPago(filtro) {
    console.log("2");
    let codOrdenPago: string = this.form.get("codigoOrdenPago").value;
    if (codOrdenPago == null || codOrdenPago.length < 1) {
      codOrdenPago = "-1";
    }
    this.listReportOrdenPago.getOrdenPagoListReport(filtro, this.actualSucursal, codOrdenPago).subscribe(data => {
      this.listOfData = data;

      this.listOfData.forEach(ordenItem => {
        if (ordenItem['pagado']) {
          ordenItem['estadoPago'] = "Pagado";
        }
        else {
          ordenItem['estadoPago'] = "No Pagado";
        }
        switch (ordenItem["anulado"]) {
          case 0:
            {
              ordenItem["estadoAnulado"] = "Habilitado";
              break;
            }
          case 1:
            {
              ordenItem["estadoAnulado"] = "Anulado";
              break;
            }
          case 2:
            {
              ordenItem["estadoAnulado"] = "Remitido";
              break;
            }
          default:
        }
        ordenItem["fechaPago"] = ordenItem["fechaPago"];
      });
      this.isSpinning = false;
    })
  }

  getActualSucursal() {
    const token = this.storage.parse(IStorageKeys.Token);
    return token.sucursal;
  }

  getTime(theTime) {
    var d = new Date(theTime);
    let hora = d.getDate() + " / " + (d.getMonth() + 1) + " / " + d.getFullYear();
    return hora;
  }

}
