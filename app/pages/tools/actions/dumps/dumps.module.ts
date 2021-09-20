import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DumpsComponent } from './dumps.component';
import { RouterModule, Routes } from '@angular/router';
import { ThreadDumpComponent } from './thread-dump/thread-dump.component';
import { HeapDumpComponent } from './heap-dump/heap-dump.component';
import { ProcessDumpComponent } from './process-dump/process-dump.component';
import { TcpDumpComponent } from './tcp-dump/tcp-dump.component';
import { ButtonModule, MenuModule, TabMenuModule, ToolbarModule, TooltipModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ThreadDumpModule } from './thread-dump/thread-dump.module';
import { TcpDumpModule } from './tcp-dump/tcp-dump.module';
import { ProcessDumpModule } from './process-dump/process-dump.module';
import { HeapDumpModule } from './heap-dump/heap-dump.module';
import { JavaHeapDumpModule } from './heap-dump/java-heap-dump/java-heap-dump.module';
import { CommonServices } from './service/common.services';
import { DashboardRESTDataAPIService } from './service/dashboard-rest-data-api.service';
import { DdrDataModelService } from './service/ddr-data-model.service';
import { DDRRequestService } from './service/ddr-request.service';
import { DdrBreadcrumbService } from './thread-dump/service/ddr-breadcrumb.service';

const routes: Routes = [
  {
    path: 'dumps',
    component: DumpsComponent,
    children: [
      {
        path: '',
        redirectTo: 'thread-dump',
        pathMatch: 'full',
      },
      {
        path: 'thread-dump',
        loadChildren: () =>
          import('./thread-dump/thread-dump.module').then(
            (m) => m.ThreadDumpModule
          ),
        component: ThreadDumpComponent,
      },
      {
        path: 'heap-dump',
        loadChildren: () =>
          import('./heap-dump/heap-dump.module').then((m) => m.HeapDumpModule),
        component: HeapDumpComponent,
      },
      {
        path: 'process-dump',
        loadChildren: () =>
          import('./process-dump/process-dump.module').then(
            (m) => m.ProcessDumpModule
          ),
        component: ProcessDumpComponent,
      },
      {
        path: 'tcp-dump',
        loadChildren: () =>
          import('./tcp-dump/tcp-dump.module').then((m) => m.TcpDumpModule),
        component: TcpDumpComponent,
      }
    ],
  },
];

const imports = [
  CommonModule,
  MenuModule,
  TabMenuModule,
  ButtonModule,
  TooltipModule,
  ToolbarModule,
  HeaderModule,
  ThreadDumpModule,
  TcpDumpModule,
  ProcessDumpModule,
  HeapDumpModule,
  JavaHeapDumpModule
];

const components = [DumpsComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule],
  providers: [CommonServices, DashboardRESTDataAPIService, DdrDataModelService, DDRRequestService, DdrBreadcrumbService]
})
export class DumpsModule {}
