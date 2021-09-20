import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeapDumpComponent } from './heap-dump.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { CardModule, TabMenuModule, InputTextModule, RadioButtonModule, DropdownModule, MessageModule, ButtonModule, AccordionModule, CheckboxModule, TreeModule, ToolbarModule, MultiSelectModule, PanelModule, InputTextareaModule, BreadcrumbModule, MenuModule, InputSwitchModule, FieldsetModule, TableModule, ToastModule, TooltipModule, DialogModule, FileUploadModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { JavaHeapDumpModule } from './java-heap-dump/java-heap-dump.module';
import { JavaHeapDumpComponent } from './java-heap-dump/java-heap-dump.component';
import { HeapDumpAnalyserComponent } from './heap-analyser/heap-dump-analyser.component';
import { HeapDumpAnalyserModule } from './heap-analyser/heap-dump-analyser.module';
import { IbmHeapDumpAnalyserModule } from './ibm-heap-analyser/ibm-heap-dump-analyser.module'
import { IbmHeapDumpAnalyserComponent } from './ibm-heap-analyser/ibm-heap-dump-analyser.component';
import { TakeHeapDumpModule } from './take-heap-dump/take-heap-dump.module';
import {MatDialogModule} from '@angular/material/dialog';
import {BlockUIModule} from 'primeng/blockui';

const routes: Routes = [
  {
    path: 'heap-dump',
    component: HeapDumpComponent,
    children: [
      {
        path: '',
        redirectTo: 'heap-dump',
        pathMatch: 'full',
      },
      {
        path: 'java-heap-dump',
        loadChildren: () =>
          import('./java-heap-dump/java-heap-dump.module').then((m) => m.JavaHeapDumpModule),
        component: JavaHeapDumpComponent,
      },
      {
        path: 'heap-analyser-dump',
        loadChildren: () =>
          import('./heap-analyser/heap-dump-analyser.module').then((m) => m.HeapDumpAnalyserModule),
        component: HeapDumpAnalyserComponent,
      },
      {
        path: 'ibm-heap-analyser-dump',
        loadChildren: () =>
          import('./ibm-heap-analyser/ibm-heap-dump-analyser.module').then((m) => m.IbmHeapDumpAnalyserModule),
        component: IbmHeapDumpAnalyserComponent,
      }
    ],
  },
];

const imports = [CommonModule,
  CardModule,
  TabMenuModule,
  InputTextModule,
  RadioButtonModule,
  DropdownModule,
  MessageModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  FormsModule,
  ButtonModule,
  AccordionModule,
  CheckboxModule,
  TreeModule,
  ToolbarModule,
  HeaderModule,
  MultiSelectModule,
  PanelModule,
  InputTextareaModule,
  BreadcrumbModule,
  MenuModule,
  InputSwitchModule,
  FieldsetModule,
  TableModule,
  AppMessageModule,
  ToastModule,
  ReactiveFormsModule,
  LongValueModule,
  PipeModule,
  IpSummaryOpenBoxModule,
  JavaHeapDumpModule,
  TooltipModule,
  DialogModule,
  FileUploadModule,
  HeapDumpAnalyserModule,
  IbmHeapDumpAnalyserModule,
  TakeHeapDumpModule,
  MatDialogModule,
  BlockUIModule,
];

const components = [HeapDumpComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})

export class HeapDumpModule { }
