import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenameIntegrationComponent } from './rename-integration.component';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';



const components = [
  RenameIntegrationComponent
];

const imports = [
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})
export class RenameIntegrationModule { }
