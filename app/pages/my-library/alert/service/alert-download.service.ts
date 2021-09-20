import { EventEmitter, Injectable, Output } from "@angular/core";
import { MessageService } from 'primeng/api';
import { Observable, Subject } from "rxjs";
import { SessionService } from "src/app/core/session/session.service";
import { Store } from "src/app/core/store/store";
import { environment } from "src/environments/environment";
import { PAYLOAD_TYPE } from "../alert-rules/alert-configuration/service/alert-config.dummy";
import { DownloadedState, DownloadingErrorState, DownloadingState, EventsArrayLoadedState, EventsArrayLoadingErrorState, EventsDataLoadedState, EventsDataLoadingErrorState } from "./alert-table.state";
import { Moment } from 'moment-timezone';
import * as moment from "moment-timezone";
import { AlertRulesService } from "../alert-rules/service/alert-rules.service";
import { FormatDateTimePipe } from "src/app/shared/pipes/dateTime/dateTime.pipe";
import { AlertTimeAgo } from "src/app/shared/pipes/dateTime/alert/alert-timeAgo.pipe";
import { AlertFilterComponent } from "../alert-filter/alert-filter.component";
import * as CONS from '../alert-constants';
import { MenuItemUtility } from "src/app/shared/utility/menu-item";
import * as ACTCONS from 'src/app/pages/my-library/alert/alert-actions/service/alert-action-constants';
import { ScheduleType } from "src/app/shared/pipes/dateTime/alert/scheduleType.pipe";
import { Schedule } from "src/app/shared/pipes/dateTime/alert/schedule.pipe";
import { UpcomingWindow } from "src/app/shared/pipes/dateTime/alert/upcomingWindow.pipe";
import { AdvancedConfigurationService } from "../alert-configuration/advanced-configuration/service/advanced-configuration.service";
import { AlertSeverityColor } from "src/app/shared/pipes/dateTime/alert/alert-severity-color.pipe";
import { FormatUTCTimePipe } from "src/app/shared/pipes/dateTime/UTCTime.pipe";


@Injectable({
  providedIn: 'root',
})
export class AlertDownloadService extends Store.AbstractService {
 
  @Output() toHour:String ;
  @Output() fromHour:String ;
  @Output() preset: String ;
  @Output() customTimeSelected :Moment[];
  utcTimePipe: FormatUTCTimePipe;
  timeAgo: AlertTimeAgo;
  schedType: ScheduleType;
  schedule: Schedule;
  severity: AlertSeverityColor;
  upcomingWindow: UpcomingWindow;
  isDownloading: boolean = false;
  filterDataMap;
  globalFilterVla;
  isActHis: string;
  alertFilterSideBar: AlertFilterComponent;

  constructor(
    private sessionService: SessionService,
    private messageService: MessageService,
    private alertRulesService: AlertRulesService,
    private advConfigService: AdvancedConfigurationService) {
    super();
    this.utcTimePipe = new FormatUTCTimePipe(sessionService, advConfigService);
    this.timeAgo = new AlertTimeAgo(sessionService, advConfigService);
    this.schedType = new ScheduleType();
    this.schedule = new Schedule(sessionService, advConfigService);
    this.upcomingWindow = new UpcomingWindow(sessionService, advConfigService);
    this.severity = new AlertSeverityColor(sessionService);
  }

