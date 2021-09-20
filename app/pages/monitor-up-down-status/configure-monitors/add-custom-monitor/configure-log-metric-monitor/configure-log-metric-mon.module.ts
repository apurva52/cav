import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CalendarModule, CardModule, CheckboxModule, ConfirmDialogModule, DialogModule, DropdownModule, FieldsetModule, InputTextareaModule, PanelModule, ProgressSpinnerModule, TableModule, ToastModule, ToolbarModule, TreeModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import {AccordionModule} from 'primeng/accordion';
import {RadioButtonModule} from 'primeng/radiobutton';

import { GenericGDFModule } from 'src/app/pages/generic-gdf/generic-gdf.module';
import { MetricGroupInfoComponent } from 'src/app/pages/generic-gdf/components/gdf-home/metric-group-info/metric-group-info.component';
import { MetricConfigurationComponent } from 'src/app/pages/generic-gdf/components/gdf-home/metric-configuration/metric-configuration.component';
import { MetricHierarchyComponent } from 'src/app/pages/generic-gdf/components/gdf-home/metric-hierarchy/metric-hierarchy.component';
import { ConfigureLogMetricMonComponent } from './configure-log-metric-mon.component';

const routes: Routes = [
    {
      path: 'configure-log-metric-monitor',
      component: ConfigureLogMetricMonComponent
    }
  ];



@NgModule({
  declarations: [ConfigureLogMetricMonComponent],
  imports: [
    GenericGDFModule,
   // MetricGroupInfoComponent,
    CommonModule,
    ToolbarModule,
    HeaderModule,
    InputTextModule,
    FormsModule,
    CheckboxModule,
    AccordionModule,
    RadioButtonModule,
    DropdownModule,
    InputTextareaModule,
    TableModule,
    CardModule,
    InputTextareaModule,
    TreeModule,
    PanelModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    FieldsetModule, 
    CalendarModule, 
    ToastModule,
    ProgressSpinnerModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ConfigureLogMetricMonModule { }
