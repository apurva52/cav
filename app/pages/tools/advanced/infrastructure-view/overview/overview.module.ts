import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview.component';
import { RouterModule, Routes } from '@angular/router';
import { OngoingTestModule } from '../ongoing-test/ongoing-test.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { AccordionModule, ButtonModule, CardModule, CarouselModule, CheckboxModule, InputTextModule, MenuModule, MultiSelectModule, TableModule, TooltipModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';

const imports = [
  CommonModule,
  OngoingTestModule,
  ChartModule,
  CarouselModule,
  CardModule,
  AccordionModule,
  TableModule,
  ButtonModule,
  TooltipModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  InputTextModule,
  CheckboxModule
];

const components = [
  OverviewComponent
];
const routes: Routes = [
  {
    path: 'overview',
    component: OverviewComponent,
  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule,components
  ]
})
export class OverviewModule { }
