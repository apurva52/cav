import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { AgentInfoComponent } from './agent-info.component';
import { RouterModule, Routes } from '@angular/router';
import { AccordionModule, BlockUIModule, BreadcrumbModule, ButtonModule, ChipsModule, DialogModule, DropdownModule, MultiSelectModule, ProgressBarModule, TableModule, TabMenuModule, ToastModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
// import { MachineAgentComponent } from './machine-agent/machine-agent.component';
// import { ApplicationAgentComponent } from './application-agent/application-agent.component';
// import { MachineAgentModule } from './machine-agent/machine-agent.module';
// import { ApplicationAgentModule } from './application-agent/application-agent.module';
import { CavNdAgentComponent } from './cav-nd-agent.component';
import { FormsModule } from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';


const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule,
  TableModule,
  AccordionModule,
  ToastModule,
  MultiSelectModule,
  DialogModule,
  DropdownModule,
  FormsModule,
  InputTextModule,
  ChipsModule,
  BlockUIModule,
  ProgressBarModule
  // MachineAgentModule,
  // ApplicationAgentModule
];


const components = [
  CavNdAgentComponent
];

const routes: Routes = [
  {
    path: 'nd-agent-info',
    component: CavNdAgentComponent,
    // children: [
    //   {
    //     path: '',
    //     redirectTo: 'machine-agent',
    //     pathMatch: 'full',
    //   },
      // {
      //   path: 'machine-agent',
      //   loadChildren: () => import('./machine-agent/machine-agent.module').then(m => m.MachineAgentModule),
      //   component: MachineAgentComponent
      // },
      // {
      //   path: 'application-agent',
      //   loadChildren: () => import('./application-agent/application-agent.module').then(m => m.ApplicationAgentModule),
      //   component: ApplicationAgentComponent
      // },
      
    // ]
  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CavNdAgentModule { }
