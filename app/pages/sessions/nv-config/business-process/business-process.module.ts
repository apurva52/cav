import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessProcessComponent } from './business-process.component'
import { FieldsetModule, TableModule, InputSwitchModule, CheckboxModule, CardModule, ToastModule, DialogModule, MessageModule, ConfirmDialogModule, TooltipModule, MultiSelectModule, MenuModule, DropdownModule, InputTextModule, ButtonModule, SlideMenuModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { FlowchartModule } from './../flowchart/flowchart.module'

@NgModule({
  declarations: [BusinessProcessComponent],
  imports: [
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
    InputTextModule,
    DialogModule,
    FlowchartModule,
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
    DropdownModule,
    FormsModule,

    SlideMenuModule,
  ]
})
export class BusinessProcessModule { }

