import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTierGroupComponent } from './add-tier-group.component';
import { FormsModule } from '@angular/forms';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, DropdownModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';

const components = [
  AddTierGroupComponent
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
 
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})
export class AddTierGroupModule { }
