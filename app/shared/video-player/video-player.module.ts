import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, CheckboxModule, ColorPickerModule, MenuModule, OverlayPanelModule, ProgressBarModule, RadioButtonModule, TooltipModule } from 'primeng';
import { VideoPlayerComponent } from './video-player.component';
import { FormsModule } from '@angular/forms';



const imports = [
  CommonModule,
  ButtonModule,
  OverlayPanelModule,
  TooltipModule,
  ColorPickerModule,
  FormsModule,
  CheckboxModule,
  RadioButtonModule,
  MenuModule,
  ProgressBarModule
];

const components = [
  VideoPlayerComponent
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
export class VideoPlayerModule { }
