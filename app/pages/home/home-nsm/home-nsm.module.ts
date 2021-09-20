import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MenuModule, MegaMenuModule, ToolbarModule, SidebarModule, CardModule, ScrollPanelModule, TableModule,
    ProgressSpinnerModule, ButtonModule, TooltipModule, MultiSelectModule, PanelMenuModule, DropdownModule, AccordionModule, DialogModule} from 'primeng';
import { NsmlogsComponent } from './nsmlogs/nsmlogs.component';
import { NsmDashboardComponent } from './nsm-dashboard/nsm-dashboard.component';
import { NsmServersComponent } from './nsm-servers/nsm-servers.component';
import { NsmProjectsComponent } from './nsm-projects/nsm-projects.component';
import { NsmVendersComponent } from './nsm-venders/nsm-venders.component';
import { NsmManageComponent } from './nsm-manage/nsm-manage.component';
import { HomeNsmComponent } from './home-nsm.component';
import { HeaderModule } from 'src/app/shared/header/header.module'; 
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { NsmBladesComponent } from './nsm-blades/nsm-blades.component';
import { BladeStatusComponent } from './blade-status/blade-status.component';
import { AllocationStatusComponent } from './allocation-status/allocation-status.component';
import { VMsStatusComponent } from './vms-status/vms-status.component';
import { CCsVPsStatusComponent } from './ccs-vps-status/ccs-vps-status.component';
import { MangVendersComponent } from './mang-venders/mang-venders.component';
import { MangTeamComponent } from './mang-team/mang-team.component';
import { MangChannelComponent } from './mang-channel/mang-channel.component';
import { MangLocationComponent } from './mang-location/mang-location.component';
// import { AgmCoreModule } from '@agm/core'; 
import { NsmdashboardModule} from './nsm-dashboard/nsm-dashboard.module'; 
import { FormsModule } from '@angular/forms';
import { ProjectAllocationComponent } from './project-allocation/project-allocation.component';

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
    NsmdashboardModule,
    PanelMenuModule,
    FormsModule,
    DropdownModule,
    AccordionModule,
    DialogModule


];




const routes: Routes = [
    
    {
        path: '',
        redirectTo: 'nsm-dashboard',
        pathMatch: 'full'

    },

    {
        path: 'nsm-dashboard', 
        loadChildren: () =>
            import('./nsm-dashboard/nsm-dashboard.module').then((m) => m.NsmdashboardModule),
        component: NsmDashboardComponent,

    },
    
    {
        path: 'nsm-projects',
        component: NsmProjectsComponent,

    },

    {
        path: 'nsm-servers',
        component: NsmServersComponent,

    },
    {
        path: 'nsmlogs',
        component: NsmlogsComponent,

    },
    {
        path: 'venders',
        component: NsmVendersComponent,

    },
    {
        path: 'blades',
        component: NsmBladesComponent,

    },
    {
        path: 'blade-status',
        component: BladeStatusComponent,

    },
    {
        path: 'allocation-status',
        component: AllocationStatusComponent,

    },
    {
        path: 'CCS-Vps-status',
        component: CCsVPsStatusComponent,

    },
    {
        path: 'vms-status',
        component: VMsStatusComponent,

    },
    {
        path: 'mang-server',
        component: NsmManageComponent,

    },
    {
        path: 'mang-vendor',
        component: MangVendersComponent,

    },
    {
        path: 'mang-team',
        component: MangTeamComponent,

    },
    {
        path: 'mang-channel',
        component: MangChannelComponent,

    },
    {
        path: 'mang-location',
        component: MangLocationComponent,

    }, 
    {
        path: 'project-allocation',
        component: ProjectAllocationComponent,

    },

]



@NgModule({
    declarations: [HomeNsmComponent, NsmlogsComponent, NsmServersComponent, NsmProjectsComponent, NsmVendersComponent,
         NsmManageComponent, NsmBladesComponent, BladeStatusComponent, AllocationStatusComponent, VMsStatusComponent, 
         CCsVPsStatusComponent, MangVendersComponent, MangTeamComponent, MangChannelComponent, MangLocationComponent, ProjectAllocationComponent],
    imports: [
        imports,
        RouterModule.forChild(routes) ,
        // AgmCoreModule.forRoot({
        //     apiKey: "your API key here"
        // })
    ],
    exports: [
        RouterModule
    ]
})
export class homeNsmModule { }
