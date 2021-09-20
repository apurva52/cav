import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng';
import { Store } from 'src/app/core/store/store';
import * as moment from 'moment';
import 'moment-timezone';
import { MessageService } from 'primeng/api';
import { NvhttpService } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
@Component({
  selector: 'app-task-scheduler',
  templateUrl: './task-scheduler.component.html',
  styleUrls: ['./task-scheduler.component.scss'],
  providers: [MessageService]
})
export class TaskSchedulerComponent implements OnInit {
  breadcrumb: MenuItem[];
  tableData: any[];
  reportdata: boolean = false;
  scheduleddata: boolean = true;
  reporttableData: any[];
  customData = false;
  subject: any;
  totalrecords: number;
  rsync = false;
  to: any;
  items: MenuItem[];

  reporttotalrecords: number;
  body: any;
  first: number;
  attach: any;

  maxDate: Date;
  header = 'Select time range.';

  days = [
    { label: 'SUN', value: 'SUN' },
    { label: 'MON', value: 'MON' },
    { label: 'TUE', value: 'TUE' },
    { label: 'WED', value: 'WED' },
    { label: 'THU', value: 'THU' },
    { label: 'FRI', value: 'FRI' },
    { label: 'SAT', value: 'SAT' },
  ];
  week = [
    { label: 'Monday', value: '1' },
    { label: 'Tuesday', value: '2' },
    { label: 'Wednesday', value: '3' },
    { label: 'Thursday', value: '4' },
    { label: 'Friday', value: '5' },
    { label: 'Satruday', value: '6' },
    { label: 'Sunday', value: '0' }
  ];
  scheduler = 'daily';
  hour = '';
  minute = '';
  taskDescription = '';
  weekDay = '';
  startTime = new Date();
  day = '';
  month = '';
  daily: any;
  startTimeMonthly: string;
  scheduleExpiryTime = new Date();
  scheduleTimee: any;
  tabIndex = 0;
  task_id_update = "";


  loading = false;
  constructor(private httpService: NvhttpService, private messageService: MessageService) {
    this.first = 0;
  }

