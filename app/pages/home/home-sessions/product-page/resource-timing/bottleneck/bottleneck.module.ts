import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BottleneckComponent } from './bottleneck.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MessageModule,  ButtonModule, PanelModule, TableModule, DialogModule} from 'primeng';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module'; 
import { ClipboardModule } from '@angular/cdk/clipboard';
import {InputTextModule} from 'primeng/inputtext';



const imports = [
  CommonModule,
  MessageModule,
  ChartModule,
  FormsModule,
  ButtonModule,
  PanelModule,
  TableModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  DialogModule,
  ClipboardModule,
  InputTextModule
];

const components = [
  BottleneckComponent
];


const routes: Routes = [
  {
    path: 'bottleneck',
    component: BottleneckComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components, RouterModule],
})

export class BottleneckModule { }
