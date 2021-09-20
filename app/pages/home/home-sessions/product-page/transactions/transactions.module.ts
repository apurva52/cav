import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { OrderListModule, MessageModule, InputSwitchModule, TableModule, InputTextModule, CardModule, ButtonModule, CheckboxModule, DialogModule, MenuModule, MultiSelectModule, SlideMenuModule, ToastModule, TooltipModule, BreadcrumbModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [TransactionsComponent],
  imports: [
    CommonModule,
    OrderListModule, MessageModule, InputSwitchModule, TableModule, InputTextModule, CardModule, ButtonModule,
     CheckboxModule, DialogModule, MenuModule, MultiSelectModule, SlideMenuModule, ToastModule, TooltipModule,
     BreadcrumbModule  
  ]
})
export class TransactionsModule { }
