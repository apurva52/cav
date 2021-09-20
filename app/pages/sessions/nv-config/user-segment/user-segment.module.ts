import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSegmentComponent } from './user-segment.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  InputTextModule,
  ButtonModule,
  MessageModule,
  MessagesModule,
  DialogModule,
  ToolbarModule,
  CardModule,
  DropdownModule,
  CheckboxModule,
  RadioButtonModule,
  TableModule,
  BreadcrumbModule,
  MultiSelectModule,
  MenuModule,
  TooltipModule,
} from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { UserSegmentCrudModule } from '../dialog/user-segment-crud/user-segment-crud.module';
import { RouterModule, Routes } from '@angular/router';
import { RuleComponent } from './rule/rule.component';
import { RuleModule } from './rule/rule.module';
import { DeleteEntryModule } from '../dialog/delete-entry/delete-entry.module';
import { RuleCrudModule } from '../dialog/rule-crud/rule-crud.module';
const routes: Routes = [
  {
    path: 'user-segment',
    children: [
      {
        path: '',
        redirectTo: 'user-segment',
        pathMatch: 'full',
      },
      {
        path: 'user-segment',
        component: UserSegmentComponent,
      },
      {
        path: 'rule',
        loadChildren: () =>
          import('./rule/rule.module').then((m) => m.RuleModule),
        component: RuleComponent,
      },
    ],
  },
];

const imports = [
  CommonModule,
  RuleCrudModule,
  RuleModule,
  MessagesModule,
  UserSegmentCrudModule,
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
  BreadcrumbModule,
  DeleteEntryModule,
  MenuModule,
  MultiSelectModule,
  TooltipModule
];

@NgModule({
  declarations: [UserSegmentComponent],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class UserSegmentModule { }
