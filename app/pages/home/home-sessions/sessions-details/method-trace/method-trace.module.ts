import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MethodTraceComponent } from './method-trace.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule, CardModule, CheckboxModule, MultiSelectModule, InputTextModule, RadioButtonModule, DropdownModule, PanelModule, InputTextareaModule, BreadcrumbModule, MenuModule, InputSwitchModule, MessageModule, DialogModule, TableModule, TooltipModule } from 'primeng';

const imports = [
  CommonModule,
  ButtonModule,
  CardModule,
  CheckboxModule,
  MultiSelectModule,
  InputTextModule,
  RadioButtonModule,
  DropdownModule,  
  PanelModule, 
  InputTextareaModule,
  BreadcrumbModule,
  MenuModule,
  InputSwitchModule,
  FormsModule,
  MessageModule,
  DialogModule,
  TableModule,
  TooltipModule
]

const components = [MethodTraceComponent];

const routes: Routes = [
  {
    path: 'method-trace',
    component: MethodTraceComponent,
  },
];

@NgModule({
  declarations: [components,],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class MethodTraceModule { }
