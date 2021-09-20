import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopologyManagementComponent } from './topology-management.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ToolbarModule, ButtonModule, CardModule, CheckboxModule, InputTextModule, RadioButtonModule, DropdownModule, PanelModule, BreadcrumbModule, TreeModule, PasswordModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';


const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  CardModule,
  CheckboxModule,  
  InputTextModule,
  RadioButtonModule,
  DropdownModule,
  PanelModule,  
  BreadcrumbModule,
  FormsModule,
  TreeModule,
  PasswordModule
];

const components = [TopologyManagementComponent];


const routes: Routes = [
  {
    path: 'topology-management',
    component: TopologyManagementComponent,
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
export class TopologyManagementModule { }
