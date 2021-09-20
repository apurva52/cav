import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizationComponent } from './visualization.component';
import { RouterModule, Routes } from '@angular/router';
import { AutoCompleteModule, BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, OrderListModule, TableModule, ToolbarModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { CommonfilterModule } from 'src/app/shared/search-sidebar/commonfilter/commonfilter.module';
import { SaveDialogModule } from 'src/app/shared/save-dialog/save-dialog.module';
//import { CreateVisualizationSubComponent } from './create-visualization-sub/create-visualization-sub.component';
//import { CreateVisualizationSubModule } from './create-visualization-sub/create-visualization-sub.module';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  BreadcrumbModule,
  MessageModule,
  OrderListModule,
  ButtonModule,
  CardModule,
  InputTextModule,
  TooltipModule,
  ChartModule,
  AutoCompleteModule,
  FormsModule,
  CommonfilterModule,
  SaveDialogModule,
  DialogModule,
  CheckboxModule,
  MenuModule
];
const components = [
  VisualizationComponent
];
const routes: Routes = [
  {
    path: 'visualization',
    component: VisualizationComponent
  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class VisualizationModule { }
