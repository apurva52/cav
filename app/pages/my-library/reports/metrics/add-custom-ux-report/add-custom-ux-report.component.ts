import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { ADD_CUSTOM_UX_REPORT_DATA } from './service/add-custom-ux-report.dummy';
import { AddCustomUxReportData } from './service/add-custom-ux-report.model';

@Component({
  selector: 'app-add-custom-ux-report',
  templateUrl: './add-custom-ux-report.component.html',
  styleUrls: ['./add-custom-ux-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddCustomUxReportComponent implements OnInit {
  breadcrumb: MenuItem[];
  data: AddCustomUxReportData;
  showTabs;
  filtersArray =[0];
  
  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'System' },
      { label: 'Reports' },
      { label: 'Add Report Settings' },
    ];
    this.showTabs = {
      "one": true,
      "two": true,
    };
    me.data = ADD_CUSTOM_UX_REPORT_DATA;
  }


  addFilterList(){
    const me = this;
    me.filtersArray.push(0);
  }

  removeFilter(index){
    const me = this;
    me.filtersArray.splice(index, 1);
  }
}
