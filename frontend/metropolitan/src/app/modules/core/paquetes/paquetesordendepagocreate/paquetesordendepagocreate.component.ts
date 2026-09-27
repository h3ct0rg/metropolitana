import { Component, OnInit, ViewChild } from '@angular/core';
import { PaquetesordendepagonotaComponent } from '../paquetesordendepagonota/paquetesordendepagonota.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrdenPago } from '../../../../shared/model/orden-pago';
import { OrdenPagoAdelanto } from '../../../../shared/model/orden-pago-adelanto';
import { PaqueteOrdenPagoService } from '../../services/paquetes/paquete-orden-pago.services';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute, Router } from '@angular/router';
import { PaqueteListaOrdenPagoPendienteService } from '../../services/paquetes/paquete-orden-pago-list.services';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { PaquetesNotaDebitoService } from '../../services/paquetes/paquete-nota-debito.services';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';
import { Guid } from 'guid-typescript';
import { UsuarioService } from '../../services/usuario.service';
import { Logs } from '../../../../shared/model/Logs';
import { LogsService } from '../../services/Logs/logs.services';
import { FormaPagoService } from '../../services/forma-pago.services';
import { CuentaBancariaService } from '../../services/cuenta-bancaria.services';
import { FormaPago } from '../../../../shared/model/forma-pago';
import { NzMessageService } from 'ng-zorro-antd';
import { CuentaBancaria } from '../../../../shared/model/cuenta-bancaria';

