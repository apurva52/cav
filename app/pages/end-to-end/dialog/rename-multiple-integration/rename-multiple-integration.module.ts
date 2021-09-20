import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenameMultipleIntegrationComponent } from './rename-multiple-integration.component';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, PickListModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';



const components = [
  RenameMultipleIntegrationComponent
];

const imports = [
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  PickListModule
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})
export class RenameMultipleIntegrationModule { }
