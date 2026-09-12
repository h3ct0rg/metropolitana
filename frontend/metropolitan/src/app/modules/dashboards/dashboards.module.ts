import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule, ThemeService } from 'ng2-charts';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { DashboardsRoutingModule } from './dashboards-routing.module';
import { MainDashboardComponent } from './components/main-dashboard/main-dashboard.component';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { FinancialDashboardComponent } from './components/financial-dashboard/financial-dashboard.component';
import { ActivityDashboardComponent } from './components/activity-dashboard/activity-dashboard.component';
import { CurrencyDashboardComponent } from './components/currency-dashboard/currency-dashboard.component';

import { DashboardFinancialService } from './services/dashboard-financial.services';
import { DashboardActivityService } from './services/dashboard-activity.services';
import { DashboardCurrencyService } from './services/dashboard-currency.services';

@NgModule({
    declarations: [MainDashboardComponent, KpiCardComponent, FinancialDashboardComponent, ActivityDashboardComponent, CurrencyDashboardComponent],
    imports: [
        CommonModule, FormsModule, DashboardsRoutingModule, ChartsModule,
        NzTabsModule, NzGridModule, NzFormModule, NzSelectModule, NzDatePickerModule,
        NzSpinModule, NzTableModule, NzIconModule
    ],
    providers: [DashboardFinancialService, DashboardActivityService, DashboardCurrencyService, ThemeService],
    exports: [MainDashboardComponent]
})
export class DashboardsModule {}
