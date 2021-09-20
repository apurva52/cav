import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TabNavigatorService } from '../../services/tab-navigator.service';
import 'moment-timezone';
import { SelectionModel } from '@angular/cdk/collections';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'runCmd-nav-bar',
  templateUrl: './runCmd-nav-bar.component.html',
  styleUrls: ['runCmd-nav-bar.component.scss'],
})
export class RunCmdNavBarComponent implements OnInit {

  displayDate: string;
  timeZone: string;
  timeZoneId: string;
  tabLinks: any[];
  subscription: Subscription;
  selection = new SelectionModel();
  activeLinkIndex = 0;
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb: MenuItem[];
  constructor(private tabNavigatorService: TabNavigatorService, private router: Router) {
    setInterval(() => {
      this.displayDate = "";//moment().tz(this.timeZoneId).format('MM/DD/YYYY HH:mm:ss') + " "+this.timeZone;
    }, 1000);

    this.tabLinks = [
      { label: 'Command on Server', link: 'main', id: "100" },
    ];

    /*Listening Event to add Tab*/
    this.subscription = tabNavigatorService.navigateTabProvider$.subscribe(

      /*Getting Event Here.*/
      value => {

        let isTabExist = this.isTabAlreadyExist(value);
        if (!isTabExist)
          this.tabLinks.push(value);
      }
    );

    /*Listening Event to remove Tab*/
    this.subscription = tabNavigatorService.removeTabProvider$.subscribe(

      /*Getting Event Here.*/
      value => {
        for (var i = 0; i < this.tabLinks.length; i++) {
          if (this.tabLinks[i].id == value)
            this.tabLinks.splice(i, 1);
        }
      }
    );
    this.selection.select(this.tabLinks[0]); // Will select the first tab.
  }

  /**This method is to check whetther the tab is already exist*/
  isTabAlreadyExist(value): boolean {
    if (this.tabLinks != undefined && this.tabLinks.length > 0) {
      for (let i = 0; i < this.tabLinks.length; i++) {
        if (this.tabLinks[i]["label"] == value["label"])
          return true;
      }
    }

    return false;
  }

  ngOnInit() {
    this.breadcrumb = [
      { label: 'Home' },
      { label: 'Action' },
      { label: 'Run Command' },
    ]
    this.tabNavigatorService.timeZoneInfoProvider$.subscribe(res => this.setTimeInfo(res));
  }

  setTimeInfo(res) {
    this.timeZoneId = res.timeZoneID;
    this.timeZone = res.timezone;
  }

  select(tab) {
    if (!this.selection.isSelected(tab)) {
      this.selection.clear(); // Only one tab can be selected in this way
      this.selection.select(tab);
    }
  }

  isSelected(tab): boolean {
    return this.selection.isSelected(tab);
  }

  setActiveTab(i) {
    this.activeLinkIndex = i;
    if (this.activeLinkIndex === 0) {
      this.router.navigate(['/run-command-V1/main']);
    }
    else if (this.activeLinkIndex === 1) {
      this.router.navigate(['/run-command-V1/EditMode']);
    }
    this.selection.select(this.tabLinks[i]);
  }
}
