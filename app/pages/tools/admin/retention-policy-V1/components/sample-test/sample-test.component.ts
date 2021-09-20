import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
//import { ApiService } from '../../../file-explorer/services/api.service';
//import { Subscription }   from 'rxjs/Subscription';
//import { Message, DataTable } from 'primeng/primeng';
//import {SizePipe} from '../../pipes/size.pipe';
//import {MatDialog, MatDialogRef } from '@angular/material';
//import { Logger } from '../../../../../vendors/angular2-logger/core';
// import {FileUploadValidationsService} from '../../../file-explorer/services/fileUploadValidation.service';

@Component({
  selector: 'app-sample-test',
  templateUrl: 'sample-test.component.html',
  styleUrls: ['./sample-test.component.css']
})
export class sampleTest{
    constructor(
        // public _api: ApiService,
        // public dialog: MatDialog, 
        // private log: Logger,
        // private dialogRef: MatDialogRef<sampleTest>
        )
  {
//    this.uploadFile = false;
//    this.uploadUrl = this._api.getSerUploadFilesPath();
    /*Getting Files based on default Path. */
    // this.fileAndFolderPath = this._api.$defaultPath;

    // /* Fetching file on load with default path. */
    // this.fetchFiles();

    // /*Listening Event.*/
    // this.subscription = _api.dataObservable$.subscribe(

    //   /*Getting Event Here.*/
    //   value => {
    //     this.processFiles(value);
    // });
  }

}
