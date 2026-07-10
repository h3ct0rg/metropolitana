import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { ClientService } from '../../services/clientes.service';
import { LogsService } from '../../services/Logs/logs.services';
import { OperadorService } from '../../services/operador.services';
import { OrdenPagoService } from '../../services/orden-pago.services';
import { SucursalService } from '../../services/sucursal.services';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';



@Component({
  selector: 'app-reporte-ventas-filtradas',
  templateUrl: './reporte-ventas-filtradas.component.html',
  styleUrls: ['./reporte-ventas-filtradas.component.css']
})
export class ReporteVentasFiltradasComponent implements OnInit {

  public form: FormGroup;
  public listReport;
  public fechaIni: string;
  public fechaF: string;
  public isSpinning: boolean;
  public listSucursales = [];
  public listClients = [];
  public listResults = [];


  token: any;

  constructor(
    private ordenPagoService: OrdenPagoService,
    private storage: StorageService,
    private sucursalesService: SucursalService,
    private operadorService: OperadorService,
    private logService: LogsService,
    private clientService: ClientService,
  ) {
    this.isSpinning = true;
    this.form = new FormGroup({
      fechaStardDate: new FormControl(null, [Validators.required]),
      fechaEndDate: new FormControl(null, [Validators.required]),
      sucursal: new FormControl(null),
      voucherItem: new FormControl(null),
      operador: new FormControl(null)
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

    operadorService.getOperadorBySucursal(this.getActualSucursal()).subscribe(result => {
      this.listClients = result;
    })

  }

  ngOnInit() {
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  generateNote() {
    const fechaStart = this.form.get("fechaStardDate").value;
    const fechaEnd = this.form.get("fechaEndDate").value;
    const voucher = this.form.get("voucherItem").value;
    const idAgencia = this.form.get("operador").value;
    this.ordenPagoService.getReportOrdenPagoByDateDetailByCityFiltered(fechaStart, fechaEnd, this.form.get("sucursal").value, voucher, idAgencia).subscribe(result => {
      console.log(result);

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

        return acc;
      }, {});

      console.log(groupedByOperador);
      const resultado = Object.values(groupedByOperador);
      console.log(resultado);
      this.listResults = resultado;
    })



  }

  getActualSucursal() {
    const token = this.storage.parse(IStorageKeys.Token);
    return token.sucursal;
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

  public downloadPDF(): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageHeight = 295; // Altura de la página en mm (tamaño A4)
    let yPosition = 10; // Margen superior inicial

    const promises = this.listResults.map(group => {
      const elementId = 'table_' + group.items[0].nombreOperador; // Asignar un ID único a cada tabla
      const element = document.getElementById(elementId)!;

      return html2canvas(element, { scale: 2 }).then(canvas => {
        const imgWidth = 210; // Ancho de la página en mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Altura ajustada

        if (yPosition + imgHeight > pageHeight) {
          // Si la tabla no cabe en la página, añadir una nueva página
          doc.addPage();
          yPosition = 10; // Reiniciar la posición y margen superior en la nueva página
        }

        // Añadir la tabla a la página actual
        const imgData = canvas.toDataURL('image/jpeg', 0.6); // Reducir calidad para menor tamaño
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
    const doc = new jsPDF();

    // Configurar el título del documento
    doc.setFontSize(18);
    doc.text('Resumen de Pagos', 14, 22);

    // Establecer el margen
    const margin = 5;
    let yOffset = 30; // Posición vertical inicial

    this.listResults.forEach((group) => {
      const headers = ['Voucher', 'ID Nota', 'Fecha Pago', 'Número Pago', 'Pago Metro', 'Precio', 'Total Agencia', 'Total Argentina', 'Total Counter', 'Total Metro'];

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
          item.pagoMetro.toFixed(2),
          item.precio.toFixed(2),
          item.totalAgencia.toFixed(2),
          item.totalArgentina.toFixed(2),
          item.totalCounter.toFixed(2),
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
        group.totals.pagoMetro.toFixed(2),
        group.totals.precio.toFixed(2),
        group.totals.totalAgencia.toFixed(2),
        group.totals.totalArgentina.toFixed(2),
        group.totals.totalCounter.toFixed(2),
        group.totals.totalMetro.toFixed(2),
        '' // Espacio vacío para Voucher
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

    // Guardar el documento como PDF
    doc.save('resumen_pagos.pdf');
  }

  calculateSum(items: any[], key: string): number {
    return items.reduce((sum, item) => sum + item[key], 0);
  }
}
