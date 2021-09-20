import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpReportComponent } from './http-report.component';
import { Routes, RouterModule } from '@angular/router';
import { ButtonModule, MenuModule, MessageModule, PanelModule, SlideMenuModule, TableModule, TooltipModule, InputTextModule } from 'primeng';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

const imports = [
  CommonModule,
  PanelModule,
  TooltipModule,
  TableModule,
  MenuModule,
  ButtonModule,
  MessageModule,
  SlideMenuModule,
  InputTextModule,
  PipeModule
];

const components = [
  HttpReportComponent
];

const routes: Routes = [
  {
    path: 'http-report',
    component: HttpReportComponent
  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  providers:[],
  exports: [
    RouterModule, HttpReportComponent
  ],
  entryComponents: [HttpReportComponent]
})
export class HttpReportModule { }
