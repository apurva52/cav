import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { HttpService } from '../../services/httpService';
import { SchedulerMgmtRows } from '../../interface/scheduler-mgmt-rows';
import { map, tap } from "rxjs/operators";

@Component({
  selector: 'app-run-cmd-scheduler-mgmt',
  templateUrl: './run-cmd-scheduler-mgmt.component.html',
  styleUrls: ['./run-cmd-scheduler-mgmt.component.css']
})

export class RunCmdSchedulerMgmtComponent implements OnInit {

  @Output() displayMsgForScheduler = new EventEmitter();

  /*
   selected tab boolean
  */

  hourlyTab: boolean = true;
  weeklyTab: boolean;
  monthlyTab: boolean;

  /*
    disabled tab values 
   */
  hourlyTabDis: boolean = true;
  weeklyTabDis: boolean = true;
  monthlyTabDis: boolean = true;
  scheduleExpiryDis: boolean = true;
  saveButtonDis: boolean = true;

  /*showScheduleSetting Table variable*/
  showScheduleSettingTable: boolean = false;

  rowData: any;
  mMonthModel: number;
  taskId: number = 0;
  mDayModel: number;
  weekDays: SelectItem[];
  selectedWeek: string;
  scheduleExpiry: Date;
  customEventDay: Date;
  addCtsmEvDayCalModel: Date;
  cstmEvDayTxtModel: string;
  everyHourTxtModel: number;
  dailyTxtModel: Date;
  taskDescModel: string;
  taskNameModel: string;
  WeekTime: Date;
  MonthlyTime: Date;
  selectedEvent: string;
  displayCstmEvSec: boolean = false;
  everyOrDaily: string = "every";
  tasksData: SchedulerMgmtRows[];
  selectedScheduleRow: SchedulerMgmtRows;
  eventDaysArr: any[];
  seletectedTabIndex: number = 0;
  selectedRow: number = -1;

