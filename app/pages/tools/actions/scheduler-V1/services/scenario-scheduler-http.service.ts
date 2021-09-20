import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { CavConfigService } from '../../../configuration/nd-config/services/cav-config.service';
import { map } from "rxjs/operators";
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpScenarioScheduleService extends Store.AbstractService{
  cmdGroupList: any[];
  completeIP: string;
  isAdminUser: boolean;
  sesRole: string;
  constructor(private http: HttpClient, private _config: CavConfigService, private sessionService: SessionService) {
    super();
    this.completeIP = this._config.getINSPrefix();// + this._config.getActiveDC();//window.location.protocol + "//" + window.location.host;
  }

  /* Getting Vector List*/
  getVectorList() {
    //return this.http.get(this.completeIP + '/DashboardServer/web/tcpDump/vectorList?testRun=' + this.sessionService.session.testRun.id + '&productKey=' + this.sessionService.session.cctx.pk).pipe(map(res => <any>res));
    const me = this;
    let path = environment.api.runCommand.tiers.endpoint;
    path = path + '?productKey=' + this.sessionService.session.cctx.pk + '&testRun=' + this.sessionService.session.testRun.id + 'userName=' + this.sessionService.session.cctx.u + '&topoName=NDE_Testing';
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
    this.isAdminUser === true ? this.sesRole = "Admin" : this.sesRole = "Standard";
    //return this.http.get(this.completeIP + '/DashboardServer/web/RunCommand/runCommandInfo?role=' + this.sesRole + '&productKey=' + this.sessionService.session.cctx.pk).pipe(map(res => { this.cmdGroupList = res[0] }));
    const me = this;
    let path = environment.api.runCommand.info.endpoint;
    path = path + '?productKey=' + this.sessionService.session.cctx.pk + '&role=' + this.isAdminUser + "&userName=" + this.sessionService.session.cctx.u + '&testRun=' + this.sessionService.session.testRun.id;
    return me.controller.get(path, null);
  }

  /*To run the commnad on the server and save and give the output */
  runCommandOnServer(paramObj, tierName) {
    //return this.http.post(this.completeIP + "/DashboardServer/web/RunCommand/runCommandOnServer?productKey=" + this.sessionService.session.cctx.pk, paramObj).pipe(map(res => <any>res));
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
    //return this.http.post(this.completeIP + "/DashboardServer/web/RunCommand/saveRunCommand?productKey=" + this.sessionService.session.cctx.pk + "&userName=" + this.sessionService.session.cctx.u, paramObj).pipe(map(res => <any>res));
    const me = this;
    let path = environment.api.runCommand.savecmd.endpoint;
    path = path + "?productKey=" + this.sessionService.session.cctx.pk + "&userName=" + this.sessionService.session.cctx.u;
    return me.controller.post(path, paramObj);
  }

  saveRunCmdTaskInDB(paramObj) {
    //return this.http.post(this.completeIP + "/DashboardServer/web/RunCmdSchedule/saveTask?productKey=" + this.sessionService.session.cctx.pk + '&userName=' + this.sessionService.session.cctx.u, paramObj).pipe(map(res => <any>res));
    const me = this;
    let path = environment.api.runCommand.schedule.savetask.endpoint;
    path = path + "?productKey=" + this.sessionService.session.cctx.pk + "&userName=" + this.sessionService.session.cctx.u;
    return me.controller.post(path, paramObj);
  }

  getTasksFromDB(command) {
    //return this.http.get(this.completeIP + "/DashboardServer/web/RunCmdSchedule/getTasks?taskType=" + encodeURI(command) + '&productKey=' + this.sessionService.session.cctx.pk + '&userName=' + this.sessionService.session.cctx.u);
    const me = this;
    let path = environment.api.runCommand.schedule.gettask.endpoint;
    path = path + "?productKey=" + this.sessionService.session.cctx.pk + "&taskType=" + encodeURI(command) + "&userName=" + this.sessionService.session.cctx.u;
    return me.controller.get(path, null);
  }

  deleteTaskFromDB(taskid, command) {
    //return this.http.get(this.completeIP + "/DashboardServer/web/RunCmdSchedule/deleteRunCmdTask?id=" + taskid + "&taskType=" + encodeURI(command) + '&productKey=' + this.sessionService.session.cctx.pk + '&userName=' + this.sessionService.session.cctx.u);
    const me = this;
    let path = environment.api.runCommand.schedule.deletetask.endpoint;
    path = path + "?productKey=" + this.sessionService.session.cctx.pk + "&id=" + taskid + "&taskType=" + encodeURI("Run Command") + "&userName=" + this.sessionService.session.cctx.u;
    return me.controller.get(path, null);
  }

  getTaskInfo(taskid) {
    //return this.http.get(this.completeIP + "/DashboardServer/web/RunCmdSchedule/taskInfo?id=" + taskid + '&productKey=' + this.sessionService.session.cctx.pk, { responseType: 'text' });
    const me = this;
    let path = environment.api.runCommand.schedule.taskinfo.endpoint;
    path = path + "?productKey=" + this.sessionService.session.cctx.pk + "&id=" + taskid + "&userName=" + this.sessionService.session.cctx.u;
    return me.controller.get(path, null);
  }

  updateSchedulingInfoInDB(taskName, taskid, cronFormat, sDateFormat, scheduleExpiry, taskDesc) {
    let command = encodeURI(taskName);
    //return this.http.get(this.completeIP + "/DashboardServer/web/RunCmdSchedule/updateTaskInfo?taskid=" + taskid + "&cron=" + cronFormat + "&taskName=" + command + "&expiryTime=" + scheduleExpiry + "&time=" + sDateFormat + "&disable=enabled&comment=" + taskDesc + '&productKey=' + this.sessionService.session.cctx.pk + '&userName=' + this.sessionService.session.cctx.u)
    const me = this;
    let path = environment.api.runCommand.schedule.updatetask.endpoint;
    path = path + "?productKey=" + this.sessionService.session.cctx.pk + "&taskid=" + taskid + "&cron=" + cronFormat + "&taskName=" + command + "&expiryTime=" + scheduleExpiry + "&time=" + sDateFormat + "&disable=enabled&comment=" + taskDesc + "&userName=" + this.sessionService.session.cctx.u;
    return me.controller.get(path, null);
  }

  enableDisableTaskFromDB(taskid, value) {
    //return this.http.get(this.completeIP + "/DashboardServer/web/RunCmdSchedule/enableDisableTask?id=" + taskid + "&disable=" + value + '&productKey=' + this.sessionService.session.cctx.pk + '&userName=' + this.sessionService.session.cctx.u);
    const me = this;
    let path = environment.api.runCommand.schedule.edtask.endpoint;
    path = path + "?productKey=" + this.sessionService.session.cctx.pk + "&id=" + taskid + "&disable=" + value + "&userName=" + this.sessionService.session.cctx.u;
    return me.controller.get(path, null);
  }

}
