import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMetricsComponent } from './custom-metrics.component';
import { OrderListModule, MessageModule, TableModule, InputTextModule, CardModule, ButtonModule, CheckboxModule, DialogModule, MenuModule, MultiSelectModule, SlideMenuModule, ToastModule, TooltipModule } from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';



@NgModule({
  declarations: [CustomMetricsComponent],
  imports: [
    CommonModule,
    OrderListModule,
    MessageModule,
    TableModule,
    InputTextModule,
    CardModule,
    CommonModule,
    TableModule,
    CardModule,
    ButtonModule,
    AppMessageModule,
    ToastModule,
    TooltipModule,
    CheckboxModule,
    MultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    SlideMenuModule,
    MenuModule,
    PipeModule,
  ]
})
export class CustomMetricsModule { }