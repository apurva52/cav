import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowPathDialogComponent } from './flow-path-dialog.component';
import { ButtonModule, CardModule, DialogModule, InputTextModule, TableModule, TooltipModule } from 'primeng';


const components = [
  FlowPathDialogComponent
];

const imports = [
  CommonModule,
  TableModule,
  DialogModule,
  CardModule,
  TooltipModule,
  ButtonModule,
  InputTextModule
];

@NgModule({
  declarations: [components],
  imports: [imports,],
  exports: [components]
})
export class FlowPathDialogModule { }
