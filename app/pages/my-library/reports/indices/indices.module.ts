import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicesComponent } from './indices.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, DropdownModule, MessageModule, OrderListModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  BreadcrumbModule,
  CardModule,
  MessageModule,
  OrderListModule,
  CheckboxModule,
  DropdownModule,
  ButtonModule
];
const components = [
  IndicesComponent
];
const routes: Routes = [
  {
    path: 'select-indices',
    component: IndicesComponent
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
export class IndicesModule { }
