import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetIntegrationComponent } from './reset-integration.component';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, TableModule, CardModule, TooltipModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';


const components = [
  ResetIntegrationComponent
];

const imports = [
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  TableModule,
  CardModule,
  TooltipModule
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})
export class ResetIntegrationModule { }
