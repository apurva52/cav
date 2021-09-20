import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DistributionComponent } from './distribution.component';
import { FormsModule } from '@angular/forms';
import { MessageModule,  RadioButtonModule, TableModule, InputTextModule,TooltipModule } from 'primeng';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { RouterModule, Routes } from '@angular/router';


const imports = [
  CommonModule,
  MessageModule,
  ChartModule,
  RadioButtonModule,
  FormsModule,
  TableModule,
  InputTextModule,
  TooltipModule
];

const components = [
  DistributionComponent
];


const routes: Routes = [
  {
    path: 'distribution',
    component: DistributionComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components, RouterModule],
})

export class DistributionModule { }
