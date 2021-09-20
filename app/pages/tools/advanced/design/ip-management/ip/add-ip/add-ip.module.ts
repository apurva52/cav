import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddIpComponent } from './add-ip.component';
import {
  ButtonModule,
  DialogModule,
  DropdownModule,
  InputTextModule,
} from 'primeng';
import { FormsModule } from '@angular/forms';

const components = [AddIpComponent];

const imports = [
  CommonModule,
  DialogModule,
  ButtonModule,
  InputTextModule,
  DropdownModule,
  FormsModule,
];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class AddIpModule {}
