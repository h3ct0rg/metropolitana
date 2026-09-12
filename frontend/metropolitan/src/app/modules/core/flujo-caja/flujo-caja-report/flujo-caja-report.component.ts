import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FlujoCajaService } from '../../services/flujo-caja.services';
import { SucursalService } from '../../services/sucursal.services';
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
  public listSucursales = [];
  public listAreas = [
    { value: 'TODAS', label: 'Todas las áreas' },
    { value: 'TRAVELACE', label: 'Travelace (UA)' },
    { value: 'PAQUETES', label: 'Paquetes' },
    { value: 'CARGA', label: 'Carga' }
  ];

  constructor(
    private flujoCajaService: FlujoCajaService,
    private sucursalesService: SucursalService
  ) {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.form = new FormGroup({
      fechaStardDate: new FormControl(inicioMes, [Validators.required]),
      fechaEndDate: new FormControl(hoy, [Validators.required]),
      area: new FormControl('TODAS'),
      sucursal: new FormControl(0)
    });

    this.sucursalesService.getSucursalList().subscribe(result => {
      this.listSucursales = result;
    });
  }

  ngOnInit() {
  }

  get rangoFechasInvalido(): boolean {
    const inicio = this.form.get('fechaStardDate').value;
    const fin = this.form.get('fechaEndDate').value;
    if (!inicio || !fin) { return false; }
    return new Date(fin) < new Date(inicio);
  }

  generarReporte() {
    if (this.rangoFechasInvalido) {
      return;
    }
    const fechaStart = this.form.get("fechaStardDate").value;
    const fechaEnd = this.form.get("fechaEndDate").value;
    const area = this.form.get("area").value;
    const sucursal = this.form.get("sucursal").value;
    this.isSpinning = true;
    this.fechaIni = this.getTime(fechaStart);
    this.fechaF = this.getTime(fechaEnd);

    this.flujoCajaService.getResumen(fechaStart, fechaEnd, area, sucursal).subscribe(result => {
      this.resumen = result;
      this.isSpinning = false;
    });

    this.flujoCajaService.getDetalle(fechaStart, fechaEnd, area, sucursal).subscribe(result => {
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
      head: [['Fecha', 'Módulo', 'ND', 'Cuenta', 'Forma de Pago', 'Moneda', 'Tipo de Cambio', 'Monto', 'Concepto']],
      body: this.detalle.map(m => [
        this.getTime(m.fechaPago), m.modulo, m.idNotaDebito.toString(), m.cuenta, m.formaPago, m.moneda,
        m.tipoCambioValor ? m.tipoCambioValor.toFixed(2) : '-', m.monto.toFixed(2), m.concepto
      ]),
      theme: 'grid'
    });

    doc.save(name);
  }
}
