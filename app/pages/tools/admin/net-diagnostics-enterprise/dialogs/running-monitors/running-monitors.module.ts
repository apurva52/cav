import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunningMonitorsComponent } from './running-monitors.component';
import {
  DialogModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  MultiSelectModule,
  DropdownModule,
} from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';

const components = [ RunningMonitorsComponent];

const imports = [
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  FormsModule,
  DropdownModule,
  MultiSelectModule,
];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class RunningMonitorsModule { }
