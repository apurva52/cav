import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormAnalyticOverallComponent } from './form-analytic-overall.component';
import { Routes, RouterModule } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ToolbarModule } from 'primeng/toolbar';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { FormAnalyticsFilterModule } from '../form-analytics-filter/form-analytics-filter.module';
import { BreadcrumbModule,MessageModule } from 'primeng';
const routes: Routes = [
  {
    path: 'form-analytic-overall',
    component: FormAnalyticOverallComponent,

  },
];

@NgModule({
  declarations: [FormAnalyticOverallComponent],
  exports: [RouterModule, FormAnalyticOverallComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HeaderModule,MessageModule,
    ToolbarModule,
    CarouselModule,
    BreadcrumbModule,
    ButtonModule, FormAnalyticsFilterModule

  ]
})



export class FormAnalyticOverallModule { }

