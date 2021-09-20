import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { KpiGraphicalComponent } from './kpi-graphical.component';
import { ToolbarModule, ButtonModule, TooltipModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { DashboardModule } from 'src/app/shared/dashboard/dashboard.module';
import { TimeBarModule } from 'src/app/shared/time-bar/time-bar.module';
import { LowerTabularPanelModule } from 'src/app/shared/lower-tabular-panel/lower-tabular-panel.module';

const routes: Routes = [
  {
    path: 'graphical',
    component: KpiGraphicalComponent,
  },
];

const components = [KpiGraphicalComponent];

const imports = [
  HeaderModule,
  ToolbarModule,
  ButtonModule,
  DashboardModule,
  TimeBarModule,
  LowerTabularPanelModule,
  TooltipModule,
];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class KpiGraphicalModule {}
