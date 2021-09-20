import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ToolbarModule, AutoCompleteModule, ButtonModule, CardModule, DialogModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { PagePerformanceFilterModule } from '../../page-performance-filter/page-performance-filter.module';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { ResourcePerformanceCompareComponent } from './resource-performance-compare.component';

const imports = [
    BreadcrumbModule,
    HeaderModule,
    ToolbarModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    DialogModule,
    CardModule,
    FormsModule,
    DropdownModule,
    TableModule,
    MultiSelectModule,
    MenuModule,
    TooltipModule,
    ChartModule,
    AutoCompleteModule,
    PagePerformanceFilterModule
];

const components = [ResourcePerformanceCompareComponent];

const routes: Routes = [
    {
        path: 'resource-performance-comapre',
        component: ResourcePerformanceCompareComponent,
    },
];

@NgModule({
    declarations: [components],
    imports: [imports, RouterModule.forChild(routes)],
    exports: [components, RouterModule],
})
export class ResourcePerformanceCompareModule { }
