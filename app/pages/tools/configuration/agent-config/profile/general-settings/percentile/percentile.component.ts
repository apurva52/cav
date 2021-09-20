import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-percentile',
  templateUrl: './percentile.component.html',
  styleUrls: ['./percentile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PercentileComponent implements OnInit {

  selectedValues: string = 'saveConfigFile';
  selectedOptions: MenuItem;
  options: MenuItem[];

  constructor() { }

  ngOnInit(): void {

    const me = this;
    
    me.options = [
      {label: '5 minutes'},
      {label: '10 minutes'},
      {label: '15 minutes'},
    ]
    
  }

}
