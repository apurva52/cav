import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionsComponent } from './sessions.component';
import { RouterModule, Routes } from '@angular/router';
import { NvConfigComponent } from './nv-config/nv-config.component';
import { NvConfigModule } from './nv-config/nv-config.module';

const imports = [CommonModule, NvConfigModule];

const components = [SessionsComponent];

const routes: Routes = [
  {
    path: 'sessions',
    component: SessionsComponent,
    children: [
      {
        path: '',
        redirectTo: 'nv-config',
        pathMatch: 'full',
      },
      {
        path: 'nv-config',
        loadChildren: () =>
          import('./nv-config/nv-config.module').then((m) => m.NvConfigModule),
        component: NvConfigComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionsModule {}
