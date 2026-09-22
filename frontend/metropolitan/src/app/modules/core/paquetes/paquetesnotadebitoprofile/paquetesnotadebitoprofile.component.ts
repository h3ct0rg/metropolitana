import { Component, OnInit } from '@angular/core';
import { PaquetesNotaDebitoService } from '../../services/paquetes/paquete-nota-debito.services';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/clientes.service';
import { CounterService } from '../../services/counter.services';
import { OperadorService } from '../../services/operador.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NotaDebito } from '../../../../shared/model/nota-debito';
import { UsuarioService } from '../../services/usuario.service';
import { Logs } from '../../../../shared/model/Logs';
import { LogsService } from '../../services/Logs/logs.services';

@Component({
  selector: 'app-paquetesnotadebitoprofile',
  templateUrl: './paquetesnotadebitoprofile.component.html',
  styleUrls: ['./paquetesnotadebitoprofile.component.css']
})
export class PaquetesnotadebitoprofileComponent implements OnInit {
  public form: FormGroup;
  token: string;
  notaDebitoID: string;
  waitAction: boolean = false;
  notaDebito: NotaDebito;
  fechaRegistro: string;
  fechaVencimimento: string;
  public isAdmin: boolean = false;
  cliente: string;
  operador: string;
  pasajero: string;
  servicio: string;
  voucher: string;
  counter: string;
  concepto: string;
  liquidacion: string;
  montoNeto: number;
  public resultSum: number;
  public alPax: number;
  public comicionAgencia: number;
  comicionCounter: number;
  comisionMetropolitana: number;
  comisionArgentina: number;
  netoLiquidar: number;
  numeroNotaDebito: number = 0;
  isVisible: boolean = false;
  isVisibleBorrar: boolean = false;
  saveData: boolean = false;
  nombreCreador: string;
  public estadoButton = true;
  public estado = "";
  public conceptoTemporal = "";
  public isAnulation: boolean = false;
  public idUser = "";
  logs: Logs;

  constructor(
    private notaDebitoServices: PaquetesNotaDebitoService,
    private storage: StorageService,
    private route: ActivatedRoute,
    private router: Router,
    private clienteServicio: ClientService,
    private counterService: CounterService,
    private operadorService: OperadorService,
    private usuarioService: UsuarioService,
    private storageService: StorageService,
    private logService: LogsService
  ) {
    this.setUserName();
    this.notaDebito = {
      codCliente: 0,
      codCounter: 0,
      codigoUnico: 0,
      codOperador: 0,
      codTipoCambio: 0,
      concepto: "",
      createBy: 0,
      createDate: "",
      fechaGestion: "",
      fechaVencimiento: "",
      isEspecial: 0,
      modify: 0,
      modifyDate: "",
      montoNeto: 0,
      pasajero: "0",
      servicio: "0",
      total: 0,
      totalAgencia: 0,
      totalArgentina: 0,
      totalCounter: 0,
      totalMetropolitana: 0,
      voucher: "0",
      id: 0,
      estado: 0
    }

    this.form = new FormGroup({
      fechaRegistro: new FormControl(null, [Validators.required])
    })
  }

  get monedaSimbolo(): string {
    return this.notaDebito.monedaNota === 2 ? 'Bs.' : '$us';
  }

  get factorConversion(): number {
    return this.notaDebito.monedaNota === 2 && this.notaDebito.tipoCambioValor ? this.notaDebito.tipoCambioValor : 1;
  }

  stateTranslate(estado) {
    switch (estado) {
      case 0:
        {
          return "Normal";
        }
      case 1:
        {
          return "Anulado";
        }
      case 2:
        {
          return "Remitido";
        }
    }
  }

