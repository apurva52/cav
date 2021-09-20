import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
    MenuModule, MegaMenuModule, ToolbarModule, SidebarModule, CardModule, ScrollPanelModule, TableModule,
    ProgressSpinnerModule, ButtonModule, TooltipModule, MultiSelectModule, DropdownModule, 
} from 'primeng';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ChartModule } from 'src/app/shared/chart/chart.module'; 
import { NsmDashboardComponent } from './nsm-dashboard.component';
import { DashPvoitTableComponent } from './dash-pvoit-table/dash-pvoit-table.component';
import { IpdetailsComponent } from './ipdetails/ipdetails.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';

// import { AgmCoreModule } from '@agm/core';

const imports = [
    CommonModule,
    MenuModule,
    MegaMenuModule,
    HeaderModule,
    ToolbarModule,
    SidebarModule,
    CardModule,
    ChartModule,
    ScrollPanelModule,
    TableModule,
    ProgressSpinnerModule,
    ButtonModule,
    TooltipModule,
    MultiSelectModule,
    FormsModule,
    DropdownModule,
    



];


const routes: Routes = [
    {
        path: 'Ip-details',
        component: IpdetailsComponent
    },
    {
        path: 'Project-detail',
        component: ProjectDetailsComponent
    }
];






@NgModule({
    declarations: [NsmDashboardComponent, DashPvoitTableComponent, IpdetailsComponent, ProjectDetailsComponent],
    imports: [
        imports,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule 

    ]
})
export class NsmdashboardModule { }
