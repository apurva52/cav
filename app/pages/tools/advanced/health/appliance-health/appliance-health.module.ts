import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplianceHealthComponent } from './appliance-health.component';
import { Routes, RouterModule } from '@angular/router';
import { ToolbarModule, ButtonModule, TooltipModule } from 'primeng';
import { DashboardModule } from 'src/app/shared/dashboard/dashboard.module';
import { HeaderModule } from 'src/app/shared/header/header.module';

const routes: Routes = [
  {
    path: 'application-health',
    component: ApplianceHealthComponent,
  },
];

const components = [ApplianceHealthComponent];

const imports = [
  HeaderModule,
  ToolbarModule,
  ButtonModule,
  DashboardModule,
  TooltipModule,
];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class ApplianceHealthModule {}
