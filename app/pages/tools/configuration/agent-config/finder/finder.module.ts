import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinderComponent } from './finder.component';
import { AutoInstrumentModule } from './auto-instrument/auto-instrument.module';
import { AutoDiscoverModule } from './auto-discover/auto-discover.module';
import { TabViewModule } from 'primeng';
import { RouterModule, Routes } from '@angular/router';
import { AutoInstrumentComponent } from './auto-instrument/auto-instrument.component';
import { AutoDiscoverComponent } from './auto-discover/auto-discover.component';

const imports = [
  CommonModule,
  CommonModule,
  TabViewModule,
  AutoInstrumentModule,
  AutoDiscoverModule,
];

const components = [FinderComponent];

const routes: Routes = [
  {
    path: 'finder',
    component: FinderComponent,
    children: [
      {
        path: 'auto-instrument',
        redirectTo: 'auto',
        pathMatch: 'full',
      },
      {
        path: 'auto-instrument',
        loadChildren: () =>
          import('./auto-instrument/auto-instrument.module').then(
            (m) => m.AutoInstrumentModule
          ),
        component: AutoInstrumentComponent,
      },
      {
        path: 'auto-discover',
        loadChildren: () =>
          import('./auto-discover/auto-discover.module').then(
            (m) => m.AutoDiscoverModule
          ),
        component: AutoDiscoverComponent,
      },
    ],
  },
];
@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinderModule {}
