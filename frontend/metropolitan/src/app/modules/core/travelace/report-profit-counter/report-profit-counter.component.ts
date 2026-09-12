import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CounterService } from '../../services/counter.services';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { SucursalService } from '../../services/sucursal.services';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';
import { Logs } from '../../../../shared/model/Logs';
import { LogsService } from '../../services/Logs/logs.services';
import { TipoCambioService } from '../../services/tipo-cambio.services';


@Component({
  selector: 'app-report-profit-counter',
  templateUrl: './report-profit-counter.component.html',
  styleUrls: ['./report-profit-counter.component.css']
})
export class ReportProfitCounterComponent implements OnInit {
  public form: FormGroup;
  public listCounters: any[];
  public emptyList: [];
  public listTablePDF: any[];
  public fechaIni: string;
  public fechaF: string;
  public totalCounter: number;
  public totalSumar: number;
  public isSpinning: boolean;
  public listSucursales = [];
  public tasaManualRespaldo: number = null;
  public detalleVisible: boolean = false;
  public detalleSeleccionado: any[] = [];
  public detalleTotalUsd: number = 0;
  public detalleTotalBs: number = 0;
  logs: Logs;
  token: any;

  constructor(
    private counterService: CounterService,
    private sucursalesService: SucursalService,
    private storage: StorageService,
    private logService: LogsService,
    private tipoCambioService: TipoCambioService
  ) {
    this.isSpinning = true;
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.form = new FormGroup({
      fechaStardDate: new FormControl(inicioMes, [Validators.required]),
      fechaEndDate: new FormControl(hoy, [Validators.required]),
      sucursal: new FormControl(null),
      monedaReporte: new FormControl(1)
    });

    this.tipoCambioService.getActual().subscribe(result => {
      this.tasaManualRespaldo = result.valor;
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

      //this.form.get("sucursal").setValue(result[0].id);
    });
    
    this.totalCounter = 0;
    this.totalSumar = 0;


  }

  getActualSucursal() {
    this.token = this.storage.parse(IStorageKeys.Token);
    return this.token.sucursal;
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

  ngOnInit() {
    this.logs = {
      id: "00000000-0000-0000-0000-000000000000",
      eventShoot: "Click Generar Reporte de Ventas Counter",
      fromEvent: "Generar Reporte de Ventas Counter",
      idSucursal: this.getActualSucursal(),
      itemUsed: "",
      userEvent: this.token["userId"],
      createDate: "1/1/2020 01:01:00"
    }
  }

  getTime(theTime) {
    const d = new Date(theTime);
    const hora = d.getDate() + " / " + (d.getMonth() + 1) + " / " + d.getFullYear();
    return hora;
  }

  get rangoFechasInvalido(): boolean {
    const inicio = this.form.get('fechaStardDate').value;
    const fin = this.form.get('fechaEndDate').value;
    if (!inicio || !fin) { return false; }
    return new Date(fin) < new Date(inicio);
  }

  generateNote() {
    if (this.rangoFechasInvalido) {
      return;
    }
    this.totalCounter = 0;
    this.totalSumar = 0;
    const fechaStart = this.form.get("fechaStardDate").value;
    const fechaEnd = this.form.get("fechaEndDate").value;
    const esBolivianos = this.form.get('monedaReporte').value === 2;

    this.fechaIni = this.getTime(fechaStart);
    this.fechaF = this.getTime(fechaEnd);
    this.listTablePDF = [];
    this.counterService.getCounterProfitByDateByCityDetalle(this.form.get("fechaStardDate").value, this.form.get("fechaEndDate").value, this.form.get("sucursal").value).subscribe(result => {
      const grupos = new Map<string, any>();

      result.forEach(fila => {
        const tasa = esBolivianos ? (fila.tipoCambioValor || this.tasaManualRespaldo || 1) : 1;
        const totalCounterConvertido = fila.totalCounter * tasa;
        const totalSalesConvertido = fila.totalSales * tasa;

        const clave = fila.agencia + '|' + fila.nombreCounter;
        if (!grupos.has(clave)) {
          grupos.set(clave, { agencia: fila.agencia, nombre: fila.nombreCounter, total: 0, totalSales: 0, detalle: [] });
        }
        const grupo = grupos.get(clave);
        grupo.total += totalCounterConvertido;
        grupo.totalSales += totalSalesConvertido;
        grupo.detalle.push({
          idNota: fila.idNota,
          agencia: fila.agencia,
          totalCounterUsd: fila.totalCounter,
          tipoCambioValor: fila.tipoCambioValor,
          totalCounterBs: fila.totalCounter * (fila.tipoCambioValor || this.tasaManualRespaldo || 1)
        });
      });

      this.listCounters = Array.from(grupos.values());
      this.listCounters.forEach(grupo => {
        this.listTablePDF.push([grupo.agencia, grupo.nombre, grupo.total.toFixed(2), grupo.totalSales.toFixed(2)]);
        this.totalCounter += grupo.total;
        this.totalSumar += grupo.totalSales;
      });
      this.listTablePDF.push(["", "", "Total Counter", "Total Ventas"]);
      this.listTablePDF.push(["", "", this.totalCounter.toFixed(2), this.totalSumar.toFixed(2)]);
      this.isSpinning = false;

      this.logs.eventShoot = "Click Reporte Ventas Counter";
      this.logService.saveLogItem(this.logs).subscribe(sucess => { });
    });

  }

  verDetalle(grupo: any) {
    this.detalleSeleccionado = grupo.detalle;
    this.detalleTotalUsd = grupo.detalle.reduce((sum, item) => sum + item.totalCounterUsd, 0);
    this.detalleTotalBs = grupo.detalle.reduce((sum, item) => sum + item.totalCounterBs, 0);
    this.detalleVisible = true;
  }

  onChange() {
  }

  onPrint() {
    this.generarPDF();
    this.isSpinning = true;
  }

  getTimeForFile(theTime) {
    const d = new Date(theTime);
    const hora = d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear();
    return hora;
  }

  private getLogoDataUrl(): Promise<string> {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = Math.round(300 * (img.height / img.width));
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = "../../../../assets/img/metropolitana-slogan.jpg";
    });
  }

  async generarPDF() {
    const doc2 = new jsPDF();
    const nombreSucursal = this.listSucursales.find(item => item.id = this.form.get("sucursal").value)['nombre']
    const monedaTexto = this.form.get('monedaReporte').value === 2 ? '(en Bolivianos)' : '(en Dólares)';
    const tittle = "Reporte Counters Universal Assistance de " + nombreSucursal + " " + monedaTexto;

    const logoDataUrl = await this.getLogoDataUrl();
    doc2.addImage(logoDataUrl, 'JPEG', 75, 10, 50, 23);

    autoTable(doc2, {
      margin: { top: 40, bottom: 10 },
      head: [[tittle]],
      theme: 'plain',
    });    

    autoTable(doc2, {
      margin: { top: 250, bottom: 50 },
      head: [['']],
      theme: 'plain',
    });

    autoTable(doc2, {
      margin: { top: 250, bottom: 50 },
      head: [['Fecha del: ' + this.fechaIni, 'Fecha Al: ' + this.fechaF]],
      theme: 'plain',
    });

    autoTable(doc2, {
      head: [['Agencia', 'Nombre', 'Total Counter', 'Total Ventas']],
      body: this.listTablePDF,
      theme: 'grid',
    });
    doc2.save("report-counter.pdf");

    this.logs.eventShoot = "Click Imprimir Reporte Ventas Counter";
    this.logService.saveLogItem(this.logs).subscribe(sucess => { });
  }
}
