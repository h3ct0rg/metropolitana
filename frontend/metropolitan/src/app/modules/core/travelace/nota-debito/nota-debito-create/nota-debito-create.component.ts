import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validator, Validators, ReactiveFormsModule } from "@angular/forms";
import { NotaDebitoService } from '../../../services/nota-debito.services';
import { ClientService } from '../../../services/clientes.service';
import { OperadorService } from '../../../services/operador.services';
import { CounterService } from '../../../services/counter.services';
import { ActivatedRoute, Router } from '@angular/router';
import { NotaDebito } from '../../../../../shared/model/nota-debito';
import { NotaDebitoCalculate } from '../../../../../shared/model/nota-debito-calculate';
import { toNumber } from 'ng-zorro-antd';
import { NotaDebitoCalculateService } from '../../../services/nota-debito-calculate.services';
import { OrdenPago } from '../../../../../shared/model/orden-pago';
import { OrdenPagoService } from '../../../services/orden-pago.services';
import { StorageService } from '../../../../../shared/services/local-data/storage.service';
import { IStorageKeys } from '../../../../../shared/services/local-data/storage';
import { Counter } from '../../../../../shared/model/counter';
import { LogsService } from '../../../services/Logs/logs.services';
import { Logs } from '../../../../../shared/model/Logs';
import { TipoCambioService } from '../../../services/tipo-cambio.services';


@Component({
  selector: 'nota-debito-create',
  templateUrl: './nota-debito-create.component.html',
  styleUrls: ['./nota-debito-create.component.css']
})
export class NotaDebitoCreateComponent implements OnInit {
  public form: FormGroup;
  listOfData = [];
  inputValue: string;
  filteredOptions: string[] = [];
  options = [] = [];
  operadores = [] = [];
  counters: Counter[] = [];
  isEdit: boolean;
  notaDebitoID: string;
  cargado1: boolean;
  cargado2: boolean;
  cargado3: boolean;
  notaDev: NotaDebito;
  datito: NotaDebitoCalculate;
  localOrdenPago: OrdenPago;
  idNotaVenta: number;
  clienteNotaVenta: number;
  codClienteReaad: number;
  fechaRegistro: string;
  token: any;
  waitAction: boolean = false;
  codunic: number = -1;
  public isDisabled: boolean;
  logs: Logs;
  isSaving: boolean = false;
  public monedaTipoCambioBloqueado: boolean = false;
  // Último desglose calculado por el backend, siempre en USD (independiente
  // de en qué moneda se muestra/tipea en el formulario). Se usa al guardar.
  private datosUsd: NotaDebitoCalculate = null;

  constructor(
    private notaDebitoServices: NotaDebitoService,
    private notaDebitoCalculateServices: NotaDebitoCalculateService,
    private clientes: ClientService,
    private operadoresService: OperadorService,
    private counterService: CounterService,
    private route: ActivatedRoute,
    private ordenPagoService: OrdenPagoService,
    private storage: StorageService,
    private router: Router,
    private logService: LogsService,
    private tipoCambioService: TipoCambioService
  ) {
    this.cargado1 = false;
    this.cargado2 = false;
    this.cargado3 = false;

    this.form = new FormGroup({
      fechaRegistro: new FormControl(null, [Validators.required]),
      clienteNotaVenta: new FormControl(null, [Validators.required]),
      operador: new FormControl(null, [Validators.required]),
      Pasajero: new FormControl(),
      Servicio: new FormControl(),
      pendienteFecha: new FormControl(),
      Voucher: new FormControl(),
      counter: new FormControl(),
      Concepto: new FormControl(),
      montoNeto: new FormControl(null, [Validators.required]),
      alPax: new FormControl(),
      comicionAgencia: new FormControl(),
      comicionCounter: new FormControl(),
      comicionMetro: new FormControl(),
      sinCalculo: new FormControl(),
      aMetro: new FormControl(),
      netoLiquida: new FormControl(),
      fechaVencimiento: new FormControl(null, [Validators.required]),
      monedaNota: new FormControl(1, [Validators.required]),
      tipoCambioValor: new FormControl(null, [Validators.required, Validators.min(0.01)])
    });

    this.tipoCambioService.getActual().subscribe(result => {
      if (result && !this.form.get('tipoCambioValor').value) {
        this.form.get('tipoCambioValor').setValue(result.valor);
      }
    });

    this.loadDropdowns();
    this.updateComisionFieldsState(false);

    this.form.get('pendienteFecha').valueChanges.subscribe(data => {
      if (data) {
        this.form.get('fechaRegistro').setValue("0001-01-01");
        this.form.get('fechaVencimiento').setValue("0001-01-01");
      }
      else {
        this.form.get('fechaRegistro').setValue("");
        this.form.get('fechaVencimiento').setValue("");
      }
    });

    this.filteredOptions = this.options;
  }

