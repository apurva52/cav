import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainActivityComponent } from './domain-activity.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, DialogModule, MessageModule, TableModule, MenuModule, TooltipModule, InputTextModule } from 'primeng';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';



const imports = [
  CommonModule,
  MessageModule,
  ChartModule,
  FormsModule,
  ButtonModule,
  TooltipModule,
  TableModule,
  DialogModule,
  MenuModule,
  OwlDateTimeModule,
  InputTextModule,
  OwlMomentDateTimeModule,
  FormsModule, ReactiveFormsModule,
];

const components = [
  DomainActivityComponent
];


const routes: Routes = [
  {
    path: 'domain-activity',
    component: DomainActivityComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components, RouterModule],
})


export class DomainActivityModule { }
