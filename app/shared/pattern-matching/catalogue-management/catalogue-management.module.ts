import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogueManagementComponent } from './catalogue-management.component';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, FieldsetModule, SliderModule, DropdownModule, TabViewModule, PickListModule, RadioButtonModule, TableModule, CardModule } from 'primeng';
import { HeaderModule } from '../../header/header.module';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
import { DerivedMetricModule } from '../../derived-metric/derived-metric.module';
import {DerivedMetricIndicesModule} from '../../derived-metric/derived-metric-indices/derived-metric-indices.module';
const components = [
  CatalogueManagementComponent
];

const imports = [
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  FieldsetModule,
  SliderModule,
  DropdownModule,
  DerivedMetricIndicesModule,
  TabViewModule,
  PickListModule,
  RadioButtonModule,
  TableModule,
  CardModule,
  FormsModule,
  DerivedMetricModule,
  ConfirmDialogModule
];
@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})

export class CatalogueManagementModule { }
