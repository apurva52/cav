import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoalinvariationComponent } from './goalinvariation.component';
import { BreadcrumbModule, ToastModule, ToggleButtonModule, ButtonModule, CardModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, RadioButtonModule, TableModule, TabMenuModule, ToolbarModule, TooltipModule } from 'primeng';
const imports = [
  CommonModule,
  ToolbarModule,
  ButtonModule,
  ToggleButtonModule,
  BreadcrumbModule,
  TabMenuModule,
  InputTextModule,
  MessageModule,
  DialogModule,
  ToastModule,
  CardModule,
  FormsModule,
  DropdownModule,
  CheckboxModule,
  TableModule,
  MultiSelectModule,
  MenuModule,
  TooltipModule,
  RadioButtonModule,
  PanelModule
]
const components = [GoalinvariationComponent];

@NgModule({
  declarations: [components,],
  imports: [imports],
  exports: [components],

})
export class GoalinvariationModule { }


