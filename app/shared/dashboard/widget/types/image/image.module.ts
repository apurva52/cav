import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageComponent } from './image.component';
import { InputTextModule, TooltipModule } from 'primeng';
import { WidgetMenuModule } from '../../widget-menu/widget-menu.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ImageComponent],
  imports: [
    CommonModule,
    WidgetMenuModule,
    TooltipModule,
    InputTextModule,
    FormsModule,
  ],
  exports: [ImageComponent],
})
export class ImageModule {}
