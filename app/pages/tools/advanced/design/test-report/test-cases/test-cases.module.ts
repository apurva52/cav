import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestCasesComponent } from './test-cases.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, TableModule, ToolbarModule, TooltipModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import { PrePostLogModule } from './pre-post-log/pre-post-log.module';
import { TestRunReportModule } from './test-run-report/test-run-report.module';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  MessageModule,
  TooltipModule,
  MultiSelectModule,
  MenuModule, 
  InputTextModule,
  HeaderModule,
  ToolbarModule,
  BreadcrumbModule,
  FormsModule,
  PrePostLogModule,
  TestRunReportModule
]

const components = [TestCasesComponent];

const routes: Routes = [
  {
    path: 'test-cases',
    component: TestCasesComponent,
  },
];

@NgModule({
  declarations: [components,],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestCasesModule { }
