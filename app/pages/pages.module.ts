import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginModule } from './login/login.module';
import { IpSummaryModule } from './dashboard-service-req/ip-summary/ip-summary.module';
import { WelcomeScreenModule } from './welcome-screen/welcome-screen.module';
import { DashboardServiceReqModule } from './dashboard-service-req/dashboard-service-req.module';
import { KpiModule } from './kpi/kpi.module';
import { HomeModule } from './home/home.module';
import { LoadingModule } from './loading/loading.module';
import { LogoutModule } from './logout/logout.module';
import { TestPageModule } from './test-page/test-page.module';
import { DrilldownModule } from './drilldown/drilldown.module';
import { EndToEndModule } from './end-to-end/end-to-end.module';
import { AggregateTransactionFlowmapModule } from './drilldown/aggregate-transaction-flowmap/aggregate-transaction-flowmap.module';
import { GeolocationModule } from './geolocation/geolocation.module';
import { FlowpathAnalyzerModule } from './drilldown/flowpath-analyzer/flowpath-analyzer.module';
import { CompareFlowpathsComponent } from './drilldown/compare-flowpaths/compare-flowpaths.component';
import { CompareFlowpathsModule } from './drilldown/compare-flowpaths/compare-flowpaths.module';
import { SettingsModule } from './settings/settings.module';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
// import { SchedulesComponent } from './schedules/schedules.component';
import { MyLibraryComponent } from './my-library/my-library.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { AdminComponent } from './admin/admin.component';
import { AdvancedSessionComponent } from './advanced-session/advanced-session.component';
import { ReportsComponent } from './my-library/reports/reports.component';
import { ClusterMonitorComponent } from './tools/actions/cluster-monitor/cluster-monitor.component';
import { QuerySettingsModule } from './query-settings/query-settings.module';
import { AdminModule } from './admin/admin.module';
import { AdvancedSessionModule } from './advanced-session/advanced-session.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { MyLibraryModule } from './my-library/my-library.module';
import { MyProfileModule } from './my-profile/my-profile.module';
import { IndexPatternComponent } from './index-pattern/index-pattern.component';
import { CreateVisualizationComponent } from './create-visualization/create-visualization.component';
import { CreateVisualizationModule } from './create-visualization/create-visualization.module';
import { ClusterMonitorModule } from './tools/actions/cluster-monitor/cluster-monitor.module';
import { NvConfigComponent } from './sessions/nv-config/nv-config.component';
import { NvConfigModule } from './sessions/nv-config/nv-config.module';
import { MonitorUpDownStatusModule } from './monitor-up-down-status/monitor-up-down-status.module';
import { MonitorUpDownStatusComponent } from './monitor-up-down-status/monitor-up-down-status.component';
import { NetDiagnosticsEnterpriseComponent } from './tools/admin/net-diagnostics-enterprise/net-diagnostics-enterprise.component';
import { NetDiagnosticsEnterpriseModule } from './tools/admin/net-diagnostics-enterprise/net-diagnostics-enterprise.module';
import { AgentInfoComponent } from './tools/admin/agent-info/agent-info.component';
import { AgentInfoModule } from './tools/admin/agent-info/agent-info.module';
import { ManageControllerComponent } from './tools/admin/manage-controller/manage-controller.component';
import { ManageControllerModule } from './tools/admin/manage-controller/manage-controller.module';
import { MachineConfigurationModule } from './tools/admin/machine-configuration/machine-configuration.module';
import { MachineConfigurationComponent } from './tools/admin/machine-configuration/machine-configuration.component';
import { EventDefinitionComponent } from './tools/advanced/design/event-definition/event-definition.component';
import { EventDefinitionModule } from './tools/advanced/design/event-definition/event-definition.module';
import { HealthCheckMonitorComponent } from './tools/advanced/design/health-check-monitor/health-check-monitor.component';
import { HealthCheckMonitorModule } from './tools/advanced/design/health-check-monitor/health-check-monitor.module';
import { IpManagementComponent } from './tools/advanced/design/ip-management/ip-management.component';
import { IpManagementModule } from './tools/advanced/design/ip-management/ip-management.module';
import { TestReportComponent } from './tools/advanced/design/test-report/test-report.component';
import { TestReportModule } from './tools/advanced/design/test-report/test-report.module';
import { ScenariosComponent } from './tools/advanced/design/scenarios/scenarios.component';
import { TestSuiteComponent } from './tools/advanced/design/test-suite/test-suite.component';
import { ScenariosModule } from './tools/advanced/design/scenarios/scenarios.module';
import { PeripheralDevicesComponent } from './tools/advanced/system-logs/peripheral-devices/peripheral-devices.component';
import { PeripheralDevicesModule } from './tools/advanced/system-logs/peripheral-devices/peripheral-devices.module';
import { CavissonServicesComponent } from './tools/advanced/health/cavisson-services/cavisson-services.component';
import { CavissonServicesModule } from './tools/advanced/health/cavisson-services/cavisson-services.module';
import { TestCaseModule } from './tools/advanced/design/test-case/test-case.module';
import { TestCaseComponent } from './tools/advanced/design/test-case/test-case.component';
import { RbuAccessLogsComponent } from './tools/advanced/system-logs/rbu-access-logs/rbu-access-logs.component';
import { KubernetesComponent } from './tools/advanced/system-logs/kubernetes/kubernetes.component';
import { RbuAccessLogsModule } from './tools/advanced/system-logs/rbu-access-logs/rbu-access-logs.module';
import { KubernetesModule } from './tools/advanced/system-logs/kubernetes/kubernetes.module';
import { PostgressStatsModule } from './tools/advanced/postgress-stats/postgress-stats.module';
import { PostgressStatsComponent } from './tools/advanced/postgress-stats/postgress-stats.component';
import { InfrastructureViewComponent } from './tools/advanced/infrastructure-view/infrastructure-view.component';
import { InfrastructureViewModule } from './tools/advanced/infrastructure-view/infrastructure-view.module';
import { TransactionsComponent } from './tools/advanced/transactions/transactions.component';
import { TransactionsModule } from './tools/advanced/transactions/transactions.module';
//import { SessionsComponent } from './home/sessions/sessions.component';
import { CurrentSessionsComponent } from './tools/advanced/current-sessions/current-sessions.component';
import { CurrentSessionsModule } from './tools/advanced/current-sessions/current-sessions.module';
import { ColorManagementComponent } from './tools/configuration/color-management/color-management.component';
import { ColorManagementModule } from './tools/configuration/color-management/color-management.module';
import { ConfigurationSettingsComponent } from './tools/configuration/configuration-settings/configuration-settings.component';
import { AgentConfigComponent } from './tools/configuration/agent-config/agent-config.component';
import { ConfigurationSettingsModule } from './tools/configuration/configuration-settings/configuration-settings.module';
import { AgentConfigModule } from './tools/configuration/agent-config/agent-config.module';
import { TierGroupComponent } from './tools/configuration/tier-group/tier-group.component';
import { TierGroupModule } from './tools/configuration/tier-group/tier-group.module';
import { CatalougeManagementComponent } from './tools/configuration/catalouge-management/catalouge-management.component';
import { GeneralSettingsComponent } from './tools/configuration/agent-config/profile/general-settings/general-settings.component';
import { GeneralSettingsModule } from './tools/configuration/agent-config/profile/general-settings/general-settings.module';
import { MultiNodeConfigurationModule } from './tools/configuration/configuration-settings/multi-node-configuration/multi-node-configuration.module';
import { MultiNodeConfigurationComponent } from './tools/configuration/configuration-settings/multi-node-configuration/multi-node-configuration.component';
import { InstrumentationSettingsComponent } from './tools/configuration/agent-config/profile/instrumentation-settings/instrumentation-settings.component';
import { InstrumentationSettingsModule } from './tools/configuration/agent-config/profile/instrumentation-settings/instrumentation-settings.module';
import { TopologyManagementModule } from './tools/configuration/topology-management/topology-management.module';
import { TopologyManagementComponent } from './tools/configuration/topology-management/topology-management.component';
import { AdvanceSettingsComponent } from './tools/configuration/agent-config/profile/advance-settings/advance-settings.component';
import { AdvanceSettingsModule } from './tools/configuration/agent-config/profile/advance-settings/advance-settings.module';
import { ProductIntegrationSettingsComponent } from './tools/configuration/agent-config/profile/product-integration-settings/product-integration-settings.component';
import { ProductIntegrationSettingsModule } from './tools/configuration/agent-config/profile/product-integration-settings/product-integration-settings.module';
import { NdSettingComponent } from './tools/configuration/agent-config/agent-config-home/application-list/nd-setting/nd-setting.component';
import { NdSettingModule } from './tools/configuration/agent-config/agent-config-home/application-list/nd-setting/nd-setting.module';
import { ActionsComponent } from './tools/actions/actions.component';
import { ActionsModule } from './tools/actions/actions.module';
import { DBMonitoringComponent } from './db-monitoring/db-monitoring.component';
import { DBMonitoringModule } from './db-monitoring/db-monitoring.module';
import { RevenueAnalyticsModule } from './home/home-sessions/revenue-analytics/revenue-analytics.module';
import { RevenueAnalyticsComponent } from './home/home-sessions/revenue-analytics/revenue-analytics.component';
import { UxAgentSettingModule } from './home/home-sessions/ux-agent-setting/ux-agent-setting.module';
import { PagePerformanceOverviewComponent } from './home/home-sessions/page-performance-overview/page-performance-overview.component';
import { PagePerformanceOverviewModule } from './home/home-sessions/page-performance-overview/page-performance-overview.module';
import { CustomMetricsReportComponent } from './home/home-sessions/custom-metrics-report/custom-metrics-report.component';
import { CustomMetricsReportModule } from './home/home-sessions/custom-metrics-report/custom-metrics.module';
import { PerformanceDetailsComponent } from './home/home-sessions/page-performance-overview/page/performance-details/performance-details.component';
import { PerformanceDetailsModule } from './home/home-sessions/page-performance-overview/page/performance-details/performance-details.module';
import { VariationComponent } from './home/home-sessions/variation/variation.component';
import { VariationModule } from './home/home-sessions/variation/variation.module';
import { FeedbackComponent } from './home/home-sessions/feedback/feedback.component';
import { FeedbackModule } from './home/home-sessions/feedback/feedback.module';

