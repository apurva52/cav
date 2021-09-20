import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditCheckPointComponent } from './edit-check-point.component';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, DropdownModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';

const components = [
  EditCheckPointComponent
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
 //
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})
export class EditCheckPointModule { }
