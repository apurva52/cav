import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExceptionMonitorComponent } from './exception-monitor.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CardModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, TableModule, TooltipModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  MessageModule,
  TooltipModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  InputTextModule,     
];

const components = [ExceptionMonitorComponent];

const routes: Routes = [
  {
    path: 'exception-monitor',
    component: ExceptionMonitorComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components,RouterModule],
})
export class ExceptionMonitorModule { }