  ngOnInit() {
    this.token = this.storage.get(IStorageKeys.Token);
    this.idUser = JSON.parse(this.token)["userId"];

    this.route.paramMap.subscribe(param => {
      const operadorParam = param;
      this.notaDebitoID = operadorParam["params"].id;

      if (this.notaDebitoID) {
        this.waitAction = true;
        this.notaDebitoServices.getNotaDebito(this.notaDebitoID).subscribe(notad => {

          this.notaDebito = notad;
          this.waitAction = false;
          this.fechaRegistro = this.getDateNow(this.notaDebito.fechaGestion);//.toString();
          this.fechaVencimimento = this.getDateNow(this.notaDebito.fechaVencimiento);
          this.clienteServicio.getClientPaquetes(this.notaDebito.codCliente.toString()).subscribe(cliRe => {
            this.cliente = cliRe.name;
          });

          this.operadorService.getOperadorPaquetes(this.notaDebito.codOperador.toString()).subscribe(op => {
            this.operador = op.name;
          });

          this.pasajero = this.notaDebito.pasajero;
          this.servicio = this.notaDebito.servicio;
          this.voucher = this.notaDebito.voucher;

          this.counterService.getCounterPaquet(this.notaDebito.codCounter.toString()).subscribe(co => {
            this.counter = co.name;
          });

          this.concepto = this.notaDebito.concepto;

          this.montoNeto = this.notaDebito.montoNeto;
          this.alPax = this.notaDebito.total;
          this.comicionAgencia = this.notaDebito.totalAgencia;
          this.resultSum = this.montoNeto - this.comicionAgencia;
          this.comicionCounter = this.notaDebito.totalCounter;
          this.comisionMetropolitana = this.notaDebito.totalMetropolitana;
          this.comisionArgentina = this.notaDebito.totalArgentina;

          this.netoLiquidar = this.notaDebito.montoNeto;
          this.numeroNotaDebito = this.notaDebito.codigoUnico;
          const createBy = this.notaDebito.createBy;
          this.usuarioService.getUser(createBy.toString()).subscribe(createdClient => {
            this.nombreCreador = createdClient.nombre;
          });

          this.estadoButton = this.notaDebito.estado == 0 ? true : false;
        });
        this.logs = {
          id: "00000000-0000-0000-0000-000000000000",
          eventShoot: "Click Imprimir Nota Debito: " + this.notaDebito.codigoUnico,
          fromEvent: "Nota Debito Profile",
          idSucursal: this.notaDebito.idSucursal,
          itemUsed: "",
          userEvent: JSON.parse(this.token)["userId"],
          createDate: "1/1/2020 01:01:00"
        }
      }
    });
  }

  getDateNow(fechita) {
    let actualDate = new Date(fechita);
    let fechaActual = actualDate.getDate() + "/" + (actualDate.getMonth() + 1) + "/" + actualDate.getFullYear();
    return fechaActual;
  }

  generarPDF() {
    // Ajustamos la escala para mejorar la calidad de la imagen
    let nnumeroNombre = this.numeroNotaDebito;

    // Añadimos una clase temporal para neutralizar el estilo "glass" durante la captura
    const pdfContainer = document.getElementById('pdfContainer');
    pdfContainer.classList.add('pdf-print');

    html2canvas(pdfContainer, {
      allowTaint: true,
      useCORS: true, // permite el uso de imágenes externas si tienen la cabecera CORS configurada
      scale: 2, // Escala mejorada para mayor calidad
      windowWidth: 1200 // fuerza el layout de escritorio (2 columnas) sin importar el ancho real de la ventana
    }).then(canvas => {
      const img = canvas.toDataURL("image/jpeg", 0.5);
      const doc = new jsPDF();

      // Ajuste de la posición y el tamaño de la imagen, preservando la proporción real de la captura
      const imgWidth = 200;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(img, 'JPEG', 5, 5, imgWidth, imgHeight);
      let name = `notaDebito_${nnumeroNombre}.pdf`;
      doc.save(name);

      // Removemos la clase de estilo PDF después de generar el archivo
      pdfContainer.classList.remove('pdf-print');
    });

    // Guardamos el log
    this.logs.eventShoot = "Imprimir Nota de Debito Numero: " + this.notaDebito.codigoUnico;
    this.logService.saveLogItemPaquetes(this.logs).subscribe(sucess => { });
  }

