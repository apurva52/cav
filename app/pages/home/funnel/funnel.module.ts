import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunnelComponent } from './funnel.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule, CardModule, ButtonModule, ToastModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, MenuModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { BusinessProcessModule } from './sidebar/business-process/business-process.module';
import { AddNoteModule } from './dialog/add-note/add-note.module';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { PageDetailsModule } from './page-details/page-details.module';
import { FunnelDetailsModule } from './funnel-details/funnel-details.module';

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
  MenuModule,
  PipeModule,
  BusinessProcessModule,
  AddNoteModule,
  PageDetailsModule,
  FunnelDetailsModule
];

const components = [FunnelComponent];

const routes: Routes = [
  {
    path: 'funnel',
    component: FunnelComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FunnelModule { }
