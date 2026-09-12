import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { OrdenPagoService } from '../../../services/orden-pago.services';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { ClientService } from '../../../services/clientes.service';
import { CounterService } from '../../../services/counter.services';
import { StorageService } from '../../../../../shared/services/local-data/storage.service';
import { IStorageKeys } from '../../../../../shared/services/local-data/storage';
import { SucursalService } from '../../../services/sucursal.services';
import { Logs } from '../../../../../shared/model/Logs';
import { LogsService } from '../../../services/Logs/logs.services';
import { userInfo } from 'os';
import { FormaPagoService } from '../../../services/forma-pago.services';
import { FormaPago } from '../../../../../shared/model/forma-pago';
import { TipoCambioService } from '../../../services/tipo-cambio.services';


@Component({
  selector: 'app-reporte-venta',
  templateUrl: './reporte-venta.component.html',
  styleUrls: ['./reporte-venta.component.css']
})
export class ReporteVentaComponent implements OnInit {
  public form: FormGroup;
  public listReport;
  public fechaIni: string;
  public fechaF: string;
  public isSpinning: boolean;
  public totalNeto: number = 0;
  public totalAgencia: number = 0;
  public totalCounter: number = 0;
  public totalTotal: number = 0;
  public totalArgentina: number = 0;
  public listRestas: number[] = [];
  public listReportExtra;
  public listReportAnulacion = [];
  public listReportRemision = [];
  public listSucursales = [];
  logs: Logs;
  token: any;

  public optionsMetodoPago: FormaPago[] = [];
  public tasaManualRespaldo: number = null;
  public faltanTasasLegacy: boolean = false;

  public listClients: any[];
  public listCounter: any[];
  public numberLines: number;
  public listOperadoresSelect: any;
  public listResultSum: [];
  public sucursalId: number;

  constructor(
    private ordenPagoService: OrdenPagoService,
    private clientService: ClientService,
    private counterService: CounterService,
    private storage: StorageService,
    private sucursalesService: SucursalService,
    private logService: LogsService,
    private formaPagoService: FormaPagoService,
    private tipoCambioService: TipoCambioService
  ) {
    this.isSpinning = true;
    this.setListRestasEmpty();
    this.listReportExtra = [];

    this.tipoCambioService.getActual().subscribe(result => {
      this.tasaManualRespaldo = result.valor;
    });

    // Por defecto: del primer día del mes actual a hoy.
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.form = new FormGroup({
      fechaStardDate: new FormControl(inicioMes, [Validators.required]),
      fechaEndDate: new FormControl(hoy, [Validators.required]),
      sucursal: new FormControl(null),
      monedaReporte: new FormControl(1)
    });

    this.formaPagoService.getFormaPagoList().subscribe(result => {
      this.optionsMetodoPago = result;
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
      
    });

    clientService.getClientList().subscribe(result => {
      this.listClients = result;
    })

    counterService.getCounterList().subscribe(result => {
      this.listCounter = result;
    });
  }

  get rangoFechasInvalido(): boolean {
    const inicio = this.form.get('fechaStardDate').value;
    const fin = this.form.get('fechaEndDate').value;
    if (!inicio || !fin) { return false; }
    return new Date(fin) < new Date(inicio);
  }

  setListRestasEmpty() {
    this.listRestas.push(0);
    this.listRestas.push(0);
    this.listRestas.push(0);
    this.listRestas.push(0);
    this.listRestas.push(0);
    this.listRestas.push(0);
    this.listRestas.push(0);
  }

  ngOnInit() {
    this.getTokenUserIsAdmin();
    this.logs = {
      id: "00000000-0000-0000-0000-000000000000",
      eventShoot: "Click Generar Reporte de Ventas",
      fromEvent: "Generar Reporte de Ventas",
      idSucursal: this.getActualSucursal(),
      itemUsed: "",
      userEvent: this.token["userId"],
      createDate: "1/1/2020 01:01:00"
    }
  }

