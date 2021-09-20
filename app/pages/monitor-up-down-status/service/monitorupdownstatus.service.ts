import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { MonitorupdownstatusLoadedState, MonitorupdownstatusErrorState } from './monitorupdownstatus.state';
import { environment } from 'src/environments/environment';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { MonitorupdownstatusPayload } from './monitorupdownstatus.model';
import { DownloadReportLoadedState, DownloadReportLoadingErrorState, DownloadReportLoadingState } from 'src/app/shared/dashboard/dialogs/metric-description/service/metric-description.state';
import { APIData } from '../containers/api-data';
import { MessageService, TreeNode } from 'primeng';
import * as _ from "lodash";

export const CCTX = 'cctx';
export const SUMMARY_ERROR = "ERROR";
export const SEVERITY_ERROR = "error";

@Injectable({
  providedIn: 'root',
})
export class MonitorupdownstatusService extends Store.AbstractService {
  apiData: APIData;
  public customData = new Subject<any>();    //added to fill data in custom deployment UIs in edit mode
  public $customData = this.customData.asObservable();
  public tier: string = null;   //added to maintain tierName in landed page
  public navTierFlag: boolean
  public flag:boolean
  public navTierName:string
  public navServerFlag: boolean
  public gMonId = "-1";
  healthCheckTreeTableData: TreeNode[] = [];
  public saveMonConf = new Subject<boolean>();    //added to fill data in custom deployment UIs in edit mode
  public $saveMonConf = this.saveMonConf.asObservable();
  agentTierList:any[] = [];
  public deleteMonConf = new Subject<boolean>(); // added to detect delete operation is performed to clear form fields in case of other monitors
  public $deleteMonConf = this.deleteMonConf.asObservable();
  public statusDetail:any = {}
  public routeFlag:boolean

  constructor(private sessionService: SessionService, private messageService: MessageService) {
    super();
  }

  load(clientObj: MonitorupdownstatusPayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    // setTimeout(() => {
    //   output.next(new MonitorupdownstatusLoadingState());
    // }, 0);


    // setTimeout(() => {
    //   output.next(new MonitorupdownstatusLoadedState());
    //   output.complete();
    // }, 2000);

    // setTimeout(() => {
    //   output.error(new MonitorupdownstatusErrorState(new Error()));
    // }, 2000);

    let path = environment.api.allMonitors.load.endpoint;
    const payload = {
      cctx: me.sessionService.session.cctx,
      tr: Number(me.sessionService.testRun.id),
      sp: clientObj.sp
    }

    const subscription = me.controller.post(path, payload).subscribe(
      (data) => {

        output.next(new MonitorupdownstatusLoadedState(data));
        output.complete();
      },
      (error: AppError) => {
        output.error(new MonitorupdownstatusErrorState(error));
        output.complete();
      }
    );

    return output;
  }

  downloadShowDescReports(downloadType, tableData, header): Observable<Store.State> {
    try {
      const me = this;
      const output = new Subject<Store.State>();

      setTimeout(() => {
        output.next(new DownloadReportLoadingState());
      }, 3000);

      let skipColumn = [];
      let downloadDataPayload = {};
      let rowData: any[] = [];

      for (let i = 0; i < tableData.length; i++) {
        let rData: string[] = [];
        let number = i + 1;
        rData.push(number.toString());
        rData.push(tableData[i].time);
        rData.push(tableData[i].agentStartTime);
        rData.push(tableData[i].component);
        rData.push(tableData[i].tier);
        rData.push(tableData[i].hostName);
        rData.push(tableData[i].server);
        rData.push(tableData[i].instance);
        rData.push(tableData[i].icon);
        rowData.push(rData);
      }

      downloadDataPayload = {
        "testRun": me.sessionService.testRun.id,
        "clientconnectionkey": me.sessionService.session.cctx.cck,
        "userName": me.sessionService.session.cctx.u,
        "productName": me.sessionService.session.cctx.prodType,
        "downloadType": downloadType,
        "skipColumn": skipColumn,
        "rowData": rowData,
        "header": header,
        "reportTitle": "MONITOR UP/DOWN STATUS"
      }

      let downloadPath = environment.api.dashboard.download.endpoint;
      me.controller.post(downloadPath, downloadDataPayload).subscribe((DownloadReportData: any) => {
        output.next(new DownloadReportLoadedState(DownloadReportData));
        output.complete();
      },
        (error: AppError) => {
          output.next(new DownloadReportLoadingErrorState(error));
          output.complete();
        }
      );
      return output;
    } catch (err) {
      console.log("Exception has occured while Downloading Report for Show Description", err);
    }
  }

