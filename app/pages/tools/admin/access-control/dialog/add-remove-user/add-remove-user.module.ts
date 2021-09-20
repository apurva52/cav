import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRemoveUserComponent } from './add-remove-user.component';
import { ButtonModule, DialogModule, CardModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';


const imports = [
  CommonModule,
  ButtonModule,
  DialogModule,
  TableModule,
  CardModule,
  MessageModule,
  TooltipModule,
  MultiSelectModule,
  FormsModule,
  DropdownModule,
  InputTextModule,
  MenuModule,
];

const components = [AddRemoveUserComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class AddRemoveUserModule { }