import { AppCrashFilterModule } from './home/home-sessions/app-crash-filter/app-crash-filter.module';
import { AppCrashFilterComponent } from './home/home-sessions/app-crash-filter/app-crash-filter.component';
import { MarketingAnalyticsModule } from './home/home-sessions/marketing-analytics/marketing-analytics.module';
import { SessionsDetailsComponent } from './home/home-sessions/sessions-details/sessions-details.component';
import { SessionsDetailsModule } from './home/home-sessions/sessions-details/sessions-details.module';
import { ProductPageModule } from './home/home-sessions/product-page/product-page.module';
import { ProductPageComponent } from './home/home-sessions/product-page/product-page.component';
import { CommandListModule } from './tools/actions/action-run-command/command-list/command-list.module';
import { JavaHeapDumpModule } from './tools/actions/dumps/heap-dump/java-heap-dump/java-heap-dump.module';
import { SessionOverviewComponent } from './home/home-sessions/session-overview/session-overview.component';
import { SessionOverviewModule } from './home/home-sessions/session-overview/session-overview.module';
import { ApplianceHealthComponent } from './tools/advanced/health/appliance-health/appliance-health.component';
import { ApplianceHealthModule } from './tools/advanced/health/appliance-health/appliance-health.module';
import {AppCrashSummaryModule} from './home/home-sessions/app-crash-summary/app-crash-summary.module';
import {AppCrashSummaryComponent} from './home/home-sessions/app-crash-summary/app-crash-summary.component';
import { MappingModule } from './home/home-sessions/mapping/mapping.module';
import { MappingComponent } from './home/home-sessions/mapping/mapping.component';
import { PlaySessionsComponent } from './home/home-sessions/play-sessions/play-sessions.component';
import { PlaySessionsModule } from './home/home-sessions/play-sessions/play-sessions.module';
import { SystemSettingsComponent } from './home/home-sessions/system-settings/system-settings.component';
import { SystemSettingsModule } from './home/home-sessions/system-settings/system-settings.module';
import { CallbackDesignerModule } from './home/home-sessions/callback-designer/callback-designer.module';
import { CallbackDesignerComponent } from './home/home-sessions/callback-designer/callback-designer.component';
import { PageFilterComponent } from './home/home-sessions/page-filter/page-filter.component';
import { PageFilterModule } from './home/home-sessions/page-filter/page-filter.module';
import { HeapDumpModule } from './tools/actions/dumps/heap-dump/heap-dump.module';
import { MarketingAnalyticsComponent } from './home/home-sessions/marketing-analytics/marketing-analytics.component';
import { FormAnalyticsComponent } from './home/home-sessions/form-analytics/form-analytics.component';
import { FormAnalyticsModule } from './home/home-sessions/form-analytics/form-analytics.module';
import { FormAnalyticOverallModule } from './home/home-sessions/form-analytics/form-analytic-overall/form-analytic-overall.module';
import { FormAnalyticOverallComponent } from './home/home-sessions/form-analytics/form-analytic-overall/form-analytic-overall.component';
import { AutoGenarageColorManagementModule } from './tools/configuration/color-management/auto-genarage-color-management/auto-genarage-color-management.module';
import { AutoGenarageColorManagementComponent } from './tools/configuration/color-management/auto-genarage-color-management/auto-genarage-color-management.component';
import { BusinessViewModule } from './business-view/business-view.module';
import { BusinessViewComponent } from './business-view/business-view.component';
import { AppComponentForConfig } from './tools/configuration/nd-config/config.component';
import { AppModuleForConfig } from './tools/configuration/nd-config/config.module';
import { RetentionPolicyMainComponent } from './tools/admin/retention-policy-V1/components/retention-policy-main/retention-policy-main.component';
import { RetentionPolicyV1Module } from './tools/admin/retention-policy-V1/retention-policy-V1.module';
import { HttpFilterComponent } from './home/home-sessions/http-filter/http-filter.component';
import { HttpFilterModule } from './home/home-sessions/http-filter/http-filter.module';
import { JsErrorFilterComponent } from './home/home-sessions/js-error-filter/js-error-filter.component';
import { JsErrorFilterModule } from './home/home-sessions/js-error-filter/js-error-filter.module';
import { SessionEventComponent } from './home/home-sessions/session-event/session-event.component';
import { SessionEventModule } from './home/home-sessions/session-event/session-event.module';
import { DrillDownCompareFlowpathsModule } from './drilldown/ddr-p4/drilldown-compare-flowpaths/drilldown-compare-flowpaths.module';
import { DrillDownCompareFlowpathsComponent } from './drilldown/ddr-p4/drilldown-compare-flowpaths/drilldown-compare-flowpaths.component';
import { AccessControlV1Module } from './tools/admin/access-control-V1/access-control-list.module';
// import { SchedulesModule } from './schedules/schedules.module';
import { TransactionFilterComponent } from './home/home-sessions/transaction-filter/transaction-filter.component';
import { TransactionFilterModule } from './home/home-sessions/transaction-filter/transaction-filter.module';
import { ProjectAccountManagementModule } from './tools/advanced/project-account-management/project-account-management.module'
import {CrashReportModule}  from './home/home-sessions/crash-report/crash-report.module';
import { AppCrashModule } from './home/home-sessions/sessions-details/app-crash/app-crash.module';
import { EnvironmentNodeModule } from './tools/advanced/enterprise-node/enterprise-node.module'
import { RunCommandV1Module } from './tools/actions/runCommand-V1';
import { SchedulerV1Module } from './tools/actions/scheduler-V1';
import { CavNdAgentComponent } from './tools/admin/cav-nd-agent/cav-nd-agent.component';
import { NDTierGroupComponent } from './tools/configuration/nd-tier-group/nd-tier-group.component';
import { NDTierAssignmentRuleComponent } from './tools/configuration/nd-tier-assignment-rule/nd-tier-assignment-rule.component';
import { DdrComponent } from './ddr/ddr.component';
import { DdrModule } from './ddr/ddr.module';
import { ExecDashboardMainComponent } from './exec-dashboard/exec-dashboard-main.component';
import { PageBaselineSettingsComponent } from './home/home-sessions/page-baseline-settings/page-baseline-settings.component';
import { PageBaselineSettingsModule } from './home/home-sessions/page-baseline-settings/page-baseline-settings.module'
import { ResourceBaselineSettingsModule } from './home/home-sessions/resource-baseline-settings/resource-baseline-settings.module';
import { ResourceBaselineSettingsComponent } from './home/home-sessions/resource-baseline-settings/resource-baseline-settings.component';
import { TaskSchedulerComponent } from './home/home-sessions/task-scheduler/task-scheduler.component';
import { TaskSchedulerModule } from './home/home-sessions/task-scheduler/task-scheduler.module';
const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../core/root-request-handler/root-request-handler.module').then(
        (m) => m.RootRequestHandlerModule
      ),
  },
  {
    path: 'loading',
    loadChildren: () =>
      import('./loading/loading.module').then((m) => m.LoadingModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'logout',
    loadChildren: () =>
      import('./logout/logout.module').then((m) => m.LogoutModule),
  },
  {
    path: 'welcome',
    loadChildren: () =>
      import('./welcome-screen/welcome-screen.module').then(
        (m) => m.WelcomeScreenModule
      ),
  },
  {
    path: 'dashboard-service-req',
    loadChildren: () =>
      import('./dashboard-service-req/dashboard-service-req.module').then(
        (m) => m.DashboardServiceReqModule
      ),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'kpi',
    loadChildren: () => import('./kpi/kpi.module').then((m) => m.KpiModule),
  },
  {
    path: 'test-page',
    loadChildren: () =>
      import('./test-page/test-page.module').then((m) => m.TestPageModule),
  },
  {
    path: 'drilldown',
    loadChildren: () =>
      import('./drilldown/drilldown.module').then((m) => m.DrilldownModule),
  },
  {
    path: 'aggregate-transaction-flowmap',
    loadChildren: () =>
      import(
        './drilldown/aggregate-transaction-flowmap/aggregate-transaction-flowmap.module'
      ).then((m) => m.AggregateTransactionFlowmapModule),
  },
  {
    path: 'sample-page',
    loadChildren: () =>
      import('./sample-page/sample-page.module').then(
        (m) => m.SamplePageModule
      ),
  },

  {
    path: 'end-to-end',
    loadChildren: () =>
      import('./end-to-end/end-to-end.module').then((m) => m.EndToEndModule),
  },
  {
    path: 'geo-location',
    loadChildren: () =>
      import('./geolocation/geolocation.module').then(
        (m) => m.GeolocationModule
      ),
  },
  {
    path: 'flowpath-analyzer',
    loadChildren: () =>
      import('./drilldown/flowpath-analyzer/flowpath-analyzer.module').then(
        (m) => m.FlowpathAnalyzerModule
      ),
  },
  {
    path: 'compare-flowpath',
    loadChildren: () =>
      import('./drilldown/compare-flowpaths/compare-flowpaths.module').then(
        (m) => m.CompareFlowpathsModule
      ),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsModule),
  },
  {
    path: 'audit-logs',
    loadChildren: () =>
      import('./audit-logs/audit-logs.module').then((m) => m.AuditLogsModule),
    component: AuditLogsComponent,
  },
  {
    path: 'index-pattern',
    loadChildren: () =>
      import('./index-pattern/index-pattern.module').then(
        (m) => m.IndexPatternModule
      ),
    component: IndexPatternComponent,
  },
  // {
  //   path: 'schedules',
  //   loadChildren: () =>
  //     import('./schedules/schedules.module').then((m) => m.SchedulesModule),
  //   component: SchedulesComponent,
  // },
  {
    path: 'reports',
    loadChildren: () =>
      import('./my-library/reports/reports.module').then(
        (m) => m.ReportsModule
      ),
    component: ReportsComponent,
  },
  {
    path: 'cluster-monitor',
    loadChildren: () =>
      import('./tools/actions/cluster-monitor/cluster-monitor.module').then(
        (m) => m.ClusterMonitorModule
      ),
    component: ClusterMonitorComponent,
  },
  {
    path: 'my-library',
    loadChildren: () =>
      import('./my-library/my-library.module').then((m) => m.MyLibraryModule),
    component: MyLibraryComponent,
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    component: AdminComponent,
  },
  {
    path: 'my-profile',
    loadChildren: () =>
      import('./my-profile/my-profile.module').then((m) => m.MyProfileModule),
    component: MyProfileComponent,
  },
  {
    path: 'advanced-session',
    loadChildren: () =>
      import('./advanced-session/advanced-session.module').then(
        (m) => m.AdvancedSessionModule
      ),
    component: AdvancedSessionComponent,
  },
  {
    path: 'query-settings',
    loadChildren: () =>
      import('./query-settings/query-settings.module').then(
        (m) => m.QuerySettingsModule
      ),
  },
  {
    path: 'create-visualization',
    loadChildren: () =>
      import('./create-visualization/create-visualization.module').then(
        (m) => m.CreateVisualizationModule
      ),
    component: CreateVisualizationComponent,
  },
  {
    path: 'nv-config',
    loadChildren: () =>
      import('./sessions/nv-config/nv-config.module').then(
        (m) => m.NvConfigModule
      ),
    component: NvConfigComponent,
  },
  {
    path: 'monitor-up-down-status',
    loadChildren: () =>
      import('./monitor-up-down-status/monitor-up-down-status.module').then(
        (m) => m.MonitorUpDownStatusModule
      ),
    component: MonitorUpDownStatusComponent,
  },

  // {
  //   path: 'add-system-report',
  //   loadChildren: () => import('./add-system-report/add-system-report.module').then((m) => m.AddSystemReportModule),
  //   component: AddSystemReportComponent
  // }
  // {
  //   path: 'access-control',
  //   loadChildren: () =>
  //     import('./tools/admin/access-control/access-control.module').then(
  //       (m) => m.AccessControlModule
  //     ),
  // },
  {	
    path: 'access-control-V1',	
    loadChildren: () =>	
      import('./tools/admin/access-control-V1/access-control-list.module').then(	
        (m) => m.AccessControlV1Module	
      ),	
  },
  {
    path: 'net-diagnostics-enterprise',
    loadChildren: () =>
      import(
        './tools/admin/net-diagnostics-enterprise/net-diagnostics-enterprise.module'
      ).then((m) => m.NetDiagnosticsEnterpriseModule),
    component: NetDiagnosticsEnterpriseComponent,
  },
  {
    path: 'agent-info',
    loadChildren: () =>
      import('./tools/admin/agent-info/agent-info.module').then(
        (m) => m.AgentInfoModule
      ),
    component: AgentInfoComponent,
  },
  // {
  //   path: 'retention-policy',
  //   loadChildren: () =>
  //     import('./tools/admin/retention-policy/retention-policy.module').then(
  //       (m) => m.RetentionPolicyModule
  //     ),
  //   component: RetentionPolicyComponent,
  // },
  {
    path: 'retention-policy-V1',
    loadChildren: () =>
      import('./tools/admin/retention-policy-V1/retention-policy-V1.module').then(
        (m) => m.RetentionPolicyV1Module
      ),
    component: RetentionPolicyMainComponent,
  },
  {
    path: 'manage-controller',
    loadChildren: () =>
      import('./tools/admin/manage-controller/manage-controller.module').then(
        (m) => m.ManageControllerModule
      ),
    component: ManageControllerComponent,
  },
  {
    path: 'machine-configuration',
    loadChildren: () =>
      import(
        './tools/admin/machine-configuration/machine-configuration.module'
      ).then((m) => m.MachineConfigurationModule),
    component: MachineConfigurationComponent,
  },
  {
    path: 'event-definition',
    loadChildren: () =>
      import(
        './tools/advanced/design/event-definition/event-definition.module'
      ).then((m) => m.EventDefinitionModule),
    component: EventDefinitionComponent,
  },
  {
    path: 'event-definition',
    loadChildren: () =>
      import(
        './tools/advanced/design/event-definition/event-definition.module'
      ).then((m) => m.EventDefinitionModule),
    component: EventDefinitionComponent,
  },
  {
    path: 'health-check-monitor',
    loadChildren: () =>
      import(
        './tools/advanced/design/health-check-monitor/health-check-monitor.module'
      ).then((m) => m.HealthCheckMonitorModule),
    component: HealthCheckMonitorComponent,
  },
  {
    path: 'ip-management',
    loadChildren: () =>
      import('./tools/advanced/design/ip-management/ip-management.module').then(
        (m) => m.IpManagementModule
      ),
    component: IpManagementComponent,
  },
  {
    path: 'test-report',
    loadChildren: () =>
      import('./tools/advanced/design/test-report/test-report.module').then(
        (m) => m.TestReportModule
      ),
    component: TestReportComponent,
  },
  {
    path: 'scenarios',
    loadChildren: () =>
      import('./tools/advanced/design/scenarios/scenarios.module').then(
        (m) => m.ScenariosModule
      ),
    component: ScenariosComponent,
  },
  {
    path: 'test-suite',
    loadChildren: () =>
      import('./tools/advanced/design/test-suite/test-suite.module').then(
        (m) => m.TestSuiteModule
      ),
    component: TestSuiteComponent,
  },
  {
    path: 'peripheral-devices',
    loadChildren: () =>
      import(
        './tools/advanced/system-logs/peripheral-devices/peripheral-devices.module'
      ).then((m) => m.PeripheralDevicesModule),
    component: PeripheralDevicesComponent,
  },
  {
    path: 'cavisson-services',
    loadChildren: () =>
      import(
        './tools/advanced/health/cavisson-services/cavisson-services.module'
      ).then((m) => m.CavissonServicesModule),
    component: CavissonServicesComponent,
  },
  {
    path: 'rbu-access-logs',
    loadChildren: () =>
      import(
        './tools/advanced/system-logs/rbu-access-logs/rbu-access-logs.module'
      ).then((m) => m.RbuAccessLogsModule),
    component: RbuAccessLogsComponent,
  },
  {
    path: 'kubernetes',
    loadChildren: () =>
      import('./tools/advanced/system-logs/kubernetes/kubernetes.module').then(
        (m) => m.KubernetesModule
      ),
    component: KubernetesComponent,
  },
  {
    path: 'test-case',
    loadChildren: () =>
      import('./tools/advanced/design/test-case/test-case.module').then(
        (m) => m.TestCaseModule
      ),
    component: TestCaseComponent,
  },
  {
    path: 'postgress-stats',
    loadChildren: () =>
      import('./tools/advanced/postgress-stats/postgress-stats.module').then(
        (m) => m.PostgressStatsModule
      ),
    component: PostgressStatsComponent,
  },
  {	
    path: 'project-account-management',	
    loadChildren: () =>	
      import('./tools/advanced/project-account-management/project-account-management.module').then(	
        (m) => m.ProjectAccountManagementModule
      ),	
  },
  {	
    path: 'enterprise-node',	
    loadChildren: () =>	
      import('./tools/advanced/enterprise-node/enterprise-node.module').then(	
        (m) => m.EnvironmentNodeModule
      ),	
  },
  {	
    path: 'exec-dashboard',	
    loadChildren: () =>	
      import('./exec-dashboard/execDashboard.module').then((m) => m.ExecDashboardModule),	
      component: ExecDashboardMainComponent,
  },
  {
    path: 'infrastructure-view',
    loadChildren: () =>
      import(
        './tools/advanced/infrastructure-view/infrastructure-view.module'
      ).then((m) => m.InfrastructureViewModule),
    component: InfrastructureViewComponent,
  },
  {
    path: 'transactions',
    loadChildren: () =>
      import('./tools/advanced/transactions/transactions.module').then(
        (m) => m.TransactionsModule
      ),
    component: TransactionsComponent,
  },
  {
    path: 'current-sessions',
    loadChildren: () =>
      import('./tools/advanced/current-sessions/current-sessions.module').then(
        (m) => m.CurrentSessionsModule
      ),
    component: CurrentSessionsComponent,
  },
  {
    path: 'color-management',
    loadChildren: () =>
      import(
        './tools/configuration/color-management/color-management.module'
      ).then((m) => m.ColorManagementModule),
    component: ColorManagementComponent,
  },
  {
    path: 'configuration-settings',
    loadChildren: () =>
      import(
        './tools/configuration/configuration-settings/configuration-settings.module'
      ).then((m) => m.ConfigurationSettingsModule),
    component: ConfigurationSettingsComponent,
  },
  //{
  //  path: 'agent-config',
  //  loadChildren: () =>
  //    import('./tools/configuration/agent-config/agent-config.module').then(
  //      (m) => m.AgentConfigModule
  //    ),
  //  component: AgentConfigComponent,
  //},
  //{
  //  path: 'agent-config',
  //  loadChildren: () =>
  //    import('./tools/configuration/agent-config/agent-config.module').then(
  //      (m) => m.AgentConfigModule
  //    ),
  //  component: AgentConfigComponent,
  //},
  {
   path: 'nd-agent-config',
   loadChildren: () =>
     import('./tools/configuration/nd-config/config.module').then(
       (m) => m.AppModuleForConfig
     ),
   component: AppComponentForConfig,
  },
  {
    path: 'ddr',
    loadChildren: () =>
      import('./ddr/ddr.module').then(
        (m) => m.DdrModule
      ),
    component: DdrComponent,
   },
  {
    path: 'tier-group',
    loadChildren: () =>
      import('./tools/configuration/tier-group/tier-group.module').then(
        (m) => m.TierGroupModule
      ),
    component: TierGroupComponent,
  },
  {
    path: 'catalouge-management',
    loadChildren: () =>
      import(
        './tools/configuration/catalouge-management/catalouge-management.module'
      ).then((m) => m.CatalougeManagementModule),
    component: CatalougeManagementComponent,
  },
  {
    path: 'multi-node-configuration',
    loadChildren: () =>
      import(
        './tools/configuration/configuration-settings/multi-node-configuration/multi-node-configuration.module'
      ).then((m) => m.MultiNodeConfigurationModule),
    component: MultiNodeConfigurationComponent,
  },
  {
    path: 'instrumentation-settings',
    loadChildren: () =>
      import(
        './tools/configuration/agent-config/profile/instrumentation-settings/instrumentation-settings.module'
      ).then((m) => m.InstrumentationSettingsModule),
    component: InstrumentationSettingsComponent,
  },
  {
    path: 'general-settings',
    loadChildren: () =>
      import(
        './tools/configuration/agent-config/profile/general-settings/general-settings.module'
      ).then((m) => m.GeneralSettingsModule),
    component: GeneralSettingsComponent,
  },
  {
    path: 'advance-settings',
    loadChildren: () =>
      import(
        './tools/configuration/agent-config/profile/advance-settings/advance-settings.module'
      ).then((m) => m.AdvanceSettingsModule),
    component: AdvanceSettingsComponent,
  },
  {
    path: 'product-integration-settings',
    loadChildren: () =>
      import(
        './tools/configuration/agent-config/profile/product-integration-settings/product-integration-settings.module'
      ).then((m) => m.ProductIntegrationSettingsModule),
    component: ProductIntegrationSettingsComponent,
  },
  {
    path: 'topology-management',
    loadChildren: () =>
      import(
        './tools/configuration/topology-management/topology-management.module'
      ).then((m) => m.TopologyManagementModule),
    component: TopologyManagementComponent,
  },
  {
    path: 'nd-setting',
    loadChildren: () =>
      import(
        './tools/configuration/agent-config/agent-config-home/application-list/nd-setting/nd-setting.module'
      ).then((m) => m.NdSettingModule),
    component: NdSettingComponent,
  },
  {
    path: 'actions',
    loadChildren: () =>
      import('./tools/actions/actions.module').then((m) => m.ActionsModule),
    component: ActionsComponent,
  },
  {
    path: 'db-monitoring',
    loadChildren: () =>
      import('./db-monitoring/db-monitoring.module').then(
        (m) => m.DBMonitoringModule
      ),
    component: DBMonitoringComponent,
  },
  {
    path: 'revenue-analytics',
    loadChildren: () =>
      import(
        './home/home-sessions/revenue-analytics/revenue-analytics.module'
      ).then((m) => m.RevenueAnalyticsModule),
    component: RevenueAnalyticsComponent,
  },
  {
    path: 'form-analytics',
    loadChildren: () =>
      import('./home/home-sessions/form-analytics/form-analytics.module').then(
        (m) => m.FormAnalyticsModule
      ),
    component: FormAnalyticsComponent,
  },
  {
    path: 'form-analytic-overall',
    loadChildren: () =>
      import('./home/home-sessions/form-analytics/form-analytic-overall/form-analytic-overall.module').then(
        (m) => m.FormAnalyticOverallModule
      ),
    component: FormAnalyticOverallComponent,
  },
  {
    path: 'page-performance-overview',
    loadChildren: () =>
      import(
        './home/home-sessions/page-performance-overview/page-performance-overview.module'
      ).then((m) => m.PagePerformanceOverviewModule),
    component: PagePerformanceOverviewComponent,
  },
  {
    path: 'performance-details',
    loadChildren: () =>
      import(
        './home/home-sessions/page-performance-overview/page/performance-details/performance-details.module'
      ).then((m) => m.PerformanceDetailsModule),
    component: PerformanceDetailsComponent,
  },
  {
    path: 'custom-metrics',
    loadChildren: () =>
      import(
        './home/home-sessions/custom-metrics-report/custom-metrics.module'
      ).then((m) => m.CustomMetricsReportModule),
    component: CustomMetricsReportComponent,
  },
  {
    path: 'variation',
    loadChildren: () =>
      import('./home/home-sessions/variation/variation.module').then(
        (m) => m.VariationModule
      ),
    component: VariationComponent,
  },
   {
    path: 'page-baseline-settings',
    loadChildren: () =>
      import('./home/home-sessions/page-baseline-settings/page-baseline-settings.module').then(
        (m) => m.PageBaselineSettingsModule
      ),
    component: PageBaselineSettingsComponent,
  },
  {
    path: 'resource-baseline-settings',
    loadChildren: () =>
      import('./home/home-sessions/resource-baseline-settings/resource-baseline-settings.module').then(
        (m) => m.ResourceBaselineSettingsModule
      ),
    component: ResourceBaselineSettingsComponent,
  },
 
  {
    path: 'task-scheduler',
    loadChildren: () =>
      import('./home/home-sessions/task-scheduler/task-scheduler.module').then(
        (m) => m.TaskSchedulerModule
      ),
    component: TaskSchedulerComponent,
  },
  {
    path: 'feedback',
    loadChildren: () =>
      import('./home/home-sessions/feedback/feedback.module').then(
        (m) => m.FeedbackModule
      ),
    component: FeedbackComponent,
  },
  {
    path: 'app-crash-filter',
    loadChildren: () =>
      import(
        './home/home-sessions/app-crash-filter/app-crash-filter.module'
      ).then((m) => m.AppCrashFilterModule),
    component: AppCrashFilterComponent,
  },
  {
    path: 'marketing-analytics',
    loadChildren: () =>
      import(
        './home/home-sessions/marketing-analytics/marketing-analytics.module'
      ).then((m) => m.MarketingAnalyticsModule),
    component: MarketingAnalyticsComponent,
  },
  {
    path: 'sessions-details',
    loadChildren: () =>
      import(
        './home/home-sessions/sessions-details/sessions-details.module'
      ).then((m) => m.SessionsDetailsModule),
    component: SessionsDetailsComponent,
  },
  {
    path: 'product-page',
    loadChildren: () =>
      import('./home/home-sessions/product-page/product-page.module').then(
        (m) => m.ProductPageModule
      ),
    component: ProductPageComponent,
  },
  {
    path: 'sessions-overview',
    loadChildren: () =>
      import(
        './home/home-sessions/session-overview/session-overview.module'
      ).then((m) => m.SessionOverviewModule),
    component: SessionOverviewComponent,
  },
  {
    path: 'application-health',
    loadChildren: () =>
      import(
        './tools/advanced/health/appliance-health/appliance-health.module'
      ).then((m) => m.ApplianceHealthModule),
    component: ApplianceHealthComponent,
  },
  {
    path: 'mapping',
    loadChildren: () =>
      import('./home/home-sessions/mapping/mapping.module').then(
        (m) => m.MappingModule
      ),
    component: MappingComponent,
  },
  {
    path: 'play-sessions',
    loadChildren: () =>
      import('./home/home-sessions/play-sessions/play-sessions.module').then(
        (m) => m.PlaySessionsModule
      ),
    component: PlaySessionsComponent,
  },
  {
    path: 'system-settings',
    loadChildren: () =>
      import(
        './home/home-sessions/system-settings/system-settings.module'
      ).then((m) => m.SystemSettingsModule),
    component: SystemSettingsComponent,
  },
  {
    path: 'callback-designer',
    loadChildren: () =>
      import(
        './home/home-sessions/callback-designer/callback-designer.module'
      ).then((m) => m.CallbackDesignerModule),
    component: CallbackDesignerComponent,
  },
  {
    path: 'form-analytics',
    loadChildren: () =>
      import('./home/home-sessions/form-analytics/form-analytics.module').then(
        (m) => m.FormAnalyticsModule
      ),
    component: FormAnalyticsComponent,
  },
  {
    path: 'page-filter',
    loadChildren: () =>
      import('./home/home-sessions/page-filter/page-filter.module').then(
        (m) => m.PageFilterModule
      ),
    component: PageFilterComponent,
  },
   {
    path: 'app-crash-filter',
    loadChildren: () =>
      import(
        './home/home-sessions/app-crash-summary/app-crash-summary.module'
      ).then((m) => m.AppCrashSummaryModule),
     component: AppCrashSummaryComponent,
  },
  {
    path: 'transaction-filter',
     loadChildren: () =>
       import('./home/home-sessions/transaction-filter/transaction-filter.module').then(
         (m) => m.TransactionFilterModule
       ),
     component: TransactionFilterComponent,
   },
  {
    path: 'http-filter',
    loadChildren: () =>
      import('./home/home-sessions/http-filter/http-filter.module').then(
        (m) => m.HttpFilterModule
      ),
    component: HttpFilterComponent,
  },
  {
    path: 'js-error-filter',
    loadChildren: () =>
      import('./home/home-sessions/js-error-filter/js-error-filter.module').then(
        (m) => m.JsErrorFilterModule
      ),
   component: JsErrorFilterComponent,
  },
  {
    path: 'session-event',
    loadChildren: () =>
      import('./home/home-sessions/session-event/session-event.module').then(
        (m) => m.SessionEventModule
      ),
   component: SessionEventComponent,
  },
  {
    path: 'auto-generate',
    loadChildren: () =>
      import(
        './tools/configuration/color-management/auto-genarage-color-management/auto-genarage-color-management.module'
      ).then((m) => m.AutoGenarageColorManagementModule),
    component: AutoGenarageColorManagementComponent,
  },
  {
    path: 'business-view',
    loadChildren: () =>
      import('./business-view/business-view.module').then(
        (m) => m.BusinessViewModule
      ),
    component: BusinessViewComponent,
  },
  {
    path: 'drilldown-compare-flowpaths',
    loadChildren: () => import('./drilldown/ddr-p4/drilldown-compare-flowpaths/drilldown-compare-flowpaths.module').then((m) => m.DrillDownCompareFlowpathsModule),
    component: DrillDownCompareFlowpathsComponent
  },
  {
    path: 'nd-tier-group',
    loadChildren:  () => import('./tools/configuration/nd-tier-group/nd-tier-group.module').then((m) => m.NDTierGroupModule),
    component: NDTierGroupComponent
  } ,
  {
    path: 'nd-tier-assignment',
    loadChildren:  () => import('./tools/configuration/nd-tier-assignment-rule/nd-tier-assignment.module').then((m) => m.NDTierAssignmentModule),
    component: NDTierAssignmentRuleComponent
  } ,
  {
    path: 'nd-agent-info',
    loadChildren:  () => import('./tools/admin/cav-nd-agent/cav-nd-agent.module').then((m) => m.CavNdAgentModule),
    component: CavNdAgentComponent
  },
  {	
    path: 'run-command-V1',	
    loadChildren: () =>	
      import('./tools/actions/runCommand-V1/runCmd-V1.module').then(	
        (m) => m.RunCommandV1Module
      ),	
  }, 
];

