import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  MenuModule,
} from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { IpGatewayComponent } from './ip-gateway.component';

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
  MenuModule,
];

const components = [IpGatewayComponent];

const routes: Routes = [
  {
    path: 'ip-gateway',
    component: IpGatewayComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IpGatewayModule {}
