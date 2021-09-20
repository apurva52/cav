import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';

import { environment } from 'src/environments/environment';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';

import { DownloadReportLoadedState, DownloadReportLoadingErrorState, DownloadReportLoadingState } from 'src/app/shared/dashboard/dialogs/metric-description/service/metric-description.state';
import { CustomMonitorPayload } from './custom-monitor.model';
import { JMXConnectionParams, JMXMonData } from '../containers/jmx-mon-data';
import { CmdMonData } from '../containers/configure-cmd-mon-data';
import { DbMonData } from '../containers/db-mon-data';
import { TableData } from '../containers/table-data';
import { StatsDMonData } from '../containers/statsd-mon-data';
import { CustMonInfo } from '../containers/cust-mon-info';
import { MessageService } from 'primeng';
import { APIData } from '../../../containers/api-data';
import * as COMPONENT from '../../add-monitor/constants/monitor-configuration-constants';

export class requestDTO {
  tName: string = ''

}

@Injectable({
  providedIn: 'root',
})
export class CustomMonitorService extends Store.AbstractService {
  productType: string = 'NS';
  reqDTO: requestDTO
  isFromEdit: boolean = false
  treeData: any; // contains domain list for jmx component.
  jmxDataFlag: boolean = false;
  jmxConnParam = new JMXConnectionParams();
  gdfNameAtEdit: String = "";
  disableFields: boolean = false;
  jmxMonitorConnectionKey: string;
  getCmdEditData: CmdMonData;
  getStatsdEditData: StatsDMonData
  getDbEditData: DbMonData
  getJMXEditData: JMXMonData
  getSNMPEditData: TableData
  tierName: string = '';
  monType: string = '';
  dbMon: string = '';
  techNology: string = '';
  tierFlag: boolean;
  outputLength: number;
  metricData: any[]; // metric data received after command is executed in Commmand Based monitor
  metricHier: any[]; // metric hierarchy received after command is executed in Commmand Based monitor
  public autoFillMetricInfo = new Subject<any>();
  public $metricInfo = this.autoFillMetricInfo.asObservable();
  public autoFillMetricHierarchy = new Subject<any>();
  public $metricHierchy = this.autoFillMetricHierarchy.asObservable();
  public saveMonitorConf = new Subject<boolean>();
  public $saveMonitorConf = this.saveMonitorConf.asObservable();
  public changeOutPutType = new Subject<boolean>();
  public $changeOutPutType = this.changeOutPutType.asObservable()
  globalNFData: any; //to store NF global setting data by reading config.ini
  hasNFGlobalSettings: boolean = false; // flag for whether NF Global Settings is present or not.
  //isFromEdit: boolean = false
  getNfEditData: CustMonInfo;
  availTechData: any = {};
  objectID: string = "-1";
  apiData: APIData;
  tierHeadersList: any[];

