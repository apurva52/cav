import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceMethodTimingComponent } from './service-method-timing.component';
import { FormsModule } from '@angular/forms';
import {
  TableModule,
  CardModule,
  ButtonModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  AccordionModule,
  PanelModule,
  ToolbarModule,
  MenuModule,
  InputTextModule,
} from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,
  AccordionModule,
  PanelModule,
  ToolbarModule,
  MenuModule,
  InputTextModule,
  PipeModule,
];

const components = [ServiceMethodTimingComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class ServiceMethodTimingModule {}
