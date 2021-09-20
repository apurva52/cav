import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MethodCallDetailsComponent } from './method-call-details.component';
import { RouterModule, Routes } from '@angular/router';
import { TableModule, CardModule, ButtonModule, ToastModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, MenuModule, ContextMenuModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { TreeTableModule } from 'primeng/treetable';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SlideMenuModule } from 'primeng';
import { AccordionModule } from 'primeng/accordion';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { DynamicLoggingModule } from './dynamic-logging/dynamic-logging.module';
import { RepeatedCalloutDetailsModule } from './repeated-callout-details/repeated-callout-details.module';
import { WidgetMenuModule } from 'src/app/shared/dashboard/widget/widget-menu/widget-menu.module';
import { DiagnosticsConfigurationModule } from 'src/app/shared/diagnostics-configuration/diagnostics-configuration.module';
//import { FlowpathDetailsModule } from '../../aggregate-transaction-flowmap/flowpath-details/flowpath-details.module';
import { FlowPathDialogModule } from './flow-path-dialog/flow-path-dialog.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

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
  TreeTableModule,
  DialogModule,
  InputTextModule,
  SlideMenuModule,
  AccordionModule,
  DropdownModule,
  OverlayPanelModule,
  AutoCompleteModule,
  DynamicLoggingModule,
  RepeatedCalloutDetailsModule,
  WidgetMenuModule,
  MenuModule,
  DiagnosticsConfigurationModule,
  FlowPathDialogModule,
  ContextMenuModule,
  PipeModule,
  CommonComponentsModule
];

const components = [MethodCallDetailsComponent];

const routes: Routes = [
  {
    path: 'method-call-details',
    component: MethodCallDetailsComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  providers:[],
  exports: [RouterModule, MethodCallDetailsComponent],
  entryComponents: [MethodCallDetailsComponent]
})
export class MethodCallDetailsModule { }
