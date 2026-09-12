import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IStorageKeys } from '../../../../../shared/services/local-data/storage';
import { StorageService } from '../../../../../shared/services/local-data/storage.service';
import { OperadorService } from '../../../services/operador.services';
import { PaqueteOrdenPagoService } from '../../../services/paquetes/paquete-orden-pago.services';
import { SucursalService } from '../../../services/sucursal.services';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { ClientService } from '../../../services/clientes.service';
import { title } from 'process';
import { TipoCambioService } from '../../../services/tipo-cambio.services';

@Component({
  selector: 'app-paquetes-reporte-ventas-filtradas',
  templateUrl: './paquetes-reporte-ventas-filtradas.component.html',
  styleUrls: ['./paquetes-reporte-ventas-filtradas.component.css']
})
export class PaquetesReporteVentasFiltradasComponent implements OnInit {

  public form: FormGroup;
  public listReport;
  public fechaIni: string;
  public fechaF: string;
  public isSpinning: boolean;
  public nombreSucursal: boolean;
  public listSucursales = [];
  public listClients = [];
  public listResults = [];
  public listReportAnulacion = [];
  public listGlobalTotals = [{
    precio: 0,
    pagoMetro: 0,
    totalAgencia: 0,
    totalArgentina: 0,
    totalCounter: 0,
    totalMetro: 0
  }]

  public listGlobalTotalsAnulados = [{
    precio: 0,
    pagoMetro: 0,
    totalAgencia: 0,
    totalArgentina: 0,
    totalCounter: 0,
    totalMetro: 0
  }]

  public tasaManualRespaldo: number = null;
  public faltanTasasLegacy: boolean = false;


  token: any;

  constructor(
    private ordenPagoService: PaqueteOrdenPagoService,
    private storage: StorageService,
    private sucursalesService: SucursalService,
    private operadorService: OperadorService,
    private clientService: ClientService,
    private tipoCambioService: TipoCambioService
  ) {
    this.isSpinning = true;
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    this.form = new FormGroup({
      fechaStardDate: new FormControl(inicioMes, [Validators.required]),
      fechaEndDate: new FormControl(hoy, [Validators.required]),
      sucursal: new FormControl(null),
      voucherItem: new FormControl(null),
      operador: new FormControl(null),
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

    });

    clientService.getClientPaquetesBySucursal(this.getActualSucursal()).subscribe(result => {
      this.listClients = result;
    })
  }

  ngOnInit() {

    this.listGlobalTotals['precio'] = 0;
    this.listGlobalTotals['pagoMetro'] = 0;
    this.listGlobalTotals['totalAgencia'] = 0;
    this.listGlobalTotals['totalArgentina'] = 0;
    this.listGlobalTotals['totalCounter'] = 0;
    this.listGlobalTotals['totalMetro'] = 0;

    this.listGlobalTotalsAnulados['precio'] = 0;
    this.listGlobalTotalsAnulados['pagoMetro'] = 0;
    this.listGlobalTotalsAnulados['totalAgencia'] = 0;
    this.listGlobalTotalsAnulados['totalArgentina'] = 0;
    this.listGlobalTotalsAnulados['totalCounter'] = 0;
    this.listGlobalTotalsAnulados['totalMetro'] = 0;
  }

  get rangoFechasInvalido(): boolean {
    const inicio = this.form.get('fechaStardDate').value;
    const fin = this.form.get('fechaEndDate').value;
    if (!inicio || !fin) { return false; }
    return new Date(fin) < new Date(inicio);
  }

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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  getTime(theTime) {
    const d = new Date(theTime);
    const hora = d.getDate() + " / " + (d.getMonth() + 1) + " / " + d.getFullYear();
    return hora;
  }

