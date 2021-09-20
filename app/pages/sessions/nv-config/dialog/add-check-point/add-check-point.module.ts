import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCheckPointComponent } from './add-check-point.component';
import { DialogModule,TooltipModule,ToastModule,MultiSelectModule,TableModule, FieldsetModule,InputSwitchModule,ButtonModule, CheckboxModule, InputTextModule, DropdownModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';


const components = [
  AddCheckPointComponent
];

const imports = [
  CommonModule,
  DialogModule,
  InputSwitchModule,
  TooltipModule,
  MultiSelectModule,
  ToastModule,
  FieldsetModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  TableModule,
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
export class AddCheckPointModule { }

