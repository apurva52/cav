import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentInfoComponent } from './agent-info.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, TabMenuModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { MachineAgentComponent } from './machine-agent/machine-agent.component';
import { ApplicationAgentComponent } from './application-agent/application-agent.component';
import { MachineAgentModule } from './machine-agent/machine-agent.module';
import { ApplicationAgentModule } from './application-agent/application-agent.module';


const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule,
  MachineAgentModule,
  ApplicationAgentModule
];


const components = [
  AgentInfoComponent
];

const routes: Routes = [
  {
    path: 'agent-info',
    component: AgentInfoComponent,
    children: [
      {
        path: '',
        redirectTo: 'machine-agent',
        pathMatch: 'full',
      },
      {
        path: 'machine-agent',
        loadChildren: () => import('./machine-agent/machine-agent.module').then(m => m.MachineAgentModule),
        component: MachineAgentComponent
      },
      {
        path: 'application-agent',
        loadChildren: () => import('./application-agent/application-agent.module').then(m => m.ApplicationAgentModule),
        component: ApplicationAgentComponent
      },
      
    ]
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
export class AgentInfoModule { }
