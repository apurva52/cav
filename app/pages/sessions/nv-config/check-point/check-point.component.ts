import { Component, OnInit, Input, Output, OnChanges, ViewEncapsulation } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { Router } from '@angular/router';
import { Store } from 'src/app/core/store/store';
import { CHECK_POINT_TABLE } from './service/check-point.dummy';
import { MenuItem } from 'primeng';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { MessageService } from 'primeng';
import { MetadataService } from '../../../home/home-sessions/common/service/metadata.service';
import { ConfirmationService } from 'primeng/api';
import { CheckPointDataSource } from './service/checkpointdatasource';
import { EventEmitter } from "@angular/core";
//import { Metadata } from '../common/interfaces/metadata';
import { NvhttpService } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
import { CallbackDesignerService } from 'src/app/pages/home/home-sessions/callback-designer/service/callback-designer.service';
import { SessionStateService } from '../../../../pages/home/home-sessions/session-state.service';
@Component({
  selector: 'app-check-point',
  templateUrl: './check-point.component.html',
  styleUrls: ['./check-point.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CheckPointComponent implements OnInit {
  button: boolean;
  @Input() notFromCallbackDesigner: boolean = true;
  searchtype: any[];
  msgs: any;
  match: any;
  oparg: any;
  id: any;
  displayruledata: boolean = false;
  ruledatatable: any[];
  checkpointvalue: any;
  selector: any;
  updateselector: any;
  activech: any;
  activateig = false;
  activatestartic = false;
  activateendic = false;
  updateactivateig = false;
  updateactivatestartic = false;
  updateactivateendic = false;
  pagevalue: any[];
  status: any[];
  nmode: any[];
  startmode: any[];
  endmode: any[];
  scope: any;
  Scopeop: any[];
  updaterules: any;
  failop: any[];
  updatematch: any;
  stringevent: any[];
  StringEvent: any;
  updateStringEvent: any;
  npage: any[];
  eventname: any;
  rules: any;
  pages: any;
  cpname: any;
  startstring: any;
  endstring: any;
  searchtext: any;
  busy = false;
  Valuecondition: any;
  Lengthcondition: any;
  updateValuecondition: any;
  updateLengthcondition: any;
  eventgeneration: any[];
  fail: any;
  failure: any;
  updatefailure: any;
  // metadata: Metadata = null;
  // metadataService: MetadataService;
  displayCheckpoint = false;
  updatedisplayCheckpoint = false;
  nevent: any;
  Radioval = "1";
  updateeventname: any;
  updatepages: any;
  updatepaging: any;
  updatecpname: any;
  updatestartstring: any;
  updateendstring: any;
  updatesearchtext: any;
  updateRadioval: any;
  updatescope: any;
  updateactivech: any;
  updatefail: any;
  updateoparg: any;
  Searchregexp: any[];
  searchregexp: any;
  Searchic: any[];
  searchic: any;
  Startstringregexp: any[];
  startstringregexp: any;
  Startstringic: any[];
  startstringic: any;
  Endstringregexp: any[];
  endstringregexp: any;
  Endstringic: any[];
  endstringic: any;
  updatesearchregexp: any;
  updatesearchic: any;
  updatestartstringregexp: any;
  updatestartstringic: any;
  updateendstringregexp: any;
  updateendstringic: any;
  uid: any;
  addcheckpoint = false;
  updatecheckpoint = false;
  rowsetindex = 0;

  data: Table;

  rowdata: any = {};
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];

  downloadOptions: MenuItem[];
  selectedRow: any;

  isCheckbox: boolean;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  globalFilterFields: string[] = [];
  buttonflag: boolean = false;

  constructor(private router: Router, private metadataService: MetadataService, private confirmationService: ConfirmationService, private messageService: MessageService, private httpService: NvhttpService, private cbService: CallbackDesignerService,
    private SessionStateService: SessionStateService) {
    // super();
  }
  // show() {
  //   super.show();
  // }

  ngOnChanges(): void {

    if (!this.notFromCallbackDesigner) {
      this.addcheckpoint = true;
    }
  }

  ngOnInit(): void {
    const me = this;
    if (this.SessionStateService.isAdminUser() == true) {
      this.buttonflag = true;
    }
    if (this.SessionStateService.isAdminUser() != true) {
      this.buttonflag = false;

    }
    me.failop = [
      { label: 'Found', value: 0x0 },
      { label: 'Not Found', value: 0x1 },
      { label: 'Length Is Less Than Equal', value: 0x10 },
      { label: 'Length Is Equal', value: 0x20 },
      { label: 'Length Is greater Than equal', value: 0x40 },
      { label: 'Is Equal', value: 0x0100 },
      { label: 'Is Not Equal', value: 0x0200 },
      { label: 'Contain The String', value: 0x0400 },
      { label: 'Not Contain The String', value: 0x1000 },
      { label: 'Match The Regex', value: 0x2000 },
      { label: 'Does not Match The Regex', value: 0x4000 },
      { label: 'Length Is Greater Than', value: 0x10000 },
      { label: 'Length Is Not Equal', value: 0x20000 },
      { label: 'Length Is Less Than', value: 0x40000 },
      { label: 'Has Member More Than', value: 0x100000 },
      { label: 'Has Member More Than Equal', value: 0x200000 },
      { label: 'Has member less than', value: 0x400000 },
      { label: 'Has member less than equal', value: 0x1000000 },
    ];
    this.getCheckPointData(false, null);

    me.data = CHECK_POINT_TABLE;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }
  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  showAddReport() {
    this.router.navigate(['/add-report']);
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


  // opening the p-dialog
  openChekpointDialog() {
    this.addcheckpoint = true;
    // this.router.navigate(['/home/netvision/methodrefractor']);
  }

  //closing the add popup
  closeCheckPointPopup($event) {
    this.addcheckpoint = false;
    this.notFromCallbackDesigner = true;

    this.cbService.broadcast('checkpointAdded', false);
  }

  //clasing the edit popup
  updatedCloseCheckPointPopup($event) {
    this.updatecheckpoint = false;
  }

  //This method gets data from child component and then save in
  saveCheckPoint(event) {
    this.msgs = [];
    console.log("event data from newcomponent=", event);
    this.activech = event.state;
    this.scope = event.Scope;
    this.eventname = event.eventname;
    this.pages = event.Page;
    this.cpname = event.checkpoint;
    this.selector = event.Selector;
    this.rules = event.rules;
    this.match = event.match;
    this.Radioval = event.searchmethod;
    this.searchtext = event.textstring;
    if (this.rules == [] || this.rules == "[]")
      this.rules = null;
    if (event.textstring != undefined) {
      if (this.searchtext.includes("'"))
        this.searchtext = this.searchtext.replace(/'/g, "''");
    }
    this.startstring = event.startstring;
    if (event.startstring != undefined) {
      if (this.startstring.includes("'"))
        this.startstring = this.startstring.replace(/'/g, "''");
    }
    this.endstring = event.endstring;
    if (event.endstring != undefined) {
      if (this.endstring.includes("'"))
        this.endstring = this.endstring.replace(/'/g, "''");
    }
    this.startstringregexp = event.startstringregexp;
    this.endstringregexp = event.endstringregexp;
    this.searchregexp = event.mode;
    this.searchic = event.searchic;
    this.fail = event.ConditionforEventGeneration;
    this.startstringic = event.startstringic;
    this.endstringic = event.endstringic;
    this.StringEvent = event.StringEvent;
    this.Lengthcondition = event.Lengthcondition;
    this.Valuecondition = event.Valuecondition;
    this.oparg = event.oparg;

    (this.id = event.id),
      (this.updateactivech = event.updateactivech),
      (this.updateeventname = event.updateeventname),
      (this.updatepaging = event.updatepaging),
      (this.updatecpname = event.updatecpname),
      (this.updaterules = event.updaterules),
      (this.updatematch = event.updatematch),
      (this.updatestartstring = event.updatestartstring);
    if (event.updatestartstring != undefined) {
      if (this.updatestartstring.includes("'"))
        this.updatestartstring = this.updatestartstring.replace(/'/g, "''");
    }
    (this.updateendstring = event.updateendstring);
    (this.updatesearchtext = event.updatesearchtext);
    (this.updateRadioval = event.fakeRadioval),
      (this.updatescope = event.updatescope),
      (this.updateselector = event.updateselector),
      (this.updateoparg = event.updateoparg),
      (this.updatefail = event.updatefail),
      (this.updatesearchregexp = event.updatesearchregexp),
      (this.updatesearchic = event.updatesearchic),
      (this.updatestartstringregexp = event.updatestartstringregexp),
      (this.updatestartstringic = event.updatestartstringic),
      (this.updateendstringregexp = event.updateendstringregexp),
      (this.updateendstringic = event.updateendstringic),
      (this.updatepages = event.updatepages);

    if (this.updatecheckpoint) {
      this.updateSaveCheckPoint();
    } else {
      if (this.pages == undefined || this.pages == "") {
        this.messageService.add({ key: 'nv-config-checkpoint', severity: 'warn', summary: 'Please Select Page', detail: '' })
        return;
      }
      if (this.scope == "99") {
        if (this.selector == "" || this.selector == undefined) {
          this.messageService.add({ key: 'nv-config-checkpoint', severity: 'warn', summary: 'Please Enter Dom Selector', detail: '' })
          return;
        }
      }

      if (this.scope == "2" || this.scope == "3" || this.scope == "4") {
        if (this.selector == "" || this.selector == undefined) {
          this.messageService.add({ key: 'nv-config-checkpoint', severity: 'warn', summary: 'Please Enter Http Url', detail: '' })
          return;
        }
      }

      if (this.cpname == "" || this.cpname == "undefined" || this.cpname == undefined) {
        this.messageService.add({ key: 'nv-config-checkpoint', severity: 'warn', summary: 'Please Enter Check Point Name', detail: '' })
        return;
      } else {
        for (var j of this.checkpointvalue) {
          if (this.cpname == j.cpName) {
            this.messageService.add({ key: 'nv-config-checkpoint', severity: 'warn', summary: 'This CheckPoint Name Already Exist Please Enter Another Name', detail: '' })
            return;
          }
        }
        this.failure = 0;

        const data = new CheckPointDataSource(
          this.activech,
          this.pages,
          this.cpname,
          this.rules,
          this.match,
          this.startstring,
          this.endstring,
          this.eventname,
          this.searchtext,
          this.failure,
          this.Radioval,
          this.oparg,
          this.scope,
          this.searchregexp,
          this.searchic,
          this.startstringregexp,
          this.startstringic,
          this.endstringregexp,
          this.endstringic,
          "",
          this.selector
        );
        this.httpService.addcheckpoint(data).subscribe((state: Store.State) => {
          let response = state['data'];
          if (response != null) {
            this.displayruledata = false;
            let obj = {};
            this.httpService.UpdateAgentMetadata(obj).subscribe((configresponse: any) => {
            });
            this.messageService.add({ key: 'nv-config-checkpoint', severity: 'success', summary: 'Successfully Added', detail: '' });
            const description =
              "Checkpoint " + "'" + data.cpname + "'" + " added";
            this.httpService
              .getAuditLog(
                "INFO",
                "Open Configuration",
                description,
                "UX Monitoring::ConfigUI::Checkpoint"
              )
              .subscribe(response => { });
            this.getCheckPointData(true, 'add');
            this.cbService.broadcast('checkpointAdded', true);
            this.notFromCallbackDesigner = true;
          }
        }, error => {
          alert('Failed to add the checkpoint.');
          console.log('checkpointAdded : false')

          this.cbService.broadcast('checkpointAdded', false);

          this.notFromCallbackDesigner = true;
        });
      }
      this.addcheckpoint = false;
    }
  }

  DeleteCheckPoint(data) {
    this.displayruledata = false;
    this.msgs = [];
    this.id = data.cpId;
    let name = data.cpName;
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete CheckPoint ' + name,
      header: 'Delete CheckPoint',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.busy = true;
        this.httpService.deleteCheckPoint(this.id).subscribe((state: Store.State) => {
          let response = state['data'];
          if (response) {
            this.displayruledata = false;
            let obj = {};
            this.httpService.UpdateAgentMetadata(obj).subscribe((state: Store.State) => {
            });
            this.messageService.add({ key: 'nv-config-checkpoint', severity: 'success', summary: 'Successfully Deleted', detail: '' })
            const description = "Checkpoint Deleted";
            this.httpService
              .getAuditLog(
                "INFO",
                "Open Configuration",
                description,
                "UX Monitoring::ConfigUI::Checkpoint"
              )
              .subscribe(response => {
                // console.log("Audit Log");
              });
            console.log("response : ", response);
            this.getCheckPointData(true, null);
            this.busy = false;
          }
        });
      },
      reject: () => {
        this.messageService.add({ key: 'nv-config-checkpoint', severity: 'info', summary: 'You Abort The Changes', detail: '' });
      }
    });
  }

  //get data from table
  getCheckPointData(mflag, indicator) {
    // console.log('getcheckpointdata called');
    this.busy = true;
    if (mflag == true) {
      this.metadataService.refreshMetadata();
    }
    this.httpService.getCheckpointData().subscribe((state: Store.State) => {
      let response = state['data'];
      if (response != null && response.length > 0) {
        for (var i of response) {
          if (i.scope == '99')
            i.scopeName = " Complete Dom and Dom Changes Both";
          if (i.scope == "0")
            i.scopeName = "Complete Dom";
          if (i.scope == "1")
            i.scopeName = "Dom Changes";
          if (i.scope == "2")
            i.scopeName = "Http Response";
          if (i.scope == "3")
            i.scopeName = "Http Response Header"
          if (i.scope == "4")
            i.scopeName = "Http Response Body and Header both";
          if (i.rules == null || i.rules == "null")
            i.rulelength = 0;

          if (i.rules != null && i.rules != "null")
            try {
              i.rulelength = JSON.parse(i.rules).length;
            }
            catch (e) {
              this.messageService.add({ key: 'nv-config-checkpoint', severity: 'info', summary: 'Unable to parse CheckPoint-' + i.cpName + '\n' + 'rules data due to wrong format of rules data', detail: '' })
            }
        }
        this.checkpointvalue = response;
        if (indicator == 'add') {
          console.log("ADDD");
          this.checkpointvalue.splice(this.rowsetindex, 0, this.checkpointvalue[this.checkpointvalue.length - 1]);
          let index = this.checkpointvalue.length - 1;
          this.checkpointvalue.splice(index, 1);
        }
        console.log("Sorted Value", this.checkpointvalue);
        this.busy = false;
        console.log("check point in audit log--", this.checkpointvalue);
      } else {
        this.busy = false;
        this.checkpointvalue = [];
        console.log("inside else block");
      }
    });
  }

  //select  data  from a row 
  onRowSelectEditTable(rowevent) {
    this.ruledatatable = [];
    console.log("rowevent selected=", rowevent);
    this.id = rowevent.cpId;
    this.updateactivech = rowevent.active;
    this.updateeventname = rowevent.eventName;
    this.updatepaging = rowevent.page;
    this.updatecpname = rowevent.cpName;
    this.updatestartstring = rowevent.startString;
    this.updateendstring = rowevent.endString;
    this.updatesearchtext = rowevent.searchText;
    this.updateRadioval = rowevent.searchMode;
    this.updatescope = rowevent.scope;
    this.updateselector = rowevent.selector;
    this.updateoparg = rowevent.oparg;
    this.updatefail = rowevent.fail;
    this.updatesearchregexp = rowevent.searchregexp;
    this.updatesearchic = rowevent.searchic;
    this.updatestartstringregexp = rowevent.startstringregexp;
    this.updatestartstringic = rowevent.startstringic;
    this.updateendstringregexp = rowevent.endstringregexp;
    this.updateendstringic = rowevent.endstringic;
    this.updaterules = rowevent.rules;
    this.displayruledata = true;
    //if (this.updaterules != null)
    this.showRule(this.updaterules);
    //this.ruledatatable = JSON.parse(this.updaterules);
    this.updatematch = rowevent.match;
    console.log(
      "rowevent data=",
      this.updatesearchtext,
      this.updatepages,
      this.updateeventname,
      this.updateendstring,
      this.updatestartstring,
      this.updateRadioval
    );
    let sepratedRate = this.updatepaging.split(/\s*,\s*/);
    this.updatepages = [];
    for (let i = 0; i < sepratedRate.length; i++) {
      const k = sepratedRate[i].toString();
      this.updatepages.push(k);
    }
  }

  //this method sets data from row in a object for sending this object to another component 
  sendRowData($event) {
    this.uid = this.id;
    this.rowdata = {
      id: this.id,
      updateactivech: this.updateactivech,
      updateeventname: this.updateeventname,
      updatepaging: this.updatepaging,
      updatecpname: this.updatecpname,
      updatestartstring: this.updatestartstring,
      updateendstring: this.updateendstring,
      updatesearchtext: this.updatesearchtext,
      updateRadioval: this.updateRadioval,
      updatescope: this.updatescope,
      updateselector: this.updateselector,
      updateoparg: this.updateoparg,
      updatefail: this.updatefail,
      updatesearchregexp: this.updatesearchregexp,
      updatesearchic: this.updatesearchic,
      updatestartstringregexp: this.updatestartstringregexp,
      updatestartstringic: this.updatestartstringic,
      updateendstringregexp: this.updateendstringregexp,
      updateendstringic: this.updateendstringic,
      updaterules: this.updaterules,
      updatematch: this.updatematch,

      updatepages: this.updatepages
    };
    console.log("data from row=" + this.rowdata);
  }

  //this method opens the edit dialog box and sends data to another component
  showDialogToEditGroup(data) {
    this.onRowSelectEditTable(data);
    console.log("popup method for edit called=", this.updatecheckpoint);
    if (this.updateRadioval == "1") {
      if (this.updatesearchregexp == "1") {
        this.updateactivateig = true;
        if (this.updatesearchic == "0") {
          this.updatesearchic = null;
        }
      }
      if (this.updatesearchregexp == null) {
        this.updateactivateig = false;
      }
    }
    if (this.updateRadioval == "2") {
      console.log(
        "updated popup=",
        this.updatestartstringregexp,
        this.updateendstringregexp,
        this.updateendstringic,
        this.updatestartstringic
      );

    }

    this.updatecheckpoint = true;
    this.sendRowData(event);
  }

  //method for editing the contents of dialog box
  updateSaveCheckPoint() {
    this.msgs = [];
    this.id = this.uid;
    if (this.updaterules == [] || this.updaterules == "[]")
      this.updaterules = null;
    console.log('uid=', this.uid, "\n", this.id);
    if (this.updatepages == undefined || this.updatepages == "") {
      // MsgService.warn("Please Select Page");
      return;
    }
    if (
      this.updatecpname == "" ||
      this.updatecpname == "undefined" ||
      this.updatecpname == undefined
    ) {
      // MsgService.warn("Please Enter check Point Name");
      return;
    }
    if (this.updateRadioval == "1") {
      if (this.updatesearchregexp == null) {
        this.updatesearchregexp = "0";
        this.updatesearchic = "0";
      }
      this.updatestartstringregexp = null;
      this.updatestartstringic = null;
      this.updateendstringregexp = null;
      this.updateendstringic = null;
      this.updatefailure = this.updatefail;
    }
    if (this.updateRadioval == "2") {
      console.log("dfd", this.updatestartstringregexp, this.updateendstringic);
      this.updatesearchregexp = null;
      this.updatesearchic = null;
      this.updatefailure = "";
      this.updatefailure = this.updateStringEvent;
    }
    this.updatefailure = 0;
    const updatedata = new CheckPointDataSource(
      this.updateactivech,
      this.updatepages,
      this.updatecpname,
      this.updaterules,
      this.updatematch,
      this.updatestartstring,
      this.updateendstring,
      this.updateeventname,
      this.updatesearchtext,
      this.updatefailure,
      this.updateRadioval,
      this.updateoparg,
      this.updatescope,
      this.updatesearchregexp,
      this.updatesearchic,
      this.updatestartstringregexp,
      this.updatestartstringic,
      this.updateendstringregexp,
      this.updateendstringic,
      this.id,
      this.updateselector
    );
    this.busy = true;
    this.httpService.updateCheckPoint(updatedata).subscribe((state: Store.State) => {
      let response = state['data'];
      if (response != null) {
        this.displayruledata = false;
        let obj = {};
        this.httpService.UpdateAgentMetadata(obj).subscribe((state: Store.State) => {
        });
        this.messageService.add({ key: 'nv-config-checkpoint', severity: 'success', summary: 'Successfully Updated', detail: '' })
        const description =
          "Checkpoint " + "'" + updatedata.cpname + "'" + " updated";
        this.httpService
          .getAuditLog(
            "INFO",
            "Open Configuration",
            description,
            "UX Monitoring::ConfigUI::Checkpoint"
          )
          .subscribe(response => {

          });
        this.getCheckPointData(true, 'update');
        this.busy = false;
        this.id = undefined;
      }
    });

    this.updatecheckpoint = false;
  }
  showRule(existingruledata) {
    if (existingruledata == null || existingruledata == "null")
      this.ruledatatable = [];
    this.displayruledata = true;
    if (existingruledata != null && existingruledata != "null") {
      let tmp = JSON.parse(existingruledata);
      for (var k of tmp) {
        k.fail_label = this.getFailLabel(k.fail);
      }
      this.ruledatatable = tmp;
    }
    console.log("ruletable", this.ruledatatable);

  }

  getFailLabel(failvalue) {
    for (var d of this.failop) {
      if (d.value == failvalue)
        return d.label;
    }

  }
  paginate(e) {
    this.displayruledata = false;
    this.rowsetindex = e.first;
  }


}

