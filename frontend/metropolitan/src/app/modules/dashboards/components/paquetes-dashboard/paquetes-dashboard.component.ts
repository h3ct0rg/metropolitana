import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';

import { DashboardPaquetesService } from '../../services/dashboard-paquetes.services';
import { SucursalService } from '../../../core/services/sucursal.services';

const COLOR_PAQUETES = '#722ed1';

@Component({
  selector: 'app-paquetes-dashboard',
  templateUrl: './paquetes-dashboard.component.html',
  styleUrls: ['./paquetes-dashboard.component.css']
})
export class PaquetesDashboardComponent implements OnInit {

  listSucursales: any[] = [];
  idSucursal: number = -1;
  rangoFechas: Date[] = [this.primerDiaDelMes(), new Date()];

  loadingFechaChart = true;
  loadingSucursalChart = true;

  fechaLabels: Label[] = [];
  fechaDatasets: ChartDataSets[] = [];
  fechaOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    legend: { display: false },
    scales: { yAxes: [{ ticks: { beginAtZero: true, precision: 0 } }] }
  };

  sucursalLabels: Label[] = [];
  sucursalData: number[] = [];
  sucursalColors = [{ backgroundColor: ['#722ed1', '#1890ff', '#fa8c16', '#13c2c2', '#eb2f96', '#52c41a'] }];
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
          return `${label}: ${value} (${pct}%)`;
        }
      }
    }
  };

  constructor(
    private paquetesDashboardService: DashboardPaquetesService,
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

    this.loadingFechaChart = true;
    this.paquetesDashboardService.getNdPorFecha(this.idSucursal, start, finDia).subscribe((result: any[]) => {
      this.fechaLabels = result.map(r => this.formatDia(r.fecha));
      this.fechaDatasets = [{
        data: result.map(r => r.cantidad), label: 'Notas de Débito', borderColor: COLOR_PAQUETES,
        backgroundColor: 'rgba(114,46,209,0.08)', pointBackgroundColor: COLOR_PAQUETES, pointBorderColor: '#fff',
        pointRadius: 3, borderWidth: 2, fill: true
      }];
      this.loadingFechaChart = false;
    });

    this.loadingSucursalChart = true;
    this.paquetesDashboardService.getNdPorSucursal(start, finDia).subscribe((result: any[]) => {
      this.sucursalLabels = result.map(r => r.sucursal);
      this.sucursalData = result.map(r => r.cantidad);
      this.loadingSucursalChart = false;
    });
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
