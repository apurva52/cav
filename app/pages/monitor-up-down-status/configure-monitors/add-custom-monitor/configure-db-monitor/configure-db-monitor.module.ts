import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CardModule, CheckboxModule, ConfirmationService, ConfirmDialogModule, DialogModule, DropdownModule, FieldsetModule, InputTextareaModule, PanelModule, ProgressSpinnerModule, TableModule, ToastModule, ToolbarModule, TreeModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import {AccordionModule} from 'primeng/accordion';
import {RadioButtonModule} from 'primeng/radiobutton';
import { GenericGDFModule } from 'src/app/pages/generic-gdf/generic-gdf.module';
import { MetricGroupInfoComponent } from 'src/app/pages/generic-gdf/components/gdf-home/metric-group-info/metric-group-info.component';
import { MetricConfigurationComponent } from 'src/app/pages/generic-gdf/components/gdf-home/metric-configuration/metric-configuration.component';
import { MetricHierarchyComponent } from 'src/app/pages/generic-gdf/components/gdf-home/metric-hierarchy/metric-hierarchy.component';
import { ConfigureDbMonitorComponent } from './configure-db-monitor.component';
import { DbConnectionComponent } from '../db-connection/db-connection.component';
import { DBConnectionModule } from '../db-connection/db-connection.module';

const routes: Routes = [
    {
      path: 'configure-db-monitor',
      component: ConfigureDbMonitorComponent
    }
  ];



@NgModule({
  declarations: [ConfigureDbMonitorComponent
],
  imports: [
    GenericGDFModule,
   // MetricGroupInfoComponent,
   DBConnectionModule,
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
    ToastModule,
    ProgressSpinnerModule,
    RouterModule.forChild(routes)
  ],

  providers: [
    
    ConfirmationService,
    
 ],
  
  exports: [RouterModule],
  entryComponents: [
    DbConnectionComponent
  ],
})
export class ConfigureDBMonitorModule { }
