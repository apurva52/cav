import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { BUSINESS_APPLICATION_VIEW } from './service/business-application-view.dummy';

@Component({
  selector: 'app-business-application-view',
  templateUrl: './business-application-view.component.html',
  styleUrls: ['./business-application-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BusinessApplicationViewComponent implements OnInit {

  breadcrumb: MenuItem[] = [];
  data: any;

  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home' },
      { label: 'Business Summary View' },
      { label: 'Business Application View' },
    ]

    me.data = BUSINESS_APPLICATION_VIEW;
  }

}
