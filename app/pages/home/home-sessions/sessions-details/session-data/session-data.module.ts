import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionDataComponent } from './session-data.component';
import { CardModule, InputTextModule, MessageModule, OrderListModule, TableModule, TooltipModule } from 'primeng';

const imports = [
  CommonModule,
  OrderListModule,
  MessageModule,
  TableModule,
  InputTextModule,
  CardModule,
  TooltipModule
];

const components = [
  SessionDataComponent
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
export class SessionDataModule { }
