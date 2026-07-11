import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.css']
})
export class KpiCardComponent {
  @Input() titulo: string;
  @Input() valor: string;
  @Input() delta: number | null = null;
  @Input() deltaLabel: string = 'vs mes anterior';
  @Input() icono: string = 'bar-chart';
  @Input() loading: boolean = false;

  get deltaEsPositivo(): boolean {
    return this.delta != null && this.delta >= 0;
  }
}
