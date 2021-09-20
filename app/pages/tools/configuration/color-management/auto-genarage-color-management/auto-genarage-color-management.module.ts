import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoGenarageColorManagementComponent } from './auto-genarage-color-management.component';
import { Routes, RouterModule } from '@angular/router';
import { ToolbarModule, ButtonModule, BreadcrumbModule, OrderListModule, CheckboxModule, MenuModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';


const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  OrderListModule,
  CheckboxModule,
  FormsModule,
  MenuModule
];

const components = [AutoGenarageColorManagementComponent];


const routes: Routes = [
  {
    path: 'auto-generate',
    component: AutoGenarageColorManagementComponent,
  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)       
  ],
  exports: [
    components, RouterModule
  ]
})
export class AutoGenarageColorManagementModule { }