  /** array used to create cronstring*/
  min: any[];
  hour: any[];
  scheduleObj: string;
  DAYS: any[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  DAYS1: any[] = ["", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  /** array used to create cronstring*/
  disCstmEvDaysWin: boolean = false;
  tableHeaderInfo: any[];

  constructor(private httpService: HttpService) {
    this.tasksData = [];
    this.weekDays = [];
    this.eventDaysArr = [];
    this.min = [];
    this.hour = [];
    this.scheduleObj = "";
    this.selectedEvent = "New Years Day";
    this.rowData = {};
    this.pushWeekDays();
    this.pushEventDays();
    this.populateTimeArr();
    this.httpService.getTasksFromDB().pipe(map(res => <any>res), tap(res => this.getTaskList(res)));
    //this.createCron();
    this.tableHeaderInfo = [
      { label: 'Task Type', field: 'taskType' },
      { label: 'Task Name', field: 'taskName' },
      { label: 'Description', field: 'description' },
      { label: 'Schedule Time', field: 'scheduleFrom' },
      { label: 'Schedule Expiry Time', field: 'scheduleExpiryDate' },
      { label: 'status', field: 'status' },
    ];
  }

  setRowData(rowData) {
    this.rowData = rowData;
  }

  getRowData() {
    return this.rowData;
  }

  onRowSelect($event) {
    //on rowselect call the view scheduleInfo method
    this.setPreviousValues($event.data, 1);
  }

  onRowUnselect($event) {

  }
  populateTimeArr() {
    for (var a = 0; a < 60; a++) {
      if (a <= 9) {
        this.min.push("0" + a);
        this.hour.push("0" + a);
      }
      else {
        this.min.push("" + a);
        if (a < 24)
          this.hour.push("" + a);
      }
    }
  }

  onTabChange(event) {
    this.seletectedTabIndex = event.index;//setting the selected tab

    if (this.seletectedTabIndex == 0) {
      this.hourlyTab = true;
      this.weeklyTab = false;
      this.monthlyTab = false;
    }
    else if (this.seletectedTabIndex == 1) {
      this.hourlyTab = false;
      this.weeklyTab = true;
      this.monthlyTab = false;
    }

    else if (this.seletectedTabIndex == 2) {
      this.hourlyTab = false;
      this.weeklyTab = false;
      this.monthlyTab = true;
    }
  }

  // for setting values in case modification of any task.
  setPreviousValues(rowData, mode) {
    this.setTaskId(rowData.taskid);
    this.setRowData(rowData);
    this.httpService.getTaskInfo(rowData.taskid).subscribe(res => this.setScheduleObj(res, rowData, mode));
  }

  setTaskId(taskId) {
    this.taskId = taskId;
  }

  saveSchedule() {
    var cronFormat = "";
    var sDateFormat = "";
    var scheduleExpiry = "";
    try {
      if (this.hourlyTab == true)//tab1
      {
        if (this.everyOrDaily == "every")//for Every
        {
          var _regHourly = new RegExp("^[0-9]{1,2}$");
          if (!_regHourly.test(String(this.everyHourTxtModel))) {
            this.showError("Please enter the valid number of hour(s)");
            return;
          }

          if (this.everyHourTxtModel > 23) {
            this.showError("Number of hours must not exceed 23");
            return;
          }

          if (this.everyHourTxtModel == undefined) {
            this.showError("Please enter number of hour(s)");
            return false;
          }
          //cronFormat = "0 */"+$('#hhour')[0].value+" * * *";
          cronFormat = "0 */" + this.everyHourTxtModel + " * * *";
          sDateFormat = "Hourly, Every " + this.everyHourTxtModel + " Hour(s)"
        }

        else //Daily At
        {
          var time = this.dailyTxtModel;
          var _regDailyAt = new RegExp("^[0-2][0-9]:[0-5][0-9]$");
          /*if( !_regDailyAt.test( String(time) ) )
          {
            this.showError("Please enter valid time(hh:mm)");
            return;
          }*/
          if (time == undefined) {
            this.showError("Please enter daily at time");
            return false;
          }
          var d = new Date(time);
          //Daily, at 01:04	
          //var time1 = time.split(":");
          cronFormat = "0 " + d.getMinutes() + " " + d.getHours() + " * * *";
          sDateFormat = "Daily, at " + this.appendZeroIfRequired(d.getHours()) + ":" + this.appendZeroIfRequired(d.getMinutes()) + "";
        }
      }

      if (this.weeklyTab == true)//tab2
      {
        var days = -1;
        var sdays = -1;

        var daysChecked = this.selectedWeek;
        var n = 0;
        if (daysChecked == undefined || daysChecked == "") {
          this.showError("Select days of the week");
          return false;
        }

        if (daysChecked == "Monday")
          days = 1
        if (daysChecked == "TuesDay")
          days = 2
        if (daysChecked == "WednesDay")
          days = 3
        if (daysChecked == "Thursday")
          days = 4
        if (daysChecked == "Friday")
          days = 5
        if (daysChecked == "Saturday")
          days = 6
        if (daysChecked == "Sunday")
          days = 0

        var _regWeekTime = new RegExp("^[0-2][0-9]:[0-5][0-9]$");
        /*if( !_regWeekTime.test( String(this.WeekTime) ) )
        {
           this.showError("Please enter valid time(hh:mm)");
           return;
        }*/

        if (this.WeekTime == undefined) {
          this.showError("Please enter start time");
          return;
        }
        cronFormat = "0 " + this.WeekTime.getMinutes() + " " + this.WeekTime.getHours() + " * * " + days;
        sDateFormat = "Weekly, " + this.DAYS[days] + " at " + this.appendZeroIfRequired(this.WeekTime.getHours()) + ":" + this.appendZeroIfRequired(this.WeekTime.getMinutes());
      }

      if (this.monthlyTab == true) //Monthly
      {
        var d = this.MonthlyTime;
        if (this.mDayModel == undefined || String(this.mDayModel) == "") {
          this.showError("Please enter number of days");
          return false;
        }

        if (this.mMonthModel == undefined || String(this.mMonthModel) == "") {
          this.showError("Enter number of months");
          return false;
        }


        cronFormat = this.mDayModel + " */" + this.mMonthModel + " *";
        sDateFormat = "Monthly, On day " + this.mDayModel + " every " + this.mMonthModel + " month(s)";
        cronFormat = "0 " + d.getMinutes() + " " + d.getHours() + " " + cronFormat;
        sDateFormat += " At " + this.appendZeroIfRequired(d.getHours()) + ":" + this.appendZeroIfRequired(d.getMinutes())
      }

      //setting the schedule expiry
      var dexpiry = this.scheduleExpiry;
      //01/01/2017 11:30:00 schedule expiry date format	

      var _regExpiry = new RegExp("^[0-3][0-9]\/[0-1][0-9]\/[0-9]{4} [0-1][0-9]:[0-5][0-9]$");

      if (this.scheduleExpiry != undefined) {
        var ddmmyy = this.appendZeroIfRequired(dexpiry.getDate() + 1) + "/" + this.appendZeroIfRequired(dexpiry.getMonth() + 1) + "/" + this.appendZeroIfRequired(dexpiry.getFullYear());
        var hhmmss = this.appendZeroIfRequired(dexpiry.getHours()) + ":" + this.appendZeroIfRequired(dexpiry.getMinutes()) + ":" + "00";
        scheduleExpiry = ddmmyy + " " + hhmmss;
      }

      else
        scheduleExpiry = "0";

      /*if( !_regExpiry.test( scheduleExpiry ))
      {
        this.showError("Please enter valid expiry date (dd/mm/yyyy hh:mm)");
        return;
      }*/

      var taskid = this.getTaskId();
      var curTaskName = this.getRowData().taskName;
      var taskNameTxt = this.taskNameModel;
      if (this.taskNameModel == undefined || this.taskNameModel.trim() == "") {
        this.showError("Task Name can not be blank");
        return;
      }

      //before saving the task, validate on the gui side, if the same name exist on the gui
      if (!this.isTaskNameExist(taskNameTxt, curTaskName)) {

        if (!this.checkForFirstChar(this.taskNameModel)) {
          this.showError("Task Name must start with an alphabet and white space(s) and special character(s) are not allowed %$_@#()");
          return;
        }

        if (this.taskNameModel.length > 16) {
          this.showError("Task Name length should not exceed its maximum length that is 16 characters");
          return;
        }


        this.saveTaskToDB("Run Command_" + taskNameTxt, taskid, cronFormat, sDateFormat, scheduleExpiry);
      }

      else {
        this.showError("Task name already exists");
        return;
      }
      //get the data based on this taskid and append the cron and expiry to it and again save it
    }
    catch (e) {
      console.error(e);
      console.error(e.stack);
      this.showError("Error in creating cron");
      return false;
    }
  }

  isTaskNameExist(taskNameTxt, curTaskName) {
    var isExist = false;
    for (var i = 0; i < this.tasksData.length; i++) {
      if (this.tasksData[i].taskName != curTaskName && this.tasksData[i].taskName == taskNameTxt) {
        isExist = true;
        break;
      }
    }
    return isExist;
  }

  checkForFirstChar(taskName) {
    taskName = taskName.trim();

    var regex = new RegExp("^[a-z A-Z]*[a-z A-Z 0-9]*$");
    if (regex.test(taskName))
      return true;

    return false;
  }

  saveTaskToDB(taskName, taskid, cronFormat, sDateFormat, scheduleExpiry) {
    this.httpService.updateSchedulingInfoInDB(taskName, taskid, cronFormat, sDateFormat, scheduleExpiry, this.taskDescModel).subscribe(res => this.populateTaskInTable(res));
  }

  populateTaskInTable(res) {
    this.httpService.getTasksFromDB().pipe(map(res => <any>res), tap(res => this.getTaskList(res)));
    this.showInfo(JSON.parse(res._body).statusMsg);
  }

  getTaskId() {
    return this.taskId;
  }

  addCstmDay() {
    //validate all the details in the custom Event days field
    var cstmEventDayTextField = this.cstmEvDayTxtModel;
    var cstmEventDayCal = this.cstmEvDayTxtModel;
    var regexTxt = new RegExp("^[a-z A-Z]*$");
    if (!regexTxt.test(cstmEventDayTextField)) {
      this.showError("Custom Event Day should consist of only Alphabets");
      return;
    }

    //add the custom day to the db
  }

  openCstmEvDaysWin() {
    this.disCstmEvDaysWin = true;
  }

  getTaskList(res) {
    this.tasksData = res;
  }

  pushEventDays() {
    var arr = ["New Years Day", "Valentines Day", "President Day", "Thanks giving Day", "Black Friday", "Cyber Monday", "Chritmas Day", "Custom Event Day"];
    this.pushElementInArray(arr, this.eventDaysArr);
  }

  pushWeekDays() {
    var arr = ["Sunday", "Monday", "TuesDay", "WednesDay", "Thursday", "Friday", "Saturday"];
    this.pushElementInArray(arr, this.weekDays);
  }

  pushElementInArray(arr, domArray) {
    for (var i = 0; i < arr.length; i++) {
      domArray.push({ label: arr[i], value: arr[i] });
    }
  }

  enableDisableTask(selectedRow) {

    var value = selectedRow.status;
    var taskId = selectedRow.taskid;
    var scheduleTime = selectedRow.scheduleFrom;

    if (scheduleTime == "NA") {
      this.showInfo("Please set the schedule time before enabling this task.");
      return;
    }

    value = (value == 'disabled') ? 'enabled' : 'disabled';

    for (var i = 0; i < this.tasksData.length; i++) {
      if (this.tasksData[i].taskid == taskId) {
        var isEnable = confirm("Do you want to " + value.substring(0, value.length - 1) + " this task?");
        if (isEnable) {
          //Logic to delete the item
          this.tasksData[i].status = value;
          this.httpService.enableDisableTaskFromDB(taskId, value).pipe(map(res => <any>res), tap(res => this.showMsg(res)));
        }
      }
    }

  }

  deleteTask(rowData) {
    var taskId = rowData.taskid;
    for (var i = 0; i < this.tasksData.length; i++) {
      if (this.tasksData[i].taskid == taskId) {
        var isDelete = confirm("Are you sure you want to delete?");
        if (isDelete) {
          //Logic to delete the item
          this.tasksData.splice(i, 1);

          //call the service to delete the task from db    
          this.httpService.deleteTaskFromDB(taskId).pipe(map(res => <any>res), tap(res => this.showMsg(res)));
        }
      }
    }
    if (this.tasksData.length == 0) {
      this.resetAll();
      this.enableDisableScheduleInfo(true);
    }
  }

  showMsg(res) {
    this.showInfo(res.statusMsg);
  }

  setScheduleObj(res, rowData, mode) {
    this.scheduleObj = res._body;
    this.showScheduleInfo(this.scheduleObj, rowData, mode);
  }

  enableDisableScheduleInfo(isDisable: boolean) {
    this.weeklyTabDis = isDisable;
    this.monthlyTabDis = isDisable;
    this.hourlyTabDis = isDisable;
    this.scheduleExpiryDis = isDisable;
    this.saveButtonDis = isDisable;
  }

  resetAll() {
    //reset weekly tab
    //reset hourly tab
    //reset monthly tab

    this.everyOrDaily = "every";
    this.everyHourTxtModel = undefined; //number
    this.dailyTxtModel = undefined; //date
    this.taskDescModel = "" //string
    this.taskNameModel = "" //string

    this.selectedWeek = "";  //string
    this.WeekTime = undefined; //date

    this.mDayModel = undefined; //number
    this.mMonthModel = undefined; // number
    this.MonthlyTime = undefined; //date

    this.scheduleExpiry = undefined;  //date 


    this.hourlyTab = true;
    this.weeklyTab = false;
    this.monthlyTab = false;

  }

  showScheduleInfo(updateTask, rowData, mode) {
    this.showScheduleSettingTable = true;

    this.resetAll();
    //view mode - > mode == 0
    //edit mode - > mode == 1

    if (mode == 1)
      this.enableDisableScheduleInfo(false);
    else
      this.enableDisableScheduleInfo(true);

    if (updateTask == undefined || updateTask == null) return;

    var info = updateTask.split("|");
    // expiry date time

    if (info[3] != "NA" && parseInt(info[3]) > 0) {
      var a = new Date(parseInt(info[3]));
      var date = a.toLocaleDateString();
      var hh = a.getHours();
      var mm = a.getMinutes();

      var scheduleExpiryDate = date + " " + hh + ":" + mm;
      this.scheduleExpiry = new Date(scheduleExpiryDate);
    }

    // occurence
    if (info[4] != "NA" && info[4].indexOf("Weekly") > -1) {
      this.weeklyTab = true;
      this.hourlyTab = false;
      this.monthlyTab = false;

      for (var x = 0; x < this.DAYS.length; x++) {
        if (this.DAYS[x] == info[4].split(",")[1].trim().substring(0, 3))
          this.selectedWeek = String(this.weekDays[x].value);
      }

      var hoursMinutes = info[4].split("at")[1].trim();
      var d = new Date();
      d.setHours(hoursMinutes.split(":")[0]);
      d.setMinutes(hoursMinutes.split(":")[1]);
      this.WeekTime = d;
    }

    if (info[4] != "NA" && (info[4].indexOf("Hourly") > -1 || info[4].indexOf("Daily") > -1)) {
      //set the hourly tab
      this.hourlyTab = true;
      this.monthlyTab = false;
      this.weeklyTab = false;
      if (info[4].indexOf("Every") > -1) {
        this.everyOrDaily = "every";
        this.everyHourTxtModel = parseInt(info[4].split("Every")[1]);
      }
      else {
        this.everyOrDaily = "dailyAt";
        var temp = info[4].toLowerCase();
        var hoursMinutes = temp.split("at")[1].trim();
        var d = new Date();
        d.setHours(hoursMinutes.split(":")[0]);
        d.setMinutes(hoursMinutes.split(":")[1]);

        this.dailyTxtModel = d;
      }
    }
    if (info[4] != "NA" && info[4].indexOf("Monthly") > - 1) {
      this.monthlyTab = true;
      this.hourlyTab = false;
      this.weeklyTab = false;

      //Monthly, On day 1 every 3 month(s) At 09:30
      this.mDayModel = parseInt(info[4].split('day')[1]);
      this.mMonthModel = parseInt(info[4].split('every')[1]);
      var d = new Date();
      var hoursMinutes = info[4].toLowerCase().split('at')[1].trim().split(":");
      d.setHours(hoursMinutes[0]);
      d.setMinutes(hoursMinutes[1]);
      this.MonthlyTime = d;
    }
    this.taskDescModel = rowData.description; //setting the task description
    this.taskNameModel = rowData.taskName; //setting the task Name

  }
  appendZeroIfRequired(element) {
    var temp = String(element);
    temp = temp.length > 1 ? temp : '0' + temp;
    return temp;
  }

  isSaveTask(res) {
    var statusMsg = res.statusMsg;
    this.showInfo(statusMsg);
    this.showScheduleSettingTable = false;//hiding the schedulerSetting Table again after saving the schedule.
  }

  ngOnInit() {
  }

  showAlerts(msg, severity) {
    this.displayMsgForScheduler.emit({
      msg: msg + ":" + severity
    });
  }

  showInfo(detail) {
    this.showAlerts(detail, 'info');
  }

  showError(detail) {
    this.showAlerts(detail, 'Error');
  }

}
