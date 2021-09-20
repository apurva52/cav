import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectivityComponent } from './connectivity.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {
  TableModule,
  CardModule,
  ButtonModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  DropdownModule,
  RadioButtonModule,
  MenuModule,
} from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,
  PipeModule,
  DropdownModule,
  RadioButtonModule,
  MenuModule,
];

const components = [ConnectivityComponent];

const routes: Routes = [
  {
    path: 'connectivity',
    component: ConnectivityComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectivityModule {}
