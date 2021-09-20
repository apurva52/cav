import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[numberRightAlign]'
})
export class NumberRightAlignDirective implements OnChanges {
  @Input() numberRightAlign: any;

  constructor(private el: ElementRef) { }

  ngOnChanges(): void {
    if (this.numberRightAlign != null) {
      if (!isNaN(this.numberRightAlign)) {
        this.el.nativeElement.style.textAlign = 'right';
      }
    }
  }

}
