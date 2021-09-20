import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionFilterComponent } from './transaction-filter.component';
import { AutoCompleteModule, ButtonModule, CardModule, CheckboxModule, InputTextModule, MenuModule, MultiSelectModule, TableModule, ToastModule, ToolbarModule, TooltipModule, BreadcrumbModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import {TransactionFilterSidebarModule} from './sidebar/transaction-filter-sidebar/transaction-filter-sidebar.module';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

const imports = [
    CommonModule,
    TableModule,
    CardModule,
    ButtonModule,
    AppMessageModule,
    ToastModule,
    MessageModule,
    MessagesModule,
    TooltipModule,
    CheckboxModule,
    MultiSelectModule,
    FormsModule,
    MenuModule,
    PipeModule,
    InputTextModule,
    HeaderModule,
    ToolbarModule,
    TransactionFilterSidebarModule,
    BreadcrumbModule,
    ProgressSpinnerModule,
    AutoCompleteModule
  ];
  
  const routes: Routes = [
  {
    path: 'transaction-filter',
    component: TransactionFilterComponent,
  }
];

 @NgModule({
  declarations: [TransactionFilterComponent],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionFilterModule { }
