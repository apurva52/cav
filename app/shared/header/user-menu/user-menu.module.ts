import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserMenuComponent } from './user-menu.component';
import { OverlayPanelModule, ButtonModule, TooltipModule, SlideMenuModule } from 'primeng';



@NgModule({
  declarations: [UserMenuComponent],
  exports: [UserMenuComponent],
  imports: [
    CommonModule,
    OverlayPanelModule,
    ButtonModule,
    TooltipModule,
    SlideMenuModule
  ]
})
export class UserMenuModule { }
