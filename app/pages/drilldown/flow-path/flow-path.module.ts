import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowPathComponent } from './flow-path.component';
import { RouterModule, Routes } from '@angular/router';
import {
  TableModule,
  CardModule,
  ButtonModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  DialogModule,
  SlideMenuModule,
  MenuModule,InputTextModule, PaginatorModule
} from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
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
  ReactiveFormsModule,
  LongValueModule,
  DialogModule,
  PipeModule,
  SlideMenuModule,
  MenuModule,
  IpSummaryOpenBoxModule,
  InputTextModule,
  PaginatorModule,
  DialogModule,
  CommonComponentsModule

];

const components = [FlowPathComponent];

const routes: Routes = [
  {
    path: 'flow-path',
    component: FlowPathComponent,
    
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlowPathModule {}
