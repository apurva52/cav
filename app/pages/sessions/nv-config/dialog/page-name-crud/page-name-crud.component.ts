import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { ADD_NEW_PAGE_NAME_DATA } from './service/add-new.dummy';
import { AddNewPageNameData } from './service/add-new.model';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-page-name-crud',
  templateUrl: './page-name-crud.component.html',
  styleUrls: ['./page-name-crud.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PageNameCrudComponent extends PageDialogComponent
  implements OnInit {
  @Output() datae: EventEmitter<any>;
  @Output() adddata: EventEmitter<any>;
  data: AddNewPageNameData[];
  showFields: boolean;
  pageName: string;
  sectionRule: any;
  urlPattern: string;
  testUrl: string;
  msgs: any;

  right: boolean = false;
  updateright: boolean = false;
  updatewrong: boolean = false;

  testurl: any;
  pattern: any;
  value2: any;
  pagename: any;
  pageid: any;
  pagenamemethod: any;
  updatedata: any;
  url: any;
  checked: boolean;
  val1: boolean;
  completeurl: any[];
  completeurlflag: any;
  updatecompleteurl: any[];
  updatecompleteurlflag: any;
  variablename: any;
  variablevalue: any;
  updatepagenamemethod: any;
  updateurl: any;
  updatepattern: any;
  updatevariablename: any;
  updatevariablevalue: any;
  busy: boolean = false;
  updatevalue2: any;
  updatepagename: any;
  definitiontype: any;
  wrong: boolean;

  constructor(private messageService: MessageService) {
    super();
    this.datae = new EventEmitter();
    this.adddata = new EventEmitter();
    this.completeurl = [
      { label: 'Active', value: "1" },
      { label: 'InActive', value: "0" }
    ];
    this.completeurlflag = "1";
    this.definitiontype = [
      { label: 'Url Pattern', value: "1" },
      { label: 'JS Variable', value: "2" }
    ];
    this.pagenamemethod = "1";
  }

  ngOnInit(): void {
    this.pagenamemethod = "1";
  }

  warn(msg: string) {
    this.messageService.add({ severity: 'warn', summary: 'Warning', detail: msg });
  }
  Error(msg: string) {
    this.messageService.add({ severity: 'error', summary: 'Message', detail: msg });
  }

  showDialog(row, isShowFields) {
    super.show();
    if (row) {
      this.updatepagename = row.name;
      this.updatepagenamemethod = row.tPageMethod;
      this.testUrl = row.parameters;
      this.pageid = row.pageId;
      this.updatecompleteurlflag = row.completeUrlFlag,
        this.updatevariablename = row.variableName
      if (row.tPageMethod == "1") {
        if (row.pattern.includes("/(")) {
          let patternvar = row.pattern.replace("/(", "");
          let patternvar2 = patternvar.replace(")/", "");
          this.urlPattern = patternvar2
        }
        else
          this.urlPattern = row.pattern;
        this.updatevariablevalue = '';
        this.updatevariablename = undefined;
      }
      if (row.tPageMethod == "2") {
        this.urlPattern = '';
        this.updatecompleteurlflag = "0";
        if (row.pattern.includes("/(")) {
          let patternvan1 = row.pattern.replace("/(", "");
          let patternvan2 = patternvan1.replace(")/", "");
          this.updatevariablevalue = patternvan2;
        }
        else {
          this.updatevariablevalue = row.pattern;
          this.updatevariablename = row.variableName;
        }
      }
    } else {
      this.pagename = null;
      this.pagenamemethod = "1";
      this.url = null;
      this.value2 = null;
      this.variablename = null;
      this.variablevalue = null;
      this.right = null;
      this.completeurlflag = 1;

    }

    this.showFields = isShowFields;
  }


  open() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  pagepopupobj: any = {};
  editPageobj() {
    this.pagepopupobj = {
      'pagename': this.pagename,
      'pagenamemethod': this.pagenamemethod,
      'completeurlflag': this.completeurlflag,
      'url': this.url,
      'value2': this.value2,
      'variablename': this.variablename,
      'variablevalue': this.variablevalue,
      'right': this.right,
      'pageid': this.pageid,
      'updatepagename': this.updatepagename,
      'updatepagenamemethod': this.updatepagenamemethod,
      'updateurl': this.urlPattern,
      'updatevalue2': this.testUrl,
      'updatecompleteurlflag': this.updatecompleteurlflag,
      'updatevariablevalue': this.updatevariablevalue,
      'updatevariablename': this.updatevariablename,
      'updateright': this.updateright
    }
    this.datae.emit(this.pagepopupobj);
    this.visible = false;

  }
  addpopupobj: any = {};
  addPageobj() {
    this.addpopupobj = {
      'pagename': this.pagename,
      'pagenamemethod': this.pagenamemethod,
      'completeurlflag': this.completeurlflag,
      'url': this.url,
      'value2': this.value2,
      'variablename': this.variablename,
      'variablevalue': this.variablevalue,
      'right': this.right,
      'pageid': this.pageid,
    }
    this.adddata.emit(this.addpopupobj);
    this.visible = false;
  }
  updateTestUrl() {

    this.msgs = [];
    if (this.testUrl == "" || this.urlPattern == "" || this.urlPattern == undefined || this.testUrl == undefined) {

      this.Error("Please Enter Url and Test Url to Test The Url")
      return;
    }
    if (this.urlPattern.includes("(")) {
      this.Error("Url cannot contain special character like (")
      return;
    }
    if (this.updatecompleteurlflag == "0") {
      let newUrl = this.urlPattern;
      let newTestURL;
      let turl = this.testUrl; //me
      let newReg = new RegExp(newUrl);
      try {
        newTestURL = new URL(turl).pathname;
        if (newTestURL.match(newReg)) {
          this.updateright = true;
          this.updatewrong = false;
        }
        else {
          this.updatewrong = true;
          this.updateright = false;
        }
      } catch (e) {
        if (turl.match(newReg)) {
          this.updateright = true;
          this.updatewrong = false;
        }
        else {
          this.updatewrong = true;
          this.updateright = false;
        }
      }

    }
    if (this.updatecompleteurlflag == "1") {
      let newUrl = this.updateurl;
      let newReg = new RegExp(newUrl);
      let turl = this.testUrl //me
      if (turl.match(newReg)) {
        this.updateright = true;
        this.updatewrong = false;
      }
      else {
        this.updatewrong = true;
        this.updateright = false;
      }
    }

  }
  Option() {
    if (this.pagenamemethod == "1") {
      this.variablename = undefined;
      this.variablename = undefined;
    }
    if (this.pagenamemethod == "2")
      this.url = undefined;
    this.testurl = undefined;
    this.wrong = false;
    this.right = false;

  }
  updateClearUrl() {
    this.updatewrong = false;
    this.updateright = false;
  }

  testAddUrl() {
    this.msgs = [];
    if (this.value2 == "" || this.url == "" || this.url == undefined || this.value2 == undefined) {
      this.Error("Please Enter Url and Test Url to Test The Url")
      return;
    }
    if (this.url.includes("(")) {
      this.Error("Url cannot contain special character like (")
      return;
    }
    if (this.completeurlflag == "0") {
      let newUrl = this.url;
      let newTestURL;
      let testurl = this.value2;
      let newReg = new RegExp(newUrl);
      try {
        newTestURL = new URL(testurl).pathname;
        if (newTestURL.match(newReg)) {
          this.right = true;
          this.wrong = false;
        }
        else {
          this.wrong = true;
          this.right = false;
        }
      } catch (e) {
        if (testurl.match(newReg)) {
          this.right = true;
          this.wrong = false;
        }
        else {
          this.wrong = true;
          this.right = false;
        }
      }
    }
    if (this.completeurlflag == "1") {
      let newUrl = this.url;
      let newReg = new RegExp(newUrl);
      let testurl = this.value2
      if (testurl.match(newReg)) {
        this.right = true;
        this.wrong = false;
      }
      else {
        this.wrong = true;
        this.right = false;
      }
    }
  }
  clearUrl() {
    this.url = '';
    this.value2 = '';
    this.wrong = false;
    this.right = false;
  }
  
}