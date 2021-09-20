import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RunCommandV1Component } from './runCmd-V1.component';
import { RouterModule } from '@angular/router';

/* Routes */
import { APP_ROUTES } from './components/runCmd-V1.routes';

/* Components */
import { RunCmdNavBarComponent } from './components/runCmd-nav-bar/runCmd-nav-bar.component';
import { RunCmdMainComponent } from './components/runCmd-main-component/runCmd-main.component';
import { EditCmdComponent } from './components/runCmd-editCmd-component/runCmd-editCmd.component';
import { AddCommandComponent } from './components/add-command/add-command.component';

/*Prime Ng*/
import { DropdownModule } from 'primeng';
import { CheckboxModule } from 'primeng';
import { SliderModule } from 'primeng';
import { InputTextModule } from 'primeng';
import { MultiSelectModule } from 'primeng';
import { PanelModule } from 'primeng';
import { SpinnerModule } from 'primeng/spinner';
import { TabViewModule } from 'primeng';
import { SharedModule } from 'primeng';
import { RadioButtonModule } from 'primeng';
import { InputTextareaModule } from 'primeng';
import { DialogModule } from 'primeng';
import { ButtonModule } from 'primeng';
import { BlockUIModule } from 'primeng';
import { SelectButtonModule } from 'primeng';
import { CalendarModule } from 'primeng';
import { InputSwitchModule } from 'primeng';
import { ToolbarModule } from 'primeng';

/*HttpClient Service*/
import { HttpService } from './services/httpService';
import { TabNavigatorService } from './services/tab-navigator.service';

//Added for Preventing 404 error while reloading
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { CreateRunCmdTaskComponent } from './components/create-run-cmd-task/create-run-cmd-task.component';
import { RunCmdSchedulerMgmtComponent } from './components/run-cmd-scheduler-mgmt/run-cmd-scheduler-mgmt.component';

/**Importing the schedular module*/
import { SchedulerV1Module } from '../../actions/scheduler-V1';

//  import { HttpRequestInterceptorService } from "../../main/services/http-request-interceptor.service";
import { RunCmdGraphInfo } from "./components/runCmd-graph-info/runCmd-graph-info.component";
import { RunCommandGraphs } from "./components/run-command-graphs/run-command-graphs.component";
import { TableModule } from 'primeng/table';
import { HighchartsChartModule } from 'highcharts-angular';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { BreadcrumbModule } from 'primeng';
import { TooltipModule } from 'primeng/tooltip';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [RunCommandV1Component, RunCmdNavBarComponent, RunCmdMainComponent, EditCmdComponent,
    AddCommandComponent, CreateRunCmdTaskComponent, RunCmdSchedulerMgmtComponent,
    RunCmdGraphInfo, RunCommandGraphs],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule.forChild(APP_ROUTES),
    DropdownModule, CheckboxModule, SliderModule, InputTextModule, MultiSelectModule,
    PanelModule, SpinnerModule, TabViewModule, SharedModule, RadioButtonModule,
    InputTextareaModule, DialogModule, ButtonModule, BlockUIModule, SelectButtonModule,
    CalendarModule, InputSwitchModule, ToolbarModule, TableModule, SchedulerV1Module,
    HighchartsChartModule, HeaderModule, BreadcrumbModule, TooltipModule, CardModule, ToastModule],
  entryComponents: [RunCmdGraphInfo],
  providers: [
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpRequestInterceptorService,
    //   multi: true
    // },
    HttpService, TabNavigatorService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [RunCommandV1Component]
})
export class RunCommandV1Module { }
