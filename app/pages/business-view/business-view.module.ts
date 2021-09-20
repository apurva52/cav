import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessViewComponent } from './business-view.component';
import { Routes, RouterModule } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';

import { FormsModule } from '@angular/forms';
import {
  CarouselModule,
  CardModule,
  AccordionModule,
  ToolbarModule,
  ButtonModule,
  CheckboxModule,
  MultiSelectModule,
  InputTextModule,
  RadioButtonModule,
  DropdownModule,
  PanelModule,
  InputTextareaModule,
  BreadcrumbModule,
  MenuModule,
  InputSwitchModule,
  MessageModule,
  DialogModule,
  TableModule,
  TooltipModule,
} from 'primeng';
import { ChartModule } from 'src/app/shared/chart/chart.module';

import { SliderComponent } from './slider/slider.component';
import { SystemSummaryViewModule } from './system-summary-view/system-summary-view.module';
import { BusinessTierComponentViewModule } from './business-tier-component-view/business-tier-component-view.module';
import { BusinessSummaryViewModule } from './business-summary-view/business-summary-view.module';
import { BusinessTierComponentViewComponent } from './business-tier-component-view/business-tier-component-view.component';
import { SystemSummaryViewComponent } from './system-summary-view/system-summary-view.component';
import { BusinessSummaryViewComponent } from './business-summary-view/business-summary-view.component';
import { BusinessApplicationViewComponent } from './business-application-view/business-application-view.component';
import { BusinessApplicationViewModule } from './business-application-view/business-application-view.module';

const imports = [
  CommonModule,
  HeaderModule,
  ChartModule,
  CarouselModule,
  CardModule,
  AccordionModule,
  ToolbarModule,
  ButtonModule,
  CheckboxModule,
  MultiSelectModule,
  InputTextModule,
  RadioButtonModule,
  DropdownModule,
  PanelModule,
  InputTextareaModule,
  BreadcrumbModule,
  MenuModule,
  InputSwitchModule,
  FormsModule,
  MessageModule,
  DialogModule,
  TableModule,
  TooltipModule,
  SystemSummaryViewModule,
  BusinessSummaryViewModule,
  BusinessTierComponentViewModule,
  BusinessApplicationViewModule,
];

const routes: Routes = [
  {
    path: 'business-view',
    component: BusinessViewComponent,

    children: [
      {
        path: 'business-application-view',
        loadChildren: () =>
          import(
            './business-application-view/business-application-view.module'
          ).then((m) => m.BusinessApplicationViewModule),
        component: BusinessApplicationViewComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [BusinessViewComponent, SliderComponent],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class BusinessViewModule {}
