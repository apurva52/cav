import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeSettingInformationComponent } from './node-setting-information.component';
import { ButtonModule, TooltipModule, TableModule, DialogModule } from 'primeng';


const imports = [
  CommonModule,
  ButtonModule,
  TooltipModule,
  TableModule,
  DialogModule,
];

const components = [NodeSettingInformationComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})

export class NodeSettingInformationModule { }
