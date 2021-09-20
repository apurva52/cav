import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestSuiteComponent } from './test-suite.component';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, RadioButtonModule, TableModule, ToolbarModule, TooltipModule } from 'primeng';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AddTestSuiteModule } from './add-test-suite/add-test-suite.module';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  DialogModule,
  CardModule,
  FormsModule,
  DropdownModule,
  CheckboxModule,
  TableModule,
  MultiSelectModule,
  MenuModule,
  BreadcrumbModule,
  TooltipModule,
  RadioButtonModule,
  AddTestSuiteModule
];

const components = [TestSuiteComponent];


const routes: Routes = [
{
  path: 'scenarios',
  component: TestSuiteComponent,
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


export class TestSuiteModule { }
