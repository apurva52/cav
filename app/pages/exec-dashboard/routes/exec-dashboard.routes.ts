import { Routes, RouterModule } from '@angular/router';
import { ExecDashboardKpiComponent } from '../components/exec-dashboard-kpi/exec-dashboard-kpi.component';
import { ExecDashboardMainComponent } from '../exec-dashboard-main.component';
import { ExecDashboardTierStatusComponent } from '../components/exec-dashboard-tier-status/exec-dashboard-tier-status.component';
import { ExecDashboardGraphicalKpiComponent } from '../components/exec-dashboard-graphical-kpi/exec-dashboard-graphical-kpi.component';
import { ExecDashboardSystemStatusComponent } from '../components/exec-dashboard-system-status/exec-dashboard-system-status.component';
import { StoreTransactionTable } from '../components/store-health-status/store-transaction-table/store-transaction-table';
import {StoreHealthStatusComponent} from '../components/store-health-status/store-health-status.component';

// Route Configuration
export const EXEC_DASHBOARD_ROUTES: Routes = [ 
  { path: '', redirectTo: 'main/tierStatus', pathMatch: 'full' },
  {
    path: 'main/tierStatus', component: ExecDashboardTierStatusComponent,
    // children: [
    //   { path: '', redirectTo: 'tierStatus', pathMatch: 'full' },
    //   { path: 'kpi', component: ExecDashboardKpiComponent },
    //   { path: 'graphicalKpi', component: ExecDashboardGraphicalKpiComponent },
    //   { path: 'tierStatus', component: ExecDashboardTierStatusComponent},
    //   { path: 'system-status', component: ExecDashboardSystemStatusComponent },
    //   { path: 'storeView', component: StoreHealthStatusComponent},
    //   { path: 'transactionTable', component: StoreTransactionTable },
    //   { path: 'transactionTable/:type', component: StoreTransactionTable }
    // ]
  },
];

