import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicesSelectComponent } from './indices-select.component';
import { ButtonModule, DialogModule, DropdownModule, InputTextModule, RadioButtonModule, TooltipModule, TreeTableModule } from 'primeng';
import { FormsModule } from '@angular/forms';

const imports = [
  CommonModule,
  DropdownModule,
  FormsModule,
  InputTextModule,
  ButtonModule,
  DialogModule,
  RadioButtonModule,
  TreeTableModule,
  TooltipModule,
];

const components = [IndicesSelectComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})

export class IndicesSelectModule { }
