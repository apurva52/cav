import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportStatusComponent } from './support-status.component';
import { ButtonModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { CommonStatsFilterModule } from '../../shared/common-stats-filter/common-stats-filter.module';



@NgModule({
  declarations: [SupportStatusComponent],
  imports: [
    CommonModule,
    TableModule,    
    MessageModule,
    TooltipModule,
    MultiSelectModule,
    FormsModule,
    MenuModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    ChartModule,
    PanelModule,
    PipeModule,
    CommonStatsFilterModule
  ]
})
export class SupportStatusModule { }
