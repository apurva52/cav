import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { Action } from './schedules-filters.model';

@Component({
  selector: 'app-schedules-filters',
  templateUrl: './schedules-filters.component.html',
  styleUrls: ['./schedules-filters.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SchedulesFiltersComponent extends PageSidebarComponent
implements OnInit {

  selectedItem;
  options: MenuItem[];
  selectedSessions: string[];
  selectedActions: Action;
  actions: Action[];

  constructor() {
    super();
   }

  ngOnInit(): void {
    const me = this;
    me.options = [
      {
        label: 'Live',
        items: [
          { label: 'Last 5 Minutes' },
          { label: 'Last 10 Minutes' },
          { label: 'Last 30 Minutes' },
          { label: 'Last 1 Hours' },
          { label: 'Last 2 Hours' },
          { label: 'Last 4 Hours' },
          { label: 'Last 6 Hours' },
          { label: 'Last 8 Hours' },
          { label: 'Last 12 Hours' },
          { label: 'Last 24 Hours' },
          { label: 'Today' },
          { label: 'Last 7 Days' },
          { label: 'Last 30 Days' },
          { label: 'Last 90 Days' },
          { label: 'This Week' },
          { label: 'This Month' },
          { label: 'This Year' },
        ],
      },
      {
        label: 'Past',
        items: [
          { label: 'Yesterday' },
          { label: 'Last Week' },
          { label: 'Last 2 Week' },
          { label: 'Last 3 Week' },
          { label: 'Last 4 Week' },
          { label: 'Last Month' },
          { label: 'Last 2 Month' },
          { label: 'Last 3 Month' },
          { label: 'Last 6 Month' },
          { label: 'Last Year' },
        ],
      },
      {
        label: 'Events',
        items: [
          {
            label: 'Black Friday',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'Christmas Day',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'Cyber Monday',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'Good Friday',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'New Years Day',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'Presidents Day',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'Thanks Giving Day',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
          {
            label: 'Valentines Day',
            items: [
              { label: '2020' },
              { label: '2019' },
              { label: '2018' },
              { label: '2017' },
              { label: '2016' },
              { label: '2015' },
              { label: '2014' },
              { label: '2013' },
              { label: '2012' },
              { label: '2011' },
              { label: '2010' },
            ],
          },
        ],
      },
      {
        label: 'Custom',
      },
    ];

    this.actions = [
      { name: "Login", icon: 'icons8 icons8-plus-math'},
      { name: "Logout", icon: 'icons8 icons8-plus-math'},
      { name: "Transaction", icon: 'icons8 icons8-plus-math'},
      { name: "Click", icon: 'icons8 icons8-plus-math'},
      { name: "ForceLogout", icon: 'icons8 icons8-plus-math'}
    ];
  }

  onClickMenu(item) {
    console.log('show item:' + item);
    this.selectedItem = item.toElement.innerText;
  }

  drillDownFilterApply() {
    const me = this;
    super.hide();
  }

  drillDownFilterReset() { }



  closeClick() {
    const me = this;
    super.hide();
  }

  remove(event) {
    const me = this;
    console.log('called');
  }

}
