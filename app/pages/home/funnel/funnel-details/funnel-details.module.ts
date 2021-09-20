import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunnelDetailsComponent } from './funnel-details.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CardModule, MessageModule, TableModule, ToastModule, TooltipModule } from 'primeng';
import { PageDetailsModule } from '../page-details/page-details.module';
import { AddNoteModule } from '../dialog/add-note/add-note.module';
import { BusinessProcessModule } from '../sidebar/business-process/business-process.module';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/shared/chart/chart.module';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  TooltipModule,
  FormsModule,
  BusinessProcessModule,
  AddNoteModule,
  PageDetailsModule,
  MessageModule,
  ChartModule,
  ToastModule
];

const components = [FunnelDetailsComponent];

const routes: Routes = [
  {
    path: 'funnel-details',
    component: FunnelDetailsComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})
export class FunnelDetailsModule { }
