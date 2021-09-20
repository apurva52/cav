import { CommonModule } from '@angular/common';  
import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { StoreModule, Store } from '@ngrx/store';
// import { Logger, Options as LoggerOptions, Level as LoggerLevel } from '../../vendors/angular2-logger/core';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
// import {  MatSlideToggleModule, MatButtonToggleModule, MatCheckboxModule, MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule,
//   MatTableModule, MatExpansionModule, MatSelectModule, MatDialogModule,  MatSnackBarModule, MatTooltipModule, MatChipsModule, MatListModule, MatSidenavModule, MatTabsModule, MatProgressBarModule, MatRadioModule } from '@angular/material';
import { DialogModule,
         CheckboxModule, 
         AccordionModule,
         FieldsetModule,
        //  GrowlModule,
         RadioButtonModule,
         DropdownModule,
         ButtonModule,
        //  DataTableModule,
         MultiSelectModule,
         ChipsModule, 
         TabViewModule,
         TabMenuModule,
         ConfirmDialogModule,
         ConfirmationService,
         CalendarModule,
         SplitButtonModule
         } from 'primeng';

import { DynamicDiagnosticsComponent } from './components/dynamic-diagnostics/dynamic-diagnostics.component';
import { ConfigProfileService } from '../../pages/tools/configuration/nd-config/services/config-profile.service';
import { ConfigHomeService } from '../../pages/tools/configuration/nd-config/services/config-home.service';
import { ConfigTopologyService } from '../../pages/tools/configuration/nd-config/services/config-topology.service';
import { ConfigUtilityService } from '../../pages/tools/configuration/nd-config/services/config-utility.service';
import { ConfigKeywordsService } from '../../pages/tools/configuration/nd-config//services/config-keywords.service';
import { CommonComponent } from './common-module.component';
// import { TierGroupComponent } from './components/tier-group/tier-group.component';
// import { TierAssignmentRuleComponent } from './components/tier-assignment-rule/tier-assignment-rule.component';

import { CommonRestApiService } from './services/common-rest-api-services';
import { TierGroupService } from './services/tier-group-service';
import { TierAssignmentRulesService } from './services/tier-assignment-rules.service';
import { CommonUtilityService } from './services/common-utility.service';

// import { DashboardConfigDataService } from '../modules/dashboard/services/dashboard-config-data.service';
// import { DashboardModelService } from '../modules/dashboard/services/dashboard-model-service';
// import { DashboardDataContainerService } from '../modules/dashboard/services/dashboard-data-container.service';
// import { UpdateUserSessionComponent } from './components/update-user-session-rate/update-user-session-rate.component';

// import  { VersionControlComponent  } from './components/version-control/version-control.component';
// import  { VersionLogsComponent }  from  './components/version-control/version-logs/version-logs.component';
// import  { VersionDiffComponent  } from  './components/version-control/version-diff/version-diff.component';
import  { VersionControlService} from   './services/version-control.service';
// import {VersionRevertComponent} from './components/version-control/version-revert/version-revert.component';
import { TableModule } from 'primeng/table';
import {InputSwitchModule} from 'primeng';
import {SpinnerModule} from 'primeng';
import { DynamicLoggingComponent } from './components/dynamic-logging/dynamic-logging.component';

// import { CommonServices } from '../modules/ddr/services/common.services';
// import { DDRRequestService } from '../modules/ddr/services/ddr-request.service';

import { SliderModule } from 'primeng';


@NgModule({
  declarations: [
    CommonComponent,
    DynamicDiagnosticsComponent,
    // TierGroupComponent,
    // UpdateUserSessionComponent,
    // VersionControlComponent,
    // VersionDiffComponent,
    // VersionLogsComponent,
    // VersionRevertComponent,
    // TierAssignmentRuleComponent,
    DynamicLoggingComponent
  ],
  imports: [
    CommonModule,
    CheckboxModule,
    FormsModule,
    DialogModule,
    // GrowlModule,
    AccordionModule,
    FieldsetModule,
    RadioButtonModule,
    DropdownModule,
    HttpClientModule,
    ButtonModule,
    // DataTableModule,
    MultiSelectModule,
    ChipsModule,
  //    MatSlideToggleModule, MatButtonToggleModule, MatCheckboxModule, MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule,
  // MatTableModule, MatExpansionModule, MatSelectModule, MatSnackBarModule, MatTooltipModule, MatChipsModule, MatListModule, MatSidenavModule, MatDialogModule, MatTabsModule, MatProgressBarModule, MatRadioModule,
    TabViewModule,
    TabMenuModule,
    TableModule,
    ConfirmDialogModule,
    SpinnerModule,
    CalendarModule,
    InputSwitchModule,
    SplitButtonModule,
    SliderModule
  ],
  exports: [
    CommonComponent,
    DynamicDiagnosticsComponent,
    DynamicLoggingComponent,
    // TierGroupComponent
  ],

  entryComponents: [CommonComponent, DynamicDiagnosticsComponent, DynamicLoggingComponent,
    // UpdateUserSessionComponent,VersionDiffComponent,VersionLogsComponent, VersionRevertComponent,
    // DynamicLoggingComponent
  ],
  providers: [
    // { provide: LoggerOptions, useValue: { level: LoggerLevel.DEBUG } }, Logger,CommonServices,DDRRequestService,
    ConfigProfileService, ConfigHomeService, ConfigTopologyService, ConfigUtilityService, ConfigKeywordsService,
    CommonUtilityService, TierGroupService, CommonRestApiService,
    // DashboardConfigDataService,DashboardModelService,DashboardDataContainerService,
    VersionControlService, TierAssignmentRulesService, ConfirmationService,
    

 
  ],
  
})
export class CommonComponentsModule { }
