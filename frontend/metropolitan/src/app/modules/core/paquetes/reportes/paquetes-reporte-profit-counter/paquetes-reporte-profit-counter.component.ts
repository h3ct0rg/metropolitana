import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CounterService } from '../../../services/counter.services';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { SucursalService } from '../../../services/sucursal.services';
import { TipoCambioService } from '../../../services/tipo-cambio.services';

@Component({
  selector: 'app-paquetes-reporte-profit-counter',
  templateUrl: './paquetes-reporte-profit-counter.component.html',
  styleUrls: ['./paquetes-reporte-profit-counter.component.css']
})
export class PaquetesReporteProfitCounterComponent implements OnInit {
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

  constructor(
    private counterService: CounterService,
    private sucursalesService: SucursalService,
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
      this.form.get("sucursal").setValue(result[0].id);
    });

    this.totalCounter = 0;
    this.totalSumar = 0;
  }

  ngOnInit() {
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

    const fechaStart = this.form.get("fechaStardDate").value;
    const fechaEnd = this.form.get("fechaEndDate").value;
    const tasa = this.form.get('monedaReporte').value === 2 ? (this.tasaManualRespaldo || 1) : 1;

    this.fechaIni = this.getTime(fechaStart);
    this.fechaF = this.getTime(fechaEnd);
    this.listTablePDF = [];
    this.listCounters = [];
    this.totalCounter = 0;
    this.totalSumar = 0;
    this.counterService.getCounterProfitByDatePaquet(this.form.get("fechaStardDate").value, this.form.get("fechaEndDate").value).subscribe(result => {
      this.listCounters = result;
      this.listCounters.forEach(result => {
        result.total = result.total * tasa;
        result.totalSales = result.totalSales * tasa;
        this.listTablePDF.push([result['agencia'], result['nombre'], result['total'].toFixed(2), result['totalSales'].toFixed(2)]);
        this.totalCounter += result.total;
        this.totalSumar += result.totalSales;
      });
      this.listTablePDF.push(["", "", "Total Counter", "Total Ventas"]);
      this.listTablePDF.push(["", "", this.totalCounter.toFixed(2), this.totalSumar.toFixed(2)]);
      this.isSpinning = false;
    });
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

  generarPDF() {
    const doc2 = new jsPDF();

    const monedaTexto = this.form.get('monedaReporte').value === 2 ? '(en Bolivianos)' : '(en Dólares)';
    const tittle = "Reporte Counters Paquetes de " + this.listSucursales[(this.form.get("sucursal").value) - 1]['nombre'] + " " + monedaTexto;

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
  }

}
