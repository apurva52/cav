import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { NvhttpService, NVPreLoadingState, NVPreLoadedState, NVPreLoadingErrorState } from './../../../home/home-sessions/common/service/nvhttp.service';
import { PAGE_NAME_DATA } from './service/page-name.dummy';
import { Store } from 'src/app/core/store/store';
import { MsgService } from './../../../home/home-sessions/common/service/msg.service';
import { ConfirmationService } from 'primeng/api';
import { PageDataSource } from './PageDataSource';
import { MetadataService } from './../../../home/home-sessions/common/service/metadata.service';
import { MessageService } from 'primeng/api';
import { SessionStateService } from '../../../../pages/home/home-sessions/session-state.service';
import { TitleData } from './service/page-name.model';

@Component({
  selector: 'app-page-name',
  templateUrl: './page-name.component.html',
  styleUrls: ['./page-name.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PageNameComponent implements OnInit {
  data: Table;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  buttonflag: boolean = false;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  isShowColumnFilter: boolean;
  downloadOptions: MenuItem[];
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  pageid: any;
  msgs: any;
  deletedata: any;
  response: any;
  metadataService: MetadataService;
  sgs: any;
  button: boolean;
  displaypagename: boolean = false;
  updatedisplaypagename: boolean = false;
  definitiontype: any[];
  DefinitionType: any;
  right: boolean = false;
  wrong: boolean = false;
  updateright: boolean = false;
  updatewrong: boolean = false;
  testurl: any;
  pattern: any;
  value2: any;
  pagename: any;
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
  updatepagename: any;
  updatepagenamemethod: any;
  updateurl: any;
  updatepattern: any;
  updatevariablename: any;
  updatevariablevalue: any;
  busy: boolean = false;
  updatevalue2: any;
  addpagename = false;
  editpagename = false;
  paginatorLastSelector: any;
  paginatorLastSelectorlast: any;
  paginatormoveToLast: any;
  paginatormoveTofirst: any;




  constructor(private http: NvhttpService, private confirmationService: ConfirmationService, metaDataService: MetadataService, private messageService: MessageService, private SessionStateService: SessionStateService) { }

  ngOnInit(): void {
    if (this.SessionStateService.isAdminUser() == true) {

      this.buttonflag = true;
    }
    if (this.SessionStateService.isAdminUser() != true) {

      this.buttonflag = false;

    }

    const me = this;

    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ]

    me.data = PAGE_NAME_DATA;
    //this.totalRecords = me.data.data.length; 

    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    me.gettabledata();

  }

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }
  warn(msg: string) {
    this.messageService.add({ key: 'nv-config-page', severity: 'warn', summary: 'Warning', detail: msg });
  }
  Error(msg: string) {
    this.messageService.add({ key: 'nv-config-page', severity: 'error', summary: 'Message', detail: msg });
  }
  Success(msg: string) {
    this.messageService.add({ key: 'nv-config-page', severity: 'success', summary: 'Message', detail: msg });

  }

  gettabledata() {
    this.data.data = null;
    this.http.getPageData().subscribe((state: Store.State) => {

      if (state instanceof NVPreLoadingState) {
        this.loading = state.loading;
        this.error = state.error;
        this.data.data = state.data;
      }

      if (state instanceof NVPreLoadedState) {
        this.loading = state.loading;
        this.error = state.error;
        this.data.data = state.data;

      }

    },
      (err: Store.State) => {
        if (err instanceof NVPreLoadingErrorState) {
          this.loading = err.loading;
          this.error = err.error;
          this.data.data = err.data;
        }

      });

  }
  rowdata = {};
  onRowSelectEditTable(rowevent) {
    this.pageid = rowevent.data.pageId;
    this.updatepagename = rowevent.data.name;
    this.updatepagenamemethod = rowevent.data.tPageMethod;
    this.updatecompleteurlflag = rowevent.data.completeUrlFlag
    this.updatevariablename = rowevent.data.variableName;
    if (rowevent.data.tPageMethod == "1") {
      if (rowevent.data.pattern.includes("/(")) {
        let patternvar = rowevent.data.pattern.replace("/(", "");
        let patternvar2 = patternvar.replace(")/", "");
        this.updateurl = patternvar2
      }
      else
        this.updateurl = rowevent.data.pattern;
      this.updatevariablevalue = '';
      this.updatevariablename = undefined;
    }
    if (rowevent.data.tPageMethod == "2") {
      this.updateurl = '';
      this.updatecompleteurlflag = "0";
      if (rowevent.data.pattern.includes("/(")) {
        let patternvan1 = rowevent.data.pattern.replace("/(", "");
        let patternvan2 = patternvan1.replace(")/", "");
        this.updatevariablevalue = patternvan2;
      }
      else
        this.updatevariablevalue = rowevent.data.pattern;
      this.updatevariablename = rowevent.data.variableName;
    }

    this.rowdata = {
      'pageid': this.pageid,
      'updatepagename': this.updatepagename,
      'updatepagenamemethod': this.updatepagenamemethod,
      'updateurl': this.updateurl,
      'updatevalue2': this.updatevalue2,
      'updatecompleteurlflag': this.updatecompleteurlflag,
      'updatevariablevalue': this.updatevariablevalue,
      'updatevariablename': this.updatevariablename
    }
  }
  deletePage(row) {
    let pagedid = row.pageId;

    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete ?',
      header: 'Confirmation Dialog',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.http.deletePage(pagedid).subscribe((state: Store.State) => {
          let response = state['data'];
          if (response) {
            let obj = {};
            this.http.UpdateAgentMetadata(obj).subscribe((configresponse: any) => {
            });
            this.Success("Deleted Successfully")
            let description = "Page deleted";
            this.http.getAuditLog("INFO", "Open Configuration", description, "UX Monitoring::ConfigUI::Page").subscribe(response => {
              //console.log("Audit Log");
            });
            console.log("response : ", response);
            this.gettabledata();
          }
        });
      }
    });


    this.pageid = undefined;

  }

  savePageName(event) {
    this.editpagename = true;
    this.pageid = event.pageid;
    this.updatepagename = event.updatepagename;
    this.updatepagenamemethod = event.updatepagenamemethod;
    this.updateurl = event.updateurl;
    this.updatevalue2 = event.testUrl;
    this.updatecompleteurlflag = event.updatecompleteurlflag;
    this.updatevariablevalue = event.updatevariablevalue;
    this.updatevariablename = event.updatevariablename;
    this.updateright = event.updateright;


    if (this.editpagename) {
      this.updateSavePageName();

    }
  }

  updateAddPageName() {

    this.msgs = [];

    if (this.pagenamemethod == "1") {
      if (this.right == false) {

        this.warn("Url Not Matched OR Please Test The Url");
        return;
      }
    }
    if (this.pagename == '' || this.pagename == undefined || this.pagename == "undefined") {
      this.warn("Please Enter Page Name");
      return;
    }
    if (this.pagenamemethod == "1") {
      if (this.url.includes("(")) {
        // this.msgs.push({ severity: 'error', summary: 'Message', detail: 'Url cannot contain special character like "("' });
        this.Error("Url cannot contain special character like ( ")
        return;
      }

      if (this.url == '' || this.url == undefined || this.url == "undefined") {
        this.warn("Please Enter Page Url");
        return;
      }
      for (var j of this.data.data) {
        if (this.pagename == j.name) {
          // this.msgs.push({ severity: 'error', summary: '', detail: 'This Page Name Already Exist' });
          this.Error("This Page Name Already Exist")
          return;
        }
      }
      for (var i of this.data.data) {
        if (i.tPageMethod == "1") {
          if (this.url == i.pattern) {
            this.warn("This Url Already present(optional)");
          }
        }
      }
    }
    if (this.pagenamemethod == "2") {
      if (this.variablename == '' || this.variablename == undefined || this.variablename == "undefined") {
        this.warn("Please Enter Page Variable Name");
        return;
      }
      if (this.variablevalue == '' || this.variablevalue == undefined || this.variablevalue == "undefined") {
        this.warn("Please Enter Page Variable Value");
        return;
      }

    }


    if (this.variablename == undefined || this.variablename == "undefined" || this.variablename == '') {
      this.pattern = this.url.trim();
    }
    if (this.url == undefined || this.url == "undefined" || this.url == '') {
      this.pattern = this.variablevalue;
    }
    let data = new PageDataSource(this.pagename, this.pagenamemethod, this.pattern, this.variablename, '', this.completeurlflag);

    this.http.addpage(data).subscribe((state : Store.State) => {
      if(state instanceof NVPreLoadedState){
        let response = state.data;
        if (response != null) {
          let obj = {};
          this.http.UpdateAgentMetadata(obj).subscribe((configresponse: any) => {
          });
          //this.msgs.push({ severity: 'success', detail: 'Successfully Added' }); 
          this.Success("Successfully Added")
          let description = "Page " + "'" + data.pagename + "'" + " added";
          this.http.getAuditLog("INFO", "Open Configuration", description, "UX Monitoring::ConfigUI::Page").subscribe(response => {
          });
        }
        this.gettabledata();
      }
    });


  }


  addPage(event) {
    this.addpagename = true;
    this.pagename = event.pagename;
    this.pagenamemethod = event.pagenamemethod;
    this.completeurlflag = event.completeurlflag;
    this.url = event.url;
    this.value2 = event.value2;
    this.variablename = event.variablename,
      this.variablevalue = event.variablevalue,
      this.right = event.right;
    this.pageid = event.pageid;
    if (this.addpagename) {
      this.updateAddPageName();
    }
  }

  updateSavePageName() {

    this.msgs = [];
    if (this.updateurl.includes("(")) {
      //this.msgs.push({ severity: 'error', summary: 'Message', detail: 'Url cannot contain special character like "("' }); 
      this.Error(" Url cannot contain special character like '('")
      return;
    }
    if (this.updatepagenamemethod == "1") {
      if (this.updateurl == '' || this.updateurl == undefined || this.updateurl == "undefined") {
        this.warn("Please Enter Url");
        return;
      }
      if (this.updateright == false) {
        this.warn("Url Not Matched OR Please Test The Url");
        return;
      }
    }

    if (this.updatepagenamemethod == "2") {
      if (this.updatevariablename == '' || this.updatevariablename == undefined || this.updatevariablename == "undefined") {
        this.warn("Please Enter Variable Name");
        return;
      }
      if (this.updatevariablevalue == '' || this.updatevariablevalue == undefined || this.updatevariablevalue == "undefined") {
        this.warn("Please Enter Variable Value");
        return;
      }
    }

    if (this.updateurl == '' || this.updateurl == "undefined") {
      this.updatedata = new PageDataSource(this.updatepagename, this.updatepagenamemethod, this.updatevariablevalue, this.updatevariablename, this.pageid, this.updatecompleteurlflag);
    }
    if (this.updatevariablevalue == '' || this.updatevariablevalue == "undefined") {
      this.updatedata = new PageDataSource(this.updatepagename, this.updatepagenamemethod, this.updateurl, this.updatevariablename, this.pageid, this.updatecompleteurlflag);
    }
    this.http.updatePage(this.updatedata).subscribe(response => {
      if (response) {
        let obj = {};
        this.http.UpdateAgentMetadata(obj).subscribe((configresponse: any) => {
        });
        // this.msgs.push({ severity: 'success', detail: 'Updated Successfully' });
        this.Success("Updated Successfully")
        let description = "Page " + "'" + this.updatedata.pagename + "'" + " updated";
        this.http.getAuditLog("INFO", "Open Configuration", description, "UX Monitoring::ConfigUI::Page").subscribe(response => {
        });

        this.gettabledata();
      }
    });

    this.editpagename = false;
    this.pageid = undefined;

  }

  ngAfterViewInit() {
    let data = TitleData;
    for (var k of data) {
      this.replaceHTMLElement(k.classname, k.title);
    }
  }
  replaceHTMLElement(classname, title) {
    const el: HTMLElement = document.querySelector(classname);

    el['title'] = title
  }

}

