import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CardModule, CheckboxModule, ConfirmationService, ConfirmDialogModule, DialogModule, DropdownModule, FieldsetModule, InputTextareaModule, PanelModule, ProgressSpinnerModule, TableModule, ToolbarModule, TreeModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import {AccordionModule} from 'primeng/accordion';
import {RadioButtonModule} from 'primeng/radiobutton';

import { GenericGDFModule } from 'src/app/pages/generic-gdf/generic-gdf.module';
import { MetricGroupInfoComponent } from 'src/app/pages/generic-gdf/components/gdf-home/metric-group-info/metric-group-info.component';
import { MetricConfigurationComponent } from 'src/app/pages/generic-gdf/components/gdf-home/metric-configuration/metric-configuration.component';
import { MetricHierarchyComponent } from 'src/app/pages/generic-gdf/components/gdf-home/metric-hierarchy/metric-hierarchy.component';
import { JmxConnectionComponent } from './jmx-connection.component';
import { ConfirmationDialogModule } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.module';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
//import { CavJmxConnectionComponent } from './cav-jmx-connection/cav-jmx-connection.component';
//import { CavJmxMonitorComponent } from './cav-jmx-monitor.component';


// const routes: Routes = [
//     {
//      path: 'configure-jmx-Connection-Component',
//       component: JmxConnectionComponent
//     }
//   ];



@NgModule({
  declarations: [JmxConnectionComponent],
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
    ConfirmationDialogModule,
    ProgressSpinnerModule
   // RouterModule.forChild(routes)
  ],

  providers: [
    
    
    ConfirmationService,
    
 ],
  /*Required for opening in model window. */
  entryComponents: [
    ConfirmationDialogComponent
      ],
    
  exports: [RouterModule,JmxConnectionComponent],
 
})
export class JMXConnectionModule { }
