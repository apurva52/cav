import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsMenuComponent } from './events-menu.component';
import { TooltipModule, OverlayPanelModule, ButtonModule } from 'primeng';
import { PipeModule } from '../../pipes/pipes.module';



@NgModule({
  declarations: [EventsMenuComponent],
  exports: [EventsMenuComponent],
  imports: [
    CommonModule,
    OverlayPanelModule,
    ButtonModule,
    TooltipModule,
    PipeModule
  ]
})
export class EventsMenuModule { }
