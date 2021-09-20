import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageDetailsComponent } from './page-details.component';
import { FormsModule } from '@angular/forms';
import {
  TableModule,
  CardModule,
  ButtonModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  SliderModule,
  OverlayPanelModule,
} from 'primeng';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  FormsModule,
  SliderModule,
  OverlayPanelModule
];

const components = [PageDetailsComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class PageDetailsModule { }
