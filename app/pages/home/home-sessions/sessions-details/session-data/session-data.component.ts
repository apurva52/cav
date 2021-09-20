import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AppError } from 'src/app/core/error/error.model';
import { Table } from 'src/app/shared/table/table.model';
import { Session } from '../../common/interfaces/session';
import { SessionStateService } from '../../session-state.service';
import { SESSION_DATA } from './service/session-data.dummy';
import { SessionsDataTable, SessionsDataTableHeaderColumn } from './service/session-data.model';

interface SmallSessionData {
  startTime: string;
  events:any[];
  pageCount:number;
  duration:string;
  channel:any;
  orderTotal:number;
  browser:any;
  deviceType:any;
  os:any;
  location:any;
  maxOnLoad:number;
  maxTTDI:number;
  bot:boolean;
  authFailed:boolean;
  authentic:boolean;
  severityColor: string;
  idx: number;
  struggling : boolean;
};

@Component({
  selector: 'app-session-data',
  templateUrl: './session-data.component.html',
  styleUrls: ['./session-data.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SessionDataComponent implements OnInit {
  data: SessionsDataTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  cols: SessionsDataTableHeaderColumn[];
  _selectedColumns: SessionsDataTableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  selectedRow: any;
  @Input() sessions: Session[] = null;
  @Input() selectedSessionIdx = 0;
  constructor(private stateService: SessionStateService) { }

  ngOnInit(): void {
    const me = this;
    me.data = SESSION_DATA;

    me.data.data = this.sessions.map((session, index): SmallSessionData => {
      console.log('session.events : ', session.events);
      return {
       startTime:session.formattedStartTime,
       events:session.events,
       pageCount:session.pageCount,
       duration:session.duration,
       channel:session.channel,
       orderTotal:session.orderCount,
       browser:session.browser,
       deviceType:session.deviceType,
       os:session.os,
       location:session.location,
       maxOnLoad:session.maxOnLoad,
       maxTTDI:session.maxTTDI,
       bot:session.botFlag,
       authFailed:session.authFailed,
       authentic:session.authentic, 
        severityColor: '#FF8484',
        idx: index,
        struggling: session.struggling
      }
    });

    this.selectedRow = me.data.data[this.selectedSessionIdx];

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  openSession(selectedRow: SmallSessionData) {
    this.selectedRow = selectedRow;
    console.log('SessionDataComponent Session Change - ', selectedRow);

    this.stateService.set('sessions.selectedSessionIdx', selectedRow.idx, true);
  }

}
