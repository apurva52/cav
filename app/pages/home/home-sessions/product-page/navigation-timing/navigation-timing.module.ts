import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationTimingComponent } from './navigation-timing.component';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { OrderListModule, MessageModule, TableModule } from 'primeng';


const imports = [
  CommonModule,
  OrderListModule,
  MessageModule,
  TableModule,
  ChartModule
];

const components = [
  NavigationTimingComponent
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports:[
    components
  ]
})
export class NavigationTimingModule { }
