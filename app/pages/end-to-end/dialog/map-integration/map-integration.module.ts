import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapIntegrationComponent } from './map-integration.component';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, DropdownModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';

const components = [
  MapIntegrationComponent
];

const imports = [
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  DropdownModule
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})
export class MapIntegrationModule { }
