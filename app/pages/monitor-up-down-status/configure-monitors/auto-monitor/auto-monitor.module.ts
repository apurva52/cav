import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { OracleServerComponent } from './oracle-server.component';
import { RouterModule, Routes } from '@angular/router';
import { AccordionModule, BreadcrumbModule, ButtonModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, ProgressSpinnerModule, TableModule, ToastModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { AutoMonitorComponent } from './auto-monitor.component';
import { MonStatsModule } from '../mon-stats/mon-stats.module';

const routes: Routes = [
  {
    path: 'auto-monitor',
    component: AutoMonitorComponent
  }
];

@NgModule({
  declarations: [AutoMonitorComponent],
  imports: [
    CommonModule,
    HeaderModule,
    ToolbarModule,
    DropdownModule,
    InputTextModule,
    PipeModule,
    ButtonModule,
    FormsModule,
    BreadcrumbModule,
    CheckboxModule,
    TableModule,
    DialogModule,
    ProgressSpinnerModule,
    AccordionModule,
    ToastModule,
    MonStatsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AutoMonitorModule { }
