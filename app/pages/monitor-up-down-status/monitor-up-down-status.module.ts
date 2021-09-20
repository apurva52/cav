import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitorUpDownStatusComponent } from './monitor-up-down-status.component';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, RadioButtonModule, TableModule, ToolbarModule, TooltipModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from '../../shared/header/header.module';
import { OwlMomentDateTimeModule } from '../../shared/date-time-picker-moment/moment-date-time.module';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { RouterModule, Routes } from '@angular/router';
import { TimeBarModule } from 'src/app/shared/time-bar/time-bar.module';
import { ConfigureMonitorsModule } from './configure-monitors/configure-monitors.module';
import { AddCustomMonitorModule } from './configure-monitors/add-custom-monitor/add-custom-monitor.module';
import { AddMonitorModule } from './configure-monitors/add-monitor/add-monitor.module';
import { MonitorsModule } from './configure-monitors/monitors/monitors.module';
import { AwsMonitoringModule } from './configure-monitors/aws-monitoring/aws-monitoring.module';
import { KubernetsMonitoringModule } from './configure-monitors/kubernets-monitoring/kubernets-monitoring.module';
import { HealthCheckMonitorSettingModule } from './configure-monitors/health-check-monitor/health-check-monitor-setting/health-check-monitor-setting.module';
import { AwsConfigurationModule } from './configure-monitors/aws-monitoring/aws-configuration/aws-configuration.module';
import { HealthCheckMonitorModule } from './configure-monitors/health-check-monitor/health-check-monitor.module';
import { OracleServerModule } from './configure-monitors/oracle-server/oracle-server.module';
import { UtilityService } from './service/utility.service';
import { AvailableCustomMonitorsModule } from './configure-monitors/add-custom-monitor/available-custom-monitors/available-custom-monitors.module';
import { ConfigureCmdMonitorModule } from './configure-monitors/add-custom-monitor/configure-cmd-monitor/configure-cmd-monitor.module';
import { ConfigureDBMonitorModule } from './configure-monitors/add-custom-monitor/configure-db-monitor/configure-db-monitor.module';
import { DBConnectionModule } from './configure-monitors/add-custom-monitor/db-connection/db-connection.module';
import { ConfigureJMXModule } from './configure-monitors/add-custom-monitor/cav-jmx-monitor/configure-jmx-monitor.module';
import { ConfigureStatsdModule } from './configure-monitors/add-custom-monitor/configure-statsd-monitor/configure-statsd-monitor.module';
import { ConfigureLogMetricMonModule } from './configure-monitors/add-custom-monitor/configure-log-metric-monitor/configure-log-metric-mon.module';
import { JMXConnectionModule } from './configure-monitors/add-custom-monitor/cav-jmx-monitor/jmx-connection/jmx-connection-module';
import { CavMonAwsModule } from './configure-monitors/cloud-monitoring/cav-mon-aws/cav-mon-aws.module';	
import { CavMonAwsComponent } from './configure-monitors/cloud-monitoring/cav-mon-aws/cav-mon-aws.component';	
import { CavMonAzureComponent } from './configure-monitors/cloud-monitoring/cav-mon-azure/cav-mon-azure.component';	
import { CavMonAzureModule } from './configure-monitors/cloud-monitoring/cav-mon-azure/cav-mon-azure.module';	
import { CavMonGcpComponent } from './configure-monitors/cloud-monitoring/cav-mon-gcp/cav-mon-gcp.component';	
import { CavMonGCPModule } from './configure-monitors/cloud-monitoring/cav-mon-gcp/cav-mon-gcp.module';	
import { CavMonNewrelic } from './configure-monitors/cloud-monitoring/cav-mon-newrelic/cav-mon-newrelic.module';	
import { CavMonNewrelicComponent } from './configure-monitors/cloud-monitoring/cav-mon-newrelic/cav-mon-newrelic.component';	
import { CavMonDynatraceComponent } from './configure-monitors/cloud-monitoring/cav-mon-dynatrace/cav-mon-dynatrace.component';	
import { CavMonDynatraceModule } from './configure-monitors/cloud-monitoring/cav-mon-dynatrace/cav-mon-dynatrace.module';
import { OracleTierModule } from './configure-monitors/oracle-tier/oracle-tier.module';
import { AddMonValidationService } from './configure-monitors/add-monitor/service/add-mon-validation.service';
import { AutoMonitorModule } from './configure-monitors/auto-monitor/auto-monitor.module';
import { GetLogFileModule } from './configure-monitors/log-monitors/get-log-file/get-log-file.module';
import { LogPatternMonitorModule } from './configure-monitors/log-monitors/log-pattern-monitor/log-pattern-monitor.module';
import { LogDataComponentModule } from './configure-monitors/log-monitors/log-data-monitor/log-data-monitor.module';
import { LogMonitorCommonModule } from './configure-monitors/log-monitor-common/log-monitor-common.module';
import { CheckMonitorModule } from './configure-monitors/check-monitor/check-monitor.module';
import { ServerSignatureModule } from './configure-monitors/server-signature-monitor/server-signature-monitor.module';
import { SnmpModule } from './configure-monitors/add-custom-monitor/snmp/snmp.module';
const imports = [
  CommonModule,
  DropdownModule,
  FormsModule,
  InputTextModule,
  ButtonModule,
  DialogModule,
  RadioButtonModule,
  CommonModule,
  ReactiveFormsModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  DialogModule,
  HeaderModule,
  ToolbarModule,
  CardModule,
  FormsModule,
  DropdownModule,
  CheckboxModule,
  RadioButtonModule,
  TableModule,
  BreadcrumbModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  MenuModule,
  MultiSelectModule,
  TimeBarModule,
  TooltipModule,
  ConfigureMonitorsModule,
  AddCustomMonitorModule,
  AddMonitorModule,
  MonitorsModule,
  AwsMonitoringModule,
  KubernetsMonitoringModule,
  HealthCheckMonitorSettingModule,
  AwsConfigurationModule,
  HealthCheckMonitorModule,
  OracleServerModule,
  AvailableCustomMonitorsModule,
  ConfigureCmdMonitorModule,
  ConfigureDBMonitorModule,
  DBConnectionModule,
  ConfigureStatsdModule,
  ConfigureJMXModule,
  ConfigureLogMetricMonModule,
  JMXConnectionModule,
  CavMonAwsModule,	
  CavMonAzureModule,	
  CavMonGCPModule,	
  CavMonNewrelic,	
  CavMonDynatraceModule,
  OracleTierModule,
  AutoMonitorModule,
  // GetLogFileModule,
  LogPatternMonitorModule,
  // LogDataComponentModule,
  LogMonitorCommonModule,
  CheckMonitorModule,
  ServerSignatureModule,
  SnmpModule

];

