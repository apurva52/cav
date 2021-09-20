import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCustomUxReportComponent } from './add-custom-ux-report.component';
import { RouterModule, Routes } from '@angular/router';
import { AccordionModule, BreadcrumbModule, ButtonModule, CheckboxModule, DropdownModule, InputTextModule, RadioButtonModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  BreadcrumbModule,
  ButtonModule,
  InputTextModule,
  DropdownModule,
  CheckboxModule,
  RadioButtonModule,
  AccordionModule
];

const components = [
  AddCustomUxReportComponent
];
const routes: Routes = [
  {
    path: 'add-custom-ux-report',
    component: AddCustomUxReportComponent
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

export class AddCustomUxReportModule { }
