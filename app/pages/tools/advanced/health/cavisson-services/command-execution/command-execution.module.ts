import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandExecutionComponent } from './command-execution.component';
import { RouterModule, Routes } from '@angular/router';
import { SidebarModule, TooltipModule } from 'primeng';

const imports = [
  CommonModule,
  TooltipModule,
  SidebarModule
];

const components = [CommandExecutionComponent];

const routes: Routes = [
  {
    path: 'command-execution',
    component: CommandExecutionComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})
export class CommandExecutionModule { }
