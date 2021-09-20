import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopTransactionComponent } from './top-transaction.component';
import { FormsModule } from '@angular/forms';
import {
  SidebarModule,
  TableModule,
  CardModule,
  ButtonModule,
  TooltipModule,
  InputTextModule,
  MultiSelectModule, MenuModule, MessageModule
} from 'primeng';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

const imports = [
  CommonModule,
  SidebarModule,
  TableModule,
  CardModule,
  ButtonModule,
  TooltipModule,
  InputTextModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  PipeModule,
  MessageModule
];

const components = [TopTransactionComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class TopTransactionModule {}
