import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-flowpath',
  templateUrl: './flowpath.component.html',
  styleUrls: ['./flowpath.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FlowpathComponent implements OnInit {

  options: MenuItem[];  
  selectedValues: string = 'selectAll';

  constructor() { }

  ngOnInit(): void {
    const me = this;

    me.options = [
      {label: '100'},
      {label: '95'},
      {label: '90'},
      {label: '85'},
      {label: '80'},
      {label: '50'}
    ];
  }

}
