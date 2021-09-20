import {
  Component,
  HostBinding,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { SCATTER_MAP_DATA } from './service/scatter-map.dummy';
import { ScatterMapData } from './service/scatter-map.model';

@Component({
  selector: 'app-scatter-map',
  templateUrl: './scatter-map.component.html',
  styleUrls: ['./scatter-map.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ScatterMapComponent implements OnInit {
  title: string = 'Page Scatter Map';

  @Input() container: Element;

  @HostBinding('class.open')
  isOpen = false;

  loading: boolean;
  data: ScatterMapData;

  loadTime: any;
  selectedLoadTime: any;
  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.data = SCATTER_MAP_DATA;
  }

  open() {
    const me = this;
    me.isOpen = true;

    if (me.container) {
      me.container.classList.add('analysis-mode');
    }
  }

  closeClick() {
    const me = this;
    me.isOpen = false;
    if (me.container) {
      me.container.classList.remove('analysis-mode');
    }
  }

  toggle() {
    const me = this;
    if (me.isOpen) {
      me.closeClick();
    } else {
      me.open();
    }
  }
}
