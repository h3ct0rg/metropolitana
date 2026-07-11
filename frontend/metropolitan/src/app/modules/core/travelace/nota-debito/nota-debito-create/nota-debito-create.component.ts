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
    private logService: LogsService
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
      fechaVencimiento: new FormControl(null, [Validators.required])
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
      this.form.get("montoNeto").setValue(result.montoNeto.toFixed(2));
      this.form.get("alPax").setValue(result.total.toFixed(2));
      this.form.get("comicionAgencia").setValue(result.totalAgencia.toFixed(2));
      this.form.get("comicionCounter").setValue(result.totalCounter.toFixed(2));
      this.form.get("comicionMetro").setValue(result.totalMetropolitana.toFixed(2));
      this.form.get("aMetro").setValue(result.totalArgentina.toFixed(2));
      this.form.get("netoLiquida").setValue(result.total.toFixed(2));
      this.form.get("fechaVencimiento").setValue(result.fechaVencimiento);
      this.waitAction = false;


      this.form.get("montoNeto").valueChanges.subscribe(data => {
        this.runRecalculate();
      });

      this.form.get("operador").valueChanges.subscribe(data => {
        this.runRecalculate();
      });

      this.form.get("counter").valueChanges.subscribe(data => {
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

  private runRecalculate() {
    let localName = this.form.get("Servicio").value;
    if (localName != undefined) {
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
        montoNeto: this.form.get("montoNeto").value,
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
      this.form.get("alPax").setValue(data.total.toFixed(2));
      this.form.get("comicionAgencia").setValue(data.totalAgencia.toFixed(2));
      this.form.get("comicionCounter").setValue(data.totalCounter.toFixed(2));
      this.form.get("comicionMetro").setValue(data.totalMetropolitana.toFixed(2));
      this.form.get("aMetro").setValue(data.totalArgentina.toFixed(2));
      this.form.get("netoLiquida").setValue(data.total.toFixed(2));
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
        montoNeto: this.form.get("montoNeto").value,
        pasajero: this.form.get("Pasajero").value,
        servicio: this.form.get("Servicio").value,
        total: this.form.get("netoLiquida").value,
        totalAgencia: this.form.get("comicionAgencia").value,
        totalArgentina: this.form.get("aMetro").value,
        totalCounter: this.form.get("comicionCounter").value,
        totalMetropolitana: this.form.get("comicionMetro").value,
        voucher: this.form.get("Voucher").value,
        id: toNumber(this.notaDebitoID),
        isEspecial: 0,
        codigoUnico: this.codunic
      }
      if (this.isEdit) {
        this.notaDev.modify = JSON.parse(this.token)["userId"];
        this.notaDebitoServices.updateNotaDebito(this.notaDev).subscribe(data => {
          this.ordenPagoService.getOrdenPagoByIDNotaIDSucursal(this.notaDev.codigoUnico, this.notaDev.idSucursal).subscribe(dataS => {

            let total: number = 0;
            total = parseFloat(this.notaDev.totalArgentina.toString()) + parseFloat(this.notaDev.totalCounter.toString()) + parseFloat(this.notaDev.totalMetropolitana.toString());
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
            monedaPago: 0,
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
