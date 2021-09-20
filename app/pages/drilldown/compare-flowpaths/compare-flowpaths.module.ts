import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompareFlowpathsComponent } from './compare-flowpaths.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, MessageModule, TableModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';

const imports = [
  HeaderModule,
  CommonModule,
  ToolbarModule,
  BreadcrumbModule,
  ButtonModule,
  TableModule,
  CardModule,
  MessageModule
];

const components = [CompareFlowpathsComponent];

const routes: Routes = [
  {
    path: 'compare-flowpaths',
    component: CompareFlowpathsComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class CompareFlowpathsModule { }
