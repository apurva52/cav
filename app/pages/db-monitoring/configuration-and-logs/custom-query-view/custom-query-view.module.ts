import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, RadioButtonModule, RatingModule, TableModule, TabMenuModule, ToolbarModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { CommonStatsFilterModule } from '../../shared/common-stats-filter/common-stats-filter.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { CustomQueryComponent } from '../custom-query/custom-query.component';
import { CustomQueryViewComponent } from './custom-query-view.component';
import { CustomQueryModule } from '../custom-query/custom-query.module';
import { ProcedureNameModule } from '../procedure-name/procedure-name.module';
import { ProcedureNameComponent } from '../procedure-name/procedure-name.component';

const imports = [
  CommonModule,
  TabMenuModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  CardModule,
  FormsModule,
  DropdownModule,
  CheckboxModule,
  TableModule,
  MultiSelectModule,
  MenuModule,
  TooltipModule,
  RadioButtonModule,
  RatingModule,
  CommonStatsFilterModule,
  PipeModule,
  CustomQueryModule,
  ProcedureNameModule,
  PanelModule
]

const components = [CustomQueryViewComponent];


const routes: Routes = [
    {
      path: 'custom-query-view',
      component: CustomQueryViewComponent,
      children: [
        {
          path: '',
          redirectTo: 'custom-query',
          pathMatch: 'full',
        },
        {
          path: 'custom-query',
          loadChildren: () =>
            import('../custom-query/custom-query.module').then(
              (m) => m.CustomQueryModule
            ),
          component: CustomQueryComponent
        },
        {
          path: 'procedure-name',
          loadChildren: () =>
            import('../procedure-name/procedure-name.module').then(
              (m) => m.ProcedureNameModule
            ),
          component: ProcedureNameComponent
        },
      ]
    },
  ];

@NgModule({
  declarations: [components,],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule,components],
})

export class CustomQueryViewModule { }
