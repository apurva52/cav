import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldsetModule, TableModule, InputSwitchModule, CheckboxModule, CardModule, ToastModule, DialogModule, MessageModule, ConfirmDialogModule, TooltipModule, MultiSelectModule, MenuModule, DropdownModule, InputTextModule, ButtonModule, SlideMenuModule } from 'primeng';
import { FlowchartComponent } from './flowchart.component'
import { FormsModule } from '@angular/forms';
import { jsPlumb } from 'jsplumb';
import { jsPlumbToolkitModule } from 'jsplumbtoolkit-angular';
import * as $ from 'jquery';

const imports = [
  CommonModule,
  ToastModule,
  CardModule,
  ConfirmDialogModule,
  MessageModule,
  TooltipModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  DropdownModule,
  jsPlumbToolkitModule,
  InputTextModule,
  DialogModule,
  ButtonModule,

  DialogModule,
  InputSwitchModule,
  MultiSelectModule,
  ToastModule,
  FieldsetModule,
  ButtonModule,
  CheckboxModule,
  TableModule,
  InputTextModule,
  DropdownModule
]
const declarations = [FlowchartComponent];



@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})
export class FlowchartModule { }

