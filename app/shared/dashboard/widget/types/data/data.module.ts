import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataComponent } from './data.component';
import { WidgetMenuModule } from '../../widget-menu/widget-menu.module';
import { TooltipModule } from 'primeng';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';



@NgModule({
  declarations: [DataComponent],
  exports: [DataComponent],
  imports: [
    CommonModule,
    WidgetMenuModule,
    TooltipModule,
    PipeModule
  ]
})
export class DataModule { }