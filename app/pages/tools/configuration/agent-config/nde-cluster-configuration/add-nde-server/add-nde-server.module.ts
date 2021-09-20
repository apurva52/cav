import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNdeServerComponent } from './add-nde-server.component';
import { FormsModule } from '@angular/forms';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, DropdownModule, FieldsetModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';

const components = [
  AddNdeServerComponent
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
  FieldsetModule
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})
export class AddNdeServerModule { }