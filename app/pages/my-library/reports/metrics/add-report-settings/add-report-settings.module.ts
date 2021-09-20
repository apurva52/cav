import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddReportSettingsComponent } from './add-report-settings.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, DropdownModule, InputTextModule, MessageModule, OrderListModule, 
  RadioButtonModule, TableModule, ToolbarModule, MultiSelectModule, ListboxModule,
ConfirmDialogModule,TooltipModule,InputNumberModule,InputMaskModule} from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { IndicesSelectModule } from 'src/app/shared/dialogs/indices-select/indices-select.module';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FieldsetModule } from 'primeng';
import { DerivedMetricIndicesModule } from 'src/app/shared/derived-metric/derived-metric-indices/derived-metric-indices.module';
import {BlockUIModule} from 'primeng/blockui';


const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  BreadcrumbModule,
  InputTextModule,
  ButtonModule,
  CardModule,
  MessageModule,
  TableModule,
  OrderListModule,
  CheckboxModule,
  RadioButtonModule,
  DropdownModule,
  IndicesSelectModule,
  FormsModule,
  MultiSelectModule,
  DialogModule,
  FieldsetModule,
  ListboxModule,
  ConfirmDialogModule,
  DerivedMetricIndicesModule,
  TooltipModule,
  InputNumberModule,
  InputMaskModule,
  BlockUIModule
];
const components = [
  AddReportSettingsComponent
];
const routes: Routes = [
  {
    path: 'add-report-setting',
    component: AddReportSettingsComponent
  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    components
  ]
})
export class AddReportSettingsModule { }