  generateNote() {
    if (this.rangoFechasInvalido) {
      return;
    }
    this.faltanTasasLegacy = false;
    this.listGlobalTotals['precio'] = 0;
    this.listGlobalTotals['pagoMetro'] = 0;
    this.listGlobalTotals['totalAgencia'] = 0;
    this.listGlobalTotals['totalArgentina'] = 0;
    this.listGlobalTotals['totalCounter'] = 0;
    this.listGlobalTotals['totalMetro'] = 0;


    this.listGlobalTotalsAnulados['precio'] = 0;
    this.listGlobalTotalsAnulados['pagoMetro'] = 0;
    this.listGlobalTotalsAnulados['totalAgencia'] = 0;
    this.listGlobalTotalsAnulados['totalArgentina'] = 0;
    this.listGlobalTotalsAnulados['totalCounter'] = 0;
    this.listGlobalTotalsAnulados['totalMetro'] = 0;


    const fechaStart = this.form.get("fechaStardDate").value;
    const fechaEnd = this.form.get("fechaEndDate").value;
    this.fechaIni = this.getTime(fechaStart);
    this.fechaF = this.getTime(fechaEnd);
    const voucher = this.form.get("voucherItem").value;
    const idAgencia = this.form.get("operador").value;
    const idSucursal = this.form.get("sucursal").value;

    this.nombreSucursal = this.getNombreSucursal(idSucursal);
    console.log(this.nombreSucursal);

    this.ordenPagoService.getReportOrdenPagoByDateDetailByCityFiltered(fechaStart, fechaEnd, idSucursal, voucher, idAgencia).subscribe(result => {
      result = this.convertirFilasAMoneda(result, ['precio', 'totalArgentina', 'pagoMetro', 'totalCounter', 'totalMetro', 'totalAgencia']);

      const groupedByOperador = result.reduce((acc, current) => {
        const operador = current.nombreOperador;

        // Si no existe el operador en el acumulador, lo creamos como un array vacío
        if (!acc[operador]) {
          acc[operador] = {
            items: [],
            totals: {
              precio: 0,
              pagoMetro: 0,
              totalAgencia: 0,
              totalArgentina: 0,
              totalCounter: 0,
              totalMetro: 0
            }
          };
        }

        // Agregamos el elemento actual al array correspondiente
        acc[operador].items.push(current);

        // Sumar los valores a los totales
        acc[operador].totals.precio += current.precio;
        acc[operador].totals.pagoMetro += current.pagoMetro;
        acc[operador].totals.totalAgencia += current.totalAgencia;
        acc[operador].totals.totalArgentina += current.totalArgentina;
        acc[operador].totals.totalCounter += current.totalCounter;
        acc[operador].totals.totalMetro += current.totalMetro;

        this.listGlobalTotals['precio'] += current.precio;
        this.listGlobalTotals['pagoMetro'] += current.pagoMetro;
        this.listGlobalTotals['totalAgencia'] += current.totalAgencia;
        this.listGlobalTotals['totalArgentina'] += current.totalArgentina;
        this.listGlobalTotals['totalCounter'] += current.totalCounter;
        this.listGlobalTotals['totalMetro'] += current.totalMetro;

        return acc;
      }, {});

      console.log(groupedByOperador);
      const resultado = Object.values(groupedByOperador);
      console.log(resultado);
      this.listResults = resultado;
      console.log(this.listGlobalTotals);
    })

    this.ordenPagoService.getReportOrdenPagoByDateDetailByCityFilteredAnulado(fechaStart, fechaEnd, idSucursal, voucher, idAgencia).subscribe(result => {
      this.listReportAnulacion = this.convertirFilasAMoneda(result, ['precio', 'totalArgentina', 'pagoMetro', 'totalCounter', 'totalMetro', 'totalAgencia']);
    });

  }

