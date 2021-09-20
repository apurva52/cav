import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
//Added for Preventing 404 error while reloading
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
// import {FileUploadValidationsService} from '../file-explorer/services/fileUploadValidation.service';
// import {FileUploadService} from '../../main/services/fileUpload.service';

import {ConfigExceptionFilterService} from './services/config-exceptionfilter.service';

/**Import materiapl module */
// import {  MatSlideToggleModule, MatButtonToggleModule, MatCheckboxModule, MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule,
//   MatTableModule, MatExpansionModule, MatSelectModule, MatSnackBarModule, MatTooltipModule, MatChipsModule, MatListModule, MatSidenavModule, MatTabsModule, MatProgressBarModule, MatRadioModule } from '@angular/material';
// import { AutofocusModule } from 'angular-autofocus-fix';

import {
  SplitButtonModule,
  CheckboxModule,
  RadioButtonModule,
  InputTextModule,
  // DataTableModule,
  BreadcrumbModule,
  MenuModule,
  DropdownModule,
  TreeModule,
  ButtonModule,
  DialogModule,
  // GrowlModule,
  ConfirmationService,
  ConfirmDialogModule,
  TabViewModule,
  TooltipModule,
  InputSwitchModule,
  PanelModule,
  SpinnerModule,
  MultiSelectModule,
  ToggleButtonModule,
  AccordionModule,
  FieldsetModule,
  ChipsModule,
  ToolbarModule,
  SliderModule,
  InputTextareaModule,
  ContextMenuModule,
  FileUploadModule,
  SelectButtonModule,
  CardModule,
  SidebarModule,
  ProgressBarModule,
  ToastModule
} from 'primeng';

/**Perfect Scrollbar module */
// import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

// import 'hammerjs';

/** Routing Module */
import { ConfigRoutingModule } from './routes/config-routing.module'

/**Reducer */
import { keywordReducer } from './reducers/keyword-reducer';
import { ndcKeywordReducer } from './reducers/ndc-keyword-reducer';

/**Config UI services */

import { ConfigApplicationService } from './services/config-application.service';
import { ConfigProfileService } from './services/config-profile.service';
import { ConfigTopologyService } from './services/config-topology.service';
import { ConfigNdAgentService } from './services/config-nd-agent.service';
import { ConfigRestApiService } from './services/config-rest-api.service';
import { ConfigBreadcrumbService } from './services/config-breadcrumb.service';
import { ConfigUtilityService } from './services/config-utility.service';
import { ConfigHomeService } from './services/config-home.service';
import { ConfigKeywordsService } from './services/config-keywords.service';
import { ConfigCustomDataService } from './services/config-customdata.service';
// import { ApiService } from '../file-explorer/services/api.service';


