import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfigureSidebarComponent } from './configure-sidebar.component';
import { ButtonModule, CardModule, CheckboxModule, DropdownModule, InputTextModule, MultiSelectModule, SidebarModule, TableModule, ToastModule, TooltipModule } from 'primeng';

const imports = [
  ToastModule,
  CommonModule,
  FormsModule,
  DropdownModule,
  SidebarModule,
  DropdownModule,
  ButtonModule,
  CheckboxModule,
  TableModule,
  CardModule,
  TooltipModule,
  InputTextModule,
  MultiSelectModule
];

const components = [
  ConfigureSidebarComponent
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [
    components
  ]
})
export class ConfigureSidebarModule { }
