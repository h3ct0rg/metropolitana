import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

import { DashboardCurrencyService } from '../../services/dashboard-currency.services';
import { SucursalService } from '../../../core/services/sucursal.services';

const COLOR_USD = '#1890ff';
const COLOR_BS = '#faad14';

@Component({
  selector: 'app-currency-dashboard',
  templateUrl: './currency-dashboard.component.html',
  styleUrls: ['./currency-dashboard.component.css']
})
export class CurrencyDashboardComponent implements OnInit {

  listSucursales: any[] = [];
  idSucursal: number = -1;
  modulo: string = 'TODOS';
  listModulos = [
    { value: 'TODOS', label: 'Todos los módulos' },
    { value: 'Travelace', label: 'Travelace (UA)' },
    { value: 'Paquetes', label: 'Paquetes' },
    { value: 'Carga', label: 'Carga' }
  ];
  rangoFechas: Date[] = [this.hace6Meses(), new Date()];

  loadingSummary = true;
  loadingRateChart = true;
  loadingOverTimeChart = true;
  loadingDistributionChart = true;
  loadingPaymentChart = true;
  loadingBranchChart = true;
  loadingModuleChart = true;

  summary: any = {};

  rateLabels: Label[] = [];
  rateDatasets: ChartDataSets[] = [];
  rateOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { display: false },
    scales: { yAxes: [{ ticks: { beginAtZero: false } }] }
  };

  overTimeLabels: Label[] = [];
  overTimeDatasets: ChartDataSets[] = [];
  overTimeOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { position: 'bottom' },
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [{ stacked: true, ticks: { beginAtZero: true } }]
    }
  };

  distributionLabels: Label[] = ['Dólares', 'Bolivianos'];
  distributionData: number[] = [0, 0];
  distributionColors = [{ backgroundColor: [COLOR_USD, COLOR_BS] }];
  donutOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { position: 'bottom' }
  };

  paymentLabels: Label[] = [];
  paymentDatasets: ChartDataSets[] = [];
  paymentOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { display: false },
    scales: { xAxes: [{ ticks: { beginAtZero: true } }] }
  };

  branchLabels: Label[] = [];
  branchDatasets: ChartDataSets[] = [];
  branchOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { position: 'bottom' },
    scales: { yAxes: [{ ticks: { beginAtZero: true } }] }
  };

  moduleLabels: Label[] = [];
  moduleDatasets: ChartDataSets[] = [];
  moduleOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { position: 'bottom' },
    scales: { yAxes: [{ ticks: { beginAtZero: true } }] }
  };

  constructor(
    private currencyService: DashboardCurrencyService,
    private sucursalService: SucursalService
  ) { }

  ngOnInit() {
    this.sucursalService.getSucursalList().subscribe(result => {
      this.listSucursales = result;
    });
    this.cargarTodo();
  }

  onFiltroChange() {
    this.cargarTodo();
  }

  cargarTodo() {
    const [start, end] = this.rangoFechas;
    const finDia = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59);

    this.loadingSummary = true;
    this.currencyService.getSummary(this.idSucursal, this.modulo, start, finDia).subscribe(result => {
      this.summary = result;
      this.loadingSummary = false;
    });

    this.loadingRateChart = true;
    this.currencyService.getExchangeRateHistory(start, finDia).subscribe((result: any[]) => {
      this.rateLabels = result.map(r => this.formatFecha(r.fecha));
      this.rateDatasets = [{
        data: result.map(r => r.valor), label: 'Tipo de Cambio (Bs por US$)', borderColor: COLOR_BS,
        backgroundColor: 'rgba(250,173,20,0.08)', pointBackgroundColor: COLOR_BS, pointBorderColor: '#fff',
        pointRadius: 3, borderWidth: 2, fill: true
      }];
      this.loadingRateChart = false;
    });

    this.loadingOverTimeChart = true;
    this.currencyService.getNdByCurrencyOverTime(this.idSucursal, this.modulo, start, finDia).subscribe((result: any[]) => {
      const periodos = Array.from(new Set(result.map(r => r.periodo)));
      this.overTimeLabels = periodos.map(p => this.formatMes(p));
      this.overTimeDatasets = this.buildMonedaDatasets(result, 'periodo', periodos);
      this.loadingOverTimeChart = false;
    });

    this.loadingDistributionChart = true;
    this.currencyService.getNdByCurrency(this.idSucursal, this.modulo, start, finDia).subscribe((result: any[]) => {
      const usd = result.find(r => r.moneda === 'USD');
      const bs = result.find(r => r.moneda === 'BS');
      this.distributionData = [usd ? usd.cantidad : 0, bs ? bs.cantidad : 0];
      this.loadingDistributionChart = false;
    });

    this.loadingPaymentChart = true;
    this.currencyService.getPaymentMethodUsage(this.idSucursal, this.modulo, start, finDia, 8).subscribe((result: any[]) => {
      this.paymentLabels = result.map(r => r.formaPago);
      this.paymentDatasets = [{ data: result.map(r => r.cantidad), label: 'Operaciones', backgroundColor: COLOR_USD, maxBarThickness: 24 }];
      this.loadingPaymentChart = false;
    });

    this.loadingBranchChart = true;
    this.currencyService.getNdByCurrencyByBranch(this.modulo, start, finDia).subscribe((result: any[]) => {
      const sucursales = Array.from(new Set(result.map(r => r.sucursal)));
      this.branchLabels = sucursales;
      this.branchDatasets = this.buildMonedaDatasets(result, 'sucursal', sucursales);
      this.loadingBranchChart = false;
    });

    this.loadingModuleChart = true;
    this.currencyService.getNdByCurrencyByModulo(this.idSucursal, this.modulo, start, finDia).subscribe((result: any[]) => {
      const modulos = Array.from(new Set(result.map(r => r.modulo)));
      this.moduleLabels = modulos;
      this.moduleDatasets = this.buildMonedaDatasets(result, 'modulo', modulos);
      this.loadingModuleChart = false;
    });
  }

  private buildMonedaDatasets(rows: any[], categoriaKey: string, categorias: string[]): ChartDataSets[] {
    const buscar = (categoria: string, moneda: string) => {
      const fila = rows.find(r => r[categoriaKey] === categoria && r.moneda === moneda);
      return fila ? fila.cantidad : 0;
    };
    return [
      { data: categorias.map(c => buscar(c, 'USD')), label: 'Dólares', backgroundColor: COLOR_USD, maxBarThickness: 28 },
      { data: categorias.map(c => buscar(c, 'BS')), label: 'Bolivianos', backgroundColor: COLOR_BS, maxBarThickness: 28 }
    ];
  }

  private hace6Meses(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
  }

  private formatFecha(fecha: string): string {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: '2-digit' });
  }

  private formatMes(mes: string): string {
    const d = new Date(mes);
    return d.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  }
}
