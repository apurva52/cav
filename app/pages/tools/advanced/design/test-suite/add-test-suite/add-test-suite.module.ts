import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTestSuiteComponent } from './add-test-suite.component';
import {
  DialogModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  CardModule,
  DropdownModule,
  OrderListModule,
  InputTextareaModule,
  RadioButtonModule,
  TabMenuModule,
  MessageModule,
  AccordionModule,
  TreeModule,
} from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';

const components = [AddTestSuiteComponent];

const imports = [
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  DropdownModule,
  FormsModule,
  OrderListModule,
  CardModule,
  InputTextareaModule,
  RadioButtonModule,
  CardModule,
  TabMenuModule,
  MessageModule,
  AccordionModule,
  TreeModule,
];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})

export class AddTestSuiteModule { }
