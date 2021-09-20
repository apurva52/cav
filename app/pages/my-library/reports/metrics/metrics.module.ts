import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsComponent } from './metrics.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CardModule, ConfirmDialogModule,
  DialogModule, DropdownModule, InputTextModule,
  MenuModule, MessageModule, MessagesModule,
  MultiSelectModule, TableModule, TooltipModule,
  ToastModule } from 'primeng';
import { FormsModule } from '@angular/forms';


const imports = [
  CommonModule,
  TableModule,
  CardModule,
  MessageModule,
  TooltipModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  DropdownModule,
  InputTextModule,
  ButtonModule,
  ConfirmDialogModule,
  DialogModule,
  MessagesModule,
  ToastModule
];
const components = [
  MetricsComponent
];
const routes: Routes = [
  {
    path: 'metrics',
    component: MetricsComponent,
    // children: [
    //   {
    //     path: 'add-report',
    //     loadChildren: () => import('./add-report/add-report.module').then(m => m.AddReportModule),
    //     component: AddReportComponent
    //   },
    // ]
  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MetricsModule { }