  getNombreSucursal(idSucursal: any): boolean {
    return (this.listSucursales.find(element => element.id === idSucursal)).nombre;
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

  getActualSucursal() {
    const token = this.storage.parse(IStorageKeys.Token);
    return token.sucursal;
  }

  public downloadPDF(): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageHeight = 295; // Altura de la página en mm (tamaño A4)
    let yPosition = 10; // Margen superior inicial

    const promises = this.listResults.map(group => {
      const elementId = 'table_' + group.items[0].nombreOperador; // Asignar un ID único a cada tabla
      const element = document.getElementById(elementId)!;

      return html2canvas(element, { scale: 1 }).then(canvas => {
        const imgWidth = 210; // Ancho de la página en mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Altura ajustada

        if (yPosition + imgHeight > pageHeight) {
          // Si la tabla no cabe en la página, añadir una nueva página
          doc.addPage();
          yPosition = 10; // Reiniciar la posición y margen superior en la nueva página
        }

        // Añadir la tabla a la página actual
        const imgData = canvas.toDataURL('image/jpeg', 0.5); // Reducir calidad para menor tamaño
        doc.addImage(imgData, 'JPEG', 0, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10; // Aumentar la posición para la siguiente tabla

        return Promise.resolve();
      });
    });

    Promise.all(promises).then(() => {
      doc.save('operadores-pago.pdf');
    });
  }

  downloadPDF2() {
    console.log("imprimiendo");
    const doc = new jsPDF()


    const fecha = new Date();
    const fechaDocumento = `Fecha: ${fecha.toLocaleDateString('es-ES')}`;
    const monedaTexto = this.form.get('monedaReporte').value === 2 ? '(en Bolivianos)' : '(en Dólares)';
    const tittle = "Reporte De Ventas Filtradas";
    const tittle2 = "Paquetes " + this.listSucursales[(this.form.get("sucursal").value) - 1]['nombre'] + " " + monedaTexto;

    let tempItem = this.listClients.find(d => d.id === this.form.get("operador").value);
    let voucherItemReport = this.form.get("voucherItem").value;
    const nombreAgencia = tempItem ? tempItem.name : "";
    const lineaAgencia = `Agencia: ${nombreAgencia ? nombreAgencia : ""}     Reserva: ${voucherItemReport ? voucherItemReport : ""}`;
    const lineaDesdeHasta = `Fecha Desde: ${this.fechaIni}   Fecha Hasta: ${this.fechaF}`;


    doc.text(fechaDocumento, 14, 10);

    const img = new Image();
    img.src = "../../../../assets/img/metropolitana-slogan.jpg";
    img.style.display = "block";
    doc.addImage(img, 'JPEG', 75, 10, 50, 23, '', 'FAST');

    const yOffsetImage = 10 + 23 + 10;

    // Configurar el título del documento
    doc.setFontSize(18);
    doc.text(tittle, 12, yOffsetImage);
    doc.text(tittle2, 12, yOffsetImage + 10);
    doc.text(lineaAgencia, 10, yOffsetImage + 20);
    doc.text(lineaDesdeHasta, 10, yOffsetImage + 30);

    // Establecer el margen
    const margin = 5;
    let yOffset = yOffsetImage + 45; // Posición vertical inicial

    this.listResults.forEach((group) => {

      const headers = ['Voucher', 'ND', 'Fecha Pago', 'OP', 'Precio', 'Com Agt', 'Pago Metro', 'Com Counter', 'Neto', 'Com Metro'];

      // Definir los anchos de las columnas
      const columnWidths = [
        25,
        15,  // ID Nota
        25,  // Fecha Pago
        15,  // Número Pago
        20,  // Pago Metro
        20,  // Precio
        20,  // Total Agencia
        20,  // Total Argentina
        20,  // Total Counter
        20  // Total Metro
      ];

      // Agregar el nombre del operador como título
      doc.setFontSize(16);
      doc.text(group.items[0].nombreOperador, margin, yOffset);
      yOffset += 10; // Incrementar el desplazamiento vertical

      // Configurar la tabla usando autoTable
      autoTable(doc, {
        head: [headers],
        body: group.items.map(item => [
          item.voucher,
          item.idNota,
          this.formatDate(item.fechaPago), // Formato de fecha
          item.numeroPago,
          item.precio.toFixed(2),
          item.totalAgencia.toFixed(2),
          (item.precio.toFixed(2) - item.totalAgencia.toFixed(2)).toFixed(2),
          //item.pagoMetro.toFixed(2),
          item.totalCounter.toFixed(2),
          item.totalArgentina.toFixed(2),
          item.totalMetro.toFixed(2)
        ]),
        startY: yOffset, // Posición inicial de la tabla
        margin: { horizontal: margin },
        columnStyles: { // Aplicar estilos de columna
          0: { cellWidth: columnWidths[0] },
          1: { cellWidth: columnWidths[1] },
          2: { cellWidth: columnWidths[2] },
          3: { cellWidth: columnWidths[3] },
          4: { cellWidth: columnWidths[4] },
          5: { cellWidth: columnWidths[5] },
          6: { cellWidth: columnWidths[6] },
          7: { cellWidth: columnWidths[7] },
          8: { cellWidth: columnWidths[8] },
          9: { cellWidth: columnWidths[9] }
        },
        styles: {
          fontSize: 11, // Tamaño de fuente
          cellPadding: 1, // Relleno en las celdas
          halign: 'center', // Alinear contenido en el centro
          valign: 'middle', // Alinear contenido en el medio
          lineColor: [0, 0, 0], // Color de las líneas
          lineWidth: 0.1, // Grosor de las líneas
        },
        didDrawCell: (data) => {
          // Si se ha dibujado la última celda de la tabla, establecer el nuevo Y para la siguiente tabla
          if (data.column.index === 0 && data.row.index === data.table.body.length - 1) {
            yOffset = doc.autoTable.previous.finalY + 10; // Ajustar el desplazamiento vertical
          }
        },
        didParseCell: (data) => {
          // Verificar si se ha alcanzado el final de la página
          if (data.row.index === data.table.body.length - 1) {
            const pageHeight = doc.internal.pageSize.height;
            const spaceNeeded = data.cell.height + data.cell.y;

            if (spaceNeeded > pageHeight) {
              doc.addPage();
              yOffset = 30; // Reiniciar la posición

              // Agregar el encabezado nuevamente en la nueva página
              doc.autoTable({
                head: [headers],
                startY: yOffset,
                margin: { horizontal: margin },
                columnStyles: {
                  0: { cellWidth: columnWidths[0] },
                  1: { cellWidth: columnWidths[1] },
                  2: { cellWidth: columnWidths[2] },
                  3: { cellWidth: columnWidths[3] },
                  4: { cellWidth: columnWidths[4] },
                  5: { cellWidth: columnWidths[5] },
                  6: { cellWidth: columnWidths[6] },
                  7: { cellWidth: columnWidths[7] },
                  8: { cellWidth: columnWidths[8] },
                  9: { cellWidth: columnWidths[9] }
                },
                styles: {
                  fontSize: 11,
                  cellPadding: 1,
                  halign: 'center',
                  valign: 'middle',
                  lineColor: [0, 0, 0],
                  lineWidth: 0.1,
                }
              });
            }
          }
        }
      });

      // Calcular y agregar fila de totales al final de la tabla
      const totalRow = [
        'Total', // Espacio vacío para ID Nota
        '', // Espacio vacío para Número Pago
        '', // Espacio vacío para Pago Metro
        '', // Espacio vacío para Pago Metro
        group.totals.precio.toFixed(2),
        group.totals.totalAgencia.toFixed(2),
        (group.totals.precio.toFixed(2) - group.totals.totalAgencia.toFixed(2)).toFixed(2),
        //group.totals.pagoMetro.toFixed(2),
        group.totals.totalCounter.toFixed(2),
        group.totals.totalArgentina.toFixed(2),
        group.totals.totalMetro.toFixed(2),

      ];

      // Agregar la fila de totales a la tabla
      autoTable(doc, {
        head: [], // Añadir encabezado en la fila de totales
        body: [totalRow],
        startY: doc.autoTable.previous.finalY,
        margin: { horizontal: margin },
        columnStyles: {
          0: { cellWidth: columnWidths[0] },
          1: { cellWidth: columnWidths[1] },
          2: { cellWidth: columnWidths[2] },
          3: { cellWidth: columnWidths[3] },
          4: { cellWidth: columnWidths[4] },
          5: { cellWidth: columnWidths[5] },
          6: { cellWidth: columnWidths[6] },
          7: { cellWidth: columnWidths[7] },
          8: { cellWidth: columnWidths[8] },
          9: { cellWidth: columnWidths[9] }
        },
        styles: {
          fillColor: [245, 245, 245], // Color de fondo para la fila de totales
          fontSize: 11, // Tamaño de fuente
          halign: 'center', // Alinear contenido en el centro
          lineColor: [0, 0, 0], // Color de las líneas
          lineWidth: 0.1, // Grosor de las líneas
        },
      });

      // Actualizar el desplazamiento vertical después de la tabla
      yOffset = doc.autoTable.previous.finalY + 20; // Incrementar espacio después de la tabla
    });

    this.listGlobalTotalsAnulados.forEach((itemanulado) => {
      this.listGlobalTotalsAnulados['precio'] += itemanulado.precio;
      this.listGlobalTotalsAnulados['pagoMetro'] += itemanulado.pagoMetro;
      this.listGlobalTotalsAnulados['totalAgencia'] += itemanulado.totalAgencia;
      this.listGlobalTotalsAnulados['totalArgentina'] += itemanulado.totalArgentina;
      this.listGlobalTotalsAnulados['totalCounter'] += itemanulado.totalCounter;
      this.listGlobalTotalsAnulados['totalMetro'] += itemanulado.totalMetro;
    })

    //this.listReportAnulacion.forEach((groupAnulado) => {

    const headers = ['Voucher', 'ND', 'Fecha Pago', 'OP', 'Precio', 'Com Agt', 'Pago Metro', 'Com Counter', 'Neto', 'Com Metro'];

    // Definir los anchos de las columnas
    const columnWidths2 = [
      25,
      15,  // ID Nota
      25,  // Fecha Pago
      15,  // Número Pago
      20,  // Pago Metro
      20,  // Precio
      20,  // Total Agencia
      20,  // Total Argentina
      20,  // Total Counter
      20  // Total Metro
    ];

    // Agregar el nombre del operador como título
    doc.setFontSize(16);
    if (this.listReportAnulacion.length > 0) {
      doc.text(`${this.listReportAnulacion[0]['nombreOperador']} Anulacion`, margin, yOffset);
      yOffset += 10; // Incrementar el desplazamiento vertical
    }
  

    // Configurar la tabla usando autoTable
    autoTable(doc, {
      head: [headers],
      body:
        this.listReportAnulacion.map(groupAnulado => [
        
          groupAnulado.voucher,
          groupAnulado.idNota,
          this.formatDate(groupAnulado.fechaPago), // Formato de fecha
          groupAnulado.numeroPago,
          groupAnulado.precio.toFixed(2),
          groupAnulado.totalAgencia.toFixed(2),
          (groupAnulado.precio.toFixed(2) - groupAnulado.totalAgencia.toFixed(2)).toFixed(2),
          //item.pagoMetro.toFixed(2),
          groupAnulado.totalCounter.toFixed(2),
          groupAnulado.totalArgentina.toFixed(2),
          groupAnulado.totalMetro.toFixed(2)
        ]),

      startY: yOffset, // Posición inicial de la tabla
      margin: { horizontal: margin },
      columnStyles: { // Aplicar estilos de columna
        0: { cellWidth: columnWidths2[0] },
        1: { cellWidth: columnWidths2[1] },
        2: { cellWidth: columnWidths2[2] },
        3: { cellWidth: columnWidths2[3] },
        4: { cellWidth: columnWidths2[4] },
        5: { cellWidth: columnWidths2[5] },
        6: { cellWidth: columnWidths2[6] },
        7: { cellWidth: columnWidths2[7] },
        8: { cellWidth: columnWidths2[8] },
        9: { cellWidth: columnWidths2[9] }
      },
      styles: {
        fontSize: 11, // Tamaño de fuente
        cellPadding: 1, // Relleno en las celdas
        halign: 'center', // Alinear contenido en el centro
        valign: 'middle', // Alinear contenido en el medio
        lineColor: [0, 0, 0], // Color de las líneas
        lineWidth: 0.1, // Grosor de las líneas
      },
      didDrawCell: (data) => {
        // Si se ha dibujado la última celda de la tabla, establecer el nuevo Y para la siguiente tabla
        if (data.column.index === 0 && data.row.index === data.table.body.length - 1) {
          yOffset = doc.autoTable.previous.finalY + 10; // Ajustar el desplazamiento vertical
        }
      },
      didParseCell: (data) => {
        // Verificar si se ha alcanzado el final de la página
        if (data.row.index === data.table.body.length - 1) {
          const pageHeight = doc.internal.pageSize.height;
          const spaceNeeded = data.cell.height + data.cell.y;

          if (spaceNeeded > pageHeight) {
            doc.addPage();
            yOffset = 30; // Reiniciar la posición

            // Agregar el encabezado nuevamente en la nueva página
            doc.autoTable({
              head: [headers],
              startY: yOffset,
              margin: { horizontal: margin },
              columnStyles: {
                0: { cellWidth: columnWidths[0] },
                1: { cellWidth: columnWidths[1] },
                2: { cellWidth: columnWidths[2] },
                3: { cellWidth: columnWidths[3] },
                4: { cellWidth: columnWidths[4] },
                5: { cellWidth: columnWidths[5] },
                6: { cellWidth: columnWidths[6] },
                7: { cellWidth: columnWidths[7] },
                8: { cellWidth: columnWidths[8] },
                9: { cellWidth: columnWidths[9] }
              },
              styles: {
                fontSize: 11,
                cellPadding: 1,
                halign: 'center',
                valign: 'middle',
                lineColor: [0, 0, 0],
                lineWidth: 0.1,
              }
            });
          }
        }
      }
    });

    // Calcular y agregar fila de totales al final de la tabla
    const totalRow = [
      'Total', // Espacio vacío para ID Nota
      '', // Espacio vacío para Número Pago
      '', // Espacio vacío para Pago Metro
      '', // Espacio vacío para Pago Metro
      this.listGlobalTotalsAnulados['precio'].toFixed(2),
      this.listGlobalTotalsAnulados['pagoMetro'].toFixed(2),
      (this.listGlobalTotalsAnulados['precio'].toFixed(2) - this.listGlobalTotalsAnulados['totalAgencia'].toFixed(2)).toFixed(2),
      //group.totals.pagoMetro.toFixed(2),
      this.listGlobalTotalsAnulados['totalCounter'].toFixed(2),
      this.listGlobalTotalsAnulados['totalArgentina'].toFixed(2),
      this.listGlobalTotalsAnulados['totalMetro'].toFixed(2),

    ];

    // Agregar la fila de totales a la tabla
    autoTable(doc, {
      head: [], // Añadir encabezado en la fila de totales
      body: [totalRow],
      startY: doc.autoTable.previous.finalY,
      margin: { horizontal: margin },
      columnStyles: {
        0: { cellWidth: columnWidths2[0] },
        1: { cellWidth: columnWidths2[1] },
        2: { cellWidth: columnWidths2[2] },
        3: { cellWidth: columnWidths2[3] },
        4: { cellWidth: columnWidths2[4] },
        5: { cellWidth: columnWidths2[5] },
        6: { cellWidth: columnWidths2[6] },
        7: { cellWidth: columnWidths2[7] },
        8: { cellWidth: columnWidths2[8] },
        9: { cellWidth: columnWidths2[9] }
      },
      styles: {
        fillColor: [245, 245, 245], // Color de fondo para la fila de totales
        fontSize: 11, // Tamaño de fuente
        halign: 'center', // Alinear contenido en el centro
        lineColor: [0, 0, 0], // Color de las líneas
        lineWidth: 0.1, // Grosor de las líneas
      },
    });

    // Actualizar el desplazamiento vertical después de la tabla
    yOffset = doc.autoTable.previous.finalY + 20; // Incrementar espacio después de la tabla
    //});






    const headersTotal = ['', 'Total Precio', 'total Com Agt', 'total Pago Metro', 'Total Com Counter', 'Total Neto', 'Total Com Metro'];

    // Definir los anchos de las columnas
    const columnWidths = [
      25,
      25,  // ID Nota
      25,  // Fecha Pago
      30,  // Número Pago
      30,  // Pago Metro
      30,  // Precio
      30,  // Total Agencia
      30,  // Total Argentina
      30,  // Total Counter
    ];

    const totalGeneral = [
      [
        'Totales',
        this.listGlobalTotals['precio'].toFixed(2),
        this.listGlobalTotals['totalAgencia'].toFixed(2),
        (this.listGlobalTotals['precio'].toFixed(2) - this.listGlobalTotals['totalAgencia'].toFixed(2)).toFixed(2),
        //this.listGlobalTotals['pagoMetro'].toFixed(2),
        this.listGlobalTotals['totalCounter'].toFixed(2),
        this.listGlobalTotals['totalArgentina'].toFixed(2),
        this.listGlobalTotals['totalMetro'].toFixed(2),

      ]
    ];

    // Agregar el nombre del operador como título
    doc.setFontSize(16);
    yOffset += 10; // Incrementar el desplazamiento vertical

    // Configurar la tabla usando autoTable
    autoTable(doc, {
      head: [headersTotal],
      body: totalGeneral,
      startY: yOffset, // Posición inicial de la tabla
      margin: { horizontal: margin },
      columnStyles: { // Aplicar estilos de columna
        0: { cellWidth: columnWidths[0] },
        1: { cellWidth: columnWidths[1] },
        2: { cellWidth: columnWidths[2] },
        3: { cellWidth: columnWidths[3] },
        4: { cellWidth: columnWidths[4] },
        5: { cellWidth: columnWidths[5] },
        6: { cellWidth: columnWidths[6] },
        7: { cellWidth: columnWidths[7] },
      },
      styles: {
        fontSize: 11, // Tamaño de fuente
        cellPadding: 1, // Relleno en las celdas
        halign: 'center', // Alinear contenido en el centro
        valign: 'middle', // Alinear contenido en el medio
        lineColor: [0, 0, 0], // Color de las líneas
        lineWidth: 0.1, // Grosor de las líneas
      }
    });


    // Guardar el documento como PDF
    doc.save('resumen_pagos.pdf');
  }


  calculateSum(items: any[], key: string): number {
    return items.reduce((sum, item) => sum + item[key], 0);
  }

}
