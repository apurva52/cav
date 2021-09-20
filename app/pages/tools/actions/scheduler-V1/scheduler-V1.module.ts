import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/**primeng Modules  */
import { PanelMenuModule, MenuItem, MenubarModule, ToolbarModule, RadioButtonModule, BreadcrumbModule, SplitButtonModule, ConfirmDialogModule } from 'primeng';
import { InputTextModule, ButtonModule, DialogModule, DropdownModule, CalendarModule, AccordionModule, CheckboxModule, MultiSelectModule } from 'primeng';
import { SharedModule, SpinnerModule, PickListModule, SliderModule } from 'primeng';
import { TabViewModule, PanelModule } from 'primeng';
import { FieldsetModule } from 'primeng';
import { InputSwitchModule } from 'primeng';
import { SelectButtonModule } from 'primeng';
import { SchedulerV1Component } from './scheduler-V1.component';
import {ConfirmationService} from 'primeng/api';

/* Import components*/
import { SchedulerManagementComponent } from './components/scheduler-management/scheduler-management.component';
/*Import services*/
import { HttpScenarioScheduleService } from './services/scenario-scheduler-http.service';
import { TableModule } from 'primeng/table';
import {ToastModule} from 'primeng/toast';
@NgModule({
  declarations: [SchedulerV1Component, SchedulerManagementComponent],
  imports: [FormsModule, CommonModule, HttpClientModule, SharedModule, InputTextModule, ButtonModule,
    DialogModule, DropdownModule, PanelMenuModule, MenubarModule, ToolbarModule, RadioButtonModule,
    SplitButtonModule, BreadcrumbModule, CalendarModule, AccordionModule, CheckboxModule,
    SpinnerModule, TabViewModule, PanelModule, MultiSelectModule, PickListModule, FieldsetModule,
    ConfirmDialogModule, SliderModule, InputSwitchModule, SelectButtonModule, HttpClientModule, TableModule, ToastModule],
  exports: [SchedulerManagementComponent],
  //schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    ConfirmationService,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpRequestInterceptorService,
    //   multi: true
    // },
    HttpScenarioScheduleService
  ]
})
export class SchedulerV1Module { }
