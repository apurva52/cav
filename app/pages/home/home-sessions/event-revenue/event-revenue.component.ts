import { Component, OnInit, Input ,Output, EventEmitter,ViewEncapsulation } from '@angular/core';
import { MsgService } from '../common/service/msg.service';
import { NvhttpService, NVPreLoadingState, NVPreLoadedState, NVPreLoadingErrorState } from './../common/service/nvhttp.service';
import { AppError } from 'src/app/core/error/error.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { EVENT_REVENUE_TABLE } from './service/event-revenue.dummy';

import { Store } from 'src/app/core/store/store'; 
import * as moment from 'moment';
import 'moment-timezone';

@Component({
  selector: 'app-event-revenue',
  templateUrl: './event-revenue.component.html',
  styleUrls: ['./event-revenue.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EventRevenueComponent implements OnInit {

  //Input parameters
  @Input() impdata = null;
  //@Input() displayFlag = false;
  @Input() loader = false;
  @Input() cardData = null;
  displayFlag = true;
   //Output parameters
   @Output() changeFlagValue :EventEmitter<boolean>;
   
   

  rLoss: any ;   //Estimate Revenue Loss
  bounceRate: any;
  convRate: any;    //Conversion Rate
  sessDur: any;   //average session duration
  impactedSess: any;    //impacted session
  impactedPage: any;    //impacted Page
  filterCriteria: string;
  bounceRateDiff : any; // difference between overall and event bounce rate
  convRateDiff : any; // difference between overall and event conversion rate
  pagedata : any = []; // info related to each page
  page_revenue_data : any; // info related to each page revenue loss
  deftime : string = "";
  //loader :boolean;
  data_available : boolean = false;
  error: AppError;
  loading: boolean;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  data:Table;

  constructor( private nvHttp:NvhttpService ) { 
    this.changeFlagValue = new EventEmitter();
   
    
  }

  ngOnInit() {
    const me = this;
    me.data = EVENT_REVENUE_TABLE;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      //me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }  
    console.log("in event impact , cardData : ", this.cardData);
    /**
     * cardData format : 
     *    {
     *      "revenueloss":0.0,"estconversionrate":80.0,"estbounceRate":80.0,"overallconversionrate":80.0,"overallbounceRate":60.0,"impacted_sessions":2.0,"impacted_pages":14.0,
     *      "truthtable":"[{\"page\":\"mypage\",\"cre\":100.0,\"ocr\":100.0,\"ototal\":1.0,\"etotal\":1.0,\"obr\":0.0,\"ebr\":0.0,\"ocompleted\":1.0,\"ecompleted\":1.0,\"sap\":-1.0},{\"page\":\"rebates\",\"cre\":100.0,\"ocr\":100.0,\"ototal\":1.0,\"etotal\":1.0,\"obr\":0.0,\"ebr\":0.0,\"ocompleted\":1.0,\"ecompleted\":1.0}]",
     *      "perpage_rl":"{\"mypage\":0.0,\"rebates\":0.0}"
     *    }
     */
    console.log("this.loader ", this.loader,'this.data : ',this.impdata);
    if(this.loader == false && this.cardData != undefined)
      this.assignValues();
    this.deftime = this.impdata[2]['startDateTime'] +" - "+ this.impdata[3]['endDateTime'];
  }
  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

   close(){
     console.log( "pop up closed");
     this.displayFlag = false;
     this.changeFlagValue.emit(this.displayFlag);
   }

  getData(timeFilter){
    const me = this;
    console.log("time : ", timeFilter);
    //for event impact
    this.loader = true;
    var st = timeFilter.startTime;
    var et = timeFilter.endTime;
    // params : startTime = 01/28/2021%2000:00:00
    //endTime = 01/28/2021%2023:59:00
    //channel=Overall
    //eventname=AjaxError
    let st_utc = moment.tz(new Date(st),"UTC").format('MM/DD/YYYY  HH:mm:ss');
    let et_utc = moment.tz(new Date(et),"UTC").format('MM/DD/YYYY  HH:mm:ss');
     me.nvHttp.getEventImpactInfo("", st_utc, et_utc,me.impdata[4]['channel'].name, me.impdata[0]['event']).subscribe((state: Store.State) =>{

      if (state instanceof NVPreLoadingState) {
        console.log('NVPreLoadingState', state);
        me.loader = true;
        me.error = state.error;
       me.data.data = state.data;
     }
     if (state instanceof NVPreLoadedState) {
      console.log('NVPreLoadedState', state);
      me.loading = state.loading;
       me.error = state.error; 
       //me.data.data=state.data;  
         me.loader = false;
         console.log("response : ", state);
         me.cardData = state;
         
         me.displayFlag = true;
         me.assignValues();
      }
     },
     (err: Store.State) =>{
      if (err instanceof NVPreLoadingErrorState) {
        
        me.loader = false;
        me.data_available = false;
       console.log("error occred : ", err);
       me.resetValues();
      }

     });
     
  
}
  assignValues(){
    const me = this;
    me.data_available = true;
    me.rLoss = me.cardData.data.revenueloss.toFixed(2);
    me.bounceRate = me.cardData.data.estbounceRate.toFixed(2);
    me.convRate = me.cardData.data.estconversionrate.toFixed(2);
    me.impactedSess =  me.cardData.data.impacted_sessions;
    me.impactedPage = me.cardData.data.impacted_pages;
    me.bounceRateDiff = Number((me.cardData.data.estbounceRate - me.cardData.data.overallbounceRate).toFixed(2));
    me.convRateDiff =  Number((me.cardData.data.overallconversionrate - me.cardData.data.estconversionrate).toFixed(2));
    me.pagedata = JSON.parse(me.cardData.data.truthtable);
    me.page_revenue_data = JSON.parse(me.cardData.data.perpage_rl);

    console.log("event data " , this.impdata);
    me.data.data=me.pagedata;
    console.log("me.data.data", me.data.data);

    me.deftime = me.impdata[2]['startDateTime'] +" - "+ me.impdata[3]['endDateTime'];
  }
  resetValues(){
    const me = this;
    me.rLoss = 0;
    me.bounceRate = 0;
    me.convRate = 0;
    me.impactedSess =  0;
    me.impactedPage = 0;
    me.bounceRateDiff = 0;
    me.convRateDiff =  0;
    me.pagedata = [];
    me.page_revenue_data = {};
    

  }
  onTimeFilterCustomTimeChange(){}
}
