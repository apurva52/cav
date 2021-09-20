import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTestCaseComponent } from './add-test-case.component';
import { Routes, RouterModule } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, DropdownModule, InputSwitchModule, InputTextareaModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, SlideMenuModule, TableModule, ToolbarModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { AddParameterModule } from './add-parameter/add-parameter.module';


const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,    
  PipeModule,
  SlideMenuModule,
  MenuModule,  
  InputTextModule, 
  HeaderModule,
  ToolbarModule,
  BreadcrumbModule,
  DropdownModule,
  PanelModule,
  InputTextareaModule, 
  InputSwitchModule,
  AddParameterModule
];

const components = [AddTestCaseComponent];

const routes: Routes = [
  {
    path: 'add-test-case',
    component: AddTestCaseComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddTestCaseModule { }
