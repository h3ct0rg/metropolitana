import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FlujoCajaService } from '../../services/flujo-caja.services';
import { FlujoCajaResumen, FlujoCajaMovimiento } from '../../../../shared/model/flujo-caja';

@Component({
  selector: 'app-flujo-caja-report',
  templateUrl: './flujo-caja-report.component.html',
  styleUrls: ['./flujo-caja-report.component.css']
})
export class FlujoCajaReportComponent implements OnInit {
  public form: FormGroup;
  public isSpinning: boolean = false;
  public resumen: FlujoCajaResumen[] = [];
  public detalle: FlujoCajaMovimiento[] = [];
  public fechaIni: string;
  public fechaF: string;

  constructor(private flujoCajaService: FlujoCajaService) {
    this.form = new FormGroup({
      fechaStardDate: new FormControl(null, [Validators.required]),
      fechaEndDate: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {
  }

  generarReporte() {
    const fechaStart = this.form.get("fechaStardDate").value;
    const fechaEnd = this.form.get("fechaEndDate").value;
    this.isSpinning = true;
    this.fechaIni = this.getTime(fechaStart);
    this.fechaF = this.getTime(fechaEnd);

    this.flujoCajaService.getResumen(fechaStart, fechaEnd).subscribe(result => {
      this.resumen = result;
      this.isSpinning = false;
    });

    this.flujoCajaService.getDetalle(fechaStart, fechaEnd).subscribe(result => {
      this.detalle = result;
    });
  }

  getTime(theTime) {
    const d = new Date(theTime);
    return d.getDate() + " / " + (d.getMonth() + 1) + " / " + d.getFullYear();
  }

  getTimeForFile(theTime) {
    const d = new Date(theTime);
    return d.getDate() + "_" + (d.getMonth() + 1) + "_" + d.getFullYear();
  }

  generarPDF() {
    const name = "flujo_de_caja_" + this.getTimeForFile(new Date()) + ".pdf";
    const doc = new jsPDF("landscape");
    const img = new Image();
    img.src = "../../../../assets/img/metropolitana-slogan.jpg";
    doc.addImage(img, 'JPEG', 75, 10, 50, 23);

    autoTable(doc, {
      margin: { top: 40, bottom: 10 },
      head: [['Flujo de Caja']],
      theme: 'plain',
    });

    autoTable(doc, {
      margin: { top: 250, bottom: 50 },
      head: [['Fecha del: ' + this.fechaIni, 'Fecha Al: ' + this.fechaF]],
      theme: 'plain',
    });

    autoTable(doc, {
      head: [['Cuenta', 'Moneda', 'Cantidad de Operaciones', 'Total Ingresado']],
      body: this.resumen.map(r => [r.cuenta, r.moneda, r.cantidadOperaciones.toString(), r.totalIngresos.toFixed(2)]),
      theme: 'grid'
    });

    autoTable(doc, {
      head: [['Fecha', 'Módulo', 'ND', 'Cuenta', 'Forma de Pago', 'Moneda', 'Monto', 'Concepto']],
      body: this.detalle.map(m => [
        this.getTime(m.fechaPago), m.modulo, m.idNotaDebito.toString(), m.cuenta, m.formaPago, m.moneda, m.monto.toFixed(2), m.concepto
      ]),
      theme: 'grid'
    });

    doc.save(name);
  }
}
