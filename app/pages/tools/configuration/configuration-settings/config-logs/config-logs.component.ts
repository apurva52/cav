import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-config-logs',
  templateUrl: './config-logs.component.html',
  styleUrls: ['./config-logs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigLogsComponent implements OnInit {

  options: MenuItem[];
  selectedOptions: MenuItem;
  selectedValues: string = 'saveConfigFile';

  constructor() { }

  ngOnInit(): void {
    const me = this;
    
    me.options = [
      {label: 'ALL'},
      {label: 'ALL'},
      {label: 'ALL'},
      {label: 'ALL'},
      {label: 'ALL'}
    ]
  }
}
