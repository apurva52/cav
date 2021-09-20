import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KubernetesComponent } from './kubernetes.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, DropdownModule, FieldsetModule, InputSwitchModule, InputTextareaModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, RadioButtonModule, TableModule, ToastModule, ToolbarModule, TooltipModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { OwlDateTimeModule } from 'ng-pick-datetime';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  CardModule,
  CheckboxModule,
  MultiSelectModule,
  InputTextModule,
  RadioButtonModule,
  DropdownModule,  
  PanelModule, 
  InputTextareaModule,
  BreadcrumbModule,
  MenuModule,
  InputSwitchModule,
  FormsModule,
  FieldsetModule,
  TableModule,
  AppMessageModule,
  ToastModule,
  ReactiveFormsModule,
  LongValueModule,
  PipeModule,
  IpSummaryOpenBoxModule,
  MessageModule,
  OwlDateTimeModule,
  TooltipModule
];

const components = [KubernetesComponent];

const routes: Routes = [
  {
    path: 'rbu-access-logs',
    component: KubernetesComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
  })

export class KubernetesModule { }
