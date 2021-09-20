import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBaselineComponent } from './add-baseline.component';
import {
  ButtonModule,
  CardModule,
  CheckboxModule,
  DialogModule,
  DropdownModule,
  FieldsetModule,
  InputSwitchModule,
  InputTextModule,
  MenuModule,
  MessageModule,
  MultiSelectModule,
  PanelModule,
  RadioButtonModule,
  TableModule,
  ToggleButtonModule,
  ToolbarModule,
  TooltipModule,
} from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { TimeBarModule } from 'src/app/shared/time-bar/time-bar.module';

const components = [AddBaselineComponent];

const imports = [
  CommonModule,
  DropdownModule,
  FormsModule,
  InputTextModule,
  ButtonModule,
  DialogModule,
  RadioButtonModule,
  ReactiveFormsModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  DialogModule,
  HeaderModule,
  ToolbarModule,
  CardModule,
  FormsModule,
  DropdownModule,
  CheckboxModule,
  RadioButtonModule,
  TableModule,
  MenuModule,
  MultiSelectModule,
  TimeBarModule,
  TooltipModule,
  ToggleButtonModule,
  InputSwitchModule,
  FieldsetModule,
];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class AddBaselineModule {}
