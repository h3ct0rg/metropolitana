import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

import { DashboardActivityService } from '../../services/dashboard-activity.services';
import { SucursalService } from '../../../core/services/sucursal.services';

const COLOR_TRAVELACE = '#1890ff';
const COLOR_CARGA = '#fa8c16';
const COLOR_PAQUETES = '#722ed1';

const MODULE_COLORS: { [key: string]: string } = {
  Travelace: COLOR_TRAVELACE,
  Carga: COLOR_CARGA,
  Paquetes: COLOR_PAQUETES,
  Otro: '#8c8c8c'
};

@Component({
  selector: 'app-activity-dashboard',
  templateUrl: './activity-dashboard.component.html',
  styleUrls: ['./activity-dashboard.component.css']
})
export class ActivityDashboardComponent implements OnInit {

  listSucursales: any[] = [];
  idSucursal: number = -1;
  rangoFechas: Date[] = [this.primerDiaDelMes(), new Date()];

  loadingSummary = true;
  loadingUserChart = true;
  loadingDailyChart = true;
  loadingBranchChart = true;
  loadingModuleChart = true;
  loadingRecentEvents = true;

  summary: any = {};
  recentEvents: any[] = [];

  userLabels: Label[] = [];
  userDatasets: ChartDataSets[] = [];
  userChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { position: 'bottom' },
    scales: {
      xAxes: [{ stacked: true, ticks: { beginAtZero: true } }],
      yAxes: [{ stacked: true }]
    }
  };

  dailyLabels: Label[] = [];
  dailyDatasets: ChartDataSets[] = [];
  dailyOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { display: false },
    scales: { yAxes: [{ ticks: { beginAtZero: true } }] }
  };

  branchLabels: Label[] = [];
  branchDatasets: ChartDataSets[] = [];
  branchOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { display: false },
    scales: { yAxes: [{ ticks: { beginAtZero: true } }] }
  };

  moduleLabels: Label[] = [];
  moduleData: number[] = [];
  moduleColors = [{ backgroundColor: [] }];
  donutOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { position: 'bottom' }
  };

  constructor(
    private activityService: DashboardActivityService,
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
    this.activityService.getSummary().subscribe(result => {
      this.summary = result;
      this.loadingSummary = false;
    });

    this.loadingUserChart = true;
    this.activityService.getNotesByUser(this.idSucursal, start, finDia, 10).subscribe((result: any[]) => {
      this.buildUserChart(result);
      this.loadingUserChart = false;
    });

    this.loadingDailyChart = true;
    this.activityService.getDailyActivity(30).subscribe((result: any[]) => {
      this.dailyLabels = result.map(r => this.formatDia(r.dia));
      this.dailyDatasets = [{ data: result.map(r => r.eventos), label: 'Eventos', borderColor: COLOR_TRAVELACE, backgroundColor: 'rgba(24,144,255,0.08)', pointRadius: 3, borderWidth: 2, fill: true }];
      this.loadingDailyChart = false;
    });

    this.loadingBranchChart = true;
    this.activityService.getActivityByBranch(start, finDia).subscribe((result: any[]) => {
      this.branchLabels = result.map(r => r.sucursal);
      this.branchDatasets = [{ data: result.map(r => r.eventos), label: 'Eventos', backgroundColor: COLOR_TRAVELACE, maxBarThickness: 24 }];
      this.loadingBranchChart = false;
    });

    this.loadingModuleChart = true;
    this.activityService.getEventTypeDistribution(start, finDia).subscribe((result: any[]) => {
      this.moduleLabels = result.map(r => r.modulo);
      this.moduleData = result.map(r => r.cantidad);
      this.moduleColors = [{ backgroundColor: result.map(r => MODULE_COLORS[r.modulo] || '#8c8c8c') }];
      this.loadingModuleChart = false;
    });

    this.loadingRecentEvents = true;
    this.activityService.getRecentEvents(50).subscribe((result: any[]) => {
      this.recentEvents = result;
      this.loadingRecentEvents = false;
    });
  }

  private buildUserChart(rows: any[]) {
    const usuarios = Array.from(new Set(rows.map(r => r.usuario)));
    const modulos = ['Travelace', 'Carga', 'Paquetes'];

    this.userLabels = usuarios;
    this.userDatasets = modulos.map(modulo => ({
      data: usuarios.map(u => {
        const fila = rows.find(r => r.usuario === u && r.modulo === modulo);
        return fila ? fila.cantidad : 0;
      }),
      label: modulo,
      backgroundColor: MODULE_COLORS[modulo],
      maxBarThickness: 20
    }));
  }

  private primerDiaDelMes(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  private formatDia(dia: string): string {
    const d = new Date(dia);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  }
}
