import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthCheckMonitorComponent } from './health-check-monitor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule, ButtonModule, MessageModule, DialogModule, ToolbarModule, CardModule, DropdownModule, CheckboxModule, TableModule, MultiSelectModule, MenuModule, SlideMenuModule, BreadcrumbModule, TooltipModule, FieldsetModule, InputSwitchModule, InputTextareaModule, PanelModule, RadioButtonModule, ToastModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { AddTemplateModule } from 'src/app/pages/my-library/reports/template/add-template/add-template.module';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';



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
 
  AddTemplateModule
  ];

const components = [HealthCheckMonitorComponent];


const routes: Routes = [
  {
    path: 'health-check-monitor',
    component: HealthCheckMonitorComponent,
  }
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
export class HealthCheckMonitorModule { }
