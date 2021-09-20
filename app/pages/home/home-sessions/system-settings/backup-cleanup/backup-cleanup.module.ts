import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, DialogModule, ToastModule, ToolbarModule, DropdownModule, FieldsetModule, InputTextModule, InputSwitchModule, MultiSelectModule, PanelModule, ProgressBarModule, CheckboxModule, SliderModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { BackupCleanupComponent } from './backup-cleanup.component'

const imports = [
  CommonModule,
  CardModule,
  ButtonModule,
  InputSwitchModule,
  ToolbarModule,
  InputTextModule,
  FormsModule,
  DialogModule,
  DropdownModule,
  ToastModule,
  CheckboxModule,
  MultiSelectModule,
  TooltipModule,
  PanelModule,
  TableModule,
  ProgressBarModule,
];

const components = [BackupCleanupComponent];
@NgModule({
  declarations: [components],
  imports: [imports,],
  exports: [components],
})
export class BackupCleanupModule { }