const modules = [
  LoginModule,
  MonitorUpDownStatusModule,
  IpSummaryModule,
  WelcomeScreenModule,
  HomeModule,
  DashboardServiceReqModule,
  KpiModule,
  DrilldownModule,
  LogoutModule,
  LoadingModule,
  TestPageModule,
  EndToEndModule,
  AggregateTransactionFlowmapModule,
  GeolocationModule,
  FlowpathAnalyzerModule,
  CompareFlowpathsModule,
  SettingsModule,
  AuditLogsModule,
  MyLibraryModule,
  AdminModule,
  MyProfileModule,
  AdvancedSessionModule,
  QuerySettingsModule,
  CreateVisualizationModule,
  ClusterMonitorModule,
  NvConfigModule,
  NetDiagnosticsEnterpriseModule,
  AgentInfoModule,
  ManageControllerModule,
  MachineConfigurationModule,
  EventDefinitionModule,
  HealthCheckMonitorModule,
  IpManagementModule,
  TestReportModule,
  ScenariosModule,
  PeripheralDevicesModule,
  CavissonServicesModule,
  TestCaseModule,
  RbuAccessLogsModule,
  KubernetesModule,
  PostgressStatsModule,
  InfrastructureViewModule,
  TransactionsModule,
  CurrentSessionsModule,
  ColorManagementModule,
  ConfigurationSettingsModule,
  AgentConfigModule,
  TierGroupModule,
  GeneralSettingsModule,
  MultiNodeConfigurationModule,
  InstrumentationSettingsModule,
  TopologyManagementModule,
  AdvanceSettingsModule,
  ProductIntegrationSettingsModule,
  ActionsModule,
  DBMonitoringModule,
  NdSettingModule,
  AppCrashSummaryModule,
  ActionsModule,
  RevenueAnalyticsModule,
  UxAgentSettingModule,
  PagePerformanceOverviewModule,
  CustomMetricsReportModule,
  PerformanceDetailsModule,
  VariationModule,
  FeedbackModule,
  HeapDumpModule,
  CommandListModule,
  JavaHeapDumpModule,
  AppCrashFilterModule,
  MarketingAnalyticsModule,
  SessionsDetailsModule,
  FormAnalyticsModule,
  FormAnalyticOverallModule,
  MarketingAnalyticsModule,
  SessionsDetailsModule,
  ProductPageModule,
  SessionOverviewModule,
  ApplianceHealthModule,
  MappingModule,
  PlaySessionsModule,
  SystemSettingsModule,
  CallbackDesignerModule,
  FormAnalyticsModule,
  PageFilterModule,
  HttpFilterModule,
  JsErrorFilterModule,
  SystemSettingsModule,
  AutoGenarageColorManagementModule,
  BusinessViewModule,
  AppModuleForConfig,
  RetentionPolicyV1Module,
  DrillDownCompareFlowpathsModule,
  AccessControlV1Module,
  TransactionFilterModule,
  ProjectAccountManagementModule,
  AppCrashModule,
  CrashReportModule,
  EnvironmentNodeModule,
  RunCommandV1Module,
  SchedulerV1Module,
  DdrModule
];

@NgModule({
  declarations: [],
  imports: [modules, RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class PagesModule {}
