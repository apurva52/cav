import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateComponent } from './state.component';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { FormsModule } from '@angular/forms';
import {
  CheckboxModule,
  MultiSelectModule,
  DropdownModule,
  InputTextModule,
  ButtonModule,
  InputNumberModule,
  TableModule,
  CardModule,
  SlideMenuModule,
  MenuModule,
  ToolbarModule,
} from 'primeng';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
  declarations: [StateComponent],
  imports: [
    CommonModule,
    ChartModule,
    CheckboxModule,
    MultiSelectModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    TableModule,
    CardModule,
    PipeModule,
    SlideMenuModule,
    MenuModule,
    ToolbarModule,
  ],
  exports: [StateComponent],
})
export class StateModule {}
