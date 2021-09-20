import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeEditSettingsComponent } from './node-edit-settings.component';
import {
  ButtonModule,
  TooltipModule,
  TableModule,
  DialogModule, InputTextModule, CheckboxModule
} from 'primeng';

const imports = [
  CommonModule,
  ButtonModule,
  TooltipModule,
  TableModule,
  DialogModule,
  InputTextModule,
  CheckboxModule
];

const components = [NodeEditSettingsComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class NodeEditSettingsModule {}
