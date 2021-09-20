import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickMapComponent } from './click-map.component';
import { SliderModule, AccordionModule, ButtonModule, CheckboxModule, ColorPickerModule, MenuModule, OrderListModule, OverlayPanelModule, ProgressBarModule, RadioButtonModule, TooltipModule } from 'primeng';
import { MapConfigModule } from '../dialog/map-config/map-config.module';
import { VideoPlayerModule } from 'src/app/shared/video-player/video-player.module';
import { FormsModule } from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import { MappingConfigurationModule } from '../mapping-configuration/mapping-configuration.module';



@NgModule({
  declarations: [ClickMapComponent],
  imports: [
    CommonModule,
    OrderListModule,
    ButtonModule,
    MenuModule,
    MapConfigModule,
    ButtonModule,
    OverlayPanelModule,
    TooltipModule,
    ColorPickerModule,
    FormsModule,
    CheckboxModule,
    RadioButtonModule,
    ProgressBarModule,
    DialogModule,
    AccordionModule,
    SliderModule,
    MappingConfigurationModule
  ]
})
export class ClickMapModule { }
