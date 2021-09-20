import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TreeTableModule } from 'primeng/treetable';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { DropdownModule } from 'primeng/dropdown';
import { ProjectAccountManagementComponent } from './project-account-management.component';
import { TableModule, CardModule, ButtonModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, SlideMenuModule, MenuModule, ToolbarModule, OverlayPanelModule, DialogModule, OrderListModule, PasswordModule,} from 'primeng';
import {SplitButtonModule} from 'primeng/splitbutton';
import {InputTextModule} from 'primeng/inputtext';

import { FormsModule } from '@angular/forms';
import { DynamicFormModule } from 'src/app/shared/dynamic-form/dynamic-form.module';

const components = [ProjectAccountManagementComponent];

const imports = [
  DynamicFormModule,
  RouterModule,
  CommonModule,
  HttpClientModule,
  TreeTableModule,
  DropdownModule,
  TableModule,
  ButtonModule,
  CardModule,
  CheckboxModule,
  MultiSelectModule,
  SlideMenuModule,
  MenuModule,
  ToolbarModule,
  OverlayPanelModule,
  DialogModule,
  MessageModule,
  InputTextModule,
  OrderListModule,
  PasswordModule,
  FormsModule,
  TooltipModule,
  HeaderModule,
  SplitButtonModule
];
const routes: Routes = [
    {
      path: 'project-account-management',
      component: ProjectAccountManagementComponent
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

export class   ProjectAccountManagementModule { } 
