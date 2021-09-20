import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberRightAlignDirective } from './number-right-align.directive';



@NgModule({
  declarations: [NumberRightAlignDirective],
  imports: [
    CommonModule
  ],
  exports: [NumberRightAlignDirective]
})
export class NumberRightAlignModule { }
