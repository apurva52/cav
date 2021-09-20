import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-percentile',
  templateUrl: './percentile.component.html',
  styleUrls: ['./percentile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PercentileComponent implements OnInit {

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
