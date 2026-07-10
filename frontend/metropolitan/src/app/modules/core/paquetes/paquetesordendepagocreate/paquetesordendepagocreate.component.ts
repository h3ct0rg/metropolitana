import { Component, OnInit, ViewChild } from '@angular/core';
import { PaquetesordendepagonotaComponent } from '../paquetesordendepagonota/paquetesordendepagonota.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrdenPago } from '../../../../shared/model/orden-pago';
import { PaqueteOrdenPagoService } from '../../services/paquetes/paquete-orden-pago.services';
import { ActivatedRoute, Router } from '@angular/router';
import { PaqueteListaOrdenPagoPendienteService } from '../../services/paquetes/paquete-orden-pago-list.services';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { PaquetesNotaDebitoService } from '../../services/paquetes/paquete-nota-debito.services';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';
import { Guid } from 'guid-typescript';
import { UsuarioService } from '../../services/usuario.service';
import { Logs } from '../../../../shared/model/Logs';
import { LogsService } from '../../services/Logs/logs.services';

@Component({
  selector: 'app-paquetesordendepagocreate',
  templateUrl: './paquetesordendepagocreate.component.html',
  styleUrls: ['./paquetesordendepagocreate.component.css']
})
export class PaquetesordendepagocreateComponent implements OnInit {

  @ViewChild('listPays', { static: false }) childPays: PaquetesordendepagonotaComponent;

  numeroOrdenPagoResult: number;
  listOfData = [];
  listCheck = [];
  optionsMetodoPago = [
    { id: "1", name: "Efectivo" },
    { id: "2", name: "Tarjeta Credito/Debito" },
    { id: "3", name: "Cheque" },
    { id: "4", name: "Cuenta de Banco" },
    { id: "5", name: "WE TRAVEL" },
    { id: "6", name: "LINKSER" }
  ];

  cuentas = [
    { id: "1", name: "BANCO BISA CUENTA 11 EN DOLARES METRO" },
    { id: "2", name: "BANCO BISA CUENTA 19 EN BOLIVIANOS METRO" },
    { id: "3", name: "BANCO GANADERO CUENTA 39 EN DOLARES LILIANA" },
    { id: "4", name: "BANCO NACIONAL CUENTA 73 EN DOLARES METRO" },
    { id: "5", name: "BCP CUENTA 17 EN BOLIVIANOS ANDREA" },
    { id: "6", name: "BCP CUENTA 301 EN BOLIVIANOS ANDREA" },
    { id: "7", name: "GANADERO CUENTA 361 BOLIVIANOS Lilian" },
    { id: "8", name: "BANCO MERCANTIL SANTA CRUZ CUENTA 252 BOLIVIANOS Liliana " },
    { id: "9", name: "BANCO UNION CUENTA 843 BOLIVIANOS Lilian Fiordoliva" },
    { id: "10", name: "BANCO BISA CUENTA 4025 EN BS ANDREA" }
  ]
  public form: FormGroup;
  clienteID: string;
  isEdit = false;
  enablePay = true;
  totalPagar = 0;
  tituloFormaPago = "Efectivo";
  ordenPago: OrdenPago;
  fechaRegistro: string;
  isVisible = false;
  checked = false;
  indeterminate = false;
  disabled = false;
  token: any;
  numeroOrdenPagoID: number;
  public mostrarData: boolean = false;
  public mostrarCuentas: boolean = false;
  logs: Logs;

  constructor(
    private ordenPagoService: PaqueteOrdenPagoService,
    private route: ActivatedRoute,
    private ordenPagoListService: PaqueteListaOrdenPagoPendienteService,
    private router: Router,
    private storage: StorageService,
    private notaDebitoService: PaquetesNotaDebitoService,
    private userService: UsuarioService,
    private logService: LogsService
  ) {
    this.form = new FormGroup({
      fechaRegistro: new FormControl(null, [Validators.required]),
      numeroOrdenPago: new FormControl(),
      montoDolares: new FormControl(null, [Validators.required]),
      montoBs: new FormControl(null, [Validators.required]),
      textMetodoPago: new FormControl(),
      metodoDePago: new FormControl(),
      cuentaBancaria: new FormControl()
    });

    this.form.get("montoDolares").disable({ emitEvent: false, onlySelf: false });
    this.form.get("montoBs").disable({ emitEvent: false, onlySelf: false });
    this.form.get("numeroOrdenPago").disable({ emitEvent: false, onlySelf: false });
  }

  ngOnInit() {
    this.token = this.storage.get(IStorageKeys.Token);

    this.route.paramMap.subscribe(param => {
      let operadorParam = param;
      this.clienteID = operadorParam["params"].id;
      if (this.clienteID) {
        this.isEdit = true;
        this.ordenPagoListService.getOrdenPagoListPendienteByClient(this.clienteID, this.getActualSucursal()).subscribe(data => {
          this.listOfData = data;
        });
      }
    });

    this.form.get("metodoDePago").valueChanges.subscribe(data => {
      if (data > 1 && data < 4) {
        this.mostrarData = true;
      }
      else {
        this.mostrarData = false;
        if (data == 4) {
          this.mostrarCuentas = true;
        }
        else {
          this.mostrarCuentas = false;
        }
      }
      this.tituloFormaPago = this.optionsMetodoPago[data - 1].name;
    });

    this.logs = {
      id: "00000000-0000-0000-0000-000000000000",
      eventShoot: "Click Pagar Orden Pago",
      fromEvent: "Open Ordenes de Pago de Cliente: " + this.clienteID,
      idSucursal: this.getActualSucursal(),
      itemUsed: "",
      userEvent: JSON.parse(this.token)["userId"],
      createDate: "1/1/2020 01:01:00"
    }

    this.logService.saveLogItemPaquetes(this.logs).subscribe(success => {
    });
  }