  downloadReport(reportType: string, dataList: any, headerList: any, type: any, pageHeaderList: any) {
    const me = this;
    const colWidth: Number[] = [];
    const header: any[] = [];
    const tableRowData: any[] = [];
    let paraList: string[] = [];
    header.push("S No.");
    colWidth.push(5);
    for (let idx = 0; idx < headerList.length; idx++) {

      if (headerList[idx].valueField == 'enableDisable')
      {
        header.push(headerList[idx].label);
        colWidth.push(Number.parseInt(headerList[idx].width.match(/(\d+)/)[0]) + 4);
        continue;
      }

      if (headerList[idx].valueField == 'selected')
        continue;
      if (type == PAYLOAD_TYPE.DOWNLOAD_RULE && (headerList[idx].valueField == 'edit'))
        continue;
      header.push(headerList[idx].label);
      colWidth.push(Number.parseInt(headerList[idx].width.match(/(\d+)/)[0]));
    }
    dataList.forEach((rowData, idx) => {
      const data: any[] = [];
      data.push(idx + 1);
      for (let idx = 0; idx < headerList.length; idx++) {
        const column = headerList[idx];
        if (column.valueField == 'selected')
          continue;
        if (type == PAYLOAD_TYPE.DOWNLOAD_RULE) {
          if (column.valueField == 'edit')
              continue;
          if (column.valueField == 'alertAction') {
            let actionName = "";
            for (let aId = 0; aId < rowData[column.valueField].length; aId++) {
              const action = rowData[column.valueField][aId];
              if (action.type == -1)
                continue;
              if (actionName)
                actionName += ", " + action.name;
              else
                actionName = action.name;
            }
            data.push(actionName);
          }
          else if (column.valueField == 'enableDisable') {
            if (rowData.enable)
              data.push("Enable");
            else
              data.push("Disable");
          }
          else
          {
            if(rowData[column.valueField])
              data.push(rowData[column.valueField]);
            else
              data.push("");
          }
        }
        else if (type == PAYLOAD_TYPE.DOWNLOAD_ACTION || type == PAYLOAD_TYPE.DOWNLOAD_ACTION_HISTORY) {
          if (column.valueField == 'severity') {
            data.push(me.severity.transform( rowData[column.valueField] ,'sevname'));
          }
          else if (column.valueField == 'actionTime') {
            data.push(me.utcTimePipe.transform( rowData[column.valueField] , 'default'));
          }
          else if(column.valueField == 'type' && type == PAYLOAD_TYPE.DOWNLOAD_ACTION ){  
           if(rowData['actions'].length){
            let notifications = [];
            let diagnostics = [];
            let remediation = [];
            let actions = "";
            for(let i = 0 ; i < rowData['actions'].length ; i++){
              for(let j = 0 ; j < ACTCONS.ACTION_TYPES.length ; j++){
                if(rowData['actions'][i]['type'] == ACTCONS.ACTION_TYPES[j].value ){
                  if(rowData['actions'][i]['type'] == ACTCONS.ACTION_TYPE.EMAIL || rowData['actions'][i]['type'] == ACTCONS.ACTION_TYPE.SMS || rowData['actions'][i]['type'] == ACTCONS.ACTION_TYPE.SNMPTRAP){
                    notifications.push(ACTCONS.ACTION_TYPES[j].label);
                  }
                  if (rowData['actions'][i]['type'] == ACTCONS.ACTION_TYPE.SEND_TO_EXTENSION){
                    me.alertRulesService.extensionsList.forEach(extension => {
                      if (extension.value == rowData['actions'][i]['extensionName'])
                        notifications.push(ACTCONS.ACTION_TYPES[j].label+'('+extension.label+')');
                    });
                  }
                  if(rowData['actions'][i]['type'] == ACTCONS.ACTION_TYPE.THREAD_DUMP || rowData['actions'][i]['type'] == ACTCONS.ACTION_TYPE.HEAP_DUMP || rowData['actions'][i]['type'] == ACTCONS.ACTION_TYPE.CPU_PROFILING || rowData['actions'][i]['type'] == ACTCONS.ACTION_TYPE.TCP_DUMP || rowData['actions'][i]['type'] == ACTCONS.ACTION_TYPE.JAVA_FLIGHT_RECORDER){
                    diagnostics.push(ACTCONS.ACTION_TYPES[j].label);
                  }
                  if(rowData['actions'][i]['type'] == ACTCONS.ACTION_TYPE.RUN_SCRIPT){
                    remediation.push(ACTCONS.ACTION_TYPES[j].label);
                  }
                }
              }
            }
            if(notifications.length){
              actions = actions +"Notification(s) : "+notifications.toString()+" ; ";
            }
            if(diagnostics.length){
              actions = actions +"Diagnostic(s) : "+diagnostics.toString()+" ; ";
            }
            if(remediation.length){
              actions = actions +"Remediation(s) : "+remediation.toString()+" ; ";
            }

            data.push(actions);
         }
          else
            data.push("");
          }
          else
            data.push(rowData[column.valueField]);
        }
        else if (type == PAYLOAD_TYPE.DOWNLOAD_MAINTENANACE) {
          if(column.valueField == 'schedName'){
            data.push(rowData['name']);
          }
          else if(column.valueField == 'type'){
            data.push(me.schedType.transform(rowData['attributes']['scheduleConfig']['type']));
          }
          else if(column.valueField == 'name'){
            data.push(me.schedule.transform(rowData['attributes']['scheduleConfig']));
          }
          else if(column.valueField == 'tagInfo'){
            data.push(rowData['attributes']['tagInfo']);
          }
          else if(column.valueField == 'description'){
            data.push(rowData['attributes']['description']);
          }
          else if(column.valueField == 'maintenanceWindow'){
            data.push(me.upcomingWindow.transform(rowData['attributes']['scheduleConfig']));
          }
          else{
            data.push("");
          }
        }
        else if(column.valueField == 'et')
        {
          if(column.label == 'Alert Time')
            data.push(me.utcTimePipe.transform(rowData[column.valueField], 'default'));
          else
            data.push(me.timeAgo.transform(rowData[column.valueField]));
        }
        else
          data.push(rowData[column.valueField]);
      }
      tableRowData.push(data);
    });
    if (type == PAYLOAD_TYPE.DOWNLOAD_RULE){
      paraList = pageHeaderList;
    }
    if(me.isActHis == "history")
    {
      if(paraList.length == 0)
        paraList.push("Filters Applied");

      paraList.push("Time Filter: " + MenuItemUtility.searchByAnyKey(me.alertFilterSideBar.selectedPreset, CONS.ALERT_PRESETS, "value")['label']);


      let newAlert = ""
      if(me.alertFilterSideBar.newAlert.length > 0)
      {
        me.alertFilterSideBar.newAlert.forEach(element => {
          newAlert = me.createFilterString(element, newAlert, "New Alerts: ");
        });
      }

      let conAlert = ""
      if(me.alertFilterSideBar.continuousAlert.length > 0)
      {
        me.alertFilterSideBar.continuousAlert.forEach(element => {
          conAlert = me.createFilterString(element, conAlert, "Continuous Alerts: ");
        });
      }
        

      let endedAlert = ""
      if(me.alertFilterSideBar.endedAlert.length > 0)
      {
        me.alertFilterSideBar.endedAlert.forEach(element => {
          endedAlert = me.createFilterString(element, endedAlert, "Ended Alerts: ");
        });
      }

      let upAlert = "";
      if(me.alertFilterSideBar.upgrAlert.length > 0)
      {
        me.alertFilterSideBar.upgrAlert.forEach(element => {
          upAlert = me.createFilterStringUpDown(element, upAlert, "Upgraded Alerts: ")
        });
      }

      let downAlert = "";
      if(me.alertFilterSideBar.dwngAlert.length > 0)
      {
        me.alertFilterSideBar.dwngAlert.forEach(element => {
          downAlert = me.createFilterStringUpDown(element, downAlert, "Downgraded Alerts: ")
        });
      }

      let others = "";
      if(me.alertFilterSideBar.selectedOthers.length > 0)
      {
        me.alertFilterSideBar.selectedOthers.forEach(element => {
          others = me.createFilterStringOths(element, others, "Other: ")
        });
      }

      if(newAlert != "" || conAlert != "" || endedAlert != "" || upAlert != "" || downAlert != "" || others != "")
      {
        var severityStr = "";

        if(newAlert != "")
        {
          if(severityStr == "")
            severityStr = "Alert Severity: " + newAlert;
          else
            severityStr = severityStr + "; " + newAlert;
        }

        if(conAlert != "")
        {
          if(severityStr == "")
            severityStr = "Alert Severity: " + conAlert 
          else
            severityStr = severityStr + "; " + conAlert;
        }

        if(endedAlert != "")
        {
          if(severityStr == "")
            severityStr = "Alert Severity: " + endedAlert; 
          else
            severityStr = severityStr + "; " + endedAlert;
        }

        if(upAlert != "")
        {
          if(severityStr == "")
            severityStr = "Alert Severity: " + upAlert; 
          else
            severityStr = severityStr + "; " + upAlert;
        }

        if(downAlert != "")
        {
          if(severityStr == "")
            severityStr = "Alert Severity: " + downAlert; 
          else
            severityStr = severityStr + "; " + downAlert;
        }

        if(others != "")
        {
          if(severityStr == "")
            severityStr = "Alert Severity: " + others; 
          else
            severityStr = severityStr + "; " + others;
        }

        paraList.push(severityStr);
      }    

      if(me.alertFilterSideBar.selectedRules.length > 0)
      {
        let ruleFiltApp = "";

        me.alertFilterSideBar.selectedRules.forEach(element => {
          if(ruleFiltApp == "")
            ruleFiltApp = "Alert Rules: " + element;
          else
            ruleFiltApp = ruleFiltApp + ", " + element;
        });
        paraList.push(ruleFiltApp);
      }

      if(me.alertFilterSideBar.tier != "" || me.alertFilterSideBar.server != "" || me.alertFilterSideBar.instance != "")
      {
        let topologyFilt = "";

        if(me.alertFilterSideBar.tier != "")
        {
          if(topologyFilt == "")
            topologyFilt = "Topology Filter: " + "Tier: " + me.alertFilterSideBar.tier;
          else
            topologyFilt = topologyFilt + ", " + "Tier: " + me.alertFilterSideBar.tier;
        }

        if(me.alertFilterSideBar.server != "")
        {
          if(topologyFilt == "")
            topologyFilt = "Topology Filter: " + "Server: " + me.alertFilterSideBar.server;
          else
            topologyFilt = topologyFilt + ", " + "Server: " + me.alertFilterSideBar.server;
        }

        if(me.alertFilterSideBar.instance != "")
        {
          if(topologyFilt == "")
            topologyFilt = "Topology Filter: " + "Instance: " + me.alertFilterSideBar.instance;
          else
            topologyFilt = topologyFilt + ", " + "Instance: " + me.alertFilterSideBar.instance;
        }
        paraList.push(topologyFilt);
      }
    }

    if(me.globalFilterVla){
      if(paraList.length == 0)
        paraList.push("Filters Applied");
      paraList.push("Global Filter: "+me.globalFilterVla);
    }
    
    if(me.filterDataMap)
    {    
      const keys: string[] = Object.keys(me.filterDataMap);
      if(paraList.length == 0 && keys.length > 0)
        paraList.push("Filters Applied");

      let cusFilter = "";
      for(let i =0; i < keys.length; i++)
      {
        if(me.filterDataMap[keys[i]].value != ""){
        if(i == 0)
          cusFilter = "Custom Filter: " + keys[i] + ": " + me.filterDataMap[keys[i]].value;
        else
          cusFilter = cusFilter + ", " + keys[i] + ": " + me.filterDataMap[keys[i]].value;
        }
      }

      if(keys.length > 0)
        paraList.push(cusFilter);
    }

    if(paraList.length > 0)
      paraList.push("");

    const path = environment.api.alert.rule.download.endpoint;
    const payload: any = {
      testRun: me.sessionService.testRun.id,
      cctx: me.sessionService.session.cctx,
      type: reportType,
      skipColumn: "",
      rowData: tableRowData,
      header: header,
      arrParaList: [paraList],
      title: type == PAYLOAD_TYPE.DOWNLOAD_RULE ? 'ALERT_RULES' : type == PAYLOAD_TYPE.DOWNLOAD_ACTION ? 'ALERT_ACTION' : type == PAYLOAD_TYPE.DOWNLOAD_ACTION_HISTORY ? 'ALERT_ACTION_HISTORY' : type == PAYLOAD_TYPE.DOWNLOAD_POLICY ? 'ALERT_POLICY' : type == PAYLOAD_TYPE.DOWNLOAD_MAINTENANACE ? 'ALERT_MAINTENANCE' : type == PAYLOAD_TYPE.DOWNLOAD_ACTIVE_ALERT ? 'ACTIVE_EVENTS' : type == PAYLOAD_TYPE.DOWNLOAD_ALERT_HISTORY ? 'EVENTS_DETAIL' : 'Default',
      //colWidthinPct: colWidth
    }

    if(reportType != 'excel')
    {
      payload['colWidthinPct'] = colWidth;
    }

    me.alertRulesService.showProgressBar("Going to download data, Please wait...");
    me.load(path, payload).subscribe(
      (state: Store.State) => {
        if (state instanceof DownloadingState) {
          return;
        }
        if (state instanceof DownloadedState) {
          me.onDownLoaded(state);
          return;
        }
      },
      (state: DownloadingErrorState) => {
        me.onLoadingError(state);
        return;
      });
  }
 
