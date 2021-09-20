import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { EVENTS_DATA } from './service/events.dummy';
import { ConfirmationService } from 'primeng/api';
import { EventsTable } from './service/events.model';
import { NvhttpService, NVPreLoadingState, NVPreLoadedState, NVPreLoadingErrorState } from './../../../home/home-sessions/common/service/nvhttp.service';
import { Store } from 'src/app/core/store/store';
import { MessageService } from 'primeng/api';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { EventDataSource } from "./eventDataSource";
import { SessionStateService } from '../../../../pages/home/home-sessions/session-state.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventsComponent implements OnInit {

  data: EventsTable;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  buttonflag: boolean;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  isShowColumnFilter: boolean;
  downloadOptions: MenuItem[];
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  id: any;
  updatedescription: any;
  updateStrugglingEvent: any;
  updatename: any;
  updategoal: any;
  updateIcons: any;
  srcpath: any
  base: any;
  icondata: any;
  name: any;
  msgs: any;
  goal: any;
  description: any;
  StrugglingEvent: any;
  Icons: any;
  //updatedescription: any;
  // updateStrugglingEvent: any;
  // updatename: any;
  // updategoal: any;
  // updateIcons: any;  
  updatedisplayEvent: boolean = false;

  constructor(private http: NvhttpService, private confirmationService: ConfirmationService, private messageService: MessageService, private sanitizer: DomSanitizer, private SessionStateService: SessionStateService) {

  }

  ngOnInit(): void {
    const me = this;
    if (this.SessionStateService.isAdminUser() == true) {

      this.buttonflag = true;
    }
    if (this.SessionStateService.isAdminUser() != true) {

      this.buttonflag = false;

    }
    me.base = environment.api.netvision.base.base; // [src]='srcpath'
    //me.srcpath = this.sanitizer.bypassSecurityTrustResourceUrl(me.base + '/netvision/images/'); 
    me.srcpath = me.base + '/netvision/images/';



    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ]

    me.data = EVENTS_DATA;
    //this.totalRecords = me.data.data.length;

    me.cols = me.data.headers[0].cols;

    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    me.geteventData();
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
    this.messageService.add({ key: 'nv-events-config', severity: 'warn', summary: 'Warning', detail: msg });
  }
  Error(msg: string) {
    this.messageService.add({ key: 'nv-events-config', severity: 'error', summary: 'Message', detail: msg });
  }
  Success(msg: string) {
    this.messageService.add({ key: 'nv-events-config', severity: 'success', summary: 'Message', detail: msg });

  }
  geteventData() {
    this.data.data = null;
    this.http.getEventData().subscribe((state: Store.State) => {

      if (state instanceof NVPreLoadingState) {
        this.loading = state.loading;
        this.error = state.error;
        this.data.data = state.data;

      }

      if (state instanceof NVPreLoadedState) {
        this.loading = state.loading;
        this.error = state.error;
        // this.data.data = state.data;  
        // for (const i of state.data) { 
        //   this.icondata = i.icons

        // this.srcpath = this.sanitizer.bypassSecurityTrustResourceUrl(this.base + '/netvision/images/' + this.icondata); 
        // }
        this.data.data = state.data;
        console.log('event table data:-----', this.data.data)

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
  DeleteEvent(row) {
    let deltedid = row.mask
    let description = "Event deleted";
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete ?',
      header: 'Confirmation Dialog',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        // this.http.deleteEvent(deltedid).subscribe((state: Store.State) => {
        //   let response = state['response']
        //   if (response) {
        //     this.http.getAuditLog("INFO", "Open Configuration", description, "UX Monitoring::ConfigUI::Event").subscribe(response => {
        //       //console.log("Audit Log");
        //     });
        //     //this.msgs.push({severity:'success', summary:'Message', detail:'Deleted Successfully'});
        //     this.Success("Deleted Successfully");
        //     this.geteventData();
        //   }
        // });
        this.http.deleteEvent(deltedid).subscribe((state: Store.State) => {
          let response = state['data'];
          if (response) {
            let obj = {};
            this.http.UpdateAgentMetadata(obj).subscribe((configresponse: any) => {
            });
            this.Success("Deleted Successfully")
            this.geteventData();
            let description = "Event deleted";
            this.http.getAuditLog("INFO", "Open Configuration", description, "UX Monitoring::ConfigUI::Page").subscribe(response => {
              //console.log("Audit Log");
            });
            console.log("response : ", response);

          }
        });
      }
    });




  }
  onRowSelectEditTable(rowevent) {
    if (rowevent == undefined || rowevent == null) return;
    this.id = rowevent.data.mask;
    this.updatedescription = rowevent.data.eventDescription;
    this.updateStrugglingEvent = rowevent.data.strugglingEvent;
    this.updatename = rowevent.data.name;
    this.updategoal = rowevent.data.goal;
    this.updateIcons = rowevent.data.icons;


  }
  // Applydelete(e) {
  //   console.log("delete called : events componeten ")
  //   this.DeleteEvent()

  // }
  Applyedite(e) {
    console.log("edite opup is called", e)
    this.updatedisplayEvent = true;
    this.id = e.id;
    this.updatedescription = e.updatedescription;
    this.updateStrugglingEvent = e.updateStrugglingEvent;
    this.updatename = e.updatename;
    this.updategoal = e.updategoal;
    this.updateIcons = e.updateIcons;
    //  for (var j of this.data.data) {
    //    if (this.updatename == j.name) {
    //      //this.msgs.push({ severity: 'error', summary: '', detail: 'This Event Name Already Exist' });
    //      this.Error("This Event Name Already Exist")
    //      return;
    //    }
    //  }

    if (this.updatedisplayEvent) {
      this.UpdateSaveEvent();
    }

  }
  UpdateSaveEvent() {
    if (this.updatename == "" || this.updatename == undefined || this.updatename == "undefined") {
      this.warn("Please Enter Name");
      return;
    }
    if (this.updatedescription == "" || this.updatedescription == undefined || this.updatedescription == "undefined") {
      this.warn("Please Enter Description");
      return;
    }
    if (this.updategoal == ""){
      this.warn("select goal, it should not be empty");
      return;
    }
    this.updatedisplayEvent = false;
    let updatedata = new EventDataSource(this.updatedescription, this.updatename, this.updateStrugglingEvent, this.updateIcons, this.updategoal, this.id);
    this.http.updateEvent(updatedata).subscribe(response => {
      if (response) {
        //this.msgs.push({ severity: 'success', detail: 'Updated Successfully' }); 
        this.Success("Updated Successfully")
        let description = "Event " + "'" + updatedata.name + "'" + " updated";
        this.http.getAuditLog("INFO", "Open Configuration", description, "UX Monitoring::ConfigUI::Event").subscribe(response => {
          //console.log("Audit Log");
        });
        this.geteventData();
      }
    });
    this.id = undefined;
  }

  AppLyeadd(e) {
    this.msgs = [];
    this.Icons = e.Icons;
    this.name = e.name;
    this.description = e.description;
    this.goal = e.goal;
    this.StrugglingEvent = e.StrugglingEvent;
    console.log("addevent is called :", e)
    for (var j of this.data.data) {
      if (this.name == j.name) {
        //this.msgs.push({ severity: 'error', summary: '', detail: 'This Event Name Already Exist' });
        this.Error("This Event Name Already Exist")
        return;
      }
    }
    this.addsaveEvent();

  }
  addsaveEvent() {

    if (this.name == "" || this.name == undefined || this.name == "undefined") {
      this.warn("Please Enter Name");
      return;
    }
    if (this.description == "" || this.description == undefined || this.description == "undefined") {
      this.warn("Please Enter Description");
      return;
    }
    if (this.goal == ""){
      this.warn("invalid goal");
      return;
    }
    //this.displayEvent = false;
    let data = new EventDataSource(this.description, this.name, this.StrugglingEvent, this.Icons, this.goal, "");
    
    //this.busy = true;
    this.http.addevent(data).subscribe((response: any) => {
      if (response != null) {
        //this.msgs.push({ severity: 'success', detail: 'Successfully Added' }); 
        this.Success("Successfully Added")
        this.geteventData();
        // this.busy = false;
        let description = "Event " + "'" + data.name + "'" + " added";
        this.http.getAuditLog("INFO", "Open Configuration", description, "UX Monitoring::ConfigUI::Event").subscribe(response => {
          //console.log("Audit Log");
        });
      }
    });

  }
}