const routes: Routes = [
  {
    path: 'monitor-up-down-status',	
    component: MonitorUpDownStatusComponent,	
    children: [ 
      {	
        path: 'cav-mon-aws',	
        loadChildren: () => import('./configure-monitors/cloud-monitoring/cav-mon-aws/cav-mon-aws.module').then(m => m.CavMonAwsModule),	
        component: CavMonAwsComponent	
      },	
      {	
        path: 'cav-mon-azure',	
        loadChildren: () => import('./configure-monitors/cloud-monitoring/cav-mon-azure/cav-mon-azure.module').then(m => m.CavMonAzureModule),	
        component: CavMonAzureComponent	
      },	
      {	
        path: 'cav-mon-gcp',	
        loadChildren: () => import('./configure-monitors/cloud-monitoring/cav-mon-gcp/cav-mon-gcp.module').then(m => m.CavMonGCPModule),	
        component: CavMonGcpComponent	
      },
      {	
        path: 'cav-mon-newrelic',	
        loadChildren: () => import('./configure-monitors/cloud-monitoring/cav-mon-newrelic/cav-mon-newrelic.module').then(m => m.CavMonNewrelic),	
        component: CavMonNewrelicComponent	
      },	
      {	
        path: 'cav-mon-dynatrace',	
        loadChildren: () => import('./configure-monitors/cloud-monitoring/cav-mon-dynatrace/cav-mon-dynatrace.module').then(m => m.CavMonDynatraceModule),	
        component: CavMonDynatraceComponent	
      },	

    ]
  }
]

@NgModule({
  declarations: [MonitorUpDownStatusComponent],
  imports: [imports],
  providers: [
    UtilityService,AddMonValidationService
  ],
  exports: [
    RouterModule
  ]
})

export class MonitorUpDownStatusModule { }
