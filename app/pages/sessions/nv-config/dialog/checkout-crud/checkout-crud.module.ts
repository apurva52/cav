import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutCrudComponent } from './checkout-crud.component';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';

const components = [
  CheckoutCrudComponent
];

const imports = [
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})
export class CheckoutCrudModule { }
