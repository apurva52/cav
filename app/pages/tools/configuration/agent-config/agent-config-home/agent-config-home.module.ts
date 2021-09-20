import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentConfigHomeComponent } from './agent-config-home.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CardModule, TableModule, TooltipModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  TooltipModule,
  FormsModule
];

const components = [
  AgentConfigHomeComponent
];
const routes: Routes = [
  {
    path: 'agent-config-home',
    component: AgentConfigHomeComponent,
  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule,components
  ]
})
export class AgentConfigHomeModule { }