interface ItemSeleccionado {
  id: number;
  saldo: number;
  monedaNota: number;
  tipoCambioValor?: number;
}

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
  itemsSeleccionados: ItemSeleccionado[] = [];
  formasPagoTodas: FormaPago[] = [];
  optionsMetodoPago: FormaPago[] = [];
  cuentasTodas: CuentaBancaria[] = [];
  cuentas: CuentaBancaria[] = [];
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

  public isAdelantoVisible = false;
  public adelantoForm: FormGroup;
  public filaAdelanto: any = null;
  public reciboAdelanto: any = null;

  constructor(
    private ordenPagoService: PaqueteOrdenPagoService,
    private route: ActivatedRoute,
    private ordenPagoListService: PaqueteListaOrdenPagoPendienteService,
    private router: Router,
    private storage: StorageService,
    private notaDebitoService: PaquetesNotaDebitoService,
    private userService: UsuarioService,
    private logService: LogsService,
    private formaPagoService: FormaPagoService,
    private cuentaBancariaService: CuentaBancariaService,
    private message: NzMessageService
  ) {
    this.form = new FormGroup({
      fechaRegistro: new FormControl(null, [Validators.required]),
      montoDolares: new FormControl(null, [Validators.required]),
      montoBs: new FormControl(null, [Validators.required]),
      textMetodoPago: new FormControl(),
      metodoDePago: new FormControl(),
      cuentaBancaria: new FormControl()
    });

    this.adelantoForm = new FormGroup({
      monto: new FormControl(null, [Validators.required, Validators.min(0.01)]),
      concepto: new FormControl(null)
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

    this.logService.saveLogItemPaquetes(this.logs).subscribe(success => {
    });
  }

  get hayMonedasMezcladas(): boolean {
    const monedas = new Set(this.itemsSeleccionados.map(i => i.monedaNota));
    return monedas.size > 1;
  }

  monedaLabel(moneda: number): string {
    return moneda === 2 ? 'Bolivianos' : 'Dólares';
  }

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
    // El equivalente en Bs se muestra siempre que haya tipo de cambio
    // registrado, sin importar si la ND es originalmente USD o BS -- es solo
    // informativo para el cajero (igual que las columnas Saldo $us/Saldo Bs).
    const totalBs = this.itemsSeleccionados.reduce((acc, item) => {
      const tasa = item.tipoCambioValor ? item.tipoCambioValor : 1;
      return acc + (item.saldo * tasa);
    }, 0);
    this.form.get("montoBs").disable({ emitEvent: false, onlySelf: false });
    this.form.get("montoBs").setValue(totalBs.toFixed(2));
  }

  check(id, saldo, nordenPago, monedaNota?, tipoCambioValor?) {
    const monedaFila = monedaNota ? monedaNota : 1;
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

  // El botón "Adelanto" se deshabilita si la ND ya está marcada para pago
  // total en este lote, o si ya no tiene saldo pendiente.
  puedeAdelantar(data): boolean {
    return data.saldoDeudor > 0 && !this.itemsSeleccionados.find(x => x.id === data.idOrden);
  }

  abrirAdelanto(data) {
    this.filaAdelanto = data;
    this.adelantoForm.reset();
    this.isAdelantoVisible = true;
  }

  cancelarAdelanto() {
    this.isAdelantoVisible = false;
    this.filaAdelanto = null;
  }

  // El saldo en la BD siempre se guarda en USD (el monto base de la ND nunca
  // cambia de moneda). Para mostrar/ingresar el adelanto en la moneda propia
  // de la ND (Bs si corresponde), se usa el tipo de cambio registrado en esa ND.
  get tasaAdelanto(): number {
    return this.filaAdelanto && this.filaAdelanto.monedaNota === 2 && this.filaAdelanto.tipoCambioValor
      ? this.filaAdelanto.tipoCambioValor : 1;
  }

  get saldoPendienteNativo(): number {
    return this.filaAdelanto ? this.filaAdelanto.saldoDeudor * this.tasaAdelanto : 0;
  }

  confirmarAdelanto() {
    if (!this.adelantoForm.valid || !this.filaAdelanto) {
      return;
    }
    const fila = this.filaAdelanto;
    const tasa = this.tasaAdelanto;
    const saldoAnteriorNativo = this.saldoPendienteNativo;

    const montoNativo = parseFloat(this.adelantoForm.get('monto').value);
    if (montoNativo > saldoAnteriorNativo) {
      this.message.create('error', 'El monto del adelanto no puede ser mayor al saldo pendiente.');
      return;
    }
    const montoUSD = montoNativo / tasa;
    const concepto = this.adelantoForm.get('concepto').value;

    const adelanto: OrdenPagoAdelanto = {
      idOrdenPago: fila.idOrden,
      idNotaDebito: fila.idNota,
      monto: montoUSD,
      concepto: concepto,
      idSucursal: this.getActualSucursal(),
      createBy: JSON.parse(this.token)["userId"]
    };

    this.ordenPagoService.createAdelanto(adelanto).subscribe(result => {
      fila.saldoDeudor = result.saldoDeudor;
      this.isAdelantoVisible = false;
      this.filaAdelanto = null;
      this.generarReciboAdelanto(fila, montoNativo, saldoAnteriorNativo, concepto);
    });
  }

  generarReciboAdelanto(fila, monto, saldoAnterior, concepto) {
    this.reciboAdelanto = {
      nombreCliente: fila.nombreCliente,
      idNota: fila.idNota,
      monedaSimbolo: fila.monedaNota === 2 ? 'Bs.' : '$us',
      monedaTexto: fila.monedaNota === 2 ? 'Bolivianos (BS)' : 'Dólares (USD)',
      concepto: concepto || '-',
      montoRecibido: monto,
      montoPendiente: saldoAnterior - monto,
      fechaPago: this.getTime(new Date()),
      fechaLimite: fila.fechaVencimiento ? this.getTime(fila.fechaVencimiento) : '-',
      nombreCreador: ''
    };

    this.userService.getUser(JSON.parse(this.token)["userId"].toString()).subscribe(res => {
      this.reciboAdelanto.nombreCreador = res.nombre;
      setTimeout(() => this.imprimirReciboAdelanto(), 0);
    });
  }

  private imprimirReciboAdelanto() {
    const idNota = this.reciboAdelanto.idNota;
    const pdfElement = document.getElementById('reciboAdelantoContainer');
    pdfElement.classList.add('pdf-print');
    html2canvas(pdfElement, {
      allowTaint: true,
      useCORS: false,
      scale: 2
    }).then(canvas => {
      pdfElement.classList.remove('pdf-print');
      const img = canvas.toDataURL('image/jpeg', 0.7);
      const doc = new jsPDF();
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(img, 'JPEG', 10, 10, imgWidth, imgHeight);
      doc.save('recibo_adelanto_' + idNota + '_' + this.getTimeForFile(new Date()) + '.pdf');
      this.reciboAdelanto = null;
    });
  }

  getTime(theTime) {
    const d = new Date(theTime);
    return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
  }

  getTimeForFile(theTime) {
    const d = new Date(theTime);
    return d.getDate() + '_' + (d.getMonth() + 1) + '_' + d.getFullYear();
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

    // Los montos se registran/guardan siempre en USD. El equivalente en Bs que
    // muestra el recibo usa el tipo de cambio propio de cada ND (no un valor
    // único ingresado a mano).
    let printList = [];

    this.listCheck.forEach(data => {
      let resultI = this.listOfData.filter(d => { return d.idOrden === data });
      const tasaNota = resultI[0].tipoCambioValor;
      const factorRecibo = this.monedaSeleccionada === 2 && tasaNota ? tasaNota : 1;

      // El recibo muestra el total original de la ND (sin descontar adelantos
      // ya cobrados por separado), aunque lo que se registra como transacción
      // de esta OP sea solo el saldo restante (resultI[0].saldoDeudor).
      const montoOriginal = resultI[0].ordenMontoPagar;

      printList.push({
        nombreCliente: resultI[0].idNota,
        fechaPago: this.ordenPago.fechaPago,
        concepto: this.ordenPago.concepto,
        montoAPagar: montoOriginal * factorRecibo,
        montoUSD: montoOriginal,
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
