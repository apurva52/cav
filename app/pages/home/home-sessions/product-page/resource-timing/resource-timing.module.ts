import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceTimingComponent } from './resource-timing.component';
import { InputTextModule, MessageModule, RadioButtonModule, TableModule } from 'primeng';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { FormsModule } from '@angular/forms';
import { DistributionModule } from './distribution/distribution.module';
import { Routes, RouterModule } from '@angular/router';
import { DomainActivityModule } from './domain-activity/domain-activity.module';
import { BottleneckModule } from './bottleneck/bottleneck.module';
import { WaterfallModule } from './waterfall/waterfall.module';


const imports = [
  CommonModule,
  MessageModule,
  ChartModule,
  RadioButtonModule,
  FormsModule,
  TableModule,
  InputTextModule,
  DistributionModule,
  DomainActivityModule,
  BottleneckModule,
  WaterfallModule
];

const components = [
  ResourceTimingComponent
];

const routes: Routes = [
  {
    path: 'resource-timing',
    component: ResourceTimingComponent,
  }
]

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
export class ResourceTimingModule { }
