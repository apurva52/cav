import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { DashboardComponent } from 'src/app/shared/dashboard/dashboard.component';
import { DashboardService } from 'src/app/shared/dashboard/service/dashboard.service';

import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { HomeService } from './system/service/home.service';
import { Store } from 'src/app/core/store/store';
import { HomeStateLoadedStatus, HomeStateLoadingErrorStatus, HomeStateLoadingStatus } from './system/service/home.state';
import { updateSequence } from './system/service/UpdateSequence.model';
import { JsonArrayComponent } from 'src/app/shared/dynamic-form/controlType/json-array/json-array.component';
import { SessionService } from 'src/app/core/session/session.service';
import * as moment from 'moment';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {


  tabs: MenuItem[];  
  access: boolean;
@ViewChild('menu') menuList : any;
  constructor(private dashboardService : DashboardService , private homeService : HomeService , private session:SessionService, private breadcrumbService : BreadcrumbService ) { 
      this.breadcrumbService.removeAll(false);
  }


  ngOnInit(): void {
    if(sessionStorage.getItem("Permission") == "true"){
      this.access = true;
    }
    else{
      this.access = false;
    }
if(this.session.session.sequence){
  this.tabs = JSON.parse(this.session.session.sequence);
}
else{

    this.tabs = [
      { label: 'DASHBOARD', routerLink: 'dashboard' }, 
      { label: 'SYSTEM', routerLink: 'system' },
      { label: 'FUNNEL', routerLink: 'funnel' },
      // { label: 'EVENTS', routerLink: 'events' },
      { label: 'SESSION', routerLink: 'home-sessions' },
      { label: 'LOGS', routerLink: 'logs' },
      { label: 'NET HAVOC', routerLink: 'net-havoc' },
       { label: 'END TO END', routerLink: '/exec-dashboard' },
      // { label: 'Link 2', routerLink: 'b' },
      // { label: 'Link 3', routerLink: 'c' },
      // { label: 'Link 4', routerLink: 'd' },
      // { label: 'Link 5', routerLink: 'e' },
      // { label: 'Link 6', routerLink: 'f' },
      // { label: 'Link 7', routerLink: 'g' },
      // { label: 'Link 8', routerLink: 'h' },
      // { label: 'Link 9', routerLink: 'j' },
      // { label: 'Link 10', routerLink: 'k' },
      // { label: 'Link 11', routerLink: 'l' },
      // { label: 'Link 12', routerLink: 'm' },
      // { label: 'Link 13', routerLink: 'n' },
      // { label: 'Link 14', routerLink: 'o' },
      // { label: 'Link 15', routerLink: 'p' },


    ];
  }
  
  //set timezone for NV module.
  let tzString;
  try {
    tzString = this.session['stateSession']['data'].defaults.serverTimeInfo.zoneId;
  } catch(e) {
    tzString = moment.tz.guess();
  }
  console.log('Setting _nvtimezone ' +  tzString);
  sessionStorage.setItem('_nvtimezone', tzString); 

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tabs, event.previousIndex, event.currentIndex);
    let updateObj : updateSequence = {
      fileName : this.session.session.cctx.u,
      sequence : JSON.stringify(this.tabs)
    }
    this.homeService.setUserSequence(updateObj).subscribe(
      (state: Store.State) => {
        if (state instanceof HomeStateLoadingStatus) {
          this.setSequenceLoadingState(state);
          return;
        }
  
        if (state instanceof HomeStateLoadedStatus) {
          this.setSequenceLoadedState(state);
          return;
        }
      },
      (state: HomeStateLoadingErrorStatus) => {
        this.setSequenceLoadingErrorStatus(state);
      }
    );
  }


  getTabOptionsFor(tab: MenuItem): MenuItem[] {

    const me = this;

    return [
      {
        label: 'Set as Default',
        command: () => {
          me.tabSetDefault(tab);
        },
        disabled: true
      },
      {
        label: 'Change Order', command: () => {
          me.tabSetDefault(tab);
        },
        disabled: true
      },
    ];
  }

  tabSetDefault(tab: MenuItem) {
    console.log('Set to defualt', tab); // TODO: Call Service
  }

  tabChangeOrder(tab: MenuItem) {
    console.log('Change the order', tab); // TODO: Call Service
  }

  setSequenceLoadingState(data:any){
console.log("in loading state");
  }
setSequenceLoadedState(data:any){
  console.log("in loaded state");
}
setSequenceLoadingErrorStatus(data:any){
  console.log("in loaded error state");
}
}
