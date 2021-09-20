import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatedmetricsComponent } from './relatedmetrics.component';
import { AccordionModule, ButtonModule,BreadcrumbModule, CardModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, MenuModule, MultiSelectModule, RadioButtonModule, TableModule } from 'primeng';
import { HeaderModule } from '../../header/header.module';
import { FormsModule } from '@angular/forms';
import { HelpRelatedmetricsModule } from './helprelatedmetrics/helprelatedmetrics.module';
import { ChartModule } from '../../chart/chart.module';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
import { ToastModule } from "primeng/toast";
import { DerivedMetricIndicesModule } from '../../derived-metric/derived-metric-indices/derived-metric-indices.module';
import { SaveCatalogueModule } from '../../../shared/pattern-matching/save-catalogue/save-catalogue.module';
import { ConfirmationDialogModule } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.module';
const imports = [
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  DropdownModule,
  RadioButtonModule,
  FormsModule,
  AccordionModule,
  CheckboxModule,
  InputTextModule,
  TableModule,
  CardModule,
  HelpRelatedmetricsModule,
  ChartModule,
  MenuModule,
  MultiSelectModule,
  DerivedMetricIndicesModule,
  ConfirmDialogModule,
  ConfirmationDialogModule,
  ToastModule,
  SaveCatalogueModule
];

const components = [RelatedmetricsComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class RelatedmetricsModule { } 
