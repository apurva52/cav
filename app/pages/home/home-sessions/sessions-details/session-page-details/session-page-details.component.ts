import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { DataManager } from '../../common/datamanager/datamanager';
import { Session } from '../../common/interfaces/session';
import { SessionStateService } from '../../session-state.service';
import { SESSION_PAGE_DATA } from './service/session-page-details.dummy';
import { SessionPageData } from './service/session-page-details.model';
import { NVAppConfigService } from './../../common/service/nvappconfig.service';
import { NvhttpService, NVPreLoadedState } from '../../common/service/nvhttp.service';
import { Store } from 'src/app/core/store/store';

@Component({
  selector: 'app-session-page-details',
  templateUrl: './session-page-details.component.html',
  styleUrls: ['./session-page-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SessionPageDetailsComponent implements OnInit {   
  selectedSession : Session;
  configVersion: any = "-";
  jsVersion: string = "-";
  display: boolean = false;
  nvconfigurations: any;
  showBotSummary = false; 
  appFlag: boolean = false;

  constructor(private route : ActivatedRoute, private stateService: SessionStateService , private nvAppConfigService: NVAppConfigService, private nvHttp : NvhttpService) { 
    this.nvAppConfigService.getdata().subscribe(response => {
      this.nvconfigurations = response;
    });
  }

  ngOnInit(): void {
    const me = this;
    this.route.queryParams.subscribe(params => {
      console.log("params in sessions details : ", params);
   });
   this.stateService.set('selectedTab', 'detail');
   this.stateService.onSessionChange().subscribe((idx: number) => {
     console.log('session-page-details, session change - ', idx);

     this.selectedSession = this.stateService.getSelectedSession();
     
     console.log('session-page-detail selectedSession - ', this.selectedSession);
     this.getAppSessionData();
   })

   this.selectedSession = this.stateService.getSelectedSession();
   this.getAppSessionData();
   console.log('session-page-detail selectedSession - ', this.selectedSession);
   if(this.selectedSession["configVersion"] != null && this.selectedSession["configVersion"] != undefined && !isNaN(this.selectedSession["configVersion"]))  {
    this.configVersion = (this.selectedSession["configVersion"] * 60 ) + this.nvconfigurations.cavEpochDiff;
    let dateTime = new Date(this.configVersion * 1000);
    this.configVersion = moment(dateTime).format("MM/DD/YY HH:mm");
    //console.log("this.configVersion " , this.configVersion);
  }

  if(this.selectedSession["jsVersion"] != null && this.selectedSession["jsVersion"] != undefined && this.selectedSession["jsVersion"] != "")  {
    let js = this.selectedSession["jsVersion"].split("_");
    let jsTime = new Date(((parseInt(js[1] , 16) * 60) + this.nvconfigurations.cavEpochDiff) * 1000);
    this.jsVersion = js[0] + " " + moment(jsTime).format("MM/DD/YY HH:mm");
  }
 } 
 showbots(){ 
   this.display = true;
   this.showBotSummary = true;
 }
 getAppSessionData()
 {         
    let appObj = {"appname" : "", "appversion":""};
    let rowEvent = this.selectedSession;
    this.appFlag = true;
    //Android -10| IphoneApp- 21 | WindowsApp - 20
    let browser_id = Number(this.selectedSession.browser.id); 
    if(browser_id === 10 || browser_id === 21 || browser_id === 20)
    {
      //this.appFlag = true;
      let st =  rowEvent.startTime;
      let et = rowEvent.endTime;
      let isActive  = this.stateService.get('isActive', false);
      // for completed session
      if(!isActive){
       st = Number(rowEvent.startTime) - this.nvconfigurations.cavEpochDiff;
       et = Number(rowEvent.endTime) - this.nvconfigurations.cavEpochDiff;
      }
      this.nvHttp.getApplicationView(rowEvent.sid,st,et).subscribe((state: Store.State) => {
        if(state instanceof NVPreLoadedState){
          let response = state.data;
          if(response && response.length > 0)
          {
              let appversionid = response[0].applicationVersionId;
	            this.nvHttp.getApplicationName(appversionid).subscribe((res:any) => {
                //if(state instanceof NVPreLoadedState){
                    if(res)
                    {
		                  appObj["appname"] = res.split("/")[0];
                      appObj["appversion"] = res.split("/")[1];
                      this.selectedSession["applicationName"] = appObj["appname"]; 
                      this.selectedSession["applicationVersion"] =  appObj["appversion"];
                      this.appFlag = false;
                    }
                //}
              },   
              err => {
                 console.log("Error occured while getting mobile app name", err);
                  this.appFlag = false;
              });
           }
           else
           {
	            this.appFlag = false;
           }
        }
      },
      err => {
          console.log("Error occured while getting mobile app session data", err);
          this.appFlag = false;
      });
    }
    else
    {
       this.appFlag = false;
    }
    //return appObj;        
  }

}
