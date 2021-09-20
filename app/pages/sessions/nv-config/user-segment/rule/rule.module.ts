import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RuleComponent } from './rule.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  InputTextModule,
  ButtonModule,
  MessageModule,
  DialogModule,
  ToolbarModule,
  CardModule,
  DropdownModule,
  CheckboxModule,
  RadioButtonModule,
  TableModule,
  MultiSelectModule,
  MenuModule,
  TooltipModule,
} from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { RouterModule, Routes } from '@angular/router';
import { RuleCrudModule } from '../../dialog/rule-crud/rule-crud.module';
import { DeleteEntryModule } from '../../dialog/delete-entry/delete-entry.module';

const components = [RuleComponent];

const routes: Routes = [
  {
    path: 'rule',
    component: RuleComponent,
  },
];

const imports = [
  CommonModule,
  RuleCrudModule,
  ReactiveFormsModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  DialogModule,
  HeaderModule,
  ToolbarModule,
  CardModule,
  FormsModule,
  DropdownModule,
  CheckboxModule,
  RadioButtonModule,
  TableModule,
  DeleteEntryModule,
  MenuModule,
  MultiSelectModule,
  TooltipModule
];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule, components],
})
export class RuleModule {}
