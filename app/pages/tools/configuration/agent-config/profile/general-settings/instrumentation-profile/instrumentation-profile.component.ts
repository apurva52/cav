import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-instrumentation-profile',
  templateUrl: './instrumentation-profile.component.html',
  styleUrls: ['./instrumentation-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InstrumentationProfileComponent implements OnInit {

  options: MenuItem[];  
  selectedOptions: MenuItem;

  constructor() { }

  ngOnInit(): void {
    const me = this;

    me.options = [
      {label: '4 items Selected'}
    ];
  }

}