  fillCustomMonData(val) {
    this.customData.next(val);
  }

  getMonitorConfiguration(techName) {
    this.apiData = new APIData()
    this.apiData.tName = techName;
    this.apiData.cctx = this.sessionService.session.cctx;
    let url = environment.api.monitor.monConfig.endpoint;
    return this.controller.post(url, this.apiData);
  }

  saveMonitorConfiguration(reqBody, tName, oid) {
    let me = this;
    me.apiData = new APIData();
    me.apiData.tName = tName;
    me.apiData.saveMonDTO = reqBody;
    me.apiData.cctx = me.sessionService.session.cctx;
    me.apiData.tr = Number(me.sessionService.testRun.id);
    let url = environment.api.monitor.saveConfig.endpoint;
    return me.controller.post(url, me.apiData);
  }
  
  getConfigInfo(techName) {
    let me = this;
    me.apiData = new APIData();
    me.apiData.tName = techName;
    me.apiData.cctx = me.sessionService.session.cctx;
    let url = environment.api.monitor.configInfo.endpoint;
    return me.controller.post(url, me.apiData);
  }

  removeConfigurationInfo(gMonId, _id, techName) {
    let me = this;
    me.apiData = new APIData();
    me.apiData.tName = techName;
    me.apiData.gMonID = gMonId;
    me.apiData.objectId = _id;
    me.apiData.cctx = me.sessionService.session.cctx;
    let url = environment.api.monitor.delConfig.endpoint;
    return me.controller.post(url, me.apiData);
  }

  getMonitorConfigurationAtEdit(techName, gMonId?, _id?) {
    let me = this;
    me.apiData = new APIData()
    me.apiData.tName = techName;
    me.apiData.gMonID = gMonId;
    me.apiData.objectId = _id;
    me.apiData.cctx = me.sessionService.session.cctx;
    let url = environment.api.monitor.monConfig.endpoint;
    return me.controller.post(url, me.apiData);
  }

  getConfigureTechnology(apiData) {
    let me = this;
    let url = environment.api.monitor.monStat.endpoint
    apiData.cctx = me.sessionService.session.cctx;
    return me.controller.post(url, apiData)
  }

  getAvailableTech(apiData) {
    let me = this;
    let url = environment.api.monitor.availTech.endpoint
    apiData.cctx = me.sessionService.session.cctx;
    return me.controller.post(url, apiData)
  }

  getTierList() {
    let me = this
    let url = environment.api.monitor.getTierList.endpoint + "?productKey=" + me.sessionService.session.cctx.pk + "&userName=" + me.sessionService.session.cctx.u;
    me.controller.get(url).subscribe(res=>{
      if(res)
        this.setAgentTierList(res);
    })
    return me.controller.get(url)
  }

  getServerList(tierId) {
    let me = this;
    let url = environment.api.monitor.getServerList.endpoint + "?" + "tierId=" + tierId;
    let payLoad={};
    payLoad[CCTX] = me.sessionService.session.cctx;
    if(me.sessionService.isMultiDC){
        let tierName = me.getAgentTierName(tierId);
        payLoad['subject']  = me.getPostPayloadSubject(tierName);
    }
    return me.controller.post(url, payLoad)
  }

  reload() {
    let me = this;
    let url = environment.api.monitor.reload.endpoint + "?productKey=" + me.sessionService.session.cctx.pk + "&userName=" + me.sessionService.session.cctx.u;
    return this.controller.get(url)
  }

  useGloablConfig(gMonId, _id, techName) {
    let me = this;
    me.apiData = new APIData()
    me.apiData.tName = techName;
    me.apiData.gMonID = gMonId;
    me.apiData.objectId = _id;
    me.apiData.cctx = me.sessionService.session.cctx;
    let url = environment.api.monitor.useGlobal.endpoint;
    return this.controller.post(url, this.apiData);
  }

  validateAtSaveForRequiredProp(val) {
    this.saveMonConf.next(val);
  }

  getMonitorStatus(apiData) {
    let me = this;
    let url = environment.api.monitor.getMonStatusOverAll.endpoint
    if(me.sessionService.isMultiDC)
    {
      if(apiData.tier)
         Object.assign(apiData, {"subject": me.getPostPayloadSubject(apiData.tier)});
    }
    apiData.cctx = me.sessionService.session.cctx;
    return me.controller.post(url, apiData)
  }

  getMonitorStatusInfo(apiData) {
    let me = this;
    let url = environment.api.monitor.getMonStatusInfo.endpoint

    if(me.sessionService.isMultiDC)
    {
      if(apiData.tier)
        Object.assign(apiData, {"subject": me.getPostPayloadSubject(apiData.tier)});
    }
    apiData.cctx = me.sessionService.session.cctx;
    return me.controller.post(url, apiData)
  }

