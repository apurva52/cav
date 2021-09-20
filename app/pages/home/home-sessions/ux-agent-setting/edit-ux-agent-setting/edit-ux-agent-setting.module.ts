import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditUxAgentSettingComponent } from './edit-ux-agent-setting.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ToolbarModule, BreadcrumbModule, TabViewModule, ProgressSpinnerModule, ConfirmDialogModule, SidebarModule, ToastModule, InputSwitchModule, TableModule, CardModule, MessageModule, TooltipModule, MultiSelectModule, MenuModule, DropdownModule, InputTextModule, ButtonModule, ChartModule, PanelModule, TabMenuModule, OrderListModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { UxAgentSettingComponent } from './../ux-agent-setting.component';
import { DynamicFormModule } from 'src/app/shared/dynamic-form/dynamic-form.module';

const imports = [
  CommonModule,
  HeaderModule,
  DynamicFormModule,
  ToolbarModule,
  BreadcrumbModule,
  TabViewModule,
  InputSwitchModule,
  ToastModule,
  ProgressSpinnerModule,
  TableModule,
  SidebarModule,
  ConfirmDialogModule,
  CardModule,
  MessageModule,
  TooltipModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  DropdownModule,
  InputTextModule,
  ButtonModule,
  ChartModule,
  PanelModule,
  TabMenuModule,
  OrderListModule

];
const components = [EditUxAgentSettingComponent];

const routes: Routes = [
  {
    path: 'edit-ux-agent-setting',
    component: EditUxAgentSettingComponent
  },
  {
    path: 'ux-agent-setting',
    component: UxAgentSettingComponent
  }
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditUxAgentSettingModule { }


