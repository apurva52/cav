import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AlertComponent } from './alert.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  InputTextModule,
  ButtonModule,
  MessageModule,
  DialogModule,
  ToolbarModule,
  CardModule,
  DropdownModule,
  CheckboxModule,
  RadioButtonModule,
  TableModule,
  MultiSelectModule,
  MenuModule,
  BreadcrumbModule,
  TooltipModule,
  SlideMenuModule,
  ToastModule,
  OverlayPanelModule,
  TreeTableModule,

} from 'primeng';
import { MessageService } from 'primeng/api';
import { AlertRulesComponent } from './alert-rules/alert-rules.component';
import { AlertRulesModule } from './alert-rules/alert-rules.module';
import { AlertActionsComponent } from './alert-actions/alert-actions.component';
import { AlertBaselineComponent } from './alert-baseline/alert-baseline.component';
import { AlertBaselineModule } from './alert-baseline/alert-baseline.module';
import { AlertActionsModule } from './alert-actions/alert-actions.module';
import { AlertMaintenanceComponent } from './alert-maintenance/alert-maintenance.component';
import { AlertMaintenanceModule } from './alert-maintenance/alert-maintenance.module';
import { AlertConfigureComponent } from './alert-configure/alert-configure.component';
import { AlertConfigureModule } from './alert-configure/alert-configure.module';
import { AlertFilterModule } from './alert-filter/alert-filter.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { AlertActionHistoryModule } from './alert-action-history/alert-action-history.module';
import { HomeComponent } from '../../home/home.component';


const imports = [
  CommonModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  DialogModule,
  ToolbarModule,
  CardModule,
  FormsModule,
  DropdownModule,
  CheckboxModule,
  TableModule,
  MultiSelectModule,
  MenuModule,
  SlideMenuModule,
  BreadcrumbModule,
  TooltipModule,
  AlertRulesModule,
  AlertBaselineModule,
  AlertActionsModule,
  AlertMaintenanceModule,
  AlertConfigureModule,
  AlertFilterModule,
  PipeModule,
  ToastModule,
  AlertActionHistoryModule,
  OverlayPanelModule,
  TreeTableModule
];

const components = [AlertComponent];

const routes: Routes = [
  {
    path: 'alert',
    component: AlertComponent,
    children: [
      {
        path: '',
        redirectTo: 'alert',
        pathMatch: 'full',
      },
      {
        path: 'alert-rules',
        loadChildren: () =>
          import('./alert-rules/alert-rules.module').then(
            (m) => m.AlertRulesModule
          ),
        component: AlertRulesComponent,
      },
      {
        path: 'alert-actions',
        loadChildren: () =>
          import('./alert-actions/alert-actions.module').then(
            (m) => m.AlertActionsModule
          ),
        component: AlertActionsComponent,
      },
      {
        path: 'alert-baseline',
        loadChildren: () =>
          import('./alert-baseline/alert-baseline.module').then(
            (m) => m.AlertBaselineModule
          ),
        component: AlertBaselineComponent,
      },
      {
        path: 'alert-maintenance',
        loadChildren: () =>
          import('./alert-maintenance/alert-maintenance.module').then(
            (m) => m.AlertMaintenanceModule
          ),
        component: AlertMaintenanceComponent,
      },
      {
        path: 'alert-configure',
        loadChildren: () =>
          import('./alert-configure/alert-configure.module').then(
            (m) => m.AlertConfigureModule
          ),
        component: AlertConfigureComponent,
      }
    ],
  },
  {
    path: 'home',
    //redirectTo: 'dashboard',
    //redirectTo:'./../../home/dashboard-page/dashboard-page.module',
    /* loadChildren: () =>
      import('./../../home/dashboard-page/dashboard-page.module').then(
        (m) => m.DashboardPageModule
      ), */
    component: HomeComponent,
  }
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [MessageService],
})
export class AlertModule {}
