import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogIntegrationComponent } from './log-integration.component';
import { ButtonModule, CardModule, CheckboxModule, DropdownModule, InputTextModule, TableModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const imports = [
  CommonModule,
  InputTextModule,
  ButtonModule,
  FormsModule,
  CardModule,
  DropdownModule,
  TableModule,
  CheckboxModule
];

const components = [
  LogIntegrationComponent
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

export class LogIntegrationModule { }
