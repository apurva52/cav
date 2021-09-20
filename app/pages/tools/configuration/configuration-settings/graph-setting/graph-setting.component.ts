import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-graph-setting',
  templateUrl: './graph-setting.component.html',
  styleUrls: ['./graph-setting.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GraphSettingComponent implements OnInit {

  selectedValues: string = 'saveConfigFile';
  selectedOptions: MenuItem;
  options: MenuItem[];
  val: number = 20;
  
  constructor() { }

  ngOnInit(): void {
    const me = this;
    
    me.options = [
      {label: 'Off'},
      {label: 'On'},
    ]
  }

}
