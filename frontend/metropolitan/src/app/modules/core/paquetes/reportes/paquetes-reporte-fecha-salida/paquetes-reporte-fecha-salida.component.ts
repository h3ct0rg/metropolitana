import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PaquetesNotaDebitoService } from '../../../services/paquetes/paquete-nota-debito.services';
import { SucursalService } from '../../../services/sucursal.services';

@Component({
  selector: 'app-paquetes-reporte-fecha-salida',
  templateUrl: './paquetes-reporte-fecha-salida.component.html',
  styleUrls: ['./paquetes-reporte-fecha-salida.component.css']
})
export class PaquetesReporteFechaSalidaComponent implements OnInit {
  public form: FormGroup;
  public listSucursales = [];
  public listResultados: any[] = [];
  public isSpinning = false;
  public fechaIni: string;
  public fechaF: string;

  constructor(
    private notaDebitoService: PaquetesNotaDebitoService,
    private sucursalesService: SucursalService
  ) {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.form = new FormGroup({
      fechaStardDate: new FormControl(inicioMes, [Validators.required]),
      fechaEndDate: new FormControl(hoy, [Validators.required]),
      sucursal: new FormControl(null, [Validators.required])
    });

    this.sucursalesService.getSucursalList().subscribe(result => {
      this.listSucursales = result;
      this.form.get('sucursal').setValue(result[0].id);
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

  generateNote() {
    if (this.rangoFechasInvalido) {
      return;
    }
    this.isSpinning = true;
    const fechaStart = this.form.get('fechaStardDate').value;
    const fechaEnd = this.form.get('fechaEndDate').value;
    this.fechaIni = this.getTime(fechaStart);
    this.fechaF = this.getTime(fechaEnd);

    this.notaDebitoService.getReporteFechaSalida(fechaStart, fechaEnd, this.form.get('sucursal').value).subscribe(result => {
      this.listResultados = result;
      this.isSpinning = false;
    });
  }

  getTime(theTime) {
    if (!theTime) { return '-'; }
    const d = new Date(theTime);
    return d.getDate() + ' / ' + (d.getMonth() + 1) + ' / ' + d.getFullYear();
  }

  getTimeForFile(theTime) {
    const d = new Date(theTime);
    return d.getDate() + '_' + (d.getMonth() + 1) + '_' + d.getFullYear();
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
      img.src = '../../../../assets/img/metropolitana-slogan.jpg';
    });
  }

  async generarPDF() {
    const name = 'reporte_fecha_salida_paquetes_' + this.getTimeForFile(new Date()) + '.pdf';
    const doc = new jsPDF('landscape');
    const nombreSucursal = this.listSucursales.find(item => item.id === this.form.get('sucursal').value);
    const tittle = 'Reporte ND por Fecha de Salida - Paquetes ' + (nombreSucursal ? nombreSucursal.nombre : '');

    const logoDataUrl = await this.getLogoDataUrl();
    doc.addImage(logoDataUrl, 'JPEG', 75, 10, 50, 23);

    autoTable(doc, {
      margin: { top: 40, bottom: 10 },
      head: [[tittle]],
      theme: 'plain',
    });

    autoTable(doc, {
      head: [['Fecha del: ' + this.fechaIni, 'Fecha Al: ' + this.fechaF]],
      theme: 'plain',
    });

    autoTable(doc, {
      head: [['ND', 'Voucher', 'Agencia', 'Operador', 'Pasajero', 'Fecha de Salida', 'Fecha Gestión', 'Monto Neto']],
      body: this.listResultados.map(r => [
        r.codigoUnico, r.voucher, r.nombreAgencia, r.nombreOperador, r.pasajero,
        this.getTime(r.fechaSalida), this.getTime(r.fechaGestion), r.montoNeto.toFixed(2)
      ]),
      theme: 'grid'
    });

    doc.save(name);
  }
}
