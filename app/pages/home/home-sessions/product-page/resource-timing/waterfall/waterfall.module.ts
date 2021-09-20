import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaterfallComponent } from './waterfall.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MessageModule, ButtonModule, TableModule, TooltipModule, MenuModule, DialogModule } from 'primeng';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import {InputTextModule} from 'primeng/inputtext';


const imports = [
  CommonModule,
  MessageModule,
  ChartModule,
  FormsModule,
  ButtonModule,
  TableModule,
  TooltipModule,
  MenuModule,
  DialogModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  FormsModule, ReactiveFormsModule,
  InputTextModule
];

const components = [
  WaterfallComponent
];


const routes: Routes = [
  {
    path: 'waterfall',
    component: WaterfallComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components, RouterModule],
})

export class WaterfallModule { }
