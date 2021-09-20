import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitorMenuComponent } from './monitor-menu.component';
import { OverlayPanelModule, ButtonModule, TooltipModule } from 'primeng';



@NgModule({
  declarations: [MonitorMenuComponent],
  exports: [MonitorMenuComponent],
  imports: [
    CommonModule,
    OverlayPanelModule,
    ButtonModule,
    TooltipModule
  ]
})


export class MonitorMenuModule { }
