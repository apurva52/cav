import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowmapsManagementComponent } from './flowmaps-management.component';
import { RouterModule, Routes } from '@angular/router';
import { ToolbarModule, ButtonModule, DropdownModule, TableModule, MenuModule, CardModule, CheckboxModule, BreadcrumbModule, TooltipModule, InputTextModule, MessageModule, MultiSelectModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'flowmaps',
    component: FlowmapsManagementComponent,
  },
];

const components = [FlowmapsManagementComponent];

const imports = [
  HeaderModule,
  ToolbarModule,
  ButtonModule,
  DropdownModule,
  FormsModule,
  TableModule,
  CardModule,
  CheckboxModule,
  BreadcrumbModule,
  TooltipModule,
  InputTextModule,
  MessageModule,
  MultiSelectModule,
  MenuModule,
];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})

export class FlowmapsManagementModule { }
