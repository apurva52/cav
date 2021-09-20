import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartMenuComponent } from './chart-menu.component';
import { ButtonModule, SlideMenuModule } from 'primeng';



@NgModule({
  declarations: [ChartMenuComponent],
  imports: [
    CommonModule,
    ButtonModule,
    SlideMenuModule
  ],
  exports: [ChartMenuComponent]
})
export class ChartMenuModule { }
