import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  private defaults = [{ label: 'Home', routerLink: '/home'}];
  private items: MenuItem[] = [];
  private observe;
  private $menuObserver;

  constructor(private router: Router) {
    this.items = this.items.concat(this.defaults);

    /**Need to remove before commit, for testing only. */
    /*this.items = this.items.concat([
      { label: 'dashboard', routerLink: "/dashboard" },
      { label: 'ddr', routerLink: '/ddr'},
      { label: 'netvision', routerLink: '/ddr'}
    ]);*/

    this.observe = new Subject<MenuItem[]>();
    this.$menuObserver = this.observe.asObservable();
  }

  /*Returns Observable<MenuItem[]>*/
  getBreadcrumbMenu(): Observable<MenuItem[]> {
    /**To get menu at first time after async pipe subscribe it. */
    //we are removing timeout part as it delaying the whole UI by 1 munite every time
    //setTimeout(() => this.observe.next(this.items), 1000);
    this.observe.next(this.items);
    return this.$menuObserver;
  }

  /**Add new breadcrumb and refresh the breadcrumb UI as well. */
  add(item: MenuItem) {
    this.addNewBreadcrumb(item);
    this.observe.next(this.items);
  }

  /**Remove all, use the flag if need to add default. */
  removeAll(ignoreDefaults = false) {
    this.items = [];
    if (!ignoreDefaults) {
      this.items = this.items.concat(this.defaults);
    }
  }

  /**Event Handler when clicked on any breadcrumb menu. */
  handleBreadcrumbClick($event) {
    let item : MenuItem = $event.item;
    if (item && item.routerLink) {
      this.router.navigate([item.routerLink], {queryParams: item.queryParams, replaceUrl: item.replaceUrl});
      this.markActive(item);
    }
  }

  /**Add new Item in breadcrumb array and mark it active. If old item exist then make it active. */
  addNewBreadcrumb(newItem: MenuItem) {
    /**Checking the active item index. */
    let currentActiveIdx = this.items.findIndex(item => (item['active'] === true));
    if (currentActiveIdx >= 0 && currentActiveIdx != (this.items.length - 1)) {
      /**If current active is not last, then it will be the new branch of breadcrumb. */
      /**Removing all the items after current active. */
      this.removeFrom(currentActiveIdx);
    }

    let oldItem: MenuItem[]  = this.items.filter(item => item.label == newItem.label);
    if (oldItem && oldItem.length > 0) {
      oldItem[0].queryParams = newItem.queryParams;
      this.markActive(oldItem[0]);
    } else {
      this.items.push(newItem);
      this.markActive(newItem);
    }
  }

  removeFrom(index) {
    if (index > this.items.length) {
      return;
    }

    /**This will reset array length and removes other items. */
    this.items.length = index + 1;
  }

  markActive(activeItem) {
    this.items.forEach((item, index) => {
      if (item.label === activeItem.label) {
        item['active'] = true;
      } else {
        item['active'] = false;
      }
    });
  }
}
