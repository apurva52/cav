import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Moment } from 'moment-timezone';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { CREATE_TASK_DATA } from './service/create-task.dummy';
import { CreateTask } from './service/create-task.model';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateTaskComponent extends PageDialogComponent implements OnInit {
  loading: boolean;
  empty: boolean;
  data: CreateTask;

  customTimeFrame: Moment[] = null;
  customTimeFrameMax: Moment = null;
  invalidDate: boolean = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    const me = this;
    me.data = CREATE_TASK_DATA;
  }

  saveChanges() {
    const me = this;
    me.hide();
  }
}
