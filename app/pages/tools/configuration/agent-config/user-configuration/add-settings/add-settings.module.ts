import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddSettingsComponent } from './add-settings.component';
import { FormsModule } from '@angular/forms';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, DropdownModule, FieldsetModule, InputTextareaModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';

const components = [
  AddSettingsComponent
];

const imports = [
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  DropdownModule,
  FormsModule,
  FieldsetModule,
  InputTextareaModule
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})
export class AddSettingsModule { }
