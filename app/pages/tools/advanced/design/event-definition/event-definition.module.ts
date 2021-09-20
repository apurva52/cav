import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventDefinitionComponent } from './event-definition.component';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, RadioButtonModule, TableModule, ToolbarModule, TooltipModule } from 'primeng';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';


const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  DialogModule,
  CardModule,
  FormsModule,
  DropdownModule,
  CheckboxModule,
  TableModule,
  MultiSelectModule,
  MenuModule,
  BreadcrumbModule,
  TooltipModule,
  RadioButtonModule
];


const components = [
  EventDefinitionComponent
];

const routes: Routes = [
  {
    path: 'event-definition',
    component: EventDefinitionComponent,
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
export class EventDefinitionModule { }
