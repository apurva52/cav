import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestReportComponent } from './test-report.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, TableModule, ToolbarModule, TooltipModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { AddActionModule } from 'src/app/pages/my-library/alert/alert-actions/add-action/add-action.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { TestCasesComponent } from './test-cases/test-cases.component';
import { TestCasesModule } from './test-cases/test-cases.module';

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
  MenuModule,
  InputTextModule,
  HeaderModule,
  ToolbarModule,
  BreadcrumbModule,
  TestCasesModule
]

const components = [TestReportComponent];

const routes: Routes = [
  {
    path: 'test-report',
    component: TestReportComponent,
    children: [
      {
        path: '',
        redirectTo: 'test-report',
        pathMatch: 'full',
      },
      {
        path: 'test-cases',
        loadChildren: () =>
          import('./test-cases/test-cases.module').then(
            (m) => m.TestCasesModule
          ),
        component: TestCasesComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [components,],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestReportModule { }
