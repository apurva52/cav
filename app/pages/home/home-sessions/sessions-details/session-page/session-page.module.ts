import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionPageComponent } from './session-page.component';
import { OrderListModule, MessageModule, TableModule, InputTextModule, CardModule, ButtonModule, CheckboxModule, DialogModule, MenuModule, MultiSelectModule, SlideMenuModule, ToastModule, TooltipModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module'; 
// import { PageScatterplotModule } from './page-scatter-plot/page-scatter-plot.module'; 
import { PageScatterplotModule } from './page-scatter-map/page-scatter-plot.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { EventRevenueModule } from '../../event-revenue/event-revenue.module'; 
import { ProgressSpinnerModule } from 'primeng/progressspinner'; 

const imports = [
  CommonModule,
  OrderListModule,
  MessageModule,
  TableModule,
  InputTextModule,
  ClipboardModule,
  CardModule,
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  ToastModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,
  ReactiveFormsModule,
  DialogModule,
  SlideMenuModule,
  MenuModule,
  PipeModule,
  PageScatterplotModule,
  EventRevenueModule,
  ProgressSpinnerModule


 
];

const components = [
  SessionPageComponent
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
export class SessionPageModule { }
