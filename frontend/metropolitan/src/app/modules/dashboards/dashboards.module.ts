import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardsRoutingModule } from './dashboards-routing.module';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';

@NgModule({
    declarations: [MainDashboardComponent],
    imports: [CommonModule, DashboardsRoutingModule],
    exports: [MainDashboardComponent]
})
export class DashboardsModule {}