  statsdtype: string = '';
  constructor(private sessionService: SessionService,
    private messageServiceObj: MessageService
  ) {
    super();
  }
  load(clientObj: CustomMonitorPayload): Observable<Store.State> {
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

    //   const subscription = me.controller.post(path, payload).subscribe(
    //     (data) => {

    //             output.next(new MonitorupdownstatusLoadedState(data));
    //             output.complete();
    //         },
    //         (error: AppError) => {
    //           output.error(new MonitorupdownstatusErrorState(error));
    //           output.complete();
    //         }
    //       );

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


  createMetricHierarchyData(dataLineWithValues, delimiter) {
    let tempArr = [];
    let tempHierArr = [];
    for (let i = 1; i < dataLineWithValues.length; i++) {
      let dataLineByDelimiter = dataLineWithValues[i].trim().replace(/  +/g, ' ');
      let splitDataLine = dataLineByDelimiter.split(delimiter);
      let metricArr = [];
      let hierarchyArr = [];
      splitDataLine.map(function (dataLine) {
        if (isNaN(dataLine) && dataLine.trim() != "null") {
          hierarchyArr.push(dataLine.trim());
        }
        else {
          metricArr.push(dataLine.trim());
        }
      })
      tempHierArr.push(hierarchyArr);
      tempArr.push(metricArr);
    }
    this.setMetricHierarchy(tempHierArr)
    this.setMetricData(tempArr)
  }

  setMetricHierarchy(data) {
    this.metricHier = data;
  }

  getMetricHierarchy() {
    return this.metricHier;
  }

  setMetricData(data) {
    this.metricData = data;
  }

  getMetricData() {
    return this.metricData;
  }

  autoFillMetricInfoData(val) {
    this.autoFillMetricInfo.next(val);
  }

  autoFillMetricHierarchyData(val) {
    this.autoFillMetricHierarchy.next(val);
  }
  saveMonitorConfProvider(val) {
    this.saveMonitorConf.next(val);
  }
  OTypeChange(val) {
    this.changeOutPutType.next(val);
  }
  //for cmd edit mode
  editCmdConfig(monName, gdfName, objId) {
    let me = this;
    let url = environment.api.monitor.getConfigMon.endpoint
    let filters = '?gdfName=' + gdfName + '&monName=' + monName + "&objId=" + objId + "&productKey=" + me.sessionService.session.cctx.pk + "&userName=" + me.sessionService.session.cctx.u;

    url = url + filters;
    // let params = new HttpParams()
    // .set('gdfName', gdfName)
    // .set('monName', monName)
    // .set('objId',objId)


    return me.controller.get(url)

  }
  //method calls in case of cmd script in case of remote
  getCMDOutput(remoteConDto, cmdScript) {
    let me = this;
    let remoteConData = {
      remoteConDto,
      cmdScript
    }
    let url = environment.api.monitor.runCmdScript.endpoint + "?productKey=" + me.sessionService.session.cctx.pk +
      "&userName=" + me.sessionService.session.cctx.u
    return me.controller.post(url, remoteConData);
  }
  //output method for cmd in case of tier server during
  runCMDOnServer(cmdMonData) {
    let url = environment.api.monitor.runCmdOnServer.endpoint
    let me = this;
    cmdMonData.cctx = me.sessionService.session.cctx;
    return me.controller.post(url, cmdMonData)
  }
  //save method for cmd
  saveCmdConf(data) {
    let me = this;
    let url = environment.api.monitor.saveCMD.endpoint;
    data.cctx = me.sessionService.session.cctx;
    return me.controller.post(url, data);
  }

  getTierList() {
    let me = this
    //let url = environment.api.monitor.tierList.endpoint
    // return me.controller.get(url)
  }

  // getAvailableTech(){
  //   let me = this
  //   let url = environment.api.monitor.availTech.endpoint
  //   return me.controller.get(url)
  // }
  getJmxConnParam() {
    return this.jmxConnParam;
  }
  setJmxConnParam(data) {
    return this.jmxConnParam = data;

  }
  getMBean(jmxMonData, topoName, ip, tierId, serverId) {
    const me = this
    let url = environment.api.monitor.getMbeans.endpoint
    url = url + "?ip=" + ip + "&topoName=" + topoName + "&tierId=" + tierId + "&serverId=" + serverId +
      "&productKey=" + me.sessionService.session.cctx.pk + "&userName=" + me.sessionService.session.cctx.u
    return me.controller.post(url, jmxMonData);
  }

  makeBCIConnection(tier, server, instance) {
    const me = this
    let userName = me.sessionService.session.cctx.u;
    let productKey = me.sessionService.session.cctx.pk;
    //this.blockUI.start(); 
    let url = environment.api.monitor.getMbeansNDC.endpoint
    url = url + "?productKey=" + productKey + "&userName=" + userName;


    let params = {
      'tierName': tier,
      'serverName': server,
      'instanceName': instance,
      'ndMsgName': 'capture_jmx_mbean_info',
      'agentType': 'Java',
      'headerKey': 'Path'
    };


    return me.controller.post(url, params)
    // return this.http.post(url, params ,{responseType:'text'})
    // return this.http.post(url, params)
    //     .toPromise()
    //     .then(res => {
    //       this.blockUI.stop();
    //       return res;
    //    })
  }

  getChildMbeans(domainName, childNodeName, key) {
    const me = this;
    let url = environment.api.monitor.getChildNode.endpoint
    url = url + "?domainName=" + domainName + "&key=" + key + "&productKey=" + me.sessionService.session.cctx.pk + "&userName=" + me.sessionService.session.cctx.u;
    for (let i = 0; i < childNodeName.length; i++) {
      url = url + "&name=" + `${childNodeName[i]}`;
    }
    return me.controller.get(url);
  }

  saveJMXData(jmxData) {
    let me = this
    let url = environment.api.monitor.saveJmxConf.endpoint
    jmxData.cctx = me.sessionService.session.cctx;
    return me.controller.post(url, jmxData)
  }
  
  editJMXConfig(monName, gdfName, key, objId) {
    let me = this;
    let url = environment.api.monitor.editJmxMConfig.endpoint 
    let filters = '?gdfName=' + gdfName + '&monName=' + monName + "&key=" + key + "&objId=" + objId + "&productKey=" + me.sessionService.session.cctx.pk + "&userName=" + me.sessionService.session.cctx.u;

    url = url + filters;
    // let params = new HttpParams()
    // .set('gdfName', gdfName) 
    // .set('monName', monName)
    // .set('objId',objId)


    return me.controller.get(url)
  }
  runDBQuery(reqDTO) {
    const me = this;
    let url = environment.api.monitor.runDBQuery.endpoint
    reqDTO.cctx = me.sessionService.session.cctx;
    return me.controller.post(url, reqDTO)
  }
  saveDb(reqDTO) {
    const me = this
    let url = environment.api.monitor.saveDbConf.endpoint
    reqDTO.cctx = me.sessionService.session.cctx;
    return me.controller.post(url, reqDTO)
  }
  editDBdataConfig(monName, gdfName, objId) {
    let me = this;
    let url = environment.api.monitor.editDbMon.endpoint 
    let filters = '?gdfName=' + gdfName + '&monName=' + monName + "&objId=" + objId + "&productKey=" + me.sessionService.session.cctx.pk + "&userName=" + me.sessionService.session.cctx.u;;

    url = url + filters;
    return me.controller.get(url)
  }
  saveStatsd(reqDTO) {
    const me = this;
    let url = environment.api.monitor.saveStatsd.endpoint
    reqDTO.cctx = me.sessionService.session.cctx;
    return me.controller.post(url, reqDTO)
  }
  editStatsd(gdfName, monName, objId) {
    let me = this;
    let userName = me.sessionService.session.cctx.u;
    let url = environment.api.monitor.editStatsd.endpoint 
    let filters = '?userName' + userName + '&gdfName=' + gdfName + '&monName=' + monName + "&objId=" + objId + "&productKey=" + me.sessionService.session.cctx.pk + "&userName=" + me.sessionService.session.cctx.u;
    url = url + filters
    return me.controller.get(url)
  }
  getProtocol(isSecure) {
    let protocol = "https";
    if (!isSecure)
      protocol = "http";
    else
      protocol = "https";

    return protocol;
  }
  saveLogMetricConfiguration(reqDTO) {
    const me = this;
    let url = environment.api.monitor.savelogMetric.enpoint
    reqDTO.cctx = me.sessionService.session.cctx;
    return me.controller.post(url, reqDTO)
  }
  globalNf() {
    const me = this;
    let url = environment.api.monitor.getGlobalNfSetting.enpoint + "?productKey=" + me.sessionService.session.cctx.pk + "&userName=" + me.sessionService.session.cctx.u;
    //url = url + "?productKey=" + '-1' + "&userName=" + 'cavisson';
    return me.controller.get(url)
  }
  getIndxList(reqDTO) {
    const me = this;
    let url = environment.api.monitor.getIndxList.enpoint
    reqDTO.cctx = me.sessionService.session.cctx;
    return me.controller.post(url, reqDTO)
  }
  editLogMetric(gdfName, monName, type, objId) {
    const me = this;
    let url = environment.api.monitor.editLogMetric.enpoint
    url = url + '?gdfName=' + gdfName + '&monName=' + monName + "&type" + type + "&objId=" + objId + "&productKey=" + me.sessionService.session.cctx.pk + "&userName=" + me.sessionService.session.cctx.u;
    return me.controller.get(url)
  }
  getMetricHierarchyData(reqDTO) {
    const me = this;
    let url = environment.api.monitor.getMetricList.enpoint
    reqDTO.cctx = me.sessionService.session.cctx;
    return me.controller.post(url, reqDTO)
  }
  saveConfigIni(reqDTO) {
    const me = this;
    let url = environment.api.monitor.saveGlobalSettingsToConfigIni.enpoint
    reqDTO.cctx = me.sessionService.session.cctx;
    return me.controller.post(url, reqDTO)
  }

  getAvailableConfiguredList(type) {
    let me = this;
    let url = environment.api.monitor.getCustomMonitorByTech.endpoint + "?type=" + type + "&productKey=" + me.sessionService.session.cctx.pk + "&userName=" + me.sessionService.session.cctx.u;
    return me.controller.get(url)
  }

  public customMonType = new Subject<any>();
  public $customMonType = this.customMonType.asObservable();

  onCustomMonTabChange(val) {
    this.customMonType.next(val);
  }

  openDbUI() {
    let me = this;
    let url = environment.api.monitor.openDbUI.endpoint + "?productKey=" + me.sessionService.session.cctx.pk + "&userName=" + me.sessionService.session.cctx.u;
    return me.controller.get(url)

  }
  //Method called validate configuration 
  validateConfigurationData(saveMonData) {
    if (!this.validateSaveMonConf(saveMonData))
      return false;

    //validate metric hierarchy table for showing hierarchical view 
    if (saveMonData.gdfInfo.depMHComp != undefined && saveMonData.gdfInfo.depMHComp.length > 0)
      this.validateMetricHierarchyInfo(saveMonData.gdfInfo.depMHComp);

    saveMonData.gdfInfo.grpN = saveMonData.gdfInfo.grpN.trim(); //remove whitespaces from group name
    saveMonData.gdfInfo.gD = saveMonData.gdfInfo.gD.trim(); //remove whitespaces from group description
    saveMonData.monN = saveMonData.gdfInfo.grpN // monitor name is same as metric group name 

    return true;
  }
  validateSaveMonConf(saveData) {
    if (saveData.gdfInfo.grpN.length > 64) {
      this.messageServiceObj.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Metric Group Name should be less than 64 characters' })
      return false;
    }
    //metric information cannot be blank
    if (saveData.gdfInfo.metricInfo.length == 0) {
      this.messageServiceObj.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Provide atleast one metric configuration.' })
      return false;
    }

    //metric hirarchy cannot be blank
    if (saveData.gdfInfo.mD == "") {
      this.messageServiceObj.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Provide metric hierarchy.' })
      return false;
    }

    //metric hirarchy table cannot be blank
    if (saveData.gdfInfo.depMHComp.length == 0 && this.monType != 'jmx') {
      this.messageServiceObj.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: 'Provide metric hierarchy.' })
      return false;
    }
    let status = false;
    let duplicateStr;
    saveData.gdfInfo.metricInfo.map(function (mName) {
      if (!status) {
        saveData.gdfInfo.depMHComp.map(function (mData) {
          if (mName.depMConf[0]._mN.trim() == mData._metadata.trim()) {
            duplicateStr = mData._metadata;
            status = true;
            return false;
          }
          else if (mName.depMConf[0]._metKeyIdx == mData._keyInd) {
            if(mData._keyInd_ui != ""){
               duplicateStr = mData._keyInd_ui;
            }
            else{
              duplicateStr = mData._keyInd
            }
            status = true;
            return false;
          }
        })
      }
    })
    if (status && this.monType != 'jmx') {
      this.messageServiceObj.add({ severity: COMPONENT.SEVERITY_ERROR, summary: COMPONENT.SUMMARY_ERROR, detail: `'${duplicateStr}' can't be used in both Metric Hierarchy and Metric Configuration` })
      return false;
    }
    return true;
  }
  validateMetricHierarchyInfo(data) {
    //if data is more than one
    if (data.length > 1) {
      let lastSecondRow = data[data.length - 2];

      if (lastSecondRow._hr == "")
        lastSecondRow._hr = "2";
    }
  }
  deleteCustomMonitor(type, monName, objId) {
    const me = this;
    this.apiData = new APIData();
    this.apiData.type = this.monType;
    this.apiData.monName = monName;
    this.apiData.objectId = objId;
    this.apiData.cctx = me.sessionService.session.cctx;;
    let url = environment.api.monitor.deleteCustomMonitorByTech.endpoint;
    return me.controller.post(url, this.apiData);
  }
  getAvailableTechList() {
    return this.availTechData;
  }

  setAvailableTechList(data) {
    return this.availTechData = data;
  }

  //Method to get server id from server list
  getServerId(list, index) {
    let serverId;
    if (index != -1) // if not found 
    {
      serverId = list[index];
    }
    return serverId;

  }

  setTierHeaderList(data) {
    this.tierHeadersList = data;
  }

  getTierHeaderList() {
    return this.tierHeadersList;
  }

  //nf monitor edit mode
  editMonitorConfig(monName, gdfName, objId) {
    let me = this;
    let url = environment.api.monitor.editLogMetric.enpoint + '?gdfName=' + gdfName + '&monName=' + monName + "&objId=" + objId + "&productKey=" + me.sessionService.session.cctx.pk + "&userName=" + me.sessionService.session.cctx.u;
    return me.controller.get(url)
  }

  copyCustomMonitor(oldMonName, newMonName, objID) {
    let me = this;
    let userName = me.sessionService.session.cctx.u;
    let productKey = me.sessionService.session.cctx.pk;
    let url = environment.api.monitor.copyCustMon.enpoint + '?oldMonName=' + oldMonName + '&newMonName=' + newMonName +
      "&userName=" + userName + "&productKey=" + productKey + "&custMonType=" + this.monType + "&objId=" + objID;
    return me.controller.get(url)
  }

  matchTierPattern(customTierName) {
    let me = this;
    let userName = me.sessionService.session.cctx.u;
    let productKey = me.sessionService.session.cctx.pk;
    let url = environment.api.monitor.testPattern.endpoint + '?tierPattern=' + customTierName + 
      "&userName=" + userName + "&productKey=" + productKey;
    return me.controller.get(url)
  }
}