  check(id, saldo, nordenPago) {
    let result = this.listCheck.find(x => x == id);
    this.numeroOrdenPagoID = nordenPago;

    if (result == undefined) {
      this.listCheck.push(id);
      this.totalPagar += saldo;
      this.totalPagar = parseFloat(this.totalPagar.toFixed(2));
    }
    else {
      this.listCheck = this.listCheck.filter(f => f !== id);
      this.totalPagar -= parseFloat(saldo.toFixed(2));
    }

    if (this.totalPagar != undefined && this.totalPagar > 0) {
      this.enablePay = false;
    }
    else {
      this.enablePay = true;
    }

    this.form.get("montoDolares").disable({ emitEvent: false, onlySelf: false });
    this.form.get("montoBs").disable({ emitEvent: false, onlySelf: false });
    this.form.get("numeroOrdenPago").disable({ emitEvent: false, onlySelf: false });
    this.form.get("montoDolares").setValue(this.totalPagar.toFixed(2));
    this.form.get("montoBs").setValue((this.totalPagar * 6.96).toFixed(2));
  }

  saveNotaVenta() {
    const cuentaBancaria = this.form.get('cuentaBancaria') == null ? "" : this.cuentas.find(item => item.id == this.form.get('cuentaBancaria').value);
    this.ordenPago = {
      anulado: 0,
      concepto: "",
      fechaPago: this.fechaRegistro,
      formaPago: this.form.get("metodoDePago").value,
      formaPagoDescripcion: this.form.get("metodoDePago").value == '1' || this.form.get("metodoDePago").value == '2' || this.form.get("metodoDePago").value == '3' || this.form.get("metodoDePago").value == '5' || this.form.get("metodoDePago").value == '6' ? this.form.get('textMetodoPago').value : cuentaBancaria['name'],
      monedaPago: 1,
      montoAPagar: this.totalPagar,
      numeroNotaDebito: 0,
      numeroPago: 0,
      numeroTarjeta: this.form.get("metodoDePago").value == '4' ? cuentaBancaria['id'] : this.form.get("textMetodoPago").value,
      pagado: true,
      saldoDeudor: 0,
      codProfile: Guid.create().toString(),
      idSucursal: this.getActualSucursal(),
      id: 0,
      createBy: JSON.parse(this.token)["userId"],
      modify: JSON.parse(this.token)["userId"],
      createDate: this.fechaRegistro,
      modifyDate: this.fechaRegistro
    }

    let printList = [];

    this.listCheck.forEach(data => {
      let resultI = this.listOfData.filter(d => { return d.idOrden === data });
      printList.push({
        nombreCliente: resultI[0].idNota,
        fechaPago: this.ordenPago.fechaPago,
        concepto: this.ordenPago.concepto,
        montoAPagar: resultI[0].saldoDeudor
      });

      this.ordenPago.numeroNotaDebito = data;
      this.ordenPago.id = data;
      this.ordenPago.montoAPagar = resultI[0].saldoDeudor;

      this.ordenPagoService.updateOrdenPago(this.ordenPago).subscribe(data => {
        this.ordenPagoService.getOrdenPago(this.ordenPago.id.toString()).subscribe(result => {
          this.childPays.numeroOrdenPago = result.numeroPago.toString();
        });
      });

      this.isVisible = true;
    })

    let tempData = this.ordenPagoService.getOrdenPago(this.listCheck[0]).subscribe(resNumber => {
      this.childPays.listOfData = printList;
      this.childPays.montoPagado = this.totalPagar.toFixed(2);
      this.childPays.nombreCliente = this.listOfData[0].nombreCliente;
      this.childPays.fechaRegistro = this.fechaRegistro;
      this.childPays.formaPagoId = this.ordenPago.formaPago;
      this.userService.getUser(this.ordenPago.createBy.toString()).subscribe(res => {
        this.childPays.nameCreator = res.nombre;
      });

      this.childPays.textConfim(resNumber.id);
    });


  }

  updateDatePayment() {
    let val = this.form.get("fechaRegistro").value;
    this.fechaRegistro = val;
  }

  handleOk(): void {
    this.isVisible = false;
    this.logs.eventShoot = "Click Guardar Pago";
    this.logService.saveLogItemPaquetes(this.logs).subscribe(sucess => {
      this.router.navigate(['/main/paquetes/orden-pago']);
    });
  }

  handleCancel(): void {
    this.isVisible = false;
    this.logs.eventShoot = "Click Cancel Guardar Pago";
    this.logService.saveLogItemPaquetes(this.logs).subscribe(success => { });
  }

  onAllChecked($event) {

  }

  getActualSucursal() {
    const token = this.storage.parse(IStorageKeys.Token);
    return token.sucursal;
  }

}
