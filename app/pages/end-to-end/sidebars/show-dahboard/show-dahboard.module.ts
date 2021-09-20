import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowDashboardComponent } from './show-dahboard.component';
import { ButtonModule, SidebarModule, TooltipModule } from 'primeng';
import { NodeActionMenuModule } from '../../end-to-end-graphical/node-action-menu/node-action-menu.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';

const imports = [
  CommonModule,
  TooltipModule,
  ButtonModule,
  SidebarModule,
  NodeActionMenuModule,
  ChartModule
];

const declarations = [ShowDashboardComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})
export class ShowDashboardModule {}
