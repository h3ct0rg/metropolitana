import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NotaDebitoService } from './../../../services/nota-debito.services';
import { NotaDebitoFilter } from '../../../../../shared/model/filterNotaDevito';
import { ClientService } from '../../../services/clientes.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { StorageService } from '../../../../../shared/services/local-data/storage.service';
import { IStorageKeys } from '../../../../../shared/services/local-data/storage';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'nota-reporte-cliente',
  templateUrl: './reporte-cliente.component.html',
  styleUrls: ['./reporte-cliente.component.css']
})
export class NotaDebitoReporteListComponent implements OnInit {
  isVisible = false;
  montoTotal = 0;
  montoComision = 0;
  listOfData = [];
  listOfTotals = [];
  buscarCliente = 0;
  buscarFecha = "";
  notaDebitoFilter: NotaDebitoFilter;
  listClientes = [] = [];
  form: FormGroup;
  waitAction: boolean = true;
  numeroNotaDebito: number = 0;
  public printND: boolean;

  public createdBy: string;
  public fechaCreate: string;
  public fechaVencimiento: string;
  public concepto: string;

  clientePagar: string;
  numeroNota: number;
  usuarioSistema: string;
  conceptonota: string;

  constructor(
    private notaDebitoService: NotaDebitoService,
    private clientes: ClientService,
    private storage: StorageService,
    private contentL: ElementRef,
    private userService: UsuarioService
  ) {
    this.printND = false;
  }

  ngOnInit() {
    this.chargeDataNotaDebito();

    this.notaDebitoFilter = {
      allClientes: true,
      allFechas: false,
      fechaMes: "",
      idcliente: 0
    }

    this.clientes.getClientList().subscribe(data => {
      this.listClientes = data;
      this.listOfTotals = [];
      this.listOfTotals.push(this.calcular("Normal", "normal"));
      this.listOfTotals.push(this.calcular("Low Cost", "LOW COST"));
      this.listOfTotals.push(this.calcular("AMP", "SEG AMP"));
      this.listOfTotals.push(this.calcular("Nacional", "NACIONAL"));
    });

    this.form = new FormGroup({
      codCliente: new FormControl(),
      fechaRegistro: new FormControl(),
      isCheckedDates: new FormControl(),
      isCheckedClientes: new FormControl(),
      codigoDebito: new FormControl()
    });

    this.form.get("isCheckedDates").setValue(true);
    this.form.get("isCheckedClientes").setValue(true);

    this.form.get("codigoDebito").valueChanges.subscribe(data => {
      if (data == "") {
        this.printND = false;
        this.updateCheckClientes();
      }
      else {
        this.printND = true;
        this.notaDebitoService.getNotaDebitoByCodigoUnico(data, this.getActualSucursal()).subscribe(data => {
          if (this.listOfData.length > 0) {
            this.clientes.getClient(this.listOfData[0].codCliente).subscribe(
              clienteR => {
                this.clientePagar = clienteR.name;
              }
            );
          }
          this.userService.getUser(data[0].createBy.toString()).subscribe(user => {
            this.createdBy = user.nombre;
          });
          this.fechaCreate = this.getTime(data[0]['fechaGestion']);
          this.fechaVencimiento = this.getTime(data[0]['fechaGestion']);
          this.concepto = data[0]['concepto'];

          this.listOfData = data;
          this.chargeClientName(this.listOfData);
          this.listOfTotals = [];
          this.listOfTotals.push(this.calcular("Normal", "normal"));
          this.listOfTotals.push(this.calcular("Low Cost", "LOW COST"));
          this.listOfTotals.push(this.calcular("AMP", "SEG AMP"));
          this.listOfTotals.push(this.calcular("Nacional", "NACIONAL"));
          if (this.listOfData.length > 0) {
            this.numeroNota = this.listOfData[0].codigoUnico;

            this.clientes.getClient(this.listOfData[0].codCliente).subscribe(
              clienteR => {
                this.clientePagar = clienteR.name;
              }
            );
          }
        });
      }
    });

  }

  chargeDataNotaDebito() {
    this.notaDebitoService.getNotaDebitoBySucursalComplete(this.getActualSucursal()).subscribe((data: []) => {
      this.listOfTotals = [];
      this.listOfData = data;
      this.chargeClientName(this.listOfData);
      this.listOfTotals.push(this.calcular("Normal", "normal"));
      this.listOfTotals.push(this.calcular("Low Cost", "LOW COST"));
      this.listOfTotals.push(this.calcular("AMP", "SEG AMP"));
      this.listOfTotals.push(this.calcular("Nacional", "NACIONAL"));
      this.waitAction = false;
      this.numeroNota = this.listOfData[0].codigoUnico;
      this.conceptonota = this.listOfData[0].concepto;
      this.numeroNotaDebito = this.numeroNota;
      this.clientes.getClient(this.listOfData[0].codCliente).subscribe(
        clienteR => {
          this.clientePagar = clienteR.name;
        }
      );
      this.userService.getUser(this.listOfData[0].createBy.toString()).subscribe(user => {
        this.createdBy = user.nombre;
      });
      let token = this.storage.get(IStorageKeys.Token);
      this.usuarioSistema = JSON.parse(token)["userName"]
    });
  }
  chargeClientName(listOfData: any[]) {
    listOfData.forEach(data => {
      const result = this.listClientes.find(d => d["id"] == data["codCliente"]);
      if (result) {
        data["nombreCliente"] = result["name"];
      }
    })
  }

