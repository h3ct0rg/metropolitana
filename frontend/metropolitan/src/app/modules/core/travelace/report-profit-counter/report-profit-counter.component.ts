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
  logs: Logs;
  token: any;

  constructor(
    private counterService: CounterService,
    private sucursalesService: SucursalService,
    private storage: StorageService,
    private logService: LogsService
  ) {
    this.isSpinning = true;
    this.form = new FormGroup({
      fechaStardDate: new FormControl(null, [Validators.required]),
      fechaEndDate: new FormControl(null, [Validators.required]),
      sucursal: new FormControl(null)
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

  generateNote() {
    this.totalCounter = 0;
    this.totalSumar = 0;
    const fechaStart = this.form.get("fechaStardDate").value;
    const fechaEnd = this.form.get("fechaEndDate").value;

    this.fechaIni = this.getTime(fechaStart);
    this.fechaF = this.getTime(fechaEnd);
    this.listTablePDF = [];
    this.counterService.getCounterProfitByDateByCity(this.form.get("fechaStardDate").value, this.form.get("fechaEndDate").value, this.form.get("sucursal").value).subscribe(result => {
      this.listCounters = result;
      this.listCounters.forEach(result => {
        this.listTablePDF.push([result['agencia'], result['nombre'], result['total'].toFixed(2), result['totalSales'].toFixed(2)]);
        this.totalCounter += result.total;
        this.totalSumar += result.totalSales;
      });
      this.listTablePDF.push(["", "", "Total Counter", "Total Ventas"]);
      this.listTablePDF.push(["", "", this.totalCounter.toFixed(2), this.totalSumar.toFixed(2)]);
      this.isSpinning = false;

      this.logs.eventShoot = "Click Reporte Ventas Counter";
      this.logService.saveLogItem(this.logs).subscribe(sucess => { });
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
    const nombreSucursal = this.listSucursales.find(item => item.id = this.form.get("sucursal").value)['nombre']
    const tittle = "Reporte Counters Universal Assistance de " + nombreSucursal;

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

    this.logs.eventShoot = "Click Imprimir Reporte Ventas Counter";
    this.logService.saveLogItem(this.logs).subscribe(sucess => { });
  }
}
