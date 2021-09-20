import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDetailsComponent } from './transaction-details.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CardModule, ButtonModule, CheckboxModule, MultiSelectModule, FieldsetModule, DropdownModule, InputTextModule } from 'primeng';


const imports = [
  CommonModule,  
  CardModule,
  ButtonModule,  
  CheckboxModule,  
  FormsModule,    
  MultiSelectModule, 
  FieldsetModule,
  DropdownModule,
  InputTextModule
];

const components = [TransactionDetailsComponent];

const routes: Routes = [
  {
    path: 'transaction-details',
    component: TransactionDetailsComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionDetailsModule { }
