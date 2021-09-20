import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IpComponent } from './ip.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TableModule, CardModule, ButtonModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, MenuModule, ToolbarModule, DropdownModule, RadioButtonModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { AddIpModule } from './add-ip/add-ip.module';
import { IpGatewayComponent } from './ip-gateway/ip-gateway.component';
import { IpGatewayModule } from './ip-gateway/ip-gateway.module';

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
  AddIpModule,
  IpGatewayModule,
  MenuModule
];

const components = [IpComponent];

const routes: Routes = [
  {
    path: 'ip',
    component: IpComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IpModule { }
