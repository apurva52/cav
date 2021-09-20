import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { PANEL_DUMMY, SETTING_DATA } from './service/settings.dummy';
import { settingData } from './service/settings.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {

  panel: any;
  selectedOptions: MenuItem;
  options: MenuItem[];
  selectedOptions1: MenuItem;
  options1: MenuItem[];
  data: settingData;

  constructor() { }

  ngOnInit(): void {
    const me = this;

    me.panel = PANEL_DUMMY;
    me.data = SETTING_DATA;

    me.options = [
      {label: '--Select--'},
      {label: 'Dummy Text'},
      {label: 'Dummy Text'},
    ];

    me.options1 = [
      {label: 'Uncompressed'},
      {label: 'Compressed'},
    ];
    
  }

}
