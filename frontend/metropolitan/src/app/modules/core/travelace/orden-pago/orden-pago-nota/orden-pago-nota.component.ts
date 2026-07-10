import { Component, OnInit, Input } from '@angular/core';
import { OrdenPagoService } from '../../../services/orden-pago.services';
import { ListaOrdenPagoPendienteService } from '../../../services/orden-pago-list.services';
import { FormGroup } from '@angular/forms';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { changeNumbertoLetter } from '../../../services/numeroaletra.service';
import { StorageService } from '../../../../../shared/services/local-data/storage.service';
import { IStorageKeys } from '../../../../../shared/services/local-data/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { NotaDebitoService } from '../../../services/nota-debito.services';
import { ClientService } from '../../../services/clientes.service';
import { OrdenPago } from '../../../../../shared/model/orden-pago';
import { UsuarioService } from '../../../services/usuario.service';


@Component({
  selector: 'orden-pago-nota',
  templateUrl: './orden-pago-nota.component.html',
  styleUrls: ['./orden-pago-nota.component.css']
})
export class OrdenPagoNotaComponent implements OnInit {
  @Input() listOfData = [];
  @Input() montoPagado: string;
  @Input() nombreCliente: string;
  @Input() fechaRegistro: string;
  @Input() formaPagoId: number;
  numeroOrdenPago: string;
  @Input() nameCreator: string;
  ordenNumner: changeNumbertoLetter;
  token: string;
  localOrdenPago: OrdenPago;
  formaPagoText = "";
  cuentaBanco = "";
  public listOPN: string = "";
  public isSpinning = true;

  public form: FormGroup;

  optionsMetodoPago = [
    { id: "1", name: "Efectivo" },
    { id: "2", name: "Tarjeta Credito/Debito" },
    { id: "3", name: "Cheque" },
    { id: "4", name: "Cuenta de Banco" },
    { id: "5", name: "WE TRAVEL" }
  ];

  cuentas = [
    { id: "1", name: "BANCO BISA CUENTA 11 EN DOLARES METRO" },
    { id: "2", name: "BANCO BISA CUENTA 19 EN BOLIVIANOS METRO" },
    { id: "3", name: "BANCO GANADERO CUENTA 39 EN DOLARES LILIANA" },
    { id: "4", name: "BANCO NACIONAL CUENTA 73 EN DOLARES METRO" },
    { id: "5", name: "BCP CUENTA 17 EN BOLIVIANOS ANDREA" },
    { id: "6", name: "BCP CUENTA 301 EN BOLIVIANOS ANDREA" },
    { id: "7", name: "GANADERO CUENTA 361 BOLIVIANOS Lilian" },
    { id: "8", name: "BANCO MERCANTIL SANTA CRUZ CUENTA 252 BOLIVIANOS Liliana " },
    { id: "9", name: "BANCO UNION CUENTA 843 BOLIVIANOS Lilian Fiordoliva" },
    { id: "10", name: "BANCO BISA CUENTA 4025 EN BS ANDREA" }
  ]

  constructor(
    private storage: StorageService,
    private route: ActivatedRoute,
    private ordenPagoService: OrdenPagoService,
    private notaDebitoService: NotaDebitoService,
    private clienteService: ClientService,
    private userService: UsuarioService
  ) {
    this.form = new FormGroup({});
    this.ordenNumner = new changeNumbertoLetter();
    this.fechaRegistro = new Date().toDateString();
  }

  ngOnInit() {
    this.token = this.storage.get(IStorageKeys.Token);
    JSON.parse(this.token)["userId"]
    this.route.paramMap.subscribe(param => {
      let operadorParam = param;
      this.numeroOrdenPago = operadorParam["params"].id;
      if (this.numeroOrdenPago) {
        this.loadOrdenPagoDatos(this.numeroOrdenPago);
      }
    });
  }

  textConfim(numeroOP) {
    this.listOPN = "";
    this.isSpinning = true;
    this.numeroOrdenPago = numeroOP;
    this.loadOrdenPagoDatos(this.numeroOrdenPago);
  }

  loadOrdenPagoDatos(ordenPago) {
    this.ordenPagoService.getOrdenPago(ordenPago).subscribe(result => {
      this.formaPagoId = this.formaPagoId == undefined ? result.formaPago : this.formaPagoId;
      if (result.id != 0) {
        this.localOrdenPago = result;
        this.userService.getUser(this.localOrdenPago.createBy.toString()).subscribe(res => {
          this.nameCreator = res.nombre;
        });
        this.numeroOrdenPago = result.numeroPago.toString();
        this.ordenPagoService.getOrdenPagoByCodProfile(result.codProfile).subscribe(resultCodProfile => {
          let calcular = 0;
          resultCodProfile.forEach(key => {            
            this.listOPN += " " + key.numeroPago + ",";
            this.notaDebitoService.getNotaDebitoByCodigoUnico(key.numeroNotaDebito, key.idSucursal).subscribe(NDResult => {
              key['nombreCliente'] = NDResult[0]['codigoUnico'];
              key['pasajero'] = NDResult[0]['servicio'];
              this.isSpinning = false;
            })

            calcular += key.montoAPagar;
          });
          this.listOPN = this.listOPN.substring(0, this.listOPN.length - 1)+" ";
          this.montoPagado = calcular.toFixed(2);
          this.listOfData = resultCodProfile;
          this.getFormaPago();
        });

        this.notaDebitoService.getNotaDebitoByCodigoUnico(result.numeroNotaDebito.toString(), this.localOrdenPago.idSucursal).subscribe(resultNota => {
          this.clienteService.getClient(resultNota[0].codCliente.toString()).subscribe(resultCliente => {
            this.nombreCliente = resultCliente.name;
          });
        });
      }
    });
  }

  getDecimals(num) {
    let number = (((num % 1) * 100).toFixed(0)).toString();
    return number.length == 1 ? "0" + number : number;
  }

  onPrint() {
    this.generarPDF();
  }

  getFormaPago() {
    let resultMetodoPago = this.optionsMetodoPago.find(item => item.id == this.formaPagoId.toString());
    if (resultMetodoPago) {
      this.formaPagoText = resultMetodoPago['name'];
      if (this.formaPagoId == 4) {
        this.formaPagoText += " - " + this.cuentas.find(item => parseInt(item.id) == parseInt(this.localOrdenPago.numeroTarjeta)).name;
      }
    }
  }

  getTime(theTime) {
    var d = new Date(theTime);
    let hora = d.getDate() + " / " + (d.getMonth() + 1) + " / " + d.getFullYear();
    return hora;
  }

  generarPDF() {
    let numneroHeader = this.numeroOrdenPago;
    const pdfElement = document.getElementById('pdfContainer');
    pdfElement.classList.add('pdf-print');
    html2canvas(pdfElement, {
      allowTaint: true,
      useCORS: false,
      scale: 1
    }).then(function (canvas) {
      pdfElement.classList.remove('pdf-print');
      var img = canvas.toDataURL("image/jpeg", 0.5);
      var doc = new jsPDF();
      var imgWidth = 180;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      doc.addImage(img, 'JPEG', 15, 20, imgWidth, imgHeight);
      let name = "ordenPago-" + numneroHeader + ".pdf";
      doc.save(name);
    });
  }

  getActualSucursal() {
    const token = this.storage.parse(IStorageKeys.Token);
    return token.sucursal;
  }
}
