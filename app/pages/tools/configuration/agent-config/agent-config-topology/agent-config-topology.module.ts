import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentConfigTopologyComponent } from './agent-config-topology.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { CardModule, TabMenuModule, InputTextModule, RadioButtonModule, DropdownModule, MessageModule, ButtonModule, AccordionModule, CheckboxModule, TreeModule, BreadcrumbModule, FieldsetModule, InputSwitchModule, InputTextareaModule, MenuModule, MultiSelectModule, PanelModule, TableModule, ToastModule, ToolbarModule } from 'primeng';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

const imports = [
  CommonModule,
  CardModule,
  InputTextModule,
  MessageModule,
  FormsModule,
  ButtonModule,
  AccordionModule,
  CheckboxModule,
  TreeModule,
  HeaderModule,
  MultiSelectModule,
  InputTextareaModule,
  MenuModule,
  TableModule,
  AppMessageModule,
  ToastModule,
  ReactiveFormsModule,
  LongValueModule,
  PipeModule,
  IpSummaryOpenBoxModule,

];
const components = [
  AgentConfigTopologyComponent
];
const routes: Routes = [
  {
    path: 'agent-config-topology',
    component: AgentConfigTopologyComponent,

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
export class AgentConfigTopologyModule { }




