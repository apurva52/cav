import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogstabComponent } from './logstab.component';
import { Routes, RouterModule } from '@angular/router';
import { AutoCompleteModule,BreadcrumbModule, ButtonModule, CardModule, ChipsModule, DropdownModule, InputTextModule, MenuModule, OverlayPanelModule, TableModule, TabMenuModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { LogIntegrationModule } from './log-integration/log-integration.module';
import { SaveDialogModule } from 'src/app/shared/save-dialog/save-dialog.module';
import { VisualChartModule } from 'src/app/shared/visualization/visual-chart/visual-chart.module';
import { VisualTableModule } from 'src/app/shared/visualization/visual-table/visual-table.module';
import { VisualStatisticsModule } from 'src/app/shared/visualization/visual-statistics/visual-statistics.module';
import { VisualRequestModule } from 'src/app/shared/visualization/visual-request/visual-request.module';
import { VisualResponseModule } from 'src/app/shared/visualization/visual-response/visual-response.module';
import { CommonfilterModule } from 'src/app/shared/search-sidebar/commonfilter/commonfilter.module';
import { LogDetailsComponent } from './log-details/log-details.component';
import { LogDetailsModule } from './log-details/log-details.module';
import { NoResultFoundComponent } from './no-result-found/no-result-found.component';


const imports = [
  CommonModule,
  InputTextModule,
  TooltipModule,
  AutoCompleteModule,
  ButtonModule,
  FormsModule,
  CardModule,
  DropdownModule,
  LogIntegrationModule,
  ChipsModule,
  TabMenuModule,
  MenuModule,
  SaveDialogModule,
  VisualChartModule,
  VisualStatisticsModule,
  VisualTableModule,
  VisualRequestModule,
  VisualResponseModule,
  CommonfilterModule,
  SaveDialogModule,
  LogDetailsModule,
  TableModule,
  OverlayPanelModule,
  BreadcrumbModule
];

const components = [
  LogstabComponent
];

const routes: Routes = [
  {
    path: 'logs',
    component: LogstabComponent,
    children: [
      {
        path: 'log-details',
        loadChildren: () => import('./log-details/log-details.module').then(m => m.LogDetailsModule),
        component: LogDetailsComponent
      },
    ]
  }
];

@NgModule({
  declarations: [components, NoResultFoundComponent],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class LogstabModule { }