import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { CavTopPanelNavigationService } from '../services/cav-top-panel-navigation.service';
import { CavConfigService } from '../services/cav-config.service';
import { Router } from '@angular/router';

@Injectable()
export class AlertConfigService
{
  private clientConnectionKey = "";
  private graphTimeLabel="Last 4 Hours"
  private activeAlertType = "Capacity";
  private activeSeverityType = "All";
  private moduleName = "active";
  private alertCounterClicked = new Subject<any>();
  alertCounterClicked$ = this.alertCounterClicked.asObservable();
  private runningTRNum = -1;
  private alertGraphUrl: string;
  private alertACLData: any;
  private alertMultiCondEnable: any;
  private callFromED: any;
  private severityFromED: any;
  private storeNameFromED: any;
  cpCriticalCount: string;
  cpMajorCount: string;
  cpMinorCount: string;
  bhCriticalCount: string;
  bhMajorCount: string;
  bhMinorCount: string;

  constructor(private _cavConfigService: CavConfigService,private _navService: CavTopPanelNavigationService, private _router: Router, 
              ) { }
  
  /** This method is used to show alert graph data in dashboard */
  setAlertGraphsData(urlGraphData: any)
  {
    let singleDcName = urlGraphData.substring(urlGraphData.length, urlGraphData.lastIndexOf("&") + 1);
    let updateUrlGraphData = urlGraphData.substring(0, urlGraphData.lastIndexOf("&"));

    if(singleDcName !== '')
    {
      sessionStorage.setItem('appPathForDC', `//${this._cavConfigService.$host}:${this._cavConfigService.$port}/tomcat/${singleDcName}/ProductUI`);
      this._cavConfigService.$dashboardTestRun = this._cavConfigService.getTestRunForDC(singleDcName);
      this._cavConfigService.setActiveDC(singleDcName);
      sessionStorage.setItem('activeDC', singleDcName);
      this._navService.addDCNameForScreen("dashboard", singleDcName);
    }
    else
    {
      this._cavConfigService.setActiveDC(sessionStorage.getItem('activeDC'));
      sessionStorage.setItem('activeDC', sessionStorage.getItem('activeDC'));
      this._navService.addDCNameForScreen("dashboard", this._cavConfigService.getActiveDC());
    }

    this.alertGraphUrl = updateUrlGraphData;
     
    let isBrowserTab = Number(localStorage.getItem('isBrowserTab'));

    if(isBrowserTab === 0) {

      localStorage.removeItem('alertGraphUrl');

      this._navService.addNewNaviationLink('dashboard');

      this._navService.activateNavigationLink('dashboard');

      this._router.navigate(['/home/dashboard/favoritePanel']);

    }else {

      localStorage.setItem('alertGraphUrl', updateUrlGraphData);

     // this._cavOpenNewBrowserTab.openModuleInNewBrowserTab('dashboard', '#/home/dashboard/favoritePanel');

    }
  }

  setAlertCounterValue(alertType: string, severityType: string)
  {
    this.activeAlertType = alertType;
    this.activeSeverityType = severityType;
    let reqObj = {};
    reqObj["type"] = alertType;
    reqObj["severity"] = severityType;

    this.alertCounterClicked.next(reqObj);
  }

  updateAlertCounterForceClearReset(res: any)
  {
    if(res.type == "Capacity")
    {
      this.cpCriticalCount = res.cpCriticalCount;
      this.cpMajorCount = res.cpMajorCount;
      this.cpMinorCount = res.cpMinorCount; 
    }
    else if(res.type == "Behavior")
    {
      this.bhCriticalCount = res.bhCriticalCount;
      this.bhMajorCount = res.bhMajorCount;
      this.bhMinorCount = res.bhMinorCount;
    }
  }
  
  public get $alertACLData(): any
  { 
    return this.alertACLData;
  }
  public set $alertACLData(aclData: any)
  { 
    this.alertACLData = aclData;    
  }
  
  public get $alertMultiCondEnable(): any
  { 
    return this.alertMultiCondEnable;
  }
  public set $alertMultiCondEnable(multiCondEnable: any)
  { 
    this.alertMultiCondEnable = multiCondEnable;    
  }

  public get $callFromED(): any
  { 
    return this.callFromED;
  }
  public set $callFromED(callFromED: any)
  { 
    this.callFromED = callFromED;    
  }

  public get $severityFromED(): any
  { 
    return this.severityFromED;
  }
  public set $severityFromED(severityFromED: any)
  { 
    this.severityFromED = severityFromED;    
  }

  public get $storeNameFromED(): any
  { 
    return this.storeNameFromED;
  }
  public set $storeNameFromED(storeNameFromED: any)
  { 
    this.storeNameFromED = storeNameFromED;    
  }

  public get $clientConnectionKey(): string
  { 
    return this.clientConnectionKey;
  }
  public set $clientConnectionKey(value: string)
  { 
    this.clientConnectionKey = value;    
  }

  public get $graphTimeLabel(): string
  {
    return this.graphTimeLabel;
  }
  public set $graphTimeLabel(value: string)
  {
    this.graphTimeLabel = value;
  }
  
  public get $activeAlertType(): string 
  { 
    return this.activeAlertType;
  }
  public set $activeAlertType(value: string)
  { 
    this.activeAlertType = value;
  }

  public get $activeSeverityType(): string
  {
    return this.activeSeverityType;
  }
  public set $activeSeverityType(value: string)
  { 
    this.activeSeverityType = value;
  }

  public get $moduleName(): string
  { 
    return this.moduleName;
  }
  public set $moduleName(value: string)
  { 
    this.moduleName = value;
  }

  public get $runningTestRunNum() : number
  {
    return this.runningTRNum;
  }  
  public set $runningTestRunNum(value: number)
  {
    this.runningTRNum = value;
  }

  public get $alertGraphUrl(): string
  { 
    return this.alertGraphUrl;
  }
  public set $alertGraphUrl(value: string)
  { 
    this.alertGraphUrl = value;    
  }
 
}
