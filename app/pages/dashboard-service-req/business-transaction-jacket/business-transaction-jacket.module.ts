import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessTransactionJacketComponent } from './business-transaction-jacket.component';
import { ButtonModule, DialogModule, MessageModule, OrderListModule, RadioButtonModule } from 'primeng';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { FormsModule } from '@angular/forms';

const imports = [
  CommonModule,
  OrderListModule,
  MessageModule,
  DialogModule,
  RadioButtonModule,
  ButtonModule,
  PipeModule,
  FormsModule
];

const components = [
  BusinessTransactionJacketComponent
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports:[
    components
  ]
})

export class BusinessTransactionJacketModule { }