/**Config UI Component */
import { AppComponentForConfig } from './config.component';
import { ConfigMainComponent } from './components/config-main/config-main.component';
import { ConfigLeftSideBarComponent } from './components/config-left-side-bar/config-left-side-bar.component';
import { ConfigTopNavBarComponent } from './components/config-top-nav-bar/config-top-nav-bar.component';
import { ConfigTopHeaderNavBarComponent } from './components/config-header-top-nav-bar/config-header-top-nav-bar';
import { ConfigRightContentComponent } from './components/config-right-content/config-right-content.component';
import { ConfigHomeComponent } from './components/config-home/config-home.component';
import { ConfigApplicationListComponent } from './components/config-application-list/config-application-list.component';
import { ConfigTreeComponent } from './components/config-tree/config-tree.component';
import { ConfigTreeDetailComponent } from './components/config-tree-detail/config-tree-detail.component';
import { ConfigProfileListComponent } from './components/config-profile-list/config-profile-list.component';
import { ConfigurationComponent } from './components/config-profile/configuration/configuration.component';
import { GeneralComponent } from './components/config-profile/general/general.component';
import { InstrumentationComponent } from './components/config-profile/instrumentation/instrumentation.component';
import { AdvanceComponent } from './components/config-profile/advance/advance.component';
import { ProductIntegrationComponent } from './components/config-profile/product-integration/product-integration.component';
import { ConfigTopologyListComponent } from './components/config-topology-list/config-topology-list.component';
import { ConfigNdAgentComponent } from './components/config-nd-agent/config-nd-agent.component';
import { ConfigBreadcrumbComponent } from './components/config-breadcrumb/config-breadcrumb.component';
import { ConfigMetaDataComponent } from './components/config-meta-data/config-meta-data.component';
import { ConfigTreeMainComponent } from './components/config-tree-main/config-tree-main.component';
import { ServiceEntryPointComponent } from './components/config-profile/instrumentation/service-entry-point/service-entry-point.component';
import { IntegrationPtDetectionComponent } from './components/config-profile/instrumentation/integration-pt-detection/integration-pt-detection.component';
import { TransactionConfigurationComponent } from './components/config-profile/instrumentation/transaction-configuration/transaction-configuration.component';
import { InstrumentMonitorsComponent } from './components/config-profile/instrumentation/instrument-monitors/instrument-monitors.component';
import { ThreadStatsComponent } from './components/config-profile/instrumentation/instrument-monitors/thread-stats/thread-stats.component';
import { ErrorDetectionComponent } from './components/config-profile/instrumentation/error-detection/error-detection.component';
import { ConfigProfileRoutingComponent } from './components/config-profile/config-profile-routing/config-profile-routing.component';
import { FlowpathComponent } from './components/config-profile/general/flowpath/flowpath.component';
import { HotspotComponent } from './components/config-profile/general/hotspot/hotspot.component';
import { HeaderComponent } from './components/config-profile/general/header/header.component';
import { InstrumentationProfilesComponent } from './components/config-profile/general/instrumentation-profiles/instrumentation-profiles.component';
import { HTTPBTConfigurationComponent,PipeForDataType } from './components/config-profile/instrumentation/transaction-configuration/http-bt-configuration/http-bt-configuration.component';
import { MethodBTConfigurationComponent } from './components/config-profile/instrumentation/transaction-configuration/method-bt-configuration/method-bt-configuration.component';
import { DebugComponent } from './components/config-profile/advance/debug/debug.component';
import { BackendMonitorsComponent } from './components/config-profile/advance/backend-monitors/backend-monitors.component';
import { MonitorsComponent } from './components/config-profile/advance/monitors/monitors.component';
import { DelayComponent } from './components/config-profile/advance/delay/delay.component';
import { GenerateExceptionComponent } from './components/config-profile/advance/generate-exception/generate-exception.component';
import { CustomKeywordsComponent } from './components/config-profile/advance/custom-keywords/custom-keywords.component';
import { BTHTTPHeadersComponent} from './components/config-profile/instrumentation/transaction-configuration/bt-http-headers/bt-http-headers.component';
import { BTResponseHeadersComponent} from './components/config-profile/instrumentation/transaction-configuration/bt-response-headers/bt-response-headers.component';
import { HttpHeaderComponent } from './components/config-profile/general/header/http-header/http-header.component';
import { CustomDataComponent } from './components/config-profile/general/custom-data/custom-data.component';
import { HttpRequestComponent } from './components/config-profile/general/custom-data/http-request/http-request.component';
import { SessionAttributeComponent } from './components/config-profile/general/custom-data/session-attribute/session-attribute.component';
import { JavaMethodComponent } from './components/config-profile/general/custom-data/java-method/java-method.component';
import { NVCookieComponent } from './components/config-profile/product-integration/nvcookie/nvcookie.component';
import { MethodMonitorsComponent } from './components/config-profile/instrumentation/instrument-monitors/method-monitors/method-monitors.component';
import { ExceptionMonitorsComponent } from './components/config-profile/instrumentation/instrument-monitors/exception-monitors/exception-monitors.component';
import { HttpStatsMonitorsComponent, PipeForFpDump } from './components/config-profile/instrumentation/instrument-monitors/http-stats-monitors/http-stats-monitors.component';

