import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

import { DashboardFinancialService } from '../../services/dashboard-financial.services';
import { SucursalService } from '../../../core/services/sucursal.services';

const COLOR_TRAVELACE = '#1890ff';
const COLOR_CARGA = '#fa8c16';
const COLOR_PAQUETES = '#722ed1';
const COLOR_COBRADO = '#1baf7a';
const COLOR_PROYECCION = 'rgba(24, 144, 255, 0.55)';
const COLOR_PAGADO = '#389e0d';
const COLOR_PENDIENTE = '#ff4d4f';

const MODULE_COLORS: { [key: string]: string } = {
  Travelace: COLOR_TRAVELACE,
  Carga: COLOR_CARGA,
  Paquetes: COLOR_PAQUETES
};

@Component({
  selector: 'app-financial-dashboard',
  templateUrl: './financial-dashboard.component.html',
  styleUrls: ['./financial-dashboard.component.css']
})
export class FinancialDashboardComponent implements OnInit {

  listSucursales: any[] = [];
  idSucursal: number = -1;
  periodo: Date = new Date();

  loadingSummary = true;
  loadingRevenueChart = true;
  loadingBranchChart = true;
  loadingModuleChart = true;
  loadingReceivables = true;
  loadingTopClients = true;

  summary: any = {};
  topClients: any[] = [];

  revenueLabels: Label[] = [];
  revenueDatasets: ChartDataSets[] = [];
  revenueOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { position: 'bottom' },
    tooltips: { mode: 'index', intersect: false },
    scales: {
      yAxes: [{ ticks: { beginAtZero: true } }]
    }
  };

  branchLabels: Label[] = [];
  branchDatasets: ChartDataSets[] = [];
  branchOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { display: false },
    scales: {
      xAxes: [{ ticks: { beginAtZero: true } }]
    }
  };

  moduleLabels: Label[] = [];
  moduleData: number[] = [];
  moduleColors = [{ backgroundColor: [] }];
  donutOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { position: 'bottom' },
    tooltips: {
      callbacks: {
        label: (item, data) => {
          const label = data.labels[item.index];
          const value = data.datasets[0].data[item.index] as number;
          const total = (data.datasets[0].data as number[]).reduce((a, b) => a + b, 0);
          const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
          return `${label}: ${value.toLocaleString()} (${pct}%)`;
        }
      }
    }
  };

  receivablesLabels: Label[] = ['Pagado', 'Pendiente'];
  receivablesData: number[] = [0, 0];
  receivablesColors = [{ backgroundColor: [COLOR_PAGADO, COLOR_PENDIENTE] }];

  constructor(
    private financialService: DashboardFinancialService,
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
    const inicioMes = new Date(this.periodo.getFullYear(), this.periodo.getMonth(), 1);
    const finMes = new Date(this.periodo.getFullYear(), this.periodo.getMonth() + 1, 0, 23, 59, 59);

    this.loadingSummary = true;
    this.financialService.getSummary(this.idSucursal, inicioMes, finMes).subscribe(result => {
      this.summary = result;
      this.loadingSummary = false;
    });

    this.loadingRevenueChart = true;
    this.financialService.getMonthlyRevenue(this.idSucursal, 12).subscribe((result: any[]) => {
      this.buildRevenueChart(result);
      this.loadingRevenueChart = false;
    });

    this.loadingBranchChart = true;
    this.financialService.getRevenueByBranch(this.periodo.getMonth() + 1, this.periodo.getFullYear()).subscribe((result: any[]) => {
      this.branchLabels = result.map(r => r.sucursal);
      this.branchDatasets = [{ data: result.map(r => r.ingresos), label: 'Ingresos', backgroundColor: COLOR_TRAVELACE, maxBarThickness: 24 }];
      this.loadingBranchChart = false;
    });

    this.loadingModuleChart = true;
    this.financialService.getModuleDistribution(this.idSucursal, inicioMes, finMes).subscribe((result: any[]) => {
      this.moduleLabels = result.map(r => r.modulo);
      this.moduleData = result.map(r => r.total);
      this.moduleColors = [{ backgroundColor: result.map(r => MODULE_COLORS[r.modulo] || '#8c8c8c') }];
      this.loadingModuleChart = false;
    });

    this.loadingReceivables = true;
    this.financialService.getReceivables(this.idSucursal).subscribe(result => {
      this.receivablesData = [result.totalPagado, result.totalPendiente];
      this.loadingReceivables = false;
    });

    this.loadingTopClients = true;
    this.financialService.getTopClients(this.idSucursal, inicioMes, finMes, 5).subscribe((result: any[]) => {
      this.topClients = result;
      this.loadingTopClients = false;
    });
  }

  private buildRevenueChart(rows: any[]) {
    this.revenueLabels = rows.map(r => this.formatMes(r.mes));

    const facturado: number[] = [];
    const cobrado: number[] = [];
    const proyeccion: (number | null)[] = [];

    let ultimoHistoricoIdx = -1;
    rows.forEach((r, i) => {
      if (!r.esProyeccion) {
        facturado.push(r.facturado);
        cobrado.push(r.cobrado);
        proyeccion.push(null);
        ultimoHistoricoIdx = i;
      } else {
        facturado.push(null);
        cobrado.push(null);
        proyeccion.push(r.facturado);
      }
    });

    if (ultimoHistoricoIdx >= 0) {
      proyeccion[ultimoHistoricoIdx] = facturado[ultimoHistoricoIdx];
    }

    this.revenueDatasets = [
      {
        data: facturado, label: 'Facturado', borderColor: COLOR_TRAVELACE, backgroundColor: 'rgba(24,144,255,0.08)',
        pointBackgroundColor: COLOR_TRAVELACE, pointBorderColor: '#fff', pointRadius: 4, borderWidth: 2, fill: true
      },
      {
        data: cobrado, label: 'Cobrado', borderColor: COLOR_COBRADO, backgroundColor: 'rgba(27,175,122,0.08)',
        pointBackgroundColor: COLOR_COBRADO, pointBorderColor: '#fff', pointRadius: 4, borderWidth: 2, fill: true
      },
      {
        data: proyeccion, label: 'Proyección (estimado)', borderColor: COLOR_PROYECCION, backgroundColor: 'transparent',
        pointBackgroundColor: COLOR_PROYECCION, pointBorderColor: '#fff', pointRadius: 4, borderWidth: 2,
        borderDash: [6, 4], fill: false
      }
    ];
  }

  private formatMes(mes: string): string {
    const d = new Date(mes);
    return d.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
  }
}
