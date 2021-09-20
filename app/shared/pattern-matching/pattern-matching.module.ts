import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule, ButtonModule, CheckboxModule, DropdownModule, FieldsetModule, InputTextModule, SliderModule, PickListModule, RadioButtonModule, CardModule, ProgressSpinnerModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { PatternMatchingComponent } from './pattern-matching.component';
import { CatalogueManagementModule } from './catalogue-management/catalogue-management.module';
import { SaveCatalogueModule } from './save-catalogue/save-catalogue.module';
import { DerivedMetricModule } from '../derived-metric/derived-metric.module';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import {DerivedMetricIndicesModule} from '../derived-metric/derived-metric-indices/derived-metric-indices.module';
import {AutoCompleteModule} from 'primeng/autocomplete';
const imports = [
  CommonModule,
  DialogModule,
  ButtonModule,
  FormsModule,
  InputTextModule,
  CheckboxModule,
  DropdownModule,
  FieldsetModule,
  DerivedMetricIndicesModule,
  ProgressSpinnerModule,
  SliderModule,
  CatalogueManagementModule,
  PickListModule,
  RadioButtonModule,
  CardModule,
  SaveCatalogueModule,
  DerivedMetricModule,
  ConfirmDialogModule,
  MessagesModule,
  AutoCompleteModule
];

const components = [
  PatternMatchingComponent
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [
    components
  ]
})
export class PatternMatchingModule { }
