import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LastLevelNodeComponent } from './last-level-node.component';
import {
  TooltipModule,
  ButtonModule,
  MenuModule,
  OverlayPanelModule,
} from 'primeng';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
  declarations: [LastLevelNodeComponent],
  imports: [
    CommonModule,
    PipeModule,
    TooltipModule,
    ButtonModule,
    MenuModule,
    OverlayPanelModule,
  ],
})
export class LastLevelNodeModule {}