  groupByLocal(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  generateNote() {
    if (this.rangoFechasInvalido) {
      return;
    }
    this.setListRestasEmpty();
    this.totalTotal = 0;
    this.totalCounter = 0;
    this.totalArgentina = 0;
    this.totalNeto = 0;
    this.totalAgencia = 0;
    this.faltanTasasLegacy = false;
    const fechaStart = this.form.get("fechaStardDate").value;
    const fechaEnd = this.form.get("fechaEndDate").value;

    const listOptions = this.optionsMetodoPago;

    this.fechaIni = this.getTime(fechaStart);
    this.fechaF = this.getTime(fechaEnd);
    this.ordenPagoService.getReportOrdenPagoByDateDetailByCity(fechaStart, fechaEnd, this.form.get("sucursal").value).subscribe(result => {
      result = this.convertirFilasAMoneda(result, ['montoNeto', 'totalArgentina', 'totalCounter', 'totalAgencia']);
      const rrGroup = this.groupByLocal(result, result => result.codOperador);
      this.listOperadoresSelect = [[]];
      let totalArgentinaTempo = 0;
      let totalMetroTempo = 0;
      rrGroup.forEach(de => {
        const resultSum = [];
        de.reduce(function (res, value) {
          if (!res[value.codUnicoNota]) {
            res[value.codUnicoNota] = {
              Id: value.codUnicoNota,
              numeroPago: value.numeroPago,
              nombreOperador: value.nombreOperador,
              nombreAgencia: value.nombreAgencia,
              pasajero: value.pasajero,
              montoNeto: 0,
              totalAgencia: 0,
              totalCounter: 0,
              totalArgentina: 0,
              totalFinal: 0,
              fechaPago: value.fechaPago,
              formaPago: (listOptions.find(element => element.id.toString() === value.formaPago.toString()) || { nombre: '' }).nombre
            };
            resultSum.push(res[value.codUnicoNota])
          }
          res[value.codUnicoNota].montoNeto += value.montoNeto;
          res[value.codUnicoNota].totalAgencia += value.totalAgencia;
          res[value.codUnicoNota].totalArgentina += value.totalArgentina;
          res[value.codUnicoNota].totalCounter += value.totalCounter;




          if (value.codOperador == 7 || value.codOperador == 1046 || value.codOperador == 45) {
            res[value.codUnicoNota].totalFinal = 0;
          }
          else {
            res[value.codUnicoNota].totalFinal += (value.montoNeto - (value.totalAgencia + value.totalArgentina + value.totalCounter));
          }
          return res;
        }, {});

        this.listOperadoresSelect.push(resultSum);
      }
      );

      this.numberLines = result.length;
      result.forEach(dato => {

        const datito = this.listCounter.filter(d => d.id === dato["codCounter"]);
        if (datito[0] != undefined) {
          dato["nombreCounter"] = datito[0]["name"];
        }
        else {
          dato["nombreCounter"] = "";
        }


        dato["fechaPaguito"] = this.getTime(dato["fechaPago"]);
        this.totalNeto += dato["montoNeto"];
        this.totalArgentina += dato["totalArgentina"];
        this.totalCounter += dato["totalCounter"];
        this.totalAgencia += dato["totalAgencia"];
        if (dato["codOperador"] == 7 || dato["codOperador"] == 1046) {
          this.totalTotal += 0;
        }
        else {
          this.totalTotal += (dato.montoNeto - (dato.totalAgencia + dato.totalArgentina + dato.totalCounter));
        }



      });

      this.listReport = result;

      this.ordenPagoService.getReportOrdenPagoByDateTotalesRest(this.form.get("sucursal").value, fechaStart, fechaEnd).subscribe(res => {
        // Este cálculo se mantiene igual (sumas agregadas del backend, sin
        // desglose por nota); solo se convierte el resultado final a la
        // moneda elegida con la tasa manual, ya que aquí no hay una tasa
        // por-fila disponible.
        const tasa = this.form.get('monedaReporte').value === 2 ? (this.tasaManualRespaldo || 1) : 1;
        this.listRestas = res.map(v => v * tasa);
      })

    });

    this.ordenPagoService.getReportOrdenPagoByDateDetailPpf(this.form.get("sucursal").value, fechaStart, fechaEnd).subscribe(dataR => {
      this.listReportExtra = this.convertirFilasAMoneda(dataR, ['montoNeto', 'totalArgentina', 'totalCounter', 'totalAgencia']);
    });

    this.ordenPagoService.getReportOrdenPagoByDateDetailAnulacion(this.form.get("sucursal").value, fechaStart, fechaEnd).subscribe(dataR => {
      this.listReportAnulacion = this.convertirFilasAMoneda(dataR, ['montoNeto', 'totalArgentina', 'totalCounter', 'totalAgencia', 'totalMetro']);
    });

    this.ordenPagoService.getReportOrdenPagoByDateDetailRemision(this.form.get("sucursal").value, fechaStart, fechaEnd).subscribe(dataR => {
      this.listReportRemision = this.convertirFilasAMoneda(dataR, ['montoNeto', 'totalArgentina', 'totalCounter', 'totalAgencia', 'totalMetro']);
    });

    this.isSpinning = false;
    this.logs.eventShoot = "Click Reporte de Ventas";
    this.logs.fromEvent = "Generar Reporte de Ventas";
    this.logService.saveLogItem(this.logs).subscribe(success => {
    });
  }

  getActualSucursal() {
    const token = this.storage.parse(IStorageKeys.Token);
    return token.sucursal;
  }

  getTokenUserIsAdmin() {
    this.token = this.storage.parse(IStorageKeys.Token);
    let userType = this.token['userType'];
    let arrayUserType = userType.split(',');
    if (arrayUserType.includes("1")) {
      return true;
    }
    else {
      return false;
    }
  }

  // Convierte los campos indicados de cada fila a Bolivianos usando la tasa
  // propia de esa ND (tipoCambioValor). Para filas antiguas sin tasa
  // guardada, usa la tasa manual de respaldo que el usuario ingresa en
  // pantalla (también usada para la sección de Totales Generales, que no
  // tiene tasa por fila disponible).
  convertirFilasAMoneda(filas: any[], campos: string[]): any[] {
    if (this.form.get('monedaReporte').value !== 2) {
      return filas;
    }
    if (filas.some(r => !r.tipoCambioValor)) {
      this.faltanTasasLegacy = true;
    }
    return filas.map(r => {
      const tasa = r.tipoCambioValor || this.tasaManualRespaldo || 1;
      const convertida = { ...r };
      campos.forEach(campo => { convertida[campo] = r[campo] * tasa; });
      return convertida;
    });
  }

  getSum(index: string, data: []): number {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i][index];
    }
    return sum;
  }

  updateCheckClientes() { }

  onChange() { }

  getTime(theTime) {
    const d = new Date(theTime);
    const hora = d.getDate() + " / " + (d.getMonth() + 1) + " / " + d.getFullYear();
    return hora;
  }

  getTimeForFile(theTime) {
    const d = new Date(theTime);
    const hora = d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear();
    return hora;
  }

  onPrint() {

    this.generarPDF();
    this.isSpinning = true;

    this.logs.eventShoot = "click imprimir Reporte";
    this.logs.fromEvent = "Generar Reporte de Ventas";
    this.logService.saveLogItem(this.logs).subscribe(sucess => { });
  }

  generarPDF() {
    const numneroHeader = this.getTimeForFile(new Date());
    const name = "reporte_venta_travelace" + numneroHeader + ".pdf";
    const doc2 = new jsPDF("landscape");
    const nombreSucursal = this.listSucursales.find(item => item.id = this.form.get("sucursal").value)['nombre'];
    const monedaTexto = this.form.get('monedaReporte').value === 2 ? '(en Bolivianos)' : '(en Dólares)';
    const tittle = "Reporte De Ventas " + nombreSucursal + " " + monedaTexto;
    const img = new Image();
    img.src = "../../../../assets/img/metropolitana-slogan.jpg";
    img.style.display = "block";
    doc2.addImage(img, 'JPEG', 75, 10, 50, 23);

    autoTable(doc2, {
      margin: { top: 40, bottom: 10 },
      head: [[tittle]],
      theme: 'plain',
    });    

    autoTable(doc2, {
      margin: { top: 250, bottom: 50 },
      head: [['Fecha del: ' + this.fechaIni, 'Fecha Al: ' + this.fechaF]],
      theme: 'plain',
    });

    this.listOperadoresSelect.forEach(item => {
      if (item.length > 0) {
        let tempRow = [];
        let nameSection = "";
        item.forEach(internal => {
          nameSection = internal['nombreOperador'];
          tempRow.push(
            [
              internal['Id'],
              internal['numeroPago'],
              internal['nombreAgencia'],
              internal['pasajero'],
              this.getTime(internal['fechaPago']),
              internal['formaPago'],
              internal['montoNeto'].toFixed(2),
              internal['totalAgencia'].toFixed(2),
              internal['totalCounter'].toFixed(2),
              internal['totalFinal'].toFixed(2),
              internal['totalArgentina'].toFixed(2)
            ]);
        });

        tempRow.push(
          [
            "", "", "", "", "", "Totales",
            this.getSum('montoNeto', item).toFixed(2),
            this.getSum('totalAgencia', item).toFixed(2),
            this.getSum('totalCounter', item).toFixed(2),
            this.getSum('totalFinal', item).toFixed(2),
            this.getSum('totalArgentina', item).toFixed(2)
          ]
        );

        autoTable(doc2, {
          head: [
            [nameSection, '','', '', '', '', '', '', '', '', ''],
            ['Nro Debito', 'Nro Orden', 'Agencia', 'Pasajero','Fecha', 'Forma Pago', 'Precio', 'Com Agencia', 'Com Counter', 'Com Metro', 'Neto']],
          body: tempRow,
          theme: 'grid'
        });
      }
    });

    if (this.listReportExtra.length > 0) {
      let tempRow = [];
      let nameSection = "";
      nameSection = "Anteriores Por Poner Fecha";
      this.listReportExtra.forEach(internal => {


        tempRow.push(
          [
            internal['codUnicoNota'],
            internal['pasajero'],
            internal['servicios'],
            this.getTime(internal['fechaPago']),
            internal['montoNeto'].toFixed(2),
            internal['totalAgencia'].toFixed(2),
            internal['totalCounter'].toFixed(2),
            internal['totalMetro'].toFixed(2),//(internal['montoNeto'] - internal['totalAgencia']).toFixed(2),
            internal['totalArgentina'].toFixed(2)
          ]);
      })

      autoTable(doc2, {
        head: [
          [nameSection, '', '', '', '', '', '', '', ''],
          ['Nro Debito', 'Pasajero', 'Servicio', 'Fecha', 'Precio', 'Com Agencia', 'Com Counter', 'Com Metro', 'Neto']],
        body: tempRow,
        theme: 'grid'
      });

    }

    if (this.listReportAnulacion.length > 0) {
      let tempRow = [];
      let nameSection = "";
      nameSection = "Notas de debito Anuladas";
      this.listReportAnulacion.forEach(internal => {


        tempRow.push(
          [
            internal['codUnicoNota'],
            internal['nombreAgencia'],
            internal['pasajero'],
            internal['servicios'],            
            internal['montoNeto'].toFixed(2),
            internal['totalAgencia'].toFixed(2),
            internal['totalCounter'].toFixed(2),
            internal['totalMetro'].toFixed(2),//(internal['montoNeto'] - internal['totalAgencia']).toFixed(2),
            internal['totalArgentina'].toFixed(2)
          ]);
      })

      autoTable(doc2, {
        head: [
          [nameSection, '', '', '', '', '', '', '', ''],
          ['Nro Debito', 'Agencia', 'Pasajero', 'Servicio', 'Precio', 'Com Agencia', 'Com Counter', 'Com Metro', 'Neto']],
        body: tempRow,
        theme: 'grid'
      });

    }

    if (this.listReportRemision.length > 0) {
      let tempRow = [];
      let nameSection = "";
      nameSection = "Notas de debito Remitidas";
      this.listReportRemision.forEach(internal => {


        tempRow.push(
          [
            internal['codUnicoNota'],
            internal['nombreAgencia'],
            internal['pasajero'],
            internal['servicios'],
            internal['montoNeto'].toFixed(2),
            internal['totalAgencia'].toFixed(2),
            internal['totalCounter'].toFixed(2),
            internal['totalMetro'].toFixed(2),//(internal['montoNeto'] - internal['totalAgencia']).toFixed(2),
            internal['totalArgentina'].toFixed(2)
          ]);
      })

      autoTable(doc2, {
        head: [
          [nameSection, '', '', '', '', '', '', '', ''],
          ['Nro Debito','Agencia', 'Pasajero', 'Servicio', 'Precio', 'Com Agencia', 'Com Counter', 'Com Metro', 'Neto']],
        body: tempRow,
        theme: 'grid'
      });

    }

    autoTable(doc2, {
      head: [
        ['', '', '', '', '', 'Precio', 'Com Agencia', 'Com Counter', 'Com Metro', 'Neto']],
      body: [["", "", "", "", "Total", this.totalNeto.toFixed(2), this.totalAgencia.toFixed(2), this.totalCounter.toFixed(2), (this.totalTotal - (this.listRestas[5] + this.listRestas[6])).toFixed(2), this.totalArgentina.toFixed(2)]],
      theme: 'grid'
    });

    autoTable(doc2, {
      head: [
        ['', '', '', '', 'Total Metropolitana', 'Total Anulaciones', 'Total Remisiones', 'Total Impuestos', 'Cobros por Anulaciones', 'Total Por Poner Fecha', 'Total Argentina']],
      body: [["Total Para Metropolitana", "", "", "",
        this.totalNeto.toFixed(2),
        this.listRestas[0].toFixed(2),
        this.listRestas[1].toFixed(2),
        this.listRestas[2].toFixed(2),
        this.listRestas[3].toFixed(2),
        this.listRestas[4].toFixed(2),
        (this.totalNeto - (this.listRestas[2] + this.listRestas[3] + this.listRestas[4] + this.listRestas[0])).toFixed(2)]],
      theme: 'grid'
    });


    doc2.save(name);
  }


}
