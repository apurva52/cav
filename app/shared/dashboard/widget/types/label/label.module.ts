import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelComponent } from './label.component';
import { TooltipModule } from 'primeng';
import { WidgetMenuModule } from '../../widget-menu/widget-menu.module';



@NgModule({
  declarations: [LabelComponent],
  exports: [LabelComponent],
  imports: [
    CommonModule,
    WidgetMenuModule,
    TooltipModule
  ]
})
export class LabelModule { }
