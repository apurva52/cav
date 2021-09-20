import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetMenuComponent } from './widget-menu.component';
import { MenuModule, ButtonModule, SlideMenuModule, TieredMenuModule, OverlayPanelModule, MessageModule} from 'primeng';
import { RouterModule } from '@angular/router';

const components = [WidgetMenuComponent];
const imports = [
  CommonModule,
  ButtonModule,
  SlideMenuModule,
  TieredMenuModule,
  OverlayPanelModule,
  MessageModule
]
@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class WidgetMenuModule { }
