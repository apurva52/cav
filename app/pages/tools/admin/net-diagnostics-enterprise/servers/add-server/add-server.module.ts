import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddServerComponent } from './add-server.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, DropdownModule, InputTextModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  BreadcrumbModule,
  InputTextModule,
  ButtonModule,
  CardModule,
  DropdownModule
];
const components = [
  AddServerComponent
];
const routes: Routes = [
  {
    path: 'add-server',
    component: AddServerComponent
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
  ],  
})
export class AddServerModule { }
