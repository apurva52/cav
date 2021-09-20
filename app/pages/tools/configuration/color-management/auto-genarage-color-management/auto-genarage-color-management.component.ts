import {
  Component,
  HostBinding,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MenuItem } from 'primeng';
import { COLOR_PALLATE_DATA } from './service/auto-generate.dummy';
import { colorList } from './service/auto-generate.model';

@Component({
  selector: 'app-auto-genarage-color-management',
  templateUrl: './auto-genarage-color-management.component.html',
  styleUrls: ['./auto-genarage-color-management.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AutoGenarageColorManagementComponent implements OnInit {
  data: colorList;
  breadcrumb: MenuItem[];
  selectedValues: string = 'Pink';

  selectedItem: boolean = true;
  // selectedColor: boolean = true;
  colorPalletArray: any[];
  isActive: boolean;

  selectedColorObj: colorList;
  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Configuration' },
      { label: ' Auto-Generate' },
    ];
    me.data = COLOR_PALLATE_DATA;
  }

  listClick($event, selectedColor) {
    const me = this;
    console.log(selectedColor);
    me.selectedColorObj = selectedColor;
    me.selectedItem = selectedColor;
    me.isActive = $event;
  }

}
