import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AvailableCustomMonitorsComponent } from './available-custom-monitors.component';
import { ConfirmDialogModule, DialogModule, TableModule, ProgressSpinnerModule, DropdownModule, FieldsetModule, DynamicDialogModule, DialogService, DynamicDialogRef, CheckboxModule, ToastModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { JMXConnectionModule } from '../cav-jmx-monitor/jmx-connection/jmx-connection-module';
import {InputTextModule} from 'primeng/inputtext';

const routes: Routes = [  
  {
    path: 'availCustMon/:monType',
    component: AvailableCustomMonitorsComponent
    
  }
];

const imports = [
  CommonModule,
  TableModule,
  FormsModule,
  ConfirmDialogModule,
  DialogModule,
  ProgressSpinnerModule,
  JMXConnectionModule,
  DropdownModule,
  FieldsetModule,
  DynamicDialogModule,
  CheckboxModule,
  ProgressSpinnerModule,
  ToastModule,
  InputTextModule
]

@NgModule({
  declarations: [AvailableCustomMonitorsComponent],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ], 

  providers: [DialogService,{ provide: DynamicDialogRef, useValue: {} }]
})
export class AvailableCustomMonitorsModule { }
