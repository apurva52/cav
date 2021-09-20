import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-new-controller',
  templateUrl: './new-controller.component.html',
  styleUrls: ['./new-controller.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NewControllerComponent implements OnInit {

  options: MenuItem[];

  constructor() { }

  ngOnInit(): void {
    const me = this;
    
    me.options = [
      {label: 'ALL' },
      {label: 'ALL' },
      {label: 'ALL' },
      {label: 'ALL' },
      {label: 'ALL' }
    ]
  }

}