// import { ConfigNdFileExplorerComponent } from '../file-explorer/components/config-nd-file-explorer/config-nd-file-explorer.component';
import { IntegrationPtComponent } from './components/config-profile/instrumentation/integration-pt-detection/integration-pt/integration-pt.component';
import { UrlCapturingComponent } from './components/config-profile/instrumentation/integration-pt-detection/url-capturing/url-capturing.component';
import { InterfaceEntryPointComponent } from './components/config-profile/instrumentation/integration-pt-detection/interface-entry-point/interface-entry-point.component';
// import { Logger, Options as LoggerOptions, Level as LoggerLevel } from '../../../vendors/angular2-logger/core';
import { ConfigImportInstrProfileComponent } from './components/config-import-instr-profile/config-import-instr-profile.component';
import { ConfigAutoDiscoverComponent } from './components/config-auto-discover/config-auto-discover.component';
import { ConfigAutoDiscoverTreeComponent } from './components/config-auto-discover/config-auto-discover-tree/config-auto-discover-tree.component';
import { ConfigAutoDiscoverMainComponent } from './components/config-auto-discover/config-auto-discover-main/config-auto-discover-main.component';
import { ConfigViewAuditLogComponent } from './components/config-view-audit-log/config-view-audit-log.component';
import { ConfigNDCKeywordsSettingComponent } from './components/config-ndc-keywords-setting/config-ndc-keywords-setting.component';
import { ConfigAutoInstrumentationComponent } from './components/config-auto-discover/config-auto-instrumentation/config-auto-instrumentation.component';
import { ConfigEditAutoInstrumentationComponent } from './components/config-auto-discover/config-edit-auto-instrumentation/config-edit-auto-instrumentation.component';
import { ExceptionCapturingComponent } from './components/config-profile/general/exception-capturing/exception-capturing.component';
import { HttpResponseComponent } from './components/config-profile/general/custom-data/http-response/http-response.component';
import { BTHTTPBodyComponent} from './components/config-profile/instrumentation/transaction-configuration/bt-http-body/bt-http-body.component';

/* Dynamic Diagnostics AI from Config UI*/
import { CommonComponentsModule } from '../../../../shared/common-config-module/common.module';
import { DynamicDiagnosticsComponent } from '../../../../shared/common-config-module/components/dynamic-diagnostics/dynamic-diagnostics.component';
import { DynamicLoggingComponent } from "../../../../shared/common-config-module/components/dynamic-logging/dynamic-logging.component";
import { AsynchronousRuleComponent } from './components/config-profile/instrumentation/asynchronous-rule/asynchronous-rule.component';
import { HelpComponent } from './components/config-help/config-help.component';
import { EventCorrelationComponent } from './components/config-profile/general/event-correlation/event-correlation.component';
import { NDEClusterConfiguration, PipeForObject } from './components/nde-cluster-configuration/nde-cluster-configuration.component';
import { UserConfiguredKeywordComponent } from './components/user-configured-keywords/user-configured-keywords.component';
import { PipeForType, FilterPipe, HighlightSearch } from './pipes/config-pipe.pipe';
import { autoFocusDirective } from './directives/config-auto-focus-directive';
import { NVAutoInjectConfiguration } from './components/config-profile/product-integration/nv-auto-inject/nv-auto-inject.component';
import { ConfigBCILogsComponent } from './components/config-bci-logs/config-bci-logs.component';
import { PercentileComponent } from './components/config-profile/general/percentile/percentile.component';
import { NDNFConfigurationComponent } from './components/config-profile/product-integration/nd-nf-configuration/nd-nf-configuration.component';
import { DebugToolComponent } from './components/config-profile/advance/debug-tool/debug-tool.component';
import { OtherComponent } from './components/config-profile/general/other/other.component';
import { ConfigDynamicLoggingComponent } from './components/config-profile/advance/config-dynamic-logging/config-dynamic-logging.component';
import { ConfigMemoryProflingSessionsComponent } from './components/config-memory-profiling-sessions/config-memory-profiling-sessions.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { ConfigMemoryProfilingComponent } from "./components/config-memory-profiling/config-memory-profiling.component";
import { TableModule } from 'primeng/table';
import {TreeTableModule} from 'primeng/treetable';