  getTime(theTime) {
    const d = new Date(theTime);
    const hora = d.getDate() + " / " + (d.getMonth() + 1) + " / " + d.getFullYear();
    return hora;
  }

  getDateNow(moreMonth: number) {
    let actualDate = new Date();
    let fechaActual = actualDate.getDate() + "/" + actualDate.getMonth() + "/" + actualDate.getFullYear();
    if (moreMonth != undefined) {
      let mes = actualDate.getMonth();
      fechaActual = actualDate.getDate() + "/" + (mes + moreMonth) + "/" + actualDate.getFullYear();
    }
    return fechaActual;
  }

  chargeDataNotaDebitoQuestion(dataFilter: NotaDebitoFilter) {

    this.notaDebitoService.getNotaDebitoByClient(dataFilter).subscribe((data: []) => {
      this.listOfTotals = [];
      this.listOfData = data;
      this.chargeClientName(this.listOfData);
      this.listOfTotals.push(this.calcular("Normal", "normal"));
      this.listOfTotals.push(this.calcular("Low Cost", "LOW COST"));
      this.listOfTotals.push(this.calcular("AMP", "SEG AMP"));
      this.listOfTotals.push(this.calcular("Nacional", "NACIONAL"));
    });
  }


  calcular(title, typeRow) {
    let listOfTotals = [];
    let totalAgencia = 0;
    let totalCounter = 0;
    let totalMetropolitan = 0;
    let totalArgentina = 0;
    let totalMontoNeto = 0;

    if (this.listOfData.length > 0) {

      this.listOfData.forEach((data) => {
        if (typeRow == "normal") {
          if (!(data.servicio.includes("LOW COST") || data.servicio.includes("SEG AMP") || data.servicio.includes("NACIONAL"))) {
            totalAgencia = totalAgencia + data.totalAgencia;
            totalCounter = totalCounter + data.totalCounter;
            totalMetropolitan = totalMetropolitan + data.totalMetropolitana;
            totalArgentina = totalArgentina + data.totalArgentina;
            totalMontoNeto = totalMontoNeto + data.montoNeto;
          }
        }
        else {
          if (data.servicio.includes(typeRow)) {
            totalAgencia = totalAgencia + data.totalAgencia;
            totalCounter = totalCounter + data.totalCounter;
            totalMetropolitan = totalMetropolitan + data.totalMetropolitana;
            totalArgentina = totalArgentina + data.totalArgentina;
            totalMontoNeto = totalMontoNeto + data.montoNeto;
          }
        }
      });
      listOfTotals.push(title);
      listOfTotals.push(totalAgencia.toFixed(2));
      listOfTotals.push(totalCounter.toFixed(2));
      listOfTotals.push(totalMetropolitan.toFixed(2));
      listOfTotals.push(totalArgentina.toFixed(2));
      listOfTotals.push(totalMontoNeto.toFixed(2));

    }
    return listOfTotals;
  }

  onPrint() {
    //window.print();
    this.generarPDF();
  }

  updateCheckClientes() {
    this.notaDebitoFilter.allClientes = this.form.get('isCheckedClientes').value;
    this.notaDebitoFilter.allFechas = this.form.get('isCheckedDates').value;
    this.notaDebitoFilter.fechaMes = this.form.get('fechaRegistro').value;
    this.notaDebitoFilter.idcliente = this.form.get('codCliente').value;
    if (this.notaDebitoFilter.idcliente == null) {
      this.notaDebitoFilter.idcliente = 0;
    }
    if (this.notaDebitoFilter.fechaMes == null) {
      this.notaDebitoFilter.fechaMes = "";
    }
    this.chargeDataNotaDebitoQuestion(this.notaDebitoFilter);
  }

  showModal(): void {
    this.isVisible = true;
    this.montoTotal = 0;
    this.montoComision = 0;

    if (this.listOfData.length > 0) {
      this.clientes.getClient(this.listOfData[0].codCliente).subscribe(
        clienteR => {
          this.clientePagar = clienteR.name;
        }
      );
    }

    this.listOfTotals.forEach((data) => {
      this.montoTotal += parseFloat(data[5]);
      this.montoComision += parseFloat(data[1]);// + parseFloat(data[2]) + parseFloat(data[3]);
    });
    //this.generarPDF();
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  generarPDF() {
    let numneroHeader = this.numeroNota;
    html2canvas(document.getElementById('pdfContainer'), {
      allowTaint: true,
      useCORS: false,
      scale: 1
    }).then(function (canvas) {
      var img = canvas.toDataURL("image/jpeg", 0.5);
      var doc = new jsPDF();
      var imgWidth = 195;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(img, 'JPEG', 7, 5, imgWidth, imgHeight);
      let name = "notaDebito" + numneroHeader + ".pdf";
      doc.save(name);
    });
  }

  getActualSucursal() {
    const token = this.storage.parse(IStorageKeys.Token);
    return token.sucursal;
  }
}
