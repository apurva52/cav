import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableBoxComponent } from './table-box.component';
import { TableModule, CardModule, ButtonModule, ToastModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, PanelModule, DialogModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';


const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,
  PanelModule,
  DialogModule
];

const components = [
  TableBoxComponent
];

const routes: Routes = [
  {
    path: 'table-box',
    component: TableBoxComponent
  }
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
export class TableBoxModule { }
