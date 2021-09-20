import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CardModule, CheckboxModule, ConfirmDialogModule, DialogModule, DropdownModule, FieldsetModule, InputTextareaModule, PanelModule, ProgressSpinnerModule, TableModule, ToolbarModule, TreeModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import {AccordionModule} from 'primeng/accordion';
import {RadioButtonModule} from 'primeng/radiobutton';

import { GenericGDFModule } from 'src/app/pages/generic-gdf/generic-gdf.module';
import { MetricGroupInfoComponent } from 'src/app/pages/generic-gdf/components/gdf-home/metric-group-info/metric-group-info.component';
import { MetricConfigurationComponent } from 'src/app/pages/generic-gdf/components/gdf-home/metric-configuration/metric-configuration.component';
import { MetricHierarchyComponent } from 'src/app/pages/generic-gdf/components/gdf-home/metric-hierarchy/metric-hierarchy.component';
//import { CavJmxConnectionComponent } from './jmx-connection/jmx-connection.component';
import { ConfigureJmxMonitorComponent } from './configure-jmx-monitor.component';
import { JMXConnectionModule } from './jmx-connection/jmx-connection-module';


const routes: Routes = [
    {
     path: 'configure-jmx-monitor',
      component: ConfigureJmxMonitorComponent
    }
  ];



@NgModule({
  declarations: [ConfigureJmxMonitorComponent],
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
    JMXConnectionModule,
    ConfirmDialogModule,
    DialogModule,
    FieldsetModule,  
    ProgressSpinnerModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
 
})
export class ConfigureJMXModule { }
