import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormAnalyticsFilterComponent } from './form-analytics-filter.component';
import { RouterModule, Routes } from '@angular/router';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { ButtonModule, CardModule, DropdownModule, InputTextModule, MessageModule, RadioButtonModule, SelectButtonModule, SidebarModule, TabViewModule, TooltipModule, MultiSelectModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { TimeFilterModule } from 'src/app/shared/time-filter/time-filter/time-filter.module';

const imports = [
    TimeFilterModule,
    CommonModule,
    CardModule,
    ButtonModule,
    AppMessageModule,
    MessageModule,
    TooltipModule,
    FormsModule, ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    SidebarModule,
    DropdownModule,
    RadioButtonModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    TabViewModule,
    SelectButtonModule,
    MultiSelectModule
];

const components = [FormAnalyticsFilterComponent];

const routes: Routes = [
    {
        path: 'formanalytics-filter',
        component: FormAnalyticsFilterComponent,
    },
];

@NgModule({
    declarations: [components],
    imports: [imports, RouterModule.forChild(routes)],
    exports: [RouterModule, components],
})
export class FormAnalyticsFilterModule { }
