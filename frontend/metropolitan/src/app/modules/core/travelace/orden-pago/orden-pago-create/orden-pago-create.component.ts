import { Component, OnInit, ViewChild } from '@angular/core';
import { OrdenPagoService } from '../../../services/orden-pago.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListaOrdenPagoPendienteService } from '../../../services/orden-pago-list.services';
import { OrdenPago } from '../../../../../shared/model/orden-pago';
import { OrdenPagoNotaComponent } from '../orden-pago-nota/orden-pago-nota.component';
import { IStorageKeys } from '../../../../../shared/services/local-data/storage';
import { StorageService } from '../../../../../shared/services/local-data/storage.service';
import { Guid } from "guid-typescript";
import { NotaDebitoService } from '../../../services/nota-debito.services';
import { UsuarioService } from '../../../services/usuario.service';
import { Logs } from '../../../../../shared/model/Logs';
import { LogsService } from '../../../services/Logs/logs.services';
import { FormaPagoService } from '../../../services/forma-pago.services';
import { CuentaBancariaService } from '../../../services/cuenta-bancaria.services';
import { FormaPago } from '../../../../../shared/model/forma-pago';
import { CuentaBancaria } from '../../../../../shared/model/cuenta-bancaria';

interface ItemSeleccionado {
  id: number;
  saldo: number;
  monedaNota: number;
  tipoCambioValor?: number;
}

@Component({
  selector: 'orden-pago-create',
  templateUrl: './orden-pago-create.component.html',
  styleUrls: ['./orden-pago-create.component.css']
})
export class OrdenPagoCreateComponent implements OnInit {

  @ViewChild('listPays', { static: false }) childPays: OrdenPagoNotaComponent;

  numeroOrdenPagoResult: number;
  listOfData = [];
  listCheck = [];
  itemsSeleccionados: ItemSeleccionado[] = [];
  formasPagoTodas: FormaPago[] = [];
  optionsMetodoPago: FormaPago[] = [];

  cuentasTodas: CuentaBancaria[] = [];
  cuentas: CuentaBancaria[] = [];
  // Moneda/tipo de cambio del lote que se está pagando: se fija con la
  // primera ND marcada y no se puede mezclar con NDs de otra moneda en el
  // mismo pago (la moneda de cada ND ya viene fija desde su creación).
  public monedaSeleccionada: number = null;
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

  constructor(private ordenPagoService: OrdenPagoService,
    private route: ActivatedRoute,
    private ordenPagoListService: ListaOrdenPagoPendienteService,
    private router: Router,
    private storage: StorageService,
    private notaDebitoService: NotaDebitoService,
    private userService: UsuarioService,
    private logService: LogsService,
    private formaPagoService: FormaPagoService,
    private cuentaBancariaService: CuentaBancariaService
  ) {
    this.form = new FormGroup({
      fechaRegistro: new FormControl(null, [Validators.required]),
      montoDolares: new FormControl(null, [Validators.required]),
      montoBs: new FormControl(null, [Validators.required]),
      textMetodoPago: new FormControl(),
      metodoDePago: new FormControl(),
      cuentaBancaria: new FormControl()
    });

    this.form.get("montoDolares").disable({ emitEvent: false, onlySelf: false });
    this.form.get("montoBs").disable({ emitEvent: false, onlySelf: false });

    this.formaPagoService.getFormaPagoActivos().subscribe(result => {
      this.formasPagoTodas = result;
      this.actualizarCatalogosFiltrados();
    });

    this.cuentaBancariaService.getCuentaBancariaActivas().subscribe(result => {
      this.cuentasTodas = result;
      this.actualizarCatalogosFiltrados();
    });
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
        this.mostrarCuentas = false;
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
      const encontrada = this.optionsMetodoPago.find(o => o.id.toString() === data.toString());
      this.tituloFormaPago = encontrada ? encontrada.nombre : "";
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

    this.logService.saveLogItem(this.logs).subscribe(success => {
    });

  }

  // true si entre las NDs marcadas hay más de una moneda -- en ese caso el
  // pago queda bloqueado hasta que el usuario desmarque para dejar una sola.
  get hayMonedasMezcladas(): boolean {
    const monedas = new Set(this.itemsSeleccionados.map(i => i.monedaNota));
    return monedas.size > 1;
  }

  monedaLabel(moneda: number): string {
    return moneda === 2 ? 'Bolivianos' : 'Dólares';
  }

  // Filtra las formas de pago y cuentas bancarias activas según la moneda
  // del lote que se está pagando. Si todavía no hay ninguna ND marcada, o si
  // hay monedas mezcladas (pago bloqueado), muestra todas las activas sin
  // filtrar, para no ocultar información mientras el usuario corrige la
  // selección.
  private actualizarCatalogosFiltrados() {
    if (this.monedaSeleccionada == null || this.hayMonedasMezcladas) {
      this.optionsMetodoPago = this.formasPagoTodas;
      this.cuentas = this.cuentasTodas;
      return;
    }
    const monedaTexto = this.monedaSeleccionada === 2 ? 'BS' : 'USD';
    this.optionsMetodoPago = this.formasPagoTodas.filter(fp => fp.moneda === 'AMBOS' || fp.moneda === monedaTexto);
    this.cuentas = this.cuentasTodas.filter(cb => cb.moneda === monedaTexto);
  }

