import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigureDetectionRulesComponent } from './configure-detection-rules.component';
import { FormsModule } from '@angular/forms';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, DropdownModule, CardModule, FieldsetModule, InputSwitchModule, TabMenuModule } from 'primeng';

const components = [
  ConfigureDetectionRulesComponent
];

const imports = [
  CommonModule,
  DialogModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  DropdownModule,
  FormsModule,
  CardModule,
  FieldsetModule,
  InputSwitchModule,
  TabMenuModule,
];

const declarations = [ConfigureDetectionRulesComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})
export class ConfigureDetectionRulesModule { }