/* Authentication guards */
import { AuthGuard } from './guards/auth.guard';
import { ConfigMemoryProfileService } from './services/config-memory-profile.service';
import { CavTopPanelNavigationService } from './services/cav-top-panel-navigation.service';
import { CavConfigService } from './services/cav-config.service';
import { AuthenticationService } from './services/authentication.service';
import { AlertConfigService } from "./services/alert-config-service";
import { TimerService } from "./services/timer.service";
import { CavMenuNavigatorService } from "./services/cav-menu-navigator.service";
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ConfigMutexLockSessionsComponent } from './components/config-mutex-lock-sessions/config-mutex-lock-sessions.component';
import { ConfigMutexLockComponent } from "./components/config-mutex-lock/config-mutex-lock.component";

// const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: true
// };
import { FileManagerModule } from 'src/app/shared/file-manager/file-manager.module';

//const routes: Routes = [
//  {
//    path: 'nd-agent-config',
//    redirectTo: '',
//    pathMatch: 'full'
//  }
//]

@NgModule({
  declarations: [
    AppComponentForConfig,
    ConfigMainComponent,
    ConfigLeftSideBarComponent,
    ConfigTopNavBarComponent,
    ConfigRightContentComponent,
    ConfigHomeComponent,
    ConfigApplicationListComponent,
    ConfigTreeComponent,
    ConfigTreeDetailComponent,
    ConfigProfileListComponent,
    ConfigurationComponent,
    GeneralComponent,
    InstrumentationComponent,
    AdvanceComponent,
    ProductIntegrationComponent,
    ConfigTopologyListComponent,
    ConfigNdAgentComponent,
    ConfigBreadcrumbComponent,
    ConfigMetaDataComponent,
    ConfigTreeMainComponent,
    ServiceEntryPointComponent,
    IntegrationPtDetectionComponent,
    TransactionConfigurationComponent,
    InstrumentMonitorsComponent,
    ErrorDetectionComponent,
    ConfigProfileRoutingComponent,
    FlowpathComponent,
    HotspotComponent,
    HeaderComponent,
    ThreadStatsComponent,
    InstrumentationProfilesComponent,
    HTTPBTConfigurationComponent,
    MethodBTConfigurationComponent,
    DebugComponent,
    BackendMonitorsComponent,
    MonitorsComponent,
    DelayComponent,
    GenerateExceptionComponent,
    HttpHeaderComponent,
    CustomDataComponent,
    HttpRequestComponent,
    SessionAttributeComponent,
    JavaMethodComponent,
    NVCookieComponent,
    MethodMonitorsComponent,
    HttpStatsMonitorsComponent,
    ConfigTopHeaderNavBarComponent,
    PipeForFpDump,
    CustomKeywordsComponent,
    // ConfigNdFileExplorerComponent,
    ExceptionMonitorsComponent,
    BTHTTPHeadersComponent,
    IntegrationPtComponent,
    UrlCapturingComponent,
    ConfigImportInstrProfileComponent,
    ConfigAutoDiscoverComponent,
    ConfigAutoDiscoverMainComponent,
    ConfigAutoDiscoverTreeComponent,
    ConfigViewAuditLogComponent,
    ConfigNDCKeywordsSettingComponent,
    ConfigAutoInstrumentationComponent,
    ConfigEditAutoInstrumentationComponent,
    ExceptionCapturingComponent,
    BTResponseHeadersComponent,
    HttpResponseComponent,
    AsynchronousRuleComponent,
    HelpComponent,
    BTHTTPBodyComponent,
    PipeForDataType,
    EventCorrelationComponent,
    NDEClusterConfiguration,
    UserConfiguredKeywordComponent,
    PipeForType,
    PipeForObject,
    autoFocusDirective,
    InterfaceEntryPointComponent,
    NVAutoInjectConfiguration,
    ConfigBCILogsComponent,
    FilterPipe,
    HighlightSearch,
    PercentileComponent,
    NDNFConfigurationComponent,
    DebugToolComponent,
    OtherComponent,
    ConfigDynamicLoggingComponent,
    ConfigMemoryProfilingComponent,
    ConfigMemoryProflingSessionsComponent,
    // DynamicDiagnosticsComponent,
    // DynamicLoggingComponent
    ConfigMutexLockSessionsComponent,
    ConfigMutexLockComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    // BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ConfigRoutingModule,
  //    MatSlideToggleModule, MatButtonToggleModule, MatCheckboxModule, MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatProgressSpinnerModule,
  // MatTableModule, MatExpansionModule, MatSelectModule, MatSnackBarModule, MatTooltipModule, MatChipsModule, MatListModule, MatSidenavModule, MatTabsModule, MatProgressBarModule, MatRadioModule,
    // PerfectScrollbarModule,
    StoreModule.forRoot({ keywordData: keywordReducer, ndcKeywordData: ndcKeywordReducer }),
    InputTextModule,
    // DataTableModule,
    BreadcrumbModule,
    MenuModule,
    ContextMenuModule,
    DropdownModule,
    TreeModule,
    ButtonModule,
    DialogModule,
    // GrowlModule,
    ConfirmDialogModule,
    TabViewModule,
    TooltipModule,
    SpinnerModule,
    InputSwitchModule,
    PanelModule,
    RadioButtonModule,
    CheckboxModule,
    MultiSelectModule,
    ToggleButtonModule,
    ChipsModule,
    AccordionModule,
    FieldsetModule,
    ToolbarModule,
    SliderModule,
    SplitButtonModule,
    InputTextareaModule,
    FileUploadModule,
    // CommonComponentsModule,
    // AutofocusModule,
    TableModule,
    SelectButtonModule,
    HighchartsChartModule,
    TreeTableModule,
    CardModule,
    SidebarModule,
    ProgressBarModule,
    HeaderModule,
    ToastModule,
    CommonComponentsModule,
    FileManagerModule,
    //RouterModule.forChild(routes)
  ],

  

  // providers: [
  //   { provide: LoggerOptions, useValue: { level: LoggerLevel.DEBUG } }, Logger,
  //   ConfigApplicationService, ConfigProfileService, ConfigTopologyService, ConfigNdAgentService, ConfigBreadcrumbService, ConfigRestApiService, ConfigUtilityService, ConfirmationService, ConfigHomeService, ConfigKeywordsService,ConfigCustomDataService,ConfigExceptionFilterService,MethodBTConfigurationComponent,PipeForType, FilterPipe, HighlightSearch, AuthGuard,
  //   ApiService,FileUploadValidationsService,FileUploadService, ConfigMemoryProfileService,
  //   { provide: LocationStrategy, useClass: HashLocationStrategy},],
  providers: [
    // { provide: LoggerOptions, useValue: { level: LoggerLevel.DEBUG } }, Logger,
    ConfigApplicationService, ConfigProfileService, ConfigTopologyService, ConfigNdAgentService, ConfigBreadcrumbService, 
    ConfigRestApiService,
     ConfigUtilityService, ConfirmationService, ConfigHomeService, ConfigKeywordsService,ConfigCustomDataService,ConfigExceptionFilterService,
    MethodBTConfigurationComponent,
    PipeForType, FilterPipe, HighlightSearch, AuthGuard,
    ConfigMemoryProfileService, CavTopPanelNavigationService, CavConfigService, AuthenticationService, AlertConfigService, TimerService, CavMenuNavigatorService,
    { provide: LocationStrategy, useClass: HashLocationStrategy},],
    bootstrap: [AppComponentForConfig]
})
export class AppModuleForConfig { }
