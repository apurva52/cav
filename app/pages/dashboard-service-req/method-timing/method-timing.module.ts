import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MethodTimingComponent } from './method-timing.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule, CardModule, ButtonModule, ToastModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, InputTextModule } from 'primeng';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { ServiceMethodTimingModule } from './service-method-timing/service-method-timing.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { DialogModule } from 'primeng/dialog';
import { CommonComponentsModule } from '../../../shared/common-config-module';


const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,
  AccordionModule,
  PanelModule,
  ToolbarModule,
  MenuModule,
  InputTextModule,
  ServiceMethodTimingModule,
  ChartModule,
  PipeModule,
  DialogModule,
  CommonComponentsModule
];

const components = [
  MethodTimingComponent
];

const routes: Routes = [
  {
    path: 'method-timing',
    component: MethodTimingComponent,
  },]

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  providers:[],
  exports: [
    RouterModule, MethodTimingComponent
  ],
  entryComponents: [MethodTimingComponent]
})
export class MethodTimingModule { }
