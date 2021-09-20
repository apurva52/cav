import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertConfigureComponent } from './alert-configure.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {TooltipModule} from 'primeng/tooltip';

import {
  ToolbarModule,
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
  FieldsetModule,
  ToastModule,
  DialogModule
} from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AddActionModule } from '../alert-actions/add-action/add-action.module';
import { GenericImportExportModule } from 'src/app/shared/generic-import-export/generic-import-export.module';


const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
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
  AddActionModule,
   FieldsetModule,
  ToastModule,
  DialogModule,
  GenericImportExportModule,
  TooltipModule
];

const components = [AlertConfigureComponent];

const routes: Routes = [
  {
    path: 'alert-configure',
    component: AlertConfigureComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})
export class AlertConfigureModule {}
