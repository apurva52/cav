import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule, ButtonModule } from 'primeng';
import { MonitorDialogComponent } from './monitor-dialog.component';


const components = [
  MonitorDialogComponent
];

const imports = [
  CommonModule,
  DialogModule,
  ButtonModule,
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})

export class MonitorDialogModule { }