  // El equivalente en Bs se calcula sumando cada ND con su propio tipo de
  // cambio (el registrado al crearla), no con una tasa única ingresada a mano.
  private recalcularMontoBs() {
    const totalBs = this.itemsSeleccionados.reduce((acc, item) => {
      const tasa = item.monedaNota === 2 && item.tipoCambioValor ? item.tipoCambioValor : 1;
      return acc + (item.saldo * tasa);
    }, 0);
    this.form.get("montoBs").disable({ emitEvent: false, onlySelf: false });
    this.form.get("montoBs").setValue(totalBs.toFixed(2));
  }

  check(id, saldo, nordenPago, monedaNota?, tipoCambioValor?) {
    const monedaFila = monedaNota ? monedaNota : 1; // legacy sin moneda registrada = USD
    const yaSeleccionado = this.itemsSeleccionados.find(x => x.id === id);

    this.numeroOrdenPagoID = nordenPago;

    if (yaSeleccionado) {
      this.itemsSeleccionados = this.itemsSeleccionados.filter(x => x.id !== id);
      this.listCheck = this.listCheck.filter(f => f !== id);
      this.totalPagar -= parseFloat(saldo.toFixed(2));
    }
    else {
      this.itemsSeleccionados.push({ id, saldo, monedaNota: monedaFila, tipoCambioValor });
      this.listCheck.push(id);
      this.totalPagar += saldo;
      this.totalPagar = parseFloat(this.totalPagar.toFixed(2));

      // Primera ND del lote: fija la moneda del pago.
      if (this.itemsSeleccionados.length === 1) {
        this.monedaSeleccionada = monedaFila;
      }
    }

    if (this.itemsSeleccionados.length === 0) {
      this.monedaSeleccionada = null;
    } else if (!this.hayMonedasMezcladas) {
      this.monedaSeleccionada = this.itemsSeleccionados[0].monedaNota;
    }
    this.actualizarCatalogosFiltrados();

    this.enablePay = !(this.totalPagar != undefined && this.totalPagar > 0);

    this.form.get("montoDolares").disable({ emitEvent: false, onlySelf: false });
    this.form.get("montoDolares").setValue(this.totalPagar.toFixed(2));
    this.recalcularMontoBs();
  }

  saveNotaVenta() {
    if (this.hayMonedasMezcladas) {
      return;
    }
    const formaPagoValue = this.form.get("metodoDePago").value;
    const formaPagoSeleccionada = this.optionsMetodoPago.find(item => item.id.toString() == formaPagoValue.toString());
    const requiereCuenta = formaPagoSeleccionada ? formaPagoSeleccionada.requiereCuentaBancaria : false;
    const cuentaBancaria = requiereCuenta ? this.cuentas.find(item => item.id.toString() == this.form.get('cuentaBancaria').value) : null;
    this.ordenPago = {
      anulado: 0,
      concepto: "",
      fechaPago: this.fechaRegistro,
      formaPago: formaPagoValue,
      formaPagoDescripcion: requiereCuenta ? (cuentaBancaria ? cuentaBancaria.nombre : '') : this.form.get('textMetodoPago').value,
      monedaPago: this.monedaSeleccionada ? this.monedaSeleccionada : 1,
      tipoCambioValor: null,
      montoAPagar: this.totalPagar,
      numeroNotaDebito: 0,
      numeroPago: 0,
      numeroTarjeta: requiereCuenta ? (cuentaBancaria ? cuentaBancaria.id.toString() : '') : this.form.get("textMetodoPago").value,
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

    // Los montos se registran/guardan siempre en USD (el monto base de la ND
    // nunca cambia de moneda). El equivalente en Bs que muestra el recibo usa
    // el tipo de cambio propio de cada ND (no un valor único ingresado a mano).
    let printList = [];

    this.listCheck.forEach(data => {
      let resultI = this.listOfData.filter(d => { return d.idOrden === data });
      const tasaNota = resultI[0].tipoCambioValor;
      const factorRecibo = this.monedaSeleccionada === 2 && tasaNota ? tasaNota : 1;

      printList.push({
        nombreCliente: resultI[0].idNota,
        fechaPago: this.ordenPago.fechaPago,
        concepto: this.ordenPago.concepto,
        montoAPagar: resultI[0].saldoDeudor * factorRecibo,
        montoUSD: resultI[0].saldoDeudor,
        tipoCambioValor: tasaNota
      });

      this.ordenPago.numeroNotaDebito = data;
      this.ordenPago.id = data;
      this.ordenPago.montoAPagar = resultI[0].saldoDeudor;
      this.ordenPago.tipoCambioValor = tasaNota;

      this.ordenPagoService.updateOrdenPago(this.ordenPago).subscribe(data => {
        this.ordenPagoService.getOrdenPago(this.ordenPago.id.toString()).subscribe(result => {
          this.childPays.numeroOrdenPago = result.numeroPago.toString();
        });
      });

      this.isVisible = true;
    })

    let tempData = this.ordenPagoService.getOrdenPago(this.listCheck[0]).subscribe(resNumber => {
      this.childPays.listOfData = printList;
      this.childPays.montoPagado = printList.reduce((acc, p) => acc + p.montoAPagar, 0).toFixed(2);
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
    this.logService.saveLogItem(this.logs).subscribe(sucess => {
      this.router.navigate(['/main/travelace/orden-pago']);
    });

  }

  handleCancel(): void {
    this.isVisible = false;
    this.logs.eventShoot = "Click Cancel Guardar Pago";
    this.logService.saveLogItem(this.logs).subscribe(success => { });
  }

  onAllChecked($event) {

  }

  getActualSucursal() {
    const token = this.storage.parse(IStorageKeys.Token);
    return token.sucursal;
  }
}
