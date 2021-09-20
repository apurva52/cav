import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TableModule, CardModule, ButtonModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, SlideMenuModule, MenuModule, InputTextModule, ToolbarModule, BreadcrumbModule, DropdownModule, SplitButtonModule, OverlayPanelModule, AutoCompleteModule, TabViewModule, AccordionModule, TabMenuModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { CreateVisualizationComponent } from './create-visualization.component';
import { IntegrationModule } from './integration/integration.module';
import { VisualizationModule } from '../my-library/visualization/visualization.module';
import { LogTableModule } from './log-table/log-table.module';
import { VisualChartModule } from 'src/app/shared/visualization/visual-chart/visual-chart.module';
import { VisualRequestModule } from 'src/app/shared/visualization/visual-request/visual-request.module';
import { VisualResponseModule } from 'src/app/shared/visualization/visual-response/visual-response.module';
import { VisualStatisticsModule } from 'src/app/shared/visualization/visual-statistics/visual-statistics.module';
import { VisualTableModule } from 'src/app/shared/visualization/visual-table/visual-table.module';
import { SaveDialogModule } from 'src/app/shared/save-dialog/save-dialog.module';
import { CommonfilterModule } from 'src/app/shared/search-sidebar/commonfilter/commonfilter.module';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,    
  PipeModule,
  SlideMenuModule,
  MenuModule,
  InputTextModule,
  HeaderModule,
  ToolbarModule,
  BreadcrumbModule,
  DropdownModule,
  SplitButtonModule,
  OverlayPanelModule,
  AutoCompleteModule,
  TabViewModule,
  TabMenuModule,
  IntegrationModule,
  VisualizationModule,
  LogTableModule,
  VisualChartModule,
  VisualStatisticsModule,
  VisualTableModule,
  VisualRequestModule,
  VisualResponseModule,
  SaveDialogModule,
  CommonfilterModule
];

const components = [CreateVisualizationComponent];

const routes: Routes = [
  {
    path: 'create-visualization',
    component: CreateVisualizationComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class CreateVisualizationModule { }