  createFilterStringOths(element: number, filterStr: string, definationStr: string)
  {
    if(element == CONS.OTHERS.TYPE_MAINTENANCE)
    {
      if(filterStr == "")
        filterStr = definationStr + 'Maintenance Window Changes';
      else
        filterStr = filterStr + ", " + 'Maintenance Window Changes';
    }

    if(element == CONS.OTHERS.TYPE_ALERT_SETTING)
    {
      if(filterStr == "")
        filterStr = definationStr + 'Global Configuration changes';
      else
        filterStr = filterStr + ", " + 'Global Configuration changes';
    }

    if(element == CONS.OTHERS.TYPE_ACTION)
    {
      if(filterStr == "")
        filterStr = definationStr + 'Action Changes';
      else
        filterStr = filterStr + ", " + 'Action Changes';
    }

    if(element == CONS.STATUS.FORCE_CLEAR)
    {
      if(filterStr == "")
        filterStr = definationStr + 'Force clear alert';
      else
        filterStr = filterStr + ", " + 'Force clear alert';
    }

    if(element == CONS.STATUS.CLEAR_DUE_TO_DISABLE_RULE)
    {
      if(filterStr == "")
        filterStr = definationStr + 'Clear due to Disable Rule';
      else
        filterStr = filterStr + ", " + 'Clear due to Disable Rule';
    }

    return filterStr;
  }
  createFilterStringUpDown(element: any, filterStr: string, definationStr: string)
  {
    if(element.severity == CONS.SEVERITY.MAJOR && element.prevSeverity == CONS.SEVERITY.MINOR)
    {
      if(filterStr == "")
        filterStr = definationStr + 'Minor to Major';
      else
        filterStr = filterStr + ", " + 'Minor to Major';
    }

    if(element.severity == CONS.SEVERITY.CRITICAL && element.prevSeverity == CONS.SEVERITY.MINOR)
    {
      if(filterStr == "")
        filterStr = definationStr + 'Minor to Critical';
      else
        filterStr = filterStr + ", " + 'Minor to Critical';
    }

    if(element.severity == CONS.SEVERITY.CRITICAL && element.prevSeverity == CONS.SEVERITY.MAJOR)
    {
      if(filterStr == "")
        filterStr = definationStr + 'Major to Critical';
      else
        filterStr = filterStr + ", " + 'Major to Critical';
    }

    if(element.severity == CONS.SEVERITY.MAJOR && element.prevSeverity == CONS.SEVERITY.CRITICAL)
    {
      if(filterStr == "")
        filterStr = definationStr + 'Critical to Major';
      else
        filterStr = filterStr + ", " + 'Critical to Major';
    }

    if(element.severity == CONS.SEVERITY.MINOR && element.prevSeverity == CONS.SEVERITY.CRITICAL)
    {
      if(filterStr == "")
        filterStr = definationStr + 'Critical to Minor';
      else
        filterStr = filterStr + ", " + 'Critical to Minor';
    }

    if(element.severity == CONS.SEVERITY.MINOR && element.prevSeverity == CONS.SEVERITY.MAJOR)
    {
      if(filterStr == "")
        filterStr = definationStr + 'Major to Minor';
      else
        filterStr = filterStr + ", " + 'Major to Minor';
    }

    return filterStr;
  }

