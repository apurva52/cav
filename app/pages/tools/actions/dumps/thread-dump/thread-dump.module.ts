import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreadDumpComponent } from './thread-dump.component';
import { RouterModule, Routes } from '@angular/router';
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
  MessageModule,
  TooltipModule,
  RadioButtonModule,
  PanelModule,
  BlockUIModule,
  ConfirmDialogModule,
  AccordionModule,
  TabMenuModule,
  DialogModule,
  CalendarModule,
  ProgressBarModule,
  ToastModule,
} from 'primeng';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { AnalyzeThreadDumpComponent } from './analyze-thread-dump/analyze-thread-dump.component';
import { AnalyzeThreadDumpModule } from './analyze-thread-dump/analyze-thread-dump.module';
import { StateModule } from './analyze-thread-dump/state/state.module';
// import { ThreadDumpSummaryComponent } from './thread-dump-summary/thread-dump-summary.component';
import { ThreadDumpSummaryModule } from './thread-dump-summary/thread-dump-summary.module';
import { CommonServices } from './service/common.services';
import { ThreadDumpSummaryComponent } from './thread-dump-summary/thread-dump-summary.component';
import { DdrBreadcrumbService } from './service/ddr-breadcrumb.service';
import { DDRRequestService } from './service/ddr-request.service';

const routes: Routes = [
  {
    path: 'thread-dump',
    component: ThreadDumpComponent,
    children: [
      {
        path: 'analyze-thread',
        loadChildren: () =>
          import('./analyze-thread-dump/analyze-thread-dump.module').then(
            (m) => m.AnalyzeThreadDumpModule
          ),
        component: AnalyzeThreadDumpComponent,
      },
      {
        path: 'thread-summary',
        loadChildren: () =>
          import('./thread-dump-summary/thread-dump-summary.module').then(
            (m) => m.ThreadDumpSummaryModule
          ),
        component: ThreadDumpSummaryComponent,
      }
    ],
  },
];

const imports = [
  CommonModule,
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
  MessageModule,
  TooltipModule,
  RadioButtonModule,
  AnalyzeThreadDumpModule,
  StateModule,
  PanelModule,
  BlockUIModule,
  ConfirmDialogModule,
  AccordionModule,
  TabMenuModule,
  DialogModule,
  CalendarModule,
  ThreadDumpSummaryModule,
  ProgressBarModule,
  ToastModule
  ];

const components = [ThreadDumpComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule],
  providers: [CommonServices, DdrBreadcrumbService, DDRRequestService,]
})
export class ThreadDumpModule {}