  private loadDropdowns() {
    this.clientes.getClientBySucursal(this.getActualSucursal()).subscribe(data => {
      this.options = data;
    });
    this.operadoresService.getOperadorBySucursal(this.getActualSucursal()).subscribe(data => {
      this.operadores = data;

    });
    this.counterService.getCounterBySucursal(this.getActualSucursal()).subscribe(data => {
      this.counters = data;
    });

    this.form.get("sinCalculo").valueChanges.subscribe(result => {
      this.isDisabled = result;
      this.updateComisionFieldsState(result);
    });
  }

  private loadDropdowns_bySucursal(idSucursal: any) {
    this.clientes.getClientBySucursal(idSucursal).subscribe(data => {
      this.options = data;
    });
    this.operadoresService.getOperadorBySucursal(idSucursal).subscribe(data => {
      this.operadores = data;

    });
    this.counterService.getCounterBySucursal(idSucursal).subscribe(data => {
      this.counters = data;
    });

    this.form.get("sinCalculo").valueChanges.subscribe(result => {
      this.isDisabled = result;
      this.updateComisionFieldsState(result);
    });
  }

  ngOnInit() {
    this.token = this.storage.get(IStorageKeys.Token);
    JSON.parse(this.token)["userId"]

    this.logs = {
      id: "00000000-0000-0000-0000-000000000000",
      eventShoot: "Click Create Nota Debito",
      fromEvent: "Open Create Nota Debito",
      idSucursal: this.getActualSucursal(),
      itemUsed: "",
      userEvent: JSON.parse(this.token)["userId"],
      createDate: "1/1/2020 01:01:00"
    }

    this.route.paramMap.subscribe(param => {
      let operadorParam = param;
      this.notaDebitoID = operadorParam["params"].id;
      if (this.notaDebitoID) {
        this.logs.eventShoot = "Click Editar Nota Debito";
        this.logs.fromEvent = "Update ND Numero: " + this.notaDebitoID;
        this.isEdit = true;
        this.waitAction = true;
        this.loadOperadorInformation(this.notaDebitoID);
      }
      else {
        this.form.get("montoNeto").valueChanges.subscribe(data => {
          this.runRecalculate();
        });

        this.form.get("operador").valueChanges.subscribe(data => {
          this.runRecalculate();
        });

        this.form.get("counter").valueChanges.subscribe(data => {
          this.runRecalculate();
        });

        // El monto tipeado siempre está en la moneda actualmente elegida, así
        // que cambiar la moneda o el tipo de cambio también debe re-disparar
        // el cálculo (el mismo número ahora se interpreta distinto).
        this.form.get("monedaNota").valueChanges.subscribe(data => {
          this.runRecalculate();
        });

        this.form.get("tipoCambioValor").valueChanges.subscribe(data => {
          this.runRecalculate();
        });

        this.form.get("operador").valueChanges.subscribe(data => {
          //this.counterService.getCounterClient(data).subscribe(result => {
          //  this.counters = result;
          //});
        });
      }

      this.logService.saveLogItem(this.logs).subscribe(success => {
      });

    });


  }

