import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionsComponent } from './actions.component';
import { RouterModule, Routes } from '@angular/router';
import { DumpsComponent } from './dumps/dumps.component';
import { DumpsModule } from './dumps/dumps.module';
import { MissionControlComponent } from './mission-control/mission-control.component';
import { MissionControlModule } from './mission-control/mission-control.module';
import { ActionRunCommandModule } from './action-run-command/action-run-command.module';
import { ActionRunCommandComponent } from './action-run-command/action-run-command.component';
import { GcManagerComponent } from './gcManager/gcManager.component';
import { GcViewerComponent } from './gcViewer/gcViewer.component';
import { MutexLockSessionsComponent } from './mutex-lock-sessions/mutex-lock-sessions.component';
import { MemoryProflingSessionsComponent } from './memory-profiling-sessions/memory-profiling-sessions.component';

const routes: Routes = [
  {
    path: 'actions',
    component: ActionsComponent,
    children: [
      {
        path: '',
        redirectTo: '/dumps',
        pathMatch: 'full',
      },
      {
        path: 'dumps',
        loadChildren: () =>
          import('./dumps/dumps.module').then((m) => m.DumpsModule),
        component: DumpsComponent,
      },
      {
        path: 'mission-control',
        loadChildren: () =>
          import('./mission-control/mission-control.module').then(
            (m) => m.MissionControlModule
          ),
        component: MissionControlComponent,
      },
      {
        path: 'ac-run-command',
        loadChildren: () =>
          import('./action-run-command/action-run-command.module').then(
            (m) => m.ActionRunCommandModule
          ),
        component: ActionRunCommandComponent,
      },
      {
        path: 'gc-manager',
        loadChildren: () =>
          import('./gcManager/gc-manager.module').then((m) => m.GCManagerModule),
        component: GcManagerComponent,
      },
      {
        path: 'gc-viewer',
        loadChildren: () =>
          import('./gcViewer/gc-viewer.module').then((m) => m.GCViewerModule),
        component: GcViewerComponent,
      },
	//Memory Profiler and Mutex Lock has been moved from nd-config module to actions module and can be accessed using the actions section in the themes menu.
      {
        path: 'mutex-lock',
        loadChildren: () =>
          import('./mutex-lock-sessions/mutex-lock-sessions.module').then((m) => m.MutexLockSessionsModule),
        component: MutexLockSessionsComponent,
      },
      {
        path: 'memory-profiler',
        loadChildren: () =>
          import('./memory-profiling-sessions/memory-profiling-sessions.module').then((m) => m.MemoryProfilingSessionsModule),
        component: MemoryProflingSessionsComponent,
      },
    ],
  },
];

const imports = [
  CommonModule,
  DumpsModule,
  MissionControlModule,
  ActionRunCommandModule,
  
];

const components = [ActionsComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class ActionsModule {}
