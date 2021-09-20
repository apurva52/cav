import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewCommandComponent } from './new-command/new-command.component';
import { CommandListComponent } from './command-list/command-list.component';
import { ScheduledCommandComponent } from './scheduled-command/scheduled-command.component';
import { Routes, RouterModule } from '@angular/router';
import { MenuModule, TabMenuModule, ButtonModule, TooltipModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ActionRunCommandComponent } from './action-run-command.component';
import { CommandListModule } from './command-list/command-list.module';

const routes: Routes = [
  {
    path: 'ac-run-command',
    component: ActionRunCommandComponent,
    children: [
      {
        path: '',
        redirectTo: 'new-command',
        pathMatch: 'full',
      },
      {
        path: 'new-command',
        loadChildren: () =>
          import('./new-command/new-command.module').then(
            (m) => m.NewCommandModule
          ),
        component: NewCommandComponent,
      },
      {
        path: 'command-list',
        loadChildren: () =>
          import('./command-list/command-list.module').then(
            (m) => m.CommandListModule
          ),
        component: CommandListComponent,
      },
      {
        path: 'scheduled-command',
        loadChildren: () =>
          import('./scheduled-command/scheduled-command.module').then(
            (m) => m.ScheduledCommandModule
          ),
        component: ScheduledCommandComponent,
      },
    ],
  },
];

const imports = [
  CommonModule,
  MenuModule,
  TabMenuModule,
  ButtonModule,
  TooltipModule,
  ToolbarModule,
  HeaderModule,
  CommandListModule
];

const components = [ActionRunCommandComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class ActionRunCommandModule {}
