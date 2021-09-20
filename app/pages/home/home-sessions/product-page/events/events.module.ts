import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { OrderListModule, MessageModule, InputSwitchModule, TableModule, InputTextModule, CardModule, ButtonModule, CheckboxModule, DialogModule, MenuModule, MultiSelectModule, SlideMenuModule, ToastModule, TooltipModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';




@NgModule({
  declarations: [EventsComponent],
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    CheckboxModule,
    FormsModule,
    InputTextModule,
    MessageModule,
    MultiSelectModule,
    TooltipModule,
    InputSwitchModule,
    TableModule,
    ReactiveFormsModule,
  ]

})
export class EventsModule { }
