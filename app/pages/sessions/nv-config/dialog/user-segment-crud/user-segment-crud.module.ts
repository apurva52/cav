import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSegmentCrudComponent } from './user-segment-crud.component';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, CardModule, DropdownModule, OrderListModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import {InputTextareaModule} from 'primeng/inputtextarea';


const components = [
  UserSegmentCrudComponent
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
  OrderListModule,
  CardModule,
  InputTextareaModule
 


];

const declarations = [UserSegmentCrudComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})




export class UserSegmentCrudModule { }