  getErrorSteps(errCode) {
    let me = this;
    let url = environment.api.monitor.getErrorSteps.endpoint + "?errorCode=" + errCode + "&productKey=" + me.sessionService.session.cctx.pk + "&userName=" + me.sessionService.session.cctx.u;
    return me.controller.get(url)
  }
  getAutoMon() {
    let me = this;
    let url = environment.api.monitor.defaultMon.endpoint + "?productKey=" + me.sessionService.session.cctx.pk + "&userName=" + me.sessionService.session.cctx.u;
    return me.controller.get(url)
  }
  saveAutoMon(data) {
    let me = this;
    let url = environment.api.monitor.saveDefaultMon.endpoint
    data[CCTX] = me.sessionService.session.cctx;
    return me.controller.post(url, data)
  }

  otherMonConfig(gMonID, objId, tName) {
    const me = this;
    me.apiData = new APIData();
    me.apiData.gMonID = gMonID
    me.apiData.objectId = objId
    me.apiData.tName = tName
    me.apiData.cctx = me.sessionService.session.cctx;
    let url = environment.api.monitor.otherMonConfig.endpoint;
    return me.controller.post(url, me.apiData)
  }

  saveHealthCheckConfiguration(data) {
    let me = this;
    data[CCTX] = me.sessionService.session.cctx;
    let url = environment.api.monitor.saveHealthCheckMonProfile.endpoint
    return me.controller.post(url, data)
  }

  getHealthChkMonData(gmonId) {
    const me = this;
    let url = environment.api.monitor.getHealthCheckData.endpoint;
    me.apiData = new APIData();
    me.apiData.gMonID = gmonId;
    me.apiData.cctx = me.sessionService.session.cctx;
    return me.controller.post(url, me.apiData)
  }


  getHealthCheckTreeTableData() {
    return this.healthCheckTreeTableData;
  }

  setHealthCheckTreeTableData(heathCheckMonitorData) {
    this.healthCheckTreeTableData = heathCheckMonitorData;
  }

  // Method called for making payload in case of multi DC
  getPostPayloadSubject(tierName?:string){
    let  subject =
      {
        "tags" : [
          {
          "key" : "Tier",
          "value" : tierName,
          "mode" : 1,
        }
      ]
     }
   return subject;
  }

  getAgentTierList(){
    return this.agentTierList;
  }

  setAgentTierList(data){
    return this.agentTierList = data;
  }

  // method to get tiername on passing tierId.
  getAgentTierName(tierId){
    let that = this;
    let tierList = that.getAgentTierList();
    let tierInfo;
    if(tierList)
    {
      tierInfo = _.find(tierList, function (each) { return each['id'] === tierId })
      console.log("Method getAgentTierName called. tier information = ", tierInfo)
      if(tierInfo)
       return tierInfo.tName;
    }

  }

  gdfDetail(item){
    const me = this;
    let url = environment.api.monitor.getMonitorStats.enpoint;
    me.apiData = new APIData();
    if(item['gdfName']){
      me.apiData.gdfName = item['gdfName']
    }
    else{
      me.apiData.tName=item['techName']
      me.apiData.monName=item['inMonName']
    }
    me.apiData.cctx = me.sessionService.session.cctx;
    return me.controller.post(url, me.apiData)
  }

  downloadProfile(techName){
    const me = this;
    let url = environment.api.monitor.downloadConfig.endpoint;
    me.apiData = new APIData();
    me.apiData.cctx = me.sessionService.session.cctx;
    me.apiData.tName = techName;

    return me.controller.post(url, me.apiData)
  }

  // Method added to validate duplicate agent tier - Bug 110013 
  validateDuplicateTier(tierServerInfo){
    let uniqueTierArr = [];
    tierServerInfo.map(function(eachItem){
      uniqueTierArr.push(eachItem.tier)
    })

      let duplicates = []
      const tempArray = [...uniqueTierArr].sort()
      for (let i = 0; i < tempArray.length; i++) {
        if (tempArray[i + 1] === tempArray[i]) {
          let tierName = tempArray[i];
          if(tempArray[i] === 'ALLtier')
            tierName = "All Tiers";

          duplicates.push(tempArray[i])
          this.messageService.add({ severity: SEVERITY_ERROR, summary: SUMMARY_ERROR, detail: "Duplicate Tier - " + tierName + " not allowed." });
          return false;
        }
      }
      return true;
    }

    deleteOtherMonConf(val) {
      this.deleteMonConf.next(val);
    }
}
