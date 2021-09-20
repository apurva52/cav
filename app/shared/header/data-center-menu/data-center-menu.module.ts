import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataCenterMenuComponent } from './data-center-menu.component';
import { OverlayPanelModule, ButtonModule, TooltipModule } from 'primeng';



@NgModule({
  declarations: [DataCenterMenuComponent],
  exports: [DataCenterMenuComponent],
  imports: [
    CommonModule,
    OverlayPanelModule,
    ButtonModule,
    TooltipModule
  ]
})
export class DataCenterMenuModule { }
