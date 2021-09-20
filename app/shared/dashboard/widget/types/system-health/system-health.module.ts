import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemHealthComponent } from './system-health.component';
import { WidgetMenuModule } from '../../widget-menu/widget-menu.module';
import { TooltipModule } from 'primeng';



@NgModule({
  declarations: [SystemHealthComponent],
  exports: [SystemHealthComponent],
  imports: [
    CommonModule,
    WidgetMenuModule,
    TooltipModule
  ]
})
export class SystemHealthModule { }
