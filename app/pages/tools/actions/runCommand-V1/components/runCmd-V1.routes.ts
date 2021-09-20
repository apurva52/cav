import { Routes } from '@angular/router';
import { RunCommandV1Component } from '../runCmd-V1.component';
import { RunCmdMainComponent } from './runCmd-main-component/runCmd-main.component';
import { EditCmdComponent } from './runCmd-editCmd-component/runCmd-editCmd.component';

export const APP_ROUTES: Routes = [
  {
    path: 'run-command-V1', component: RunCommandV1Component,
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main', component: RunCmdMainComponent },
      { path: 'EditMode', component: EditCmdComponent }
    ]
  }
];