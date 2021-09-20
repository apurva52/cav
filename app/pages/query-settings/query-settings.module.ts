import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuerySettingsComponent } from './query-settings.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { BreadcrumbModule, MessagesModule, ButtonModule, CardModule, CheckboxModule,InputNumberModule, DialogModule, DropdownModule, InputTextModule, MessageModule, PasswordModule, RadioButtonModule, TableModule, ToolbarModule, ToastModule } from 'primeng';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const imports = [
  CommonModule,
  ReactiveFormsModule,
  InputTextModule,
  ButtonModule,
  PasswordModule,
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
  InputNumberModule,
  MessagesModule,
  ToastModule
]

const components = [
  QuerySettingsComponent
];

const routes: Routes = [
  {
    path: 'query-settings',
    component: QuerySettingsComponent
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

export class QuerySettingsModule { }