  createFilterString(element: number, filterStr: string, definationStr: string)
  {
    if(element == CONS.SEVERITY.CRITICAL)
    {
      if(filterStr == "")
        filterStr = definationStr + CONS.SEVERITY.CRITICAL_STRING;
      else
        filterStr = filterStr + ", " + CONS.SEVERITY.CRITICAL_STRING;
    }

    if(element == CONS.SEVERITY.MAJOR)
    {
      if(filterStr == "")
        filterStr = definationStr + CONS.SEVERITY.MAJOR_STRING;
      else
        filterStr = filterStr + ", " + CONS.SEVERITY.MAJOR_STRING;
    }

    if(element == CONS.SEVERITY.MINOR)
    {
      if(filterStr == "")
        filterStr = definationStr + CONS.SEVERITY.MINOR_STRING;
      else
        filterStr = filterStr + ", " + CONS.SEVERITY.MINOR_STRING;
    }

    return filterStr;
  }

  load(path: any, payload: any): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();
    setTimeout(() => {
      output.next(new DownloadingState());
    }, 0);

    me.controller.post(path, payload).subscribe(
      (data: any) => {
        output.next(new DownloadedState(data));
        output.complete();
      },
      (e: any) => {
        console.log("download Alert Report loading failed");
        output.error(new DownloadingErrorState(e));
        output.complete();

        me.logger.error('download Alert Report loading failed', e);
      }
    );
    return output;
  }
  onDownLoaded(state: any) {
    const me = this;
    let path = state.data.path.trim();
    let url = window.location.protocol + '//' + window.location.host;
    path = url + "/common/" + path;
    window.open(path + "#page=1&zoom=75", "_blank");
    me.alertRulesService.progressValue = 100;
    me.alertRulesService.isHideProgress = true;
    me.filterDataMap = {};
    me.globalFilterVla = '';
    me.isDownloading = !me.isDownloading;
  }

  private onLoadingError(state: any) {
    const me = this;
    me.alertRulesService.progressValue = 100;
    me.alertRulesService.isHideProgress = true;
    me.filterDataMap = {};
    me.globalFilterVla = '';
    me.messageService.add({ severity: 'error', summary: 'Error', detail: 'download Alert Report loading failed.' });
    me.isDownloading = !me.isDownloading;
  }
  
}