  ngOnInit(): void {
    this.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Sessions', routerLink: '/home/home-sessions' },
      { label: 'Task-Scheduler' }
    ];
    this.getTableData();
    this.items = [{
      label: 'Select Task',
      items: [{
        label: 'Report',
        icon: 'pi pi-file',
        // command: (event) => {
        //   this.router.navigate(['/home/netvision/taskScheduler/addReports'], { replaceUrl: true });
        // }
      },
      {
        label: 'Rsync',
        icon: 'pi pi-refresh',
        command: (event) => {
          this.openRsyc();

        }
      }]
    },];

  }
  openRsyc() {
    this.rsync = true;
  }

  getTableData() {
    console.log("getTableData inside task-scheduler");
    this.httpService.getTaskReport().subscribe((state: Store.State) => {
      let response = state['data'];
      console.log("response======", response);
      this.tableData = [];
      if (response != null) {
        for (const i of response) {
          let array = i.split(',');
          let extime = array[3];
          //let st = new Date(parseInt(extime));
          //let scheduleextime = st.getMonth() + 1 + '/' + st.getDate() + '/' + st.getFullYear() + ' ' + st.toString().split(' ')[4].split(':')[0] + ':' + st.toString().split(' ')[4].split(':')[1] + ':' + st.toString().split(' ')[4].split(':')[2];
          let scheduleextime = moment.utc(parseInt(extime)).tz(sessionStorage.getItem('_nvtimezone')).format('HH:mm:ss MM/DD/YY')
          this.tableData.push({
            'taskid': array[0],
            'taskType': array[2],
            'description': array[8],
            'scheduleTime': array[4] + array[5],
            'scheduleExpiryTime': scheduleextime,
            'status': array[7],
          });

          console.log("tableData-------", this.tableData);
        }
        this.totalrecords = this.tableData.length;
      }
    });
  }
  openReport() {
    this.reportdata = true;
    this.scheduleddata = false;
    this.getReportTableData();
  }
  getReportTableData() {
    this.loading = true;
    this.httpService.getReportList().subscribe((state: Store.State) => {
      let response = state['data'];
      console.log("response======", response);
      this.reporttableData = [];
      if (response != null) {
        for (const a of response) {
          var filenameTokens = a.split(".")[0].split("_");
          var date = filenameTokens[filenameTokens.length - 2];
          var time = filenameTokens[filenameTokens.length - 1];
          filenameTokens.pop();
          filenameTokens.pop();
          var report = filenameTokens.join(" ");
          console.log("filenameTokens-------", report);
          this.reporttableData.push({
            'report': report,
            'reportTime': date + " " + time,
            'fileName': a,
          });
        }
        this.reporttotalrecords = this.reporttableData.length;
        this.loading = false;
      }
      console.log("tableData-------", this.reporttableData);
    });
  }
  openCustom(xlsFileName: any) {
    console.log("xlsFileName : ", xlsFileName);
    this.subject = xlsFileName;
    this.attach = xlsFileName;
    this.customData = true;
  }
  deleteReport(filename) {
    this.httpService.getDeleteReport(filename).subscribe((state: Store.State) => {
      let response = state['data'];
      if (response != null) {
        console.log("response==22====", response);
        if (response === true) {
          console.log("response==33====", response);
          this.getReportTableData();
        }
      }
    });
  }

  sendMail() {
    this.customData = false;
    console.log("subject======", this.subject);
    console.log("to======", this.to);
    console.log("body======", this.body);
    console.log("attach======", this.attach);
    let toMail = "";
    for (let j = 0; j < this.to.length; j++) {
      if (j == 0)
        toMail = this.to[j];
      else
        toMail = toMail + ";" + this.to[j];

    }
    console.log("toMail == ", toMail);
    // if(this.subject== undefined) {
    //   this.msgs.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please Enter the Subject for Mail' });
    //   return;
    // }

    // else if(this.to== undefined) {
    //   this.msgs.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please Enter the Mail-Id' });
    //   return;
    // }

    // else if(this.body== undefined) {
    //   this.msgs.add({ severity: 'warn', summary: 'Warn Message', detail: 'Please Enter the Mail Body' });
    //   return;
    // }
    this.customData = false;
    this.httpService.getTaskMailinfo(this.subject, toMail, this.body, this.attach).subscribe((state: Store.State) => {
      let response = state['data']
      console.log("response task mail : ", response);
      if (response != null && response != undefined) {
        if (response == true) {
          this.messageService.add({ severity: 'success', summary: 'Success Message', detail: '' });
          return;
        }
        else if (response == false) {

          this.messageService.add({ severity: 'warn', summary: 'Mail Not Sent', detail: '' });
          return;
        }
      }

    });

  }

  deleteTask(reportdata) {
    console.log("deletTask taskid", reportdata.taskid);
    this.httpService.getTaskOperation(reportdata.taskid + "|" + reportdata.taskType, "deleteTask").subscribe((state: Store.State) => {
      let response = state['data']
      if (response != null) {
        console.log("response==22====", response);
        if (response == 'true') {
          this.getTableData();
        }
      }
    });
  }
  enableDisable(reportdata) {
    console.log("disableenable", reportdata.status);
    if (reportdata.status === "enabled") {
      this.httpService.getTaskOperation(reportdata.taskid + "|" + 'disabled', "enableDisableTask").subscribe((state: Store.State) => {
        let response = state['data']
        if (response != null) {
          console.log("response==22====", response);
          if (response == 'true') {
            this.getTableData();
          }
        }
      });
    }
    else if (reportdata.status === "disabled") {
      this.httpService.getTaskOperation(reportdata.taskid + "|" + 'enabled', "enableDisableTask").subscribe((state: Store.State) => {
        let response = state['data']
        if (response != null) {
          console.log("response==22====", response);
          if (response == 'true') {
            this.getTableData();
          }
        }
      });
    }
  }
}

