import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorManagementComponent } from './color-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ToolbarModule, ButtonModule, CardModule, CheckboxModule, MultiSelectModule, InputTextModule, RadioButtonModule, DropdownModule, PanelModule, InputTextareaModule, BreadcrumbModule, MenuModule, InputSwitchModule, FieldsetModule, TableModule, ToastModule, MessageModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { AutoGenarageColorManagementModule } from './auto-genarage-color-management/auto-genarage-color-management.module';
import { AutoGenarageColorManagementComponent } from './auto-genarage-color-management/auto-genarage-color-management.component';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  CardModule,
  CheckboxModule,
  MultiSelectModule,
  InputTextModule,
  DropdownModule,
  BreadcrumbModule,
  MenuModule,
  FormsModule,
  TableModule,
  PipeModule,
  MessageModule,
  AutoGenarageColorManagementModule
];

const components = [ColorManagementComponent];


const routes: Routes = [
  {
    path: 'color-management',
    component: ColorManagementComponent,
    children: [
      {
       path: 'auto-generate',
       loadChildren: () =>
       import('./auto-genarage-color-management/auto-genarage-color-management.module').then((m) => m.AutoGenarageColorManagementModule),
       component: AutoGenarageColorManagementComponent
      }
    ],
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
export class ColorManagementModule { }
