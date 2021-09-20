import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TreeTableModule } from 'primeng/treetable';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { DropdownModule } from 'primeng/dropdown';
import { EnvironmentNodeComponent } from './enterprise-node.component';
import { TabViewModule } from 'primeng/tabview';
import { TableModule, CardModule, ButtonModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, SlideMenuModule, MenuModule, InputTextModule, ToolbarModule, OverlayPanelModule, DialogModule, OrderListModule, PasswordModule,} from 'primeng';

import { FormsModule } from '@angular/forms';

const components = [EnvironmentNodeComponent];

const imports = [
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
  TabViewModule
  
];
const routes: Routes = [
    {
      path: 'enterprise-node',
      component: EnvironmentNodeComponent
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

export class   EnvironmentNodeModule { } 
