import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EndToEndTierComponent } from './end-to-end-tier.component';
import { BreadcrumbModule, ButtonModule, MessageModule, OrderListModule, ToolbarModule } from 'primeng';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';

const routes: Routes = [
  {
    path: 'end-to-end-tier',
    component: EndToEndTierComponent,
  },
];

const components = [EndToEndTierComponent];

const imports = [
  CommonModule,
  MessageModule,
  OrderListModule,
  ButtonModule,
  BreadcrumbModule,
  HeaderModule,
  ToolbarModule,
  ChartModule
];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})

export class EndToEndTierModule { }
