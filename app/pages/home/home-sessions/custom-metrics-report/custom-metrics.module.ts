import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMetricsReportComponent } from './custom-metrics-report.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { BreadcrumbModule, ToolbarModule, ButtonModule, AccordionModule, TabViewModule, TableModule, SidebarModule, CardModule, DropdownModule, InputTextModule, MessageModule, RadioButtonModule, TooltipModule, MultiSelectModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';


const imports = [
    ToolbarModule,
    TableModule,
    ChartModule,
    AccordionModule,
    TabViewModule,
    CommonModule,
    SidebarModule,
    HeaderModule,
    ButtonModule,
    BreadcrumbModule,
    InputTextModule,
    MessageModule,
    CardModule,
    FormsModule,
    DropdownModule,
    MultiSelectModule,
    TooltipModule,
    RadioButtonModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    ReactiveFormsModule

]

const components = [CustomMetricsReportComponent];

const routes: Routes = [
    {
        path: 'custom-metrics',
        component: CustomMetricsReportComponent,
    },
];

@NgModule({
    declarations: [components],
    imports: [imports, RouterModule.forChild(routes)],
    exports: [RouterModule],
})

export class CustomMetricsReportModule { }
