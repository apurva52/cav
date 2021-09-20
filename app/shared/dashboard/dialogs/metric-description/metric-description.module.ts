import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricDescriptionComponent } from './metric-description.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule, InputTextModule, ButtonModule, DialogModule, PanelModule, InputTextareaModule, MultiSelectModule, RadioButtonModule, TableModule, CardModule, MessageModule, MenuModule } from 'primeng';
import {TooltipModule} from 'primeng/tooltip';
const imports = [
  CommonModule,
  DropdownModule,
  ButtonModule,
  DialogModule,
  PanelModule,
  TableModule,
  FormsModule,
  CardModule,
  MessageModule,
  MenuModule,
  InputTextModule,
  TooltipModule
];

const components = [MetricDescriptionComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})

export class MetricDescriptionModule { }
