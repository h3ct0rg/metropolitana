import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OrdenPago } from '../../../../shared/model/orden-pago';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';
import { Guid } from 'guid-typescript';
import { UsuarioService } from '../../services/usuario.service';
import { CargaOrdenPagoService } from '../../services/carga/carga-orden-pago.services';
import { CargaListaOrdenPagoPendienteService } from '../../services/carga/carga-orden-pago-list.services';
import { CargaNotaDebitoService } from '../../services/carga/carga-nota-debito.services';
import { CargaordendepagonotaComponent } from '../cargaordendepagonota/cargaordendepagonota.component';
import { FormaPagoService } from '../../services/forma-pago.services';
import { CuentaBancariaService } from '../../services/cuenta-bancaria.services';
import { TipoCambioService } from '../../services/tipo-cambio.services';
import { FormaPago } from '../../../../shared/model/forma-pago';
import { CuentaBancaria } from '../../../../shared/model/cuenta-bancaria';

interface ItemSeleccionado {
  id: number;
  saldo: number;
  monedaNota: number;
}

@Component({
  selector: 'app-cargaordendepagocreate',
  templateUrl: './cargaordendepagocreate.component.html',
  styleUrls: ['./cargaordendepagocreate.component.css']
})
export class CargaordendepagocreateComponent implements OnInit {

  @ViewChild('listPays', { static: false }) childPays: CargaordendepagonotaComponent;

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

  constructor(
    private ordenPagoService: CargaOrdenPagoService,
    private route: ActivatedRoute,
    private ordenPagoListService: CargaListaOrdenPagoPendienteService,
    private router: Router,
    private storage: StorageService,
    private notaDebitoService: CargaNotaDebitoService,
    private userService: UsuarioService,
    private formaPagoService: FormaPagoService,
    private cuentaBancariaService: CuentaBancariaService,
    private tipoCambioService: TipoCambioService
  ) {
    this.form = new FormGroup({
      fechaRegistro: new FormControl(null, [Validators.required]),
      numeroOrdenPago: new FormControl(),
      montoDolares: new FormControl(null, [Validators.required]),
      montoBs: new FormControl(null, [Validators.required]),
      textMetodoPago: new FormControl(),
      metodoDePago: new FormControl(),
      cuentaBancaria: new FormControl(),
      tipoCambioValor: new FormControl(null, [Validators.required, Validators.min(0.01)])
    });

    this.form.get("montoDolares").disable({ emitEvent: false, onlySelf: false });
    this.form.get("montoBs").disable({ emitEvent: false, onlySelf: false });
    this.form.get("numeroOrdenPago").disable({ emitEvent: false, onlySelf: false });

    this.formaPagoService.getFormaPagoActivos().subscribe(result => {
      this.formasPagoTodas = result;
      this.actualizarCatalogosFiltrados();
    });

    this.cuentaBancariaService.getCuentaBancariaActivas().subscribe(result => {
      this.cuentasTodas = result;
      this.actualizarCatalogosFiltrados();
    });

    this.tipoCambioService.getActual().subscribe(result => {
      if (result && !this.form.get('tipoCambioValor').value) {
        this.form.get('tipoCambioValor').setValue(result.valor);
        this.recalcularMontoBs();
      }
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

    this.form.get("tipoCambioValor").valueChanges.subscribe(() => {
      this.recalcularMontoBs();
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

  private recalcularMontoBs() {
    const tasa = this.form.get("tipoCambioValor").value || 0;
    this.form.get("montoBs").disable({ emitEvent: false, onlySelf: false });
    this.form.get("montoBs").setValue((this.totalPagar * tasa).toFixed(2));
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
      this.itemsSeleccionados.push({ id, saldo, monedaNota: monedaFila });
      this.listCheck.push(id);
      this.totalPagar += saldo;
      this.totalPagar = parseFloat(this.totalPagar.toFixed(2));

      if (this.itemsSeleccionados.length === 1) {
        this.monedaSeleccionada = monedaFila;
        if (tipoCambioValor) {
          this.form.get('tipoCambioValor').setValue(tipoCambioValor);
        }
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
    this.form.get("numeroOrdenPago").disable({ emitEvent: false, onlySelf: false });
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
      tipoCambioValor: this.form.get("tipoCambioValor").value,
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

    // Los montos se registran/guardan siempre en USD; el factor es solo para
    // que el recibo impreso muestre el equivalente en Bs al pagar en Bolivianos.
    const factorRecibo = this.monedaSeleccionada === 2 ? (this.form.get("tipoCambioValor").value || 1) : 1;

    let printList = [];

    this.listCheck.forEach(data => {
      let resultI = this.listOfData.filter(d => { return d.idOrden === data });
      printList.push({
        nombreCliente: resultI[0].idNota,
        fechaPago: this.ordenPago.fechaPago,
        concepto: this.ordenPago.concepto,
        montoAPagar: resultI[0].saldoDeudor * factorRecibo
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
      this.childPays.montoPagado = (this.totalPagar * factorRecibo).toFixed(2);
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
    this.router.navigate(['/main/carga/orden-pago']);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  onAllChecked($event) {

  }

  getActualSucursal() {
    const token = this.storage.parse(IStorageKeys.Token);
    return token.sucursal;
  }

}
