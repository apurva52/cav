import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopTransactionComponent } from './top-transaction.component';
import {
  CardModule,
  InputTextModule,
  MessageModule,
  MultiSelectModule,
  TableModule,
  TooltipModule,
  ButtonModule,
  SidebarModule,
} from 'primeng';
import { FormsModule } from '@angular/forms';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  InputTextModule,
  MultiSelectModule,
  FormsModule,
  MessageModule,
  TooltipModule,
  ButtonModule,
  SidebarModule,
];

const declarations = [TopTransactionComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})
export class TopTransactionModule {}
