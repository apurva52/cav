import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogTableComponent } from './log-table.component';
import { ButtonModule, CardModule, OverlayPanelModule, TableModule,TooltipModule } from 'primeng';
import { LogDetailsModule } from '../../home/logstab/log-details/log-details.module';
import { LogIntegrationModule } from '../../home/logstab/log-integration/log-integration.module';



const imports = [
  CommonModule,
  TableModule,
  CardModule,
  OverlayPanelModule,
  ButtonModule,
  TooltipModule,
  LogDetailsModule,
  LogIntegrationModule
];

const components = [
  LogTableComponent,

];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [
    components
  ]
})
export class LogTableModule { }
