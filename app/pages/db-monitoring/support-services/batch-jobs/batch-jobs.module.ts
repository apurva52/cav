import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchJobsComponent } from './batch-jobs.component';
import { ButtonModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, SlideMenuModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { CommonStatsFilterModule } from '../../shared/common-stats-filter/common-stats-filter.module';



@NgModule({
  declarations: [BatchJobsComponent],
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
    PanelModule,
    SlideMenuModule,
    ChartModule,
    PipeModule,
    CommonStatsFilterModule
  ]
})
export class BatchJobsModule { }
