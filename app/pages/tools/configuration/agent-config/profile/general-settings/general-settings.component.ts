import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent implements OnInit {

  breadcrumb: MenuItem[] = [];
  items: MenuItem[];
  activeTab: MenuItem;
  
  constructor(
    private router : Router,
  ) { }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home' },
      { label: 'Configuration' },
      { label: 'General Setting' },
    ]
    me.items = [
      {label: 'Flowpath', routerLink: '/general-settings/flowpath'},      
      {label: 'Hotspot', routerLink: '/general-settings/hotspot'},
      {label: 'Capture Exception', routerLink: '/general-settings/capture-exception'},
      {label: 'Flowpath Http Data', routerLink: '/general-settings/flowpath-http-data'},
      {label: 'Custom Data', routerLink: '/general-settings/custom-data'},
      {label: 'Instrumentation Profile', routerLink: '/general-settings/instrumentation-profile'},
      {label: 'Percentile',  routerLink: '/general-settings/percentile'},
      {label: 'Others', routerLink: '/general-settings/others'}
    ];    
  }
}
