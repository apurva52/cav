import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentConfigApplicationComponent } from './agent-config-application.component';
import { RouterModule, Routes } from '@angular/router';
import { CardModule, ButtonModule, CheckboxModule, MultiSelectModule, FieldsetModule, RadioButtonModule, DropdownModule, TabViewModule, BreadcrumbModule, DialogModule, InputTextModule, MenuModule, MessageModule, TableModule, ToolbarModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { NdSettingModule } from '../agent-config-home/application-list/nd-setting/nd-setting.module';
import { NdSettingComponent } from '../agent-config-home/application-list/nd-setting/nd-setting.component';


const imports = [
  CommonModule,
  ButtonModule,  
  MessageModule,
  TooltipModule,
  NdSettingModule
];

const components = [AgentConfigApplicationComponent];

const routes: Routes = [
  {
    path: 'agent-config-application',
    children: [
      {
        path: '',
        redirectTo: 'agent-config-application',
        pathMatch: 'full',
      },
      {
        path: 'agent-config-application',
        component: AgentConfigApplicationComponent,
      },
      {
        path: 'nd-setting',
        loadChildren: () =>
          import('../agent-config-home/application-list/nd-setting/nd-setting.module').then((m) => m.NdSettingModule),
        component: NdSettingComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AgentConfigApplicationModule { }
