import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TcpDumpComponent } from './tcp-dump.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CheckboxModule,
  DialogModule,
  MultiSelectModule,
  DropdownModule,
  InputTextModule,
  ButtonModule,
  InputNumberModule,
  TableModule,
  CardModule,
  SlideMenuModule,
  MenuModule,
  ConfirmDialogModule,
  ToolbarModule, MessageModule, TooltipModule, FieldsetModule
} from 'primeng';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

const routes: Routes = [
  {
    path: 'tcp-dump',
    component: TcpDumpComponent,
  },
];

const imports = [
  DialogModule,
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
  FieldsetModule,
  ConfirmDialogModule
];

const components = [TcpDumpComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class TcpDumpModule {}
