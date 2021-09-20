import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateVisualizationSubComponent } from './create-visualization-sub.component';
import { AutoCompleteModule, BreadcrumbModule, ButtonModule, CardModule, InputTextModule, MenuModule, MessageModule, OrderListModule, TableModule, ToolbarModule, TooltipModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonfilterModule } from 'src/app/shared/search-sidebar/commonfilter/commonfilter.module';
import { SaveDialogModule } from 'src/app/shared/save-dialog/save-dialog.module';



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
  AutoCompleteModule,
  FormsModule,
  TableModule,
  CommonfilterModule,
  SaveDialogModule,
  MenuModule
];
const components = [
  CreateVisualizationSubComponent
];
const routes: Routes = [
  {
    path: 'create-visualization-sub',
    component: CreateVisualizationSubComponent
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
export class CreateVisualizationSubModule { }
