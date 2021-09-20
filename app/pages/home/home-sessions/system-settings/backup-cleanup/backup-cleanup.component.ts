import { Component, OnInit } from '@angular/core';
//import { CronOptions } from 'ngx-cron-editor';
import { Store } from 'src/app/core/store/store';
import { AppError } from 'src/app/core/error/error.model';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NvhttpService } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
import {
  BackupCleanupLoadedState, BackupCleanupLoadingErrorState, BackupCleanupLoadingState
} from './service/backup-cleanup.state';
import { BackupCleanupService } from './service/backup-cleanup.service'
import { MessageService } from 'primeng';
@Component({
  selector: 'app-backup-cleanup',
  templateUrl: './backup-cleanup.component.html',
  styleUrls: ['./backup-cleanup.component.scss']
})
export class BackupCleanupComponent implements OnInit {
  error: AppError;
  loading: boolean;
  empty: boolean;
  path = "/webapps/hpd/rum/config";
  filename = "nv_cb_config.json";
  filedata: any;
  cronvalue: any;
  annualcalendar: any;
  cleanupTableData: any[] = [];
  backupTableData: any[] = [];
  displaycleanupDialog: boolean = false;
  crongui: boolean = false;
  button: boolean;
  displaybackupDialog: boolean = false;
  checked1: boolean = false;
  busy: boolean = false;
  backuptime: any;
  cleanupheader: string;
  selectedClean: any;
  selectedBackup: any;
  backupheader: string;
  cleanupcalendar: string;
  backupcalendar: string;
  cleanuptime: any;
  cronExpression = '';
  cols: { field: any; header: string; }[] = [];
  // cronOptions: CronOptions;
  cronForm: FormGroup;

  constructor(private httpService: NvhttpService, private backupcleanupservice: BackupCleanupService, private messageService: MessageService) {
    this.getData();
  }
  ngOnInit(): void {
    this.annualcalendar = [
      { label: 'Year', value: "y" },
      { label: 'Month', value: "m" },
      { label: 'Day', value: "d" }
    ];

  }
  getData() {
    this.busy = true;
    const me = this;
    me.backupcleanupservice.LoadBackupCleanupData(me.path, me.filename).subscribe(
      (state: Store.State) => {
        if (state instanceof BackupCleanupLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof BackupCleanupLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: BackupCleanupLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );

  }



  private onLoading(state: BackupCleanupLoadingState) {
    const me = this;
    // me.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: BackupCleanupLoadingErrorState) {
    const me = this;
    //me.data = null;
    me.empty = false;
    me.error = {};
    me.error['error'] = "error";
    me.error['msg'] = "Error while loading data.";
    me.loading = false;
  }

  private onLoaded(state: BackupCleanupLoadedState) {
    const me = this;
    let response = state.data.data;
    //response = JSON.parse(response)
    let jsonparse = response["data"];
    this.filedata = JSON.parse(jsonparse);
    console.log("backpcleanupdata", this.filedata);
    this.cleanupTableData = this.filedata["CLEANUP"];
    this.backupTableData = this.filedata["BACKUP"];
    this.cronExpression = this.filedata["CRON_STRING"];

    me.loading = false;
    me.error = null;

  }

  onCleanUpRowSelect(event) {
    console.log(event);
    this.cleanupheader = event.name;
    let cleantime = event.time;
    this.cleanuptime = parseInt(cleantime.split(/([0-9]+)/)[1]);
    this.cleanupcalendar = cleantime.split(/([0-9]+)/)[2];
    this.displaycleanupDialog = true;

  }

  onBackUpRowSelect(rowevent) {
    console.log(event);
    this.displaybackupDialog = true;
    this.backupheader = rowevent.name;
    let backtime = rowevent.time;
    this.backuptime = parseInt(backtime.split(/([0-9]+)/)[1]);
    this.backupcalendar = backtime.split(/([0-9]+)/)[2];

  }

  closebackupDialog() {
    this.displaybackupDialog = false;
  }

  closecleanupDialog() {

    this.displaycleanupDialog = false;
  }

  saveCleanUp(clname) {
    this.cleanupTableData.forEach(temp => {
      if (temp.name == clname) {
        temp.time = (this.cleanuptime + this.cleanupcalendar).toString();
        console.log("tabledata", this.cleanupTableData);
        this.displaycleanupDialog = false;
      }
    })
  }

  saveBackUp(bname) {
    this.backupTableData.forEach(temp => {
      if (temp.name == bname) {
        temp.time = (this.backuptime + this.backupcalendar).toString();;
        this.displaybackupDialog = false;
      }
    });
  }

  // Save the all data
  SaveData() {
    ///console.log("coronastring", this.cronForm.controls["expression"].value)
    //let coronstringvalue = this.cronForm.controls["expression"].value;
    this.filedata["BACKUP"] = this.backupTableData;
    this.filedata["CLEANUP"] = this.cleanupTableData;
    //this.filedata["CRON_STRING"] = coronstringvalue;
    console.log("datatable", this.filedata);
    this.httpService.SaveBackupCleanupData(this.filedata).subscribe(response => {
      if (response != null) {
        console.log(response);
        this.getData();
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Successfully Saved', detail: '' });
      }
    });

  }


}


