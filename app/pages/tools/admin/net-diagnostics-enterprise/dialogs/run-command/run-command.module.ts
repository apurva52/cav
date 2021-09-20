import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RunCommandComponent } from './run-command.component';
import { FormsModule } from '@angular/forms';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, DropdownModule, MultiSelectModule, PanelModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { RouterModule } from '@angular/router';

const components = [ RunCommandComponent];

const imports = [
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  FormsModule,
  DropdownModule,
  RouterModule,
  MultiSelectModule,

];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class RunCommandModule { }
