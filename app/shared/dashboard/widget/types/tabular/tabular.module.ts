import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabularComponent } from './tabular.component';
import { WidgetMenuModule } from '../../widget-menu/widget-menu.module';
import { TooltipModule, TableModule } from 'primeng';



@NgModule({
  declarations: [TabularComponent],
  exports: [TabularComponent],
  imports: [
    CommonModule,
    WidgetMenuModule,
    TooltipModule,
    TableModule
  ]
})
export class TabularModule { }
