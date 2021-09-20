import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-business-view',
  templateUrl: './business-view.component.html',
  styleUrls: ['./business-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BusinessViewComponent {
  componentRef;
  current = 0;
  prev = -1;

  @ViewChild('alertContainer', { read: ViewContainerRef }) container;

  constructor(private resolver: ComponentFactoryResolver) {}

  onPrev() {
    if (this.current > 0) {
      this.prev = this.current--;
    }
  }

  onNext() {
    if (this.current < 2) {
      this.prev = this.current++;
    }
  }

  isLeftTransition(idx: number): boolean {
    return this.current === idx
      ? this.prev > this.current
      : this.prev < this.current;
  }
}