  Anular() {
    this.isVisibleBorrar = true;
  }

  handleOkAnular() {
    this.isAnulation = true;
    this.notaDebito.estado = 1;
    this.notaDebito.estadoEditado = 1;
    this.notaDebitoServices.deleteNotaDebito(this.notaDebito.id, this.idUser).subscribe(result => {
      this.isVisibleBorrar = false;

      this.logs.eventShoot = "Click Ok anular Nota de Debito Numero: " + this.notaDebito.codigoUnico;
      this.logService.saveLogItemPaquetes(this.logs).subscribe(success => {
        this.router.navigate(['/main/paquetes/nota-debito']);
      });
    });
  }

  handleCancelAnular() {
    this.logs.eventShoot = "Click Cancel anular Nota de Debito Numero: " + this.notaDebito.codigoUnico;
    this.logService.saveLogItemPaquetes(this.logs).subscribe(success => {
    });
    this.isVisibleBorrar = false;
  }

  NDAnulacion() {
    this.isAnulation = true;
    this.notaDebito.estado = 1;
    this.notaDebito.estadoEditado = 1;
    this.conceptoTemporal = this.notaDebito.concepto;
    this.notaDebito.concepto = this.notaDebito.concepto + '(ANULADO)';
    this.notaDebitoServices.updateNotaDebito(this.notaDebito).subscribe(result => {
      this.isVisible = true;
      this.estado = " Anulado de Nota de Debito N°: ";
      this.logs.eventShoot = "Click ND Anulacion Nota de Debito Numero: " + this.notaDebito.codigoUnico;
      this.logService.saveLogItemPaquetes(this.logs).subscribe(success => {
      });
    });
  }

  Remitir() {
    this.isAnulation = true;
    this.notaDebito.estado = 2;
    this.notaDebito.estadoEditado = 1;
    this.notaDebitoServices.updateNotaDebito(this.notaDebito).subscribe(result => {
      this.isVisible = true;
      this.estado = " Remitido de Nota de Debito N°: ";
      this.logs.eventShoot = "Click Remitir Nota de Debito Numero: " + this.notaDebito.codigoUnico;
      this.logService.saveLogItemPaquetes(this.logs).subscribe(success => { });
    });
  }

  PendienteFecha() {
    this.isAnulation = true;
    this.notaDebito.estado = 3;
    this.notaDebito.estadoEditado = 1;
    this.notaDebitoServices.updateNotaDebito(this.notaDebito).subscribe(result => {
      this.isVisible = true;
      this.estado = "Pendiente de fecha de Nota de Debito N°: ";
      this.logs.eventShoot = "Click Pendiente Fecha Nota de Debito Numero: " + this.notaDebito.codigoUnico;
      this.logService.saveLogItemPaquetes(this.logs).subscribe(success => { });
    });
  }

  handleOk() {
    if (this.isAnulation) {
      const data = this.form.get("fechaRegistro").value;
      this.notaDebito.concepto = this.conceptoTemporal;
      this.notaDebito.concepto += this.estado + " " + this.notaDebito.codigoUnico;
      this.notaDebito.fechaVencimiento = data;
      this.notaDebito.fechaGestion = data;
      this.notaDebito.codigoUnico = -1;
      this.notaDebitoServices.saveNotaDebitoItem(this.notaDebito).subscribe(re => {
        this.router.navigate(['/main/paquetes/edit-nota-debito/' + re['id']]);
      });
    }
    this.isVisible = false;
  }

  handleCancel() {
    this.isVisible = false;
  }

  setUserName = () => {
    const token = this.storageService.parse(IStorageKeys.Token);
    this.usuarioService.getUser(token['userId']).subscribe(item => {
      let listRole = item.idRole;
      listRole.forEach(l => {
        if (l == 1) {
          this.isAdmin = true;
        }
      });
    });

  }
}
