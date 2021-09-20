import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDataComponent } from './custom-data.component';
import { CardModule, ButtonModule, CheckboxModule, MultiSelectModule, FieldsetModule, RadioButtonModule, DropdownModule, TabViewModule, BreadcrumbModule, DialogModule, InputTextModule, MenuModule, MessageModule, TableModule, ToolbarModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const imports = [
  CommonModule,  
  CardModule,
  ButtonModule,  
  CheckboxModule,  
  FormsModule, 
  RadioButtonModule,
  DropdownModule,
  TabViewModule,
  InputTextModule,
  MessageModule,
  DialogModule,
  ToolbarModule,
  TableModule,
  MenuModule,
  BreadcrumbModule,
  TooltipModule,
  MultiSelectModule
];

const components = [CustomDataComponent];

const routes: Routes = [
  {
    path: 'custom-data',
    component: CustomDataComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})


export class CustomDataModule { }
