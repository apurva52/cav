import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EndToEndNewGroupComponent } from './end-to-end-new-group.component';
import { ButtonModule, CheckboxModule, DialogModule, DropdownModule, PickListModule,InputTextModule } from 'primeng';
import { FormsModule } from '@angular/forms';
const imports = [
  CommonModule,
  DialogModule,
  DropdownModule,
  CheckboxModule,
  PickListModule,
  ButtonModule,
  InputTextModule,
  FormsModule
];

const components = [
  EndToEndNewGroupComponent
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [
    components
  ]
})
export class EndToEndNewGroupModule { }
