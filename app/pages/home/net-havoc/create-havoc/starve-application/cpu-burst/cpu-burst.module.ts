import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CpuBurstComponent } from './cpu-burst.component';
import { CardModule, ChipsModule, DropdownModule, InputTextModule, MessageModule, RadioButtonModule } from 'primeng';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/shared/chart/chart.module';


const components = [CpuBurstComponent];
const imports = [
  CommonModule,
  RadioButtonModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  MessageModule,
  FormsModule,
  CardModule,
  DropdownModule,
  InputTextModule,
  ChartModule,
  ChipsModule
  
];

const routes: Routes = [
  {
    path: 'cpu-burst',
    component: CpuBurstComponent,
    
  },
];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule]
})

export class CpuBurstModule { }
