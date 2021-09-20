import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardWidgetComponent } from './dashboard-widget.component';
import { LowerTabularPanelModule } from '../../lower-tabular-panel/lower-tabular-panel.module';

@NgModule({
  declarations: [DashboardWidgetComponent],
  exports: [DashboardWidgetComponent],
  imports: [CommonModule, LowerTabularPanelModule]
})
export class DashboardWidgetModule { }
