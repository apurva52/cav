import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetSubmenuComponent } from './widget-submenu.component';
import { ButtonModule, SlideMenuModule } from 'primeng';



@NgModule({
  declarations: [WidgetSubmenuComponent],
  imports: [
    CommonModule,
    ButtonModule,
    SlideMenuModule
  ],
  exports:[WidgetSubmenuComponent]
})
export class WidgetSubmenuModule { }