  loadOperadorInformation(notaDebitoID) {
    this.notaDebitoServices.getNotaDebito(notaDebitoID).subscribe((result) => {

      this.loadDropdowns_bySucursal(result.idSucursal);

      this.notaDev = result;

      console.log(result);
      this.codunic = this.notaDev.codigoUnico;
      this.form.get("fechaRegistro").setValue(result.fechaGestion);
      this.form.get("clienteNotaVenta").setValue(result.codCliente.toString());
      this.form.get("operador").setValue(result.codOperador.toString());
      this.form.get("Pasajero").setValue(result.pasajero);
      this.form.get("Servicio").setValue(result.servicio);
      this.form.get("Voucher").setValue(result.voucher);
      this.form.get("counter").setValue(result.codCounter.toString());
      this.form.get("Concepto").setValue(result.concepto);
      // Lo guardado en la BD siempre está en USD; se muestra convertido a la
      // moneda con la que se creó esta ND para poder seguir editándola en
      // esa misma moneda.
      this.datosUsd = {
        codCliente: result.codCliente, codCounter: result.codCounter, codOperador: result.codOperador,
        codTipoCambio: 1, typeCounter: 0,
        montoNeto: result.montoNeto, total: result.total, totalAgencia: result.totalAgencia,
        totalArgentina: result.totalArgentina, totalCounter: result.totalCounter, totalMetropolitana: result.totalMetropolitana
      };
      const fMostrar = result.monedaNota === 2 && result.tipoCambioValor ? result.tipoCambioValor : 1;
      this.form.get("montoNeto").setValue((result.montoNeto * fMostrar).toFixed(2));
      this.form.get("alPax").setValue((result.total * fMostrar).toFixed(2));
      this.form.get("comicionAgencia").setValue((result.totalAgencia * fMostrar).toFixed(2));
      this.form.get("comicionCounter").setValue((result.totalCounter * fMostrar).toFixed(2));
      this.form.get("comicionMetro").setValue((result.totalMetropolitana * fMostrar).toFixed(2));
      this.form.get("aMetro").setValue((result.totalArgentina * fMostrar).toFixed(2));
      this.form.get("netoLiquida").setValue((result.total * fMostrar).toFixed(2));
      this.form.get("fechaVencimiento").setValue(result.fechaVencimiento);
      this.form.get("monedaNota").setValue(result.monedaNota ? result.monedaNota : 1);
      this.form.get("tipoCambioValor").setValue(result.tipoCambioValor ? result.tipoCambioValor : this.form.get("tipoCambioValor").value);
      this.waitAction = false;

      this.ordenPagoService.getOrdenPagoByIDNotaIDSucursal(result.codigoUnico, result.idSucursal).subscribe(op => {
        if (op && op.pagado) {
          this.monedaTipoCambioBloqueado = true;
          this.form.get("monedaNota").disable({ emitEvent: false });
          this.form.get("tipoCambioValor").disable({ emitEvent: false });
        }
      });

      this.form.get("montoNeto").valueChanges.subscribe(data => {
        this.runRecalculate();
      });

      this.form.get("operador").valueChanges.subscribe(data => {
        this.runRecalculate();
      });

      this.form.get("counter").valueChanges.subscribe(data => {
        this.runRecalculate();
      });

      this.form.get("monedaNota").valueChanges.subscribe(data => {
        this.runRecalculate();
      });

      this.form.get("tipoCambioValor").valueChanges.subscribe(data => {
        this.runRecalculate();
      });

      this.form.get("operador").valueChanges.subscribe(data => {
        //this.counterService.getCounterClient(data).subscribe(result => {
        //  this.counters = result;
        //});
      });

    });
  }

  private updateComisionFieldsState(manual: boolean) {
    const campos = ["comicionAgencia", "comicionCounter", "comicionMetro", "aMetro"];
    campos.forEach(nombre => {
      const control = this.form.get(nombre);
      if (manual) {
        control.enable({ emitEvent: false });
      } else {
        control.disable({ emitEvent: false });
      }
    });
  }

  // Factor para convertir un monto de USD a la moneda que se está mostrando
  // en el formulario (1 si es USD, el tipo de cambio si es Bolivianos).
  private factorMoneda(): number {
    return this.form.get('monedaNota').value === 2 ? (this.form.get('tipoCambioValor').value || 1) : 1;
  }

