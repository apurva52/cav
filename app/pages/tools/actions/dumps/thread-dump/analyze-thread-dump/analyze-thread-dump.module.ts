import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyzeThreadDumpComponent } from './analyze-thread-dump.component';
import { StateComponent } from './state/state.component';
import { CategoryComponent } from './category/category.component';
import { Routes, RouterModule } from '@angular/router';
import {
  MenuModule,
  TabMenuModule,
  ButtonModule,
  TooltipModule,
  ToolbarModule,
  TableModule,
  AccordionModule,
  DialogModule,
  CalendarModule,
  TabViewModule,
} from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { CommanMethodsComponent } from './comman-methods/comman-methods.component';
import { MostUsedMethodsModule } from './most-used-methods/most-used-methods.module';
import { MostUsedMethodsComponent } from './most-used-methods/most-used-methods.component';
import { ThredGroupsModule } from './thred-groups/thred-groups.module';
import { ThredGroupsComponent } from './thred-groups/thred-groups.component';
import { DeadlocksComponent } from './deadlocks/deadlocks.component';
import { HotstacksModule } from './hotstacks/hotstacks.module';
import { HotstacksComponent } from './hotstacks/hotstacks.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'analyze-thread',
    component: AnalyzeThreadDumpComponent,
    children: [
      {
        path: '',
        redirectTo: 'state',
        pathMatch: 'full',
      },
      {
        path: 'state',
        loadChildren: () =>
          import('./state/state.module').then((m) => m.StateModule),
        component: StateComponent,
      },
      {
        path: 'category',
        loadChildren: () =>
          import('./category/category.module').then((m) => m.CategoryModule),
        component: CategoryComponent,
      },
      {
        path: 'common-methods',
        loadChildren: () =>
          import('./comman-methods/comman-methods.module').then((m) => m.CommanMethodsModule),
        component: CommanMethodsComponent,
      },
      {
        path: 'most-used-methods',
        loadChildren: () =>
          import('./most-used-methods/most-used-methods.module').then((m) => m.MostUsedMethodsModule),
        component: MostUsedMethodsComponent,
      },
      {
        path: 'thread-groups',
        loadChildren: () =>
          import('./thred-groups/thred-groups.module').then((m) => m.ThredGroupsModule),
        component: ThredGroupsComponent,
      },
      {
        path: 'deadlocks',
        loadChildren: () =>
          import('./deadlocks/deadlocks.module').then((m) => m.DeadlocksModule),
        component: DeadlocksComponent,
      },
      {
        path: 'hotstacks',
        loadChildren: () =>
          import('./hotstacks/hotstacks.module').then((m) => m.HotstacksModule),
        component: HotstacksComponent,
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
  TableModule,
  AccordionModule,
  DialogModule,
  CalendarModule,
  HighchartsChartModule,
  FormsModule,
  TabViewModule
];

const components = [AnalyzeThreadDumpComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule, components],
})
export class AnalyzeThreadDumpModule {}
