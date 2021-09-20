import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Store } from 'src/app/core/store/store';
import { CavConfigService } from '../../../../tools/configuration/nd-config/services/cav-config.service';
import { map } from "rxjs/operators";
import { Observable, Subject } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpService extends Store.AbstractService{
  cmdGroupList;
  completeIP: string;

  /** These array are used for contains row data for delete n modifying table data.*/
  deleteRowForAuditLog: any[] = [];
  editRowForAuditLog: any[] = [];
  addCommandForAuditLog: any[] = [];
  isAdminUser: boolean;
  constructor(private http: HttpClient, private _productConfig: CavConfigService, private sessionService: SessionService) {
    super();
    // this.completeIP = this._productConfig.getINSPrefix() + this._navService.getDCNameForScreen('runCommand');//window.location.protocol + "//" + window.location.host;
    this.completeIP = this._productConfig.getINSPrefix();
  }

  /* Getting Vector List*/
  getVectorList() {
    //return this.http.get(this.completeIP + '/DashboardServer/web/tcpDump/vectorList?productKey=' + this.sessionService.session.cctx.pk + '&testRun=' + this.sessionService.session.testRun.id).pipe(map((res: Response) => res));
    const me = this;
    let path = environment.api.runCommand.tiers.endpoint;
    path = path + '?productKey=' + this.sessionService.session.cctx.pk + 'userName=' + this.sessionService.session.cctx.u;
    return me.controller.get(path, null);
  }
  getCmdGroupInfo() {
    return this.cmdGroupList;
  }
  /*Getting CMD Grp List */
  getCmdGrpList() {
    if (this.sessionService.session && this.sessionService.session.permissions) {
      for (const c of this.sessionService.session.permissions) {
        for (const d of c.permissions) {
          d.permission === 7 ? this.isAdminUser = true : this.isAdminUser = false;
        }
      }
    }
    // return this.http.get(this.completeIP + '/DashboardServer/web/RunCommand/runCommandInfo?productKey=' + this.sessionService.session.cctx.pk + '&role=' + this.isAdminUser + "&userName=" + this.sessionService.session.cctx.u + '&testRun=' + this.sessionService.session.testRun.id).pipe(map((res: Response) => this.cmdGroupList = res));
    const me = this;
    let path = environment.api.runCommand.info.endpoint;
    path = path + '?productKey=' + this.sessionService.session.cctx.pk + '&role=' + this.isAdminUser + "&userName=" + this.sessionService.session.cctx.u + '&testRun=' + this.sessionService.session.testRun.id;
    return me.controller.get(path, null);
  }

  setcmdGroupList(commandList){
    this.cmdGroupList = commandList;
  }

  /*To run the commnad on the server and save and give the output */
  runCommandOnServer(paramObj, tierName) {
    //return this.http.post(this.completeIP + "/DashboardServer/web/RunCommand/runCommandOnServer?productKey=" + this.sessionService.session.cctx.pk + "&userName=" + this.sessionService.session.cctx.u, paramObj).pipe(map((res: Response) => res));
    const me = this;
    let path = environment.api.runCommand.onserver.endpoint;
    let data={
      "serverInfo":paramObj,
      "subject":{"tags":[{"key":"Tier","value":tierName,"mode":1}]}
    }
    path = path + '?productKey=' + this.sessionService.session.cctx.pk + '&userName=' + this.sessionService.session.cctx.u;
    return me.controller.post(path, data);
  }

  saveDataToServer(paramObj) {
    var tableObject = { "allCommandsWithData": paramObj, "addCommand": this.addCommandForAuditLog, "editCommand": this.editRowForAuditLog, "deleteCommand": this.deleteRowForAuditLog };

    // let dc = JSON.parse(localStorage.getItem("dc"));
    // if(dc && dc.url.length > 0)
    //   return this.http.post(dc.url + "/DashboardServer/web/RunCommand/saveRunCommand?productKey=" + this.sessionService.session.cctx.pk + "&userName=" + this.sessionService.session.cctx.u, tableObject).pipe(map((res: Response) => res));
    // else
    //   return this.http.post(this.completeIP + "/DashboardServer/web/RunCommand/saveRunCommand?productKey=" + this.sessionService.session.cctx.pk + "&userName=" + this.sessionService.session.cctx.u, tableObject).pipe(map((res: Response) => res));
    const me = this;
    let path = environment.api.runCommand.savecmd.endpoint;
    path = path + "?productKey=" + this.sessionService.session.cctx.pk + "&userName=" + this.sessionService.session.cctx.u;
    return me.controller.post(path, tableObject);
  }
  saveRunCmdTaskInDB(paramObj) {
    //return this.http.post(this.completeIP + "/DashboardServer/web/RunCmdSchedule/saveTask?productKey=" + this.sessionService.session.cctx.pk + "&userName=" + this.sessionService.session.cctx.u, paramObj).pipe(map((res: Response) => res));
    const me = this;
    let path = environment.api.runCommand.schedule.savetask.endpoint;
    path = path + "?productKey=" + this.sessionService.session.cctx.pk + "&userName=" + this.sessionService.session.cctx.u;
    return me.controller.post(path, paramObj);
  }

  getTasksFromDB() {
    let command = "'Run Command%'";
    //return this.http.get(this.completeIP + "/DashboardServer/web/RunCmdSchedule/getTasks?productKey=" + this.sessionService.session.cctx.pk + "&taskType=" + encodeURI(command) + "&userName=" + this.sessionService.session.cctx.u);
    const me = this;
    let path = environment.api.runCommand.schedule.gettask.endpoint;
    path = path + "?productKey=" + this.sessionService.session.cctx.pk + "&taskType=" + encodeURI(command) + "&userName=" + this.sessionService.session.cctx.u;
    return me.controller.get(path, null);
  }

  deleteTaskFromDB(taskid) {
    //return this.http.get(this.completeIP + "/DashboardServer/web/RunCmdSchedule/deleteRunCmdTask?productKey=" + this.sessionService.session.cctx.pk + "&id=" + taskid + "&taskType=" + encodeURI("Run Command") + "&userName=" + this.sessionService.session.cctx.u);
    const me = this;
    let path = environment.api.runCommand.schedule.deletetask.endpoint;
    path = path + "?productKey=" + this.sessionService.session.cctx.pk + "&id=" + taskid + "&taskType=" + encodeURI("Run Command") + "&userName=" + this.sessionService.session.cctx.u;
    return me.controller.get(path, null);
  }

  getTaskInfo(taskid) {
    //return this.http.get(this.completeIP + "/DashboardServer/web/RunCmdSchedule/taskInfo?productKey=" + this.sessionService.session.cctx.pk + "&id=" + taskid + "&userName=" + this.sessionService.session.cctx.u);
    const me = this;
    let path = environment.api.runCommand.schedule.taskinfo.endpoint;
    path = path + "?productKey=" + this.sessionService.session.cctx.pk + "&id=" + taskid + "&userName=" + this.sessionService.session.cctx.u;
    return me.controller.get(path, null);
  }

  updateSchedulingInfoInDB(taskName, taskid, cronFormat, sDateFormat, scheduleExpiry, taskDesc) {
    let command = encodeURI(taskName);
    //return this.http.get(this.completeIP + "/DashboardServer/web/RunCmdSchedule/updateTaskInfo?productKey=" + this.sessionService.session.cctx.pk + "&taskid=" + taskid + "&cron=" + cronFormat + "&taskName=" + command + "&expiryTime=" + scheduleExpiry + "&time=" + sDateFormat + "&disable=enabled&comment=" + taskDesc + "&userName=" + this.sessionService.session.cctx.u)
    const me = this;
    let path = environment.api.runCommand.schedule.updatetask.endpoint;
    path = path + "?productKey=" + this.sessionService.session.cctx.pk + "&taskid=" + taskid + "&cron=" + cronFormat + "&taskName=" + command + "&expiryTime=" + scheduleExpiry + "&time=" + sDateFormat + "&disable=enabled&comment=" + taskDesc + "&userName=" + this.sessionService.session.cctx.u;
    return me.controller.get(path, null);
  }

  enableDisableTaskFromDB(taskid, value) {
    //return this.http.get(this.completeIP + "/DashboardServer/web/RunCmdSchedule/enableDisableTask?productKey=" + this.sessionService.session.cctx.pk + "&id=" + taskid + "&disable=" + value + "&userName=" + this.sessionService.session.cctx.u);
    const me = this;
    let path = environment.api.runCommand.schedule.edtask.endpoint;
    path = path + "?productKey=" + this.sessionService.session.cctx.pk + "&id=" + taskid + "&disable=" + value + "&userName=" + this.sessionService.session.cctx.u;
    return me.controller.get(path, null);
  }

  downloadRunCmdData(mainTabularData: any, outputCols: any, format: string) {

    let obj = {
      "mainData": mainTabularData,
      "headerData": outputCols,
      "formatType": "xls"
    }

    //return this.http.post(this.completeIP + "/DashboardServer/web/RunCommand/downloadRunCmdFile?productKey=" + this.sessionService.session.cctx.pk + "&userName=" + this.sessionService.session.cctx.u, JSON.stringify(obj)).pipe(map(res => res));
    const me = this;
    let path = environment.api.runCommand.download.endpoint;
    path = path + "?productKey=" + this.sessionService.session.cctx.pk + "&userName=" + this.sessionService.session.cctx.u;
    return me.controller.post(path, JSON.stringify(obj));
  }

  /**
   * Get a Graph Data
   */
  getGraphData(tableObject) {
    try {

      //return this.http.post(this.completeIP + "/DashboardServer/web/RunCommand/getRunCommandGraphData?productKey=" + this.sessionService.session.cctx.pk + "&userName=" + this.sessionService.session.cctx.u, tableObject).pipe(map((res: Response) => res));
      const me = this;
      let path = environment.api.runCommand.graphdata.endpoint;
      path = path + "?productKey=" + this.sessionService.session.cctx.pk + "&userName=" + this.sessionService.session.cctx.u
      return me.controller.post(path, tableObject);

    } catch (error) {
      console.error('error in get a graph Data --> ', error);
    }
  }
}