  // El monto que el usuario tipea siempre está en la moneda actualmente
  // elegida (USD o Bs); esto lo convierte a USD para calcular/guardar.
  private aUsd(valorEnMoneda: number): number {
    const valor = parseFloat(valorEnMoneda as any) || 0;
    const f = this.factorMoneda();
    return f ? valor / f : valor;
  }

  private runRecalculate() {
    let localName = this.form.get("Servicio").value;
    const montoNetoRaw = this.form.get("montoNeto").value;
    // El backend de cálculo no tolera un monto vacío/0 cuando ya hay operador
    // y counter elegidos (tira error 500) -- no llamarlo hasta que el usuario
    // haya tipeado un monto real.
    if (localName != undefined && montoNetoRaw !== null && montoNetoRaw !== '' && parseFloat(montoNetoRaw) > 0) {
      let typec = this.selectTypeCounterPercentage(localName);
      let codC = this.form.get("counter").value;
      if (codC == null) {
        codC = -1;
      }
      this.datito = {
        codCliente: this.form.get("clienteNotaVenta").value,
        codCounter: codC,
        codOperador: this.form.get("operador").value,
        codTipoCambio: 1,
        typeCounter: typec,
        montoNeto: this.aUsd(this.form.get("montoNeto").value),
        total: 0,
        totalAgencia: 0,
        totalArgentina: 0,
        totalCounter: 0,
        totalMetropolitana: 0,
      };
      this.calculateData();
    }
  }

  selectTypeCounterPercentage(name) {
    if (name.includes("LOW COST")) {
      return 2;
    }

    if (name.includes("SEG AMP")) {
      return 3;
    }

    if (name.includes("ESP")) {
      return 2;
    }

    if (name.includes("NACIONAL")) {
      return 4;
    }
    return 1;
  }

  calculateData() {
    this.notaDebitoCalculateServices.getNotaDebitoCalculate(this.datito).subscribe(data => {
      this.datosUsd = data;
      const f = this.factorMoneda();
      this.form.get("alPax").setValue((data.total * f).toFixed(2));
      this.form.get("comicionAgencia").setValue((data.totalAgencia * f).toFixed(2));
      this.form.get("comicionCounter").setValue((data.totalCounter * f).toFixed(2));
      this.form.get("comicionMetro").setValue((data.totalMetropolitana * f).toFixed(2));
      this.form.get("aMetro").setValue((data.totalArgentina * f).toFixed(2));
      this.form.get("netoLiquida").setValue((data.total * f).toFixed(2));
    });
  }

  updateCheckClientes() {
    let val = this.form.get("fechaRegistro").value;
    this.fechaRegistro = val;
  }

