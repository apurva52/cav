import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GdfHomeComponent } from './components/gdf-home/gdf-home.component';
import { GenericGdfRoutingModule } from './routes/generic-gdf-routing.routes';

import { AccordionModule, ContextMenuModule, MultiSelectModule, 
  ConfirmDialogModule, InputTextModule, ButtonModule, DialogModule, DropdownModule, FieldsetModule, RadioButtonModule,
  CheckboxModule, InputTextareaModule, TreeTableModule,SharedModule, FileUploadModule, PaginatorModule, PanelModule, SpinnerModule,
  BreadcrumbModule,TreeModule, TreeNode, MessagesModule,ToolbarModule,ConfirmationService,TabViewModule,TooltipModule, ToggleButtonModule
} from 'primeng';

// import {TreeModule} from 'primeng/tree';
// import {TreeNode} from 'primeng/api';

//components
import { MetricConfigurationComponent } from './components/gdf-home/metric-configuration/metric-configuration.component';
import { MetricHierarchyComponent } from './components/gdf-home/metric-hierarchy/metric-hierarchy.component';
import { MetricGroupInfoComponent } from './components/gdf-home/metric-group-info/metric-group-info.component';

//Services
import { UtilityService } from './services/utility.service';
import { GenericGdfMessageService }  from './services/generic-gdf-message.service';
import { TableModule } from 'primeng/table';
//import { AdvanceMetricConfigurationComponent } from './components/gdf-home/advance-metric-configuration/advance-metric-configuration.component';
import { GenericGdfService } from './services/generic-gdf-service';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { AdvancedConfigurationComponent } from '../my-library/alert/alert-configuration/advanced-configuration/advanced-configuration.component';
import { AdvanceMetricConfigurationComponent } from './components/gdf-home/advance-metric-configuration/advance-metric-configuration.component';
//import { AdvanceMetricConfigurationComponent } from './components/gdf-home/advance-metric-configuration/advance-metric-configuration.component';
//import { AdvanceMetricConfigurationModule } from './components/gdf-home/advance-metric-configuration/advance-metric-configuration.module';
@NgModule({
  declarations: [GdfHomeComponent, 
    MetricConfigurationComponent,
    MetricHierarchyComponent, 
    AdvanceMetricConfigurationComponent,
    MetricGroupInfoComponent,
    ],
  imports: [
    CommonModule,
    CommonModule,
    ButtonModule,
    PanelModule,
    TreeTableModule,
   // GrowlModule,
    ContextMenuModule,
    MultiSelectModule,
    AccordionModule,
    //DataTableModule,
    DropdownModule,
    InputTextModule,
    FieldsetModule,
    CheckboxModule,
    InputTextareaModule,
    ConfirmDialogModule,
    DialogModule,
    RadioButtonModule,
    SharedModule,
    FileUploadModule, 
    PaginatorModule,
    SpinnerModule,
    BreadcrumbModule,
    MessagesModule,
    ToolbarModule,
    TreeModule,
    TabViewModule, 
    TooltipModule,
    GenericGdfRoutingModule,
    TableModule,
    ToggleButtonModule,
   // AdvanceMetricConfigurationModule
  
  ],

  

  providers: [
     UtilityService,
     GenericGdfMessageService,
     ConfirmationService,
     GenericGdfService
  ],
  /*Required for opening in model window. */
  entryComponents: [
ConfirmationDialogComponent
  ],

  
  exports: [GenericGdfRoutingModule, MetricConfigurationComponent, MetricHierarchyComponent, MetricGroupInfoComponent,AdvanceMetricConfigurationComponent],

  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class GenericGDFModule { 
  constructor() {
  }
}
