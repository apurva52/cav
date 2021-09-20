
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule, InputTextModule, ButtonModule, PasswordModule, MessageModule, DialogModule, ToolbarModule, CardModule, DropdownModule, CheckboxModule, RadioButtonModule, TableModule, MessageService, MultiSelectModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { PipeModule } from '../../shared/pipes/pipes.module';
import { InformativeDialogModule } from 'src/app/shared/dialogs/informative-dialog/informative-dialog.module';
import { ConfirmDialogModule} from 'primeng/confirmdialog';

const imports = [
  CommonModule,
  ToastModule,
  ReactiveFormsModule,
  InputTextModule,
  ButtonModule,
  PasswordModule,
  MessageModule,
  DialogModule,
  HeaderModule,
  ToolbarModule,
  CardModule,
  FormsModule,
  DropdownModule,
  CheckboxModule,
  RadioButtonModule,
  TableModule,
  PipeModule,
  InformativeDialogModule,
  ConfirmDialogModule,
  MultiSelectModule
];

const components = [
  SettingsComponent
];

const routes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent
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
  ],
  providers: [MessageService]
})

export class SettingsModule { }
