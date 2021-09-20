import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphComponent } from './graph.component';
import { WidgetMenuModule } from '../../widget-menu/widget-menu.module';
import { MessageModule, MessagesModule, TooltipModule, ButtonModule} from 'primeng';
import { HighchartsChartModule } from 'highcharts-angular';
import { LowerTabularPanelModule } from 'src/app/shared/lower-tabular-panel/lower-tabular-panel.module';

@NgModule({
  declarations: [GraphComponent],
  exports: [GraphComponent],
  imports: [
    CommonModule,
    WidgetMenuModule,
    TooltipModule,
    HighchartsChartModule,
    MessageModule,
    MessagesModule,
    ButtonModule,
    LowerTabularPanelModule
  ]
})
export class GraphModule { }
