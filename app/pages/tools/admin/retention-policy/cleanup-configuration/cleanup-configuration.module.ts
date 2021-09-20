import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CleanupConfigurationComponent } from './cleanup-configuration.component';
import { DropdownModule, PanelModule } from 'primeng';



@NgModule({
  declarations: [CleanupConfigurationComponent],
  imports: [
    CommonModule,
    PanelModule,
    DropdownModule
  ]
})
export class CleanupConfigurationModule { }
