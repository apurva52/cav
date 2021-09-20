import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckPointComponent } from './check-point.component';
import { Routes } from '@angular/router';
import { TableModule, CardModule, ToastModule, MessageModule, ConfirmDialogModule, TooltipModule, MultiSelectModule, MenuModule, DropdownModule, InputTextModule, ButtonModule, SlideMenuModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { AddCheckPointModule } from '../dialog/add-check-point/add-check-point.module';
import { EditCheckPointModule } from '../dialog/edit-check-point/edit-check-point.module';
import { DeleteEntryModule } from '../dialog/delete-entry/delete-entry.module';


const components = [
  CheckPointComponent
];
const routes: Routes = [
  {
    path: 'check-point',
    component: CheckPointComponent,
  }
];
@NgModule({
  declarations: [components],
  imports: [
    CommonModule,
    TableModule,
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
    ButtonModule,
    AddCheckPointModule,
    EditCheckPointModule,
    SlideMenuModule,
    DeleteEntryModule
  ],
  exports: [components]
})
export class CheckPointModule { }

