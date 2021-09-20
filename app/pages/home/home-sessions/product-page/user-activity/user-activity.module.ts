import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserActivityComponent } from './user-activity.component';
import { OrderListModule, MessageModule, InputSwitchModule, TableModule, InputTextModule, CardModule, ButtonModule, CheckboxModule, DialogModule, MenuModule, MultiSelectModule, SlideMenuModule, ToastModule, TooltipModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';



@NgModule({
  declarations: [UserActivityComponent],
  imports: [
   CommonModule,
    OrderListModule, MessageModule, InputSwitchModule, ClipboardModule,TableModule, InputTextModule, CardModule, ButtonModule,
     CheckboxModule, DialogModule, MenuModule, MultiSelectModule, SlideMenuModule, ToastModule, TooltipModule 
  ]
})
export class UserActivityModule { }

