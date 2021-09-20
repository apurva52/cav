import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { NvhttpService } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
import { CRASH_DETAIL_DATA, CRASH_INFO_DATA, PANEL_DUMMY, CrashKey, REQUEST_HEADERS_DATA } from './service/app-crash.model';
import { AppCrashLoadedState, AppCrashLoadingErrorState, AppCrashLoadingState } from './service/app-crash.state';
import { AppCrashService } from './service/app-crash.service';
import { Store } from 'src/app/core/store/store';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionFilter } from '../../common/interfaces/sessionfilter';
import { Session } from '../../common/interfaces/session';
import { HomeSessionService } from '../../service/home-sessions.service';
import { MetadataService } from '../../common/service/metadata.service';
import { DataManager } from '../../common/datamanager/datamanager';
import { SessionStateService } from '../../session-state.service';
import { Metadata } from '../../common/interfaces/metadata';
@Component({
  selector: 'app-app-crash',
  templateUrl: './app-crash.component.html',
  styleUrls: ['./app-crash.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppCrashComponent implements OnInit {

  panel: any;
  data: Table;
  data2: Table;
  showtable: boolean = false;
  data3: Table;
  totalRecords = 0;
  totalRecords2 = 0;
  error: AppError;
  loading: boolean;
  metadata: Metadata;
  empty: boolean;
  emptyTable: boolean;
  selectedColumns3: TableHeaderColumn[] = [];
  selectedColumns2: TableHeaderColumn[] = [];
  selectedColumns: TableHeaderColumn[] = [];
  selectedSession: Session;
  stacktrace: any;
  param: any;


  constructor(private appcrashservice: AppCrashService, private metadataService: MetadataService, private router: Router, private httpService: NvhttpService, private homeSessionService: HomeSessionService, private route: ActivatedRoute, private stateService: SessionStateService) {
    this.metadataService.getMetadata().subscribe(e => {
      this.metadata = e;
    });
  }

  ngOnInit(): void {
    const me = this;
    me.panel = PANEL_DUMMY;

    me.data = {...CRASH_DETAIL_DATA};

    this.totalRecords = me.data.data.length;
    me.selectedColumns = me.data.headers[0].cols;


    me.data2 = REQUEST_HEADERS_DATA;
    me.data3 = CRASH_INFO_DATA;
    me.selectedColumns2 = me.data2.headers[0].cols;
    me.selectedColumns3 = me.data3.headers[0].cols;

    this.route.queryParams.subscribe(params => {
      console.log("params in app-crash : ", params);
      me.param = params;
    });

    me.selectedSession = me.stateService.getSelectedSession();

    me.stateService.onSessionChange().subscribe((idx: number) => {
      console.log('app-crash session change - ', idx);
      me.selectedSession = me.stateService.getSelectedSession();
      me.reload();
    });

    me.reload();
  }


  reload() {
    let me = this;

    me.appcrashservice.LoadAppCrashData(Object.keys(me.param).length == 0 ? me.selectedSession : me.param).subscribe(
      (state: Store.State) => {

        if (state instanceof AppCrashLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof AppCrashLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: AppCrashLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: AppCrashLoadingState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: AppCrashLoadingErrorState) {
    const me = this;
    me.data.data = null;
    me.empty = false;
    me.error = state.error;
    me.empty = false;
    me.error.msg = "Error while loading data."
    me.loading = true;
  }

  private onLoaded(state: AppCrashLoadedState) {
    const me = this;
    me.data = CRASH_DETAIL_DATA;
    let sessdata;
    me.data2 = REQUEST_HEADERS_DATA;
    me.data3 = CRASH_INFO_DATA;
    let sid: any;
    Object.keys(me.param).length == 0 ? sid = me.selectedSession.sid : sid = me.param.Sid
    let sessionFilter = new SessionFilter();
    sessionFilter.nvSessionId = sid + '';
    if (state.data.data.length > 0) {

      me.homeSessionService.LoadSessionListTableData(sessionFilter, false, false).subscribe(
        (state2: Store.State) => {
          let sessiondata;
          let response = state2['data']
          if (response != null) {
            console.log('Response', response);
            let sessions: any;
            sessions = response.data.map(a => {
              sessiondata = new Session(a, this.metadata, false);
              sessdata = sessiondata;
              return sessiondata;
            });
            console.log("session ", sessions, sessdata)

            me.showtable = true;
            me.loading = false;
            me.data.data[0].values = state.data.data[0].crashTime;
            me.data.data[1].values = state.data.data[0].exceptionName;
            me.data.data[2].values = state.data.data[0].crashedFile;
            me.data.data[3].values = state.data.data[0].exceptionMessage;

            //2nd Table
            me.data2.data[0].values = state.data.data[0].application.split("/")[0];
            me.data2.data[1].values = sessdata.channel.name;
            me.data2.data[2].values = sessdata.duration;
            me.data2.data[3].values = state.data.data[0].os;
            me.data2.data[4].values = sessdata.location.country;
            me.data2.data[5].values = state.data.data[0].mobileappversion;
            me.data2.data[6].values = state.data.data[0].os;
            me.data2.data[7].values = state.data.data[0].os;
            me.data2.data[8].values = state.data.data[0].deviceManufacturer;
            me.data2.data[9].values = sessdata.formattedStartTime;
            //3rd Table
            let tempcrashinfo = JSON.parse(unescape(state.data.data[0].crashReport))
            this.stacktrace = tempcrashinfo.STACK_TRACE;
            delete (tempcrashinfo["STACK_TRACE"]);
            delete (tempcrashinfo["RAW_DATA"]);

            let tempcrashvalue = Object.values(tempcrashinfo)
            Object.keys(tempcrashinfo).forEach((data, index) => {
              let finaldata = {} as CrashKey;
              if (data != '') {
                if (data != "USER_CRASH_DATE" && data != "USER_APP_START_DATE") {
                  finaldata.keys = data;
                  finaldata.values = tempcrashvalue[index];
                  if (me.data3.data.indexOf(finaldata.keys) == -1)
                    me.data3.data.push(finaldata);
                }
              }
            }
            )

          }
        });
    }
    console.log(me.data3);
    me.empty = !state.data.data.length;
    me.error = null;



  }
  exportappcrash() {
    let me = this;
    //console.log("this.starttime : ", this.starttime, " this.endtime : ", this.endttime, " this.sid : ", this.Sid);
    const crashdurarion = "0";
    Object.keys(me.param).length == 0 ? me.selectedSession : me.param
    if (Object.keys(me.param).length == 0)
      this.httpService.ViewCrashTabexport(me.selectedSession.startTime, me.selectedSession.endTime, me.selectedSession.sid, crashdurarion);
    else {
      this.httpService.ViewCrashTabexport(me.param.startTime, me.param.endTime, me.param.Sid, crashdurarion);
    }
  }

}