  saveNotaVenta() {

    if (!this.isSaving) {
      this.isSaving = true;

      let actualDate = new Date();
      let sDateNow = actualDate.getDate() + "/" + actualDate.getMonth() + "/" + actualDate.getFullYear();
      let actualCount = this.form.get("counter").value;
      if (actualCount == null) {
        actualCount = 0;
      }

      // Lo que se guarda en la BD siempre es en USD. En modo automático se usa
      // el último desglose que devolvió el backend (ya en USD); en modo manual
      // ("sinCalculo") el usuario tipeó los montos en la moneda mostrada, así
      // que hay que convertirlos.
      const montoNetoUsd = this.aUsd(this.form.get("montoNeto").value);
      const totalUsd = this.isDisabled ? this.aUsd(this.form.get("netoLiquida").value) : (this.datosUsd ? this.datosUsd.total : montoNetoUsd);
      const totalAgenciaUsd = this.isDisabled ? this.aUsd(this.form.get("comicionAgencia").value) : (this.datosUsd ? this.datosUsd.totalAgencia : 0);
      const totalArgentinaUsd = this.isDisabled ? this.aUsd(this.form.get("aMetro").value) : (this.datosUsd ? this.datosUsd.totalArgentina : 0);
      const totalCounterUsd = this.isDisabled ? this.aUsd(this.form.get("comicionCounter").value) : (this.datosUsd ? this.datosUsd.totalCounter : 0);
      const totalMetropolitanaUsd = this.isDisabled ? this.aUsd(this.form.get("comicionMetro").value) : (this.datosUsd ? this.datosUsd.totalMetropolitana : 0);

      this.notaDev = {
        estado: this.notaDev === undefined ? 0 : this.notaDev.estado,
        codCliente: this.form.get("clienteNotaVenta").value,
        codCounter: actualCount,
        codOperador: this.form.get("operador").value,
        codTipoCambio: 1,
        concepto: this.form.get("Concepto").value,
        createBy: JSON.parse(this.token)["userId"],
        createDate: this.fechaRegistro,
        fechaGestion: this.form.get("fechaRegistro").value,
        fechaVencimiento: this.form.get("fechaVencimiento").value,
        modify: 1,
        idSucursal: this.getActualSucursal(),
        modifyDate: this.fechaRegistro,
        montoNeto: montoNetoUsd,
        pasajero: this.form.get("Pasajero").value,
        servicio: this.form.get("Servicio").value,
        total: totalUsd,
        totalAgencia: totalAgenciaUsd,
        totalArgentina: totalArgentinaUsd,
        totalCounter: totalCounterUsd,
        totalMetropolitana: totalMetropolitanaUsd,
        voucher: this.form.get("Voucher").value,
        id: toNumber(this.notaDebitoID),
        isEspecial: 0,
        codigoUnico: this.codunic,
        monedaNota: this.form.get("monedaNota").value,
        tipoCambioValor: this.form.get("tipoCambioValor").value
      }
      if (this.isEdit) {
        this.notaDev.modify = JSON.parse(this.token)["userId"];
        this.notaDebitoServices.updateNotaDebito(this.notaDev).subscribe(data => {
          this.ordenPagoService.getOrdenPagoByIDNotaIDSucursal(this.notaDev.codigoUnico, this.notaDev.idSucursal).subscribe(dataS => {

            let total: number = 0;
            total = parseFloat(this.notaDev.totalArgentina.toString()) + parseFloat(this.notaDev.totalCounter.toString()) + parseFloat(this.notaDev.totalMetropolitana.toString());
            if (dataS && !dataS.pagado) {
              dataS.monedaPago = this.notaDev.monedaNota;
              dataS.tipoCambioValor = this.notaDev.tipoCambioValor;
            }
            this.ordenPagoService.updateOrdenPago(dataS).subscribe(result => {

              this.logs.eventShoot = "Update Nota Debito";
              this.logService.saveLogItem(this.logs).subscribe(success => {
                this.router.navigate(['/main/travelace/nota-debito']);
              });

            });
          });
        });
      }
      else {
        this.notaDev.codigoUnico = -1;
        this.notaDebitoServices.saveNotaDebitoItem(this.notaDev).subscribe(data => {
          let idND = data['id'];
          let valor = parseFloat(data["montoNeto"]) - parseFloat(data["totalAgencia"]);
          this.localOrdenPago = {
            anulado: 0,
            concepto: "",
            fechaPago: "1/1/2020 01:01:00",
            formaPago: 0,
            numeroNotaDebito: data["codigoUnico"],
            monedaPago: this.notaDev.monedaNota,
            tipoCambioValor: this.notaDev.tipoCambioValor,
            montoAPagar: 0,
            numeroPago: -1,
            formaPagoDescripcion: "",
            numeroTarjeta: "0",
            pagado: false,
            codProfile: "",
            idSucursal: this.getActualSucursal(),
            saldoDeudor: valor,
            createBy: JSON.parse(this.token)["userId"],
            createDate: data["createDate"],
            id: 0,
            modify: 1,
            modifyDate: data["createDate"],
          }
          this.ordenPagoService.saveOrdenPagoItem(this.localOrdenPago).subscribe(data => {

            this.logs.eventShoot = "Save Nota Debito";
            this.logService.saveLogItem(this.logs).subscribe(success => {
              this.router.navigate(['/main/travelace/profile-nota-debito/' + idND]);
            });

          });
        });
      }

    }
  }

  calculateAgain() {
  }

  getActualSucursal() {
    const token = this.storage.parse(IStorageKeys.Token);
    return token.sucursal;
  }

  counterChange($event) {
    this.counterService.getCounterClient($event).subscribe(result => {
      this.counters = result;
    });
  }

}
