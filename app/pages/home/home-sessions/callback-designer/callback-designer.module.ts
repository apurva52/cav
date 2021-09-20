import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { jsPlumbToolkitModule } from 'jsplumbtoolkit-angular';
import { jsPlumbToolkitDragDropModule } from 'jsplumbtoolkit-angular-drop';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, ConfirmDialogModule, DialogModule, DropdownModule, InputNumberModule, InputSwitchModule, InputTextareaModule, InputTextModule, ListboxModule, MenuModule, MessageModule, MultiSelectModule, OrderListModule, PanelModule, ProgressSpinnerModule, RadioButtonModule, SidebarModule, TabViewModule, TieredMenuModule, ToastModule, ToolbarModule, TooltipModule } from 'primeng';
import { CheckPointModule } from 'src/app/pages/sessions/nv-config/check-point/check-point.module';
import { DynamicFormModule } from 'src/app/shared/dynamic-form/dynamic-form.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { CallbackDesignerComponent } from './callback-designer.component';
import { CallbackDatapointComponent } from './callback-flowchart-sidebar/callback-datapoint/callback-datapoint.component';
import { CallbackFlowchartSidebarComponent } from './callback-flowchart-sidebar/callback-flowchart-sidebar.component';
import { CallbackLocalvarComponent } from './callback-flowchart-sidebar/callback-localvar/callback-localvar.component';
import { CallbackActionApiFormComponent } from './callback-flowchart/callback-action-api-form/callback-action-api-form.component';
import { CallbackActionConditionFormComponent } from './callback-flowchart/callback-action-condition-form/callback-action-condition-form.component';
import { CallbackFlowchartComponent } from './callback-flowchart/callback-flowchart.component';
import { CallbackHistoryComponent } from './callback-history/callback-history.component';
import { ActionNodeComponent } from './callback-nodes/action-node/action-node.component';
import { EndNodeComponent } from './callback-nodes/end-node/end-node.component';
import { PlaceholderNodeComponent } from './callback-nodes/placeholder-node/placeholder-node.component';
import { QuestionNodeComponent } from './callback-nodes/question-node/question-node.component';
import { StartNodeComponent } from './callback-nodes/start-node/start-node.component';
import { StateNodeComponent } from './callback-nodes/state-node/state-node.component';
import { CallbackStateDiagramComponent } from './callback-state-diagram/callback-state-diagram.component';
import { CallbackTriggerActionComponent } from './callback-trigger-action/callback-trigger-action.component';

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
  BreadcrumbModule,
  MenuModule,
  FormsModule,
  ReactiveFormsModule,
  MessageModule,
  DialogModule,
  TooltipModule,
  OrderListModule,
  TabViewModule,
  jsPlumbToolkitModule,
  jsPlumbToolkitDragDropModule,
  DialogModule,
  InputTextareaModule,
  ProgressSpinnerModule,
  ToastModule,
  ConfirmDialogModule,
  DynamicFormModule,
  InputNumberModule,
  TieredMenuModule,
  SidebarModule,
  ListboxModule,
  InputSwitchModule,
  CheckPointModule,
  MonacoEditorModule
];

const components = [
  CallbackDesignerComponent,
  CallbackStateDiagramComponent,
  CallbackTriggerActionComponent,
  CallbackFlowchartComponent,
  CallbackFlowchartSidebarComponent,
  CallbackDatapointComponent,
  CallbackLocalvarComponent,
  ActionNodeComponent,
  EndNodeComponent,
  PlaceholderNodeComponent,
  QuestionNodeComponent,
  StartNodeComponent,
  StateNodeComponent,
  CallbackActionApiFormComponent,
  CallbackActionConditionFormComponent,
  CallbackHistoryComponent
];

const routes: Routes = [
  {
    path: 'callback-designer',
    component: CallbackDesignerComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
  entryComponents: [StartNodeComponent, StateNodeComponent, EndNodeComponent, ActionNodeComponent, QuestionNodeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class CallbackDesignerModule { }
