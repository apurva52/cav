import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LDAPServerSettingComponent } from '../ldap-server-setting/ldap-server-setting.component';
import { ButtonModule, CardModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, OrderListModule, PasswordModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

const components = [LDAPServerSettingComponent];

const imports = [
  CommonModule,
  DialogModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  DropdownModule,
  FormsModule,
  OrderListModule,
  CardModule,
  PasswordModule,
  ToastModule,
  ConfirmDialogModule
];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})

export class LDAPServerSettingModule { }
