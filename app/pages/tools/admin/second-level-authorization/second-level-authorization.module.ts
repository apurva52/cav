import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondLevelAuthorizationComponent } from './second-level-authorization.component';
import { ButtonModule, CardModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, OrderListModule, PasswordModule } from 'primeng';
import { FormsModule } from '@angular/forms';

const components = [SecondLevelAuthorizationComponent];

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
  PasswordModule
];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})

export class SecondLevelAuthorizationModule { }
