import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpService } from '../../services/httpService';
import { SchedulerMgmtRows } from '../../interface/scheduler-mgmt-rows';
import { map, tap } from "rxjs/operators";

@Component({
  selector: 'app-create-run-cmd-task',
  templateUrl: './create-run-cmd-task.component.html',
  styleUrls: ['./create-run-cmd-task.component.css']
})

export class CreateRunCmdTaskComponent implements OnInit {
  @Input() runCmdObjToCreateTask;
  @Output() displayChange = new EventEmitter();
  @Output() displayMsg = new EventEmitter();
  msgs = 'msgs';
  taskNameModel: string;
  taskDescModel: string;
  tasksData: SchedulerMgmtRows[];

  constructor(private httpService: HttpService) {
    this.tasksData = [];
  }

  ngOnInit() {
    this.httpService.getTasksFromDB().pipe(map(res => <any>res), tap(res => this.getTaskList(res)));
  }

  getTaskList(res) {
    this.tasksData = res;
  }

  saveTaskToDB() {
    var runCmdObj = {};
    var _taskName = "Run Command_" + this.taskNameModel;
    if (this.taskNameModel == undefined || this.taskNameModel.trim() == "") {
      this.showError("Task Name can not be blank");
      return;
    }
    if (!this.isTaskNameExist(this.taskNameModel)) {
      if (!this.checkForFirstChar(this.taskNameModel)) {
        this.showError("Task Name must start with an alphabet and white space(s) and special character(s) are not allowed %$_@#()");
        return;
      }

      if (this.taskNameModel.length > 16) {
        this.showError("Task Name length should not exceed its maximum length that is 16 characters");
        return;
      }

      if (this.taskDescModel == undefined || this.taskDescModel.trim() == "") {
        this.showError("Task Description can not be blank");
        return;
      }
      var taskObj = { "format": "NA", "reportType": _taskName.trim(), "crqObj": this.runCmdObjToCreateTask, "dataTime": "0", "mail": { "subject": "NA", "to": "NA", "body": "NA" }, "taskObj": { "cron": "NA", "task": _taskName.trim(), "expiryTime": "0", "sCron": "NA", "comments": this.taskDescModel.trim() } };
      this.httpService.saveRunCmdTaskInDB(taskObj).subscribe(res => this.isSaveTask(res));
    }
    else {
      this.showError("Task name already exists");
      return;
    }
  }

  checkForFirstChar(taskName) {
    taskName = taskName.trim();
    var regex = new RegExp("^[a-z A-Z]*[a-z A-Z 0-9]*$");
    if (regex.test(taskName))
      return true;

    return false;
  }

  isTaskNameExist(taskName) {
    var trimTaskName = taskName.trim();
    var isExist = false;
    for (var i = 0; i < this.tasksData.length; i++) {
      if (this.tasksData[i].taskName == trimTaskName) {
        isExist = true;
        break;
      }
    }
    return isExist;
  }

  isSaveTask(res) {
    var statusMsg = res.statusMsg;
    this.showInfo(statusMsg);
    this.displayChange.emit({
      displayFlag: res.display
    })
  }

  closeDialogue() {
    this.displayChange.emit({
      displayFlag: "false"
    });
  }

  showAlerts(msg, severity) {
    this.displayMsg.emit({
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
