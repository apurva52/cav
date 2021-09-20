import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
//import { Metadata } from './../../common/interfaces/metadata';
import { MenuItem, MessageService } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { SessionEventTable } from './service/session-event.model';
import { SESSION_EVENT_TABLE } from './service/session-event.dummy';
import { SessionEventTableHeaderColumn } from './service/session-event.model';
import { SessionEventService } from './service/session-event.service';
import { Store } from 'src/app/core/store/store';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
import {
    SessionEventLoadedState, SessionEventLoadingErrorState, SessionEventLoadingState
} from './service/session-event.state';

//import { PageInformation } from 'src/app/pages/home/home-sessions/common/interfaces/pageinformation'
import { EventInformation } from 'src/app/pages/home/home-sessions/common/interfaces/eventinformation'
//import { Session } from '../../common/interfaces/session';
import { Session } from '../common/interfaces/session';
import { ParseSessionFilters } from '../common/interfaces/parsesessionfilters';
import { Metadata } from '../common/interfaces/metadata';
import { NvhttpService ,NVPreLoadedState, NVPreLoadingErrorState, NVPreLoadingState } from '../common/service/nvhttp.service';
import * as moment from 'moment';
import { NVAppConfigService } from '../common/service/nvappconfig.service';
import { Table } from 'primeng';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { SessionFilter } from '../common/interfaces/sessionfilter';
import { PageFilters } from '../common/interfaces/pagefilter';

@Component({
  selector: 'app-session-event',
  templateUrl: './session-event.component.html',
  styleUrls: ['./session-event.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SessionEventComponent implements OnInit {
  @ViewChild('session') session: Table ;

  data: SessionEventTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  breadcrumb: BreadcrumbService


  cols: SessionEventTableHeaderColumn[] = [];
  _selectedColumns: SessionEventTableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean;
  isEnabledColumnFilter: boolean;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  //error: boolean;
  options: MenuItem[];
  options1: MenuItem[];
  selectedValues: string[] = [];
  options2: MenuItem[];
  selectedSession : Session;
  selectedPage: any;
  filterCriteria: any;
  filterCriteriaList: any;
  //metadata : Metadata;
  last: any;
  eventname: any;
  analyticsOptions: MenuItem[];
  linkOptions : MenuItem[];
  stime: any;
  etime: any;
  fromSessionFilter: any;
  metadata : Metadata
  eventAggData: any;
  eventData: any[];
  pattern: any;
  dur: number;
  tbuckets: number;
  granularity : string = "Auto";
  dialogFlag: boolean;
  eventAttribute = null;
  attrData: any[];
  countBucket: any;
  attrindex: any[];
  nvconfig : any;
  cbuckets: any[];
  trendloading : boolean = false;
  showtrend : boolean = false;
  eventTrendData: any ; // { title: any; highchart: { plotOptions: { column: { stacking: string; }; series: { cursor: string; events: { click: (event: any) => void; }; }; }; credits: { enabled: boolean; }; legend: { enabled: boolean; }; yAxis: { min: number; title: { text: string; }; }; chart: { type: string; }; title: { text: string; }; time: { timezone: string; }; xAxis: { startOnTick: boolean; endOnTick: boolean; showLastLabel: boolean; type: string; labels: { format: string; }; }; tooltip: { pointFormat: string; shared: boolean; }; series: { name: string; data: any[]; }[]; exporting: { enabled: boolean; sourceWidth: number; sourceHeight: number; title: string; }; }; };
  constructor(private router: Router, private route: ActivatedRoute,breadcrumb: BreadcrumbService, private sessioneventservice: SessionEventService, private metadataService : MetadataService, private httpService : NvhttpService, private msgService: MessageService, private nvconfigService : NVAppConfigService) {
  
     this.breadcrumb = breadcrumb;
 }

  ngOnInit(): void {
    let me = this;
   
    me.linkOptions = [
      { label: 'Sessions' , command: (event: any) => {this.sessionDDR() }}
      //{ label: 'Sessions', command: (event: any) => {  } },
    ],
    me.downloadOptions = [
              { label: 'WORD', command: (event: any) => { this.session.exportCSV(); }},//exportCSV
              { label: 'PDF'  , command: (event: any) => { this.exportPdf(); }},
              { label: 'EXCEL' , command: (event: any) => { this.exportExcel(); }}
            ] 
      
    me.data = {...SESSION_EVENT_TABLE};
    //me.getDataForTable();
    // No need to subscribe for queryParam as parameters will change on 
    const params = this.route.snapshot.queryParams;
    {
        //this.last = params['last'];
        //this.eventname = params['eventname'];

        this.stime = params['startDateTime'];
        this.etime = params['endDateTime'];
        this.last = params['last'];
        //ParseSessionFilters.sessionFilters.sessionEventFlag = params['eventFlag'];

        this.fromSessionFilter = params['eventFlag'];
         
        console.log('this.fromSessionFilter - ' + this.fromSessionFilter);
        if (this.fromSessionFilter == 'false') {
          // enable page ddr. 
          this.linkOptions = [
            { label: 'Pages' , command: (event: any) => {this.pageDDR() }}
          ]
        }
        this.eventname = params['eventname'];
        this.metadataService.getMetadata().subscribe(response => {
          this.metadata = response;
          this.showData();
        });
      }    

    me.nvconfigService.getdata().subscribe(response =>{
        me.nvconfig = response;
    });
     this.cbuckets = [
      { label : '5 Minutes', value : '5 Minutes'},
      { label: '1 Hour', value: '1 Hour' },
      { label: '1 Day', value: '1 Day' },
      { label: 'Auto', value: 'Auto' }];

    this.totalRecords = me.data.data.length;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    /*me.sessioneventservice.LoadSessionEventData(this.last,this.eventname).subscribe(
      (state: Store.State) => {

        if (state instanceof SessionEventLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof SessionEventLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: SessionEventLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );*/

  
    if (Object.keys(this.route.snapshot.queryParams).length == 0) {
      // clear all breadcrumb. 
      this.breadcrumb.removeAll();
      this.breadcrumb.addNewBreadcrumb({ label: 'Home', routerLink: '/home' } as MenuItem);
      this.breadcrumb.addNewBreadcrumb({ label: 'Sessions', routerLink: '/home/home-sessions' });
    }
    this.breadcrumb.add({ label: 'Session-Event', routerLink: '/session-event', queryParams: { ...this.route.snapshot.queryParams } } as MenuItem);
  }

  @Input() get selectedColumns(): SessionEventTableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: SessionEventTableHeaderColumn[]) {
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


  sessionDDR() {
    console.log('Session DDR from event aggregate, selectedRow - ', this.selectedRow);
    let selectedEvent: { count: number, eventdata: string, eventname: string} = this.selectedRow;

    // set session filter.
    let eobj = this.metadata.getEventFromName(selectedEvent.eventname);
    
    let edata = selectedEvent.eventdata.replace(/'/g, `''`);

    //set the new sessionfilter.
    // TODO: handling for both session and page.
    let sessionfilter = new SessionFilter();

    sessionfilter.timeFilter = {
      startTime: this.stime, 
      endTime: this.etime,
      last: this.last,
    };

    sessionfilter.sessionsWithSpecificEvents = eobj.id + '';
    sessionfilter.eventData = edata;

    // route to home-session.
    this.router.navigate(['home/home-sessions'], { queryParams: {'filterCriteria': JSON.stringify(sessionfilter)}, replaceUrl: true});
  }

  pageDDR() {
    console.log('Event Aggregate, Page DDR for event data - ', this.selectedRow);
    let selectedEvent: { count: number, eventdata: string, eventname: string} = this.selectedRow;

    // set session filter.
    let eobj = this.metadata.getEventFromName(selectedEvent.eventname);
    
    let edata = selectedEvent.eventdata.replace(/'/g, `''`);

    let pageFilter = new PageFilters();
    pageFilter.timeFilter = {
      startTime:  this.stime,
      endTime: this.etime,
      last: this.last
    };

    pageFilter.events = eobj.id + '';
    pageFilter.eventData = edata;

    this.router.navigate(['page-filter'], {queryParams: { 'filterCriteria': JSON.stringify(pageFilter)}, replaceUrl: true});
  }

  /*getDataForTable(){
    const me = this;
    //let filter = '{%22limit%22:15,%22offset%22:0,%22sessionCount%22:false,%22orderBy%22:[%22sessionstarttime%22],%22output%22:[],%22timeFilter%22:{%22last%22:%221%20Month%22,%22startTime%22:%22%22,%22endTime%22:%22%22},%22ddrscatterflag%22:false,%22bucketString%22:%225%20Minutes%22,%22duration%22:86400,%22totalBuckets%22:288,%22pageCount%22:false,%22errorCode%22:false}';
    let filter  = JSON.stringify(ParseSessionFilters.sessionFilters);
        me.sessioneventservice.LoadSessionEventData(filter).subscribe(
            (state: Store.State) => {
      
              if (state instanceof SessionEventLoadingState) {
                me.onLoading(state);
                return;
              }
      
              if (state instanceof SessionEventLoadedState) {
                me.onLoaded(state);
                return;
              }
            },
            (state: SessionEventLoadingErrorState) => {
              me.onLoadingError(state);
            }
          );
  }*/
  private onLoading(state: SessionEventLoadingState) {
    const me = this;
    me.data.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
    me.empty = false;
  }

  private onLoadingError(state: SessionEventLoadingErrorState) {
    const me = this;
    me.data.data = null;
    me.empty = false;
    me.error = state.error;
    me.empty = false;
    me.error.msg = "Error while loading data."
    me.loading = false;
  }
  private onLoaded(state: SessionEventLoadedState) {
    const me = this;
    //me.metadataService.getMetadata().subscribe(metadata => {
      me.data = {...SESSION_EVENT_TABLE};
      /*me.data.data = state.data.data.map(a => {
        console.log("Data3",a);
       return new EventInformation(a);
      });
      this.totalRecords = me.data.data.length;
  //});
 }*/
    me.data.data = state.data.data;
    me.totalRecords = me.data.data.length;
    me.empty = !me.data.data.length;
    me.error = null;
    me.loading = false;
  }
  pushToBag(data) {
    console.log(data);
  }



  applyFilter(tf){
    console.log("applyFilters called");
    this.stime = window["toDateString"](new Date(tf['starttime'])) + ' ' + new Date(tf['starttime']).toTimeString().split(" ")[0];
    this.etime = window["toDateString"](new Date(tf['endtime'])) + ' ' + new Date(tf['endtime']).toTimeString().split(" ")[0];
    this.last = tf['last'];
    if(this.last == undefined || this.last == null)
      this.last = "";
    this.showData();
  }


  showData()
  {
    this.eventAggData = null;
    this.httpService.getEventAggData(this.stime, this.etime, this.last, this.eventname).subscribe((state: Store.State)=> 
      {
        if (state instanceof NVPreLoadingState) {
          this.loading = state.loading;
        }
  
        if (state instanceof NVPreLoadedState) {
          this.loading = state.loading;
          let response = state.data;
          console.log("response :  ",response);
          if(response.length == 1 && typeof response[0] === 'string' && response[0].includes("Error:"))
          {
              console.log("response[0] if ",response[0]);
              //this.msgService.warn(""+response[0]); 
              this.msgService.add({severity:'warn',summary: 'Error',detail:response[0]});
              this.trendLoaded = false;
              this.eventAggData = [];
              this.data.data = this.eventAggData;
              this.totalRecords = this.data.data.length;
              this.empty = !this.data.data.length;
              return ;
          }
          this.eventAggData = this.processData(response);
          this.eventData = this.processData(response);
          //-------for events trend -------
         if(this.eventData != null && this.eventData.length > 0)
           this.getEventsCount();
         else{
           this.trendLoaded = false;
           this.showtrend = false;
         }
         this.data.data = this.eventAggData;
         this.totalRecords = this.data.data.length;
         this.empty = !this.data.data.length;
    }
    }, (error: Store.State) => {
      if (error instanceof NVPreLoadingErrorState) {
        this.loading = error.loading;
        this.msgService.add({ severity: 'danger', summary: 'Error Message', detail: 'Failed to get Data' });
      }
    });
  }
 
 //--------- for events trend ---------
  trendLoaded = false;
  prepareEventsTrendData(response , bucketSize)
  {
         if(response == null) return;
         if(response == null || response == undefined) return;
         let totalCounts = 0;
         let trends = response.trend;
 
         // set timestamp for each bucket.
         for(let j = 0; j < this.eventsTrends.length; j++)
         {
           console.log('response.startTimeStamp : ',response.startTimeStamp);
           let _time = new Date (moment.utc(response.startTimeStamp*1000).tz(sessionStorage.getItem('_nvtimezone')).format('YYYY-MM-DD hh:mm:ss')).valueOf()/1000;; 
           console.log('_time : ',_time);
           this.eventsTrends[j].x  = (_time + ((j+1) * bucketSize) + this.nvconfig.cavEpochDiff) * 1000;
         }
         for(let p = 0; p < trends.length; p++)
         {
           this.eventsTrends[trends[p].index].y = trends[p].count;
         }
 
         if(this.eventsTrends.length > 0){
           this.setOptions();
         }
         else{
           this.trendLoaded = true;
           this.trendloading = false;
           this.showtrend = false;
         }
  }
  getEventsCount()
  {
        this.showtrend = true;
        this.trendloading = true;
        this.trendLoaded = false;

         this.countBucket = this.getBucketDuration();
         this.httpService.getEventTrend(this.stime, this.etime, this.last, this.eventname, this.countBucket).subscribe((state: Store.State)=> {
           if(state instanceof NVPreLoadingState)
              this.trendloading = true;
           if(state instanceof NVPreLoadedState){
             let response = state.data;
            this.prepareEventsTrendData(response[0],this.countBucket);
           }
         });
  }
 
  getData(time)
  {
   if(time.last !== "" && time.last !== null)
     this.last = time.last;
   else
    {
     this.stime = time.startTime;
     this.etime = time.endTime;
     this.last = "";
    }
     this.router.navigate(['/home/netvision/eventAgg'],{ queryParams: { startDateTime : this.stime,endDateTime: this.etime,last: this.last, eventname: this.eventname   },replaceUrl : true});
  }
 
   processData(data)
   {
      let data1 = [];
      for(let i =0; i< data.length; i++)
      {
        data1[i] = {};
        data1[i]["eventname"] = data[i].eventname;
        if(data[i].eventdata === null || data[i].eventdata === "" || data[i].eventdata === undefined)
          data1[i]["eventdata"] = data[i].eventdata;
        else 
        {
          data1[i]["eventdata"] = data[i].eventdata;
          this.pattern = data1[i].eventdata.match(/##\*\*##/g);	 
          if(this.pattern) 
         {
           data1[i].eventdata = data1[i].eventdata.replace(/##\*\*##/g , "<span class=\"link\" style = \"color: blue;text-decoration: underline;\">****</span>"); 
           setTimeout(() => {
            document.getElementById("eventdata").innerHTML = data1[i].eventdata;} , 300);
          }
        }
        data1[i]["count"] = parseInt(data[i].count);
        let url = document.location.protocol+"//"+document.location.host+document.location.pathname+"index.html#sessions?filterCriteria=";
        if(this.fromSessionFilter  == "false")
         url = document.location.protocol+"//"+document.location.host+document.location.pathname+"index.html#pages?filterCriteria=";
        let filter = this.setFilterData(i,data1);
        data1[i]["urlnew"] = url +  JSON.stringify(filter); 
     }
      return data1;
   }
   setFilterData(i,data)
   {
      let eventObj = this.metadata.getEventFromName(this.eventname);
      let eventid = eventObj.id;
      let eventData = data[i].eventdata;
      if(eventData)
          eventData =data[i].eventdata.replace(/'/g,"''");
      let filtercriteria = {};
      if(this.fromSessionFilter == "false" )
        filtercriteria = {'timeFilter':{'startTime':this.stime,'endTime':this.etime,'last':this.last },'events': eventid, 'eventData': eventData };
      else
        {
        filtercriteria = {'timeFilter':{'startTime':this.stime,'endTime':this.etime,'last':this.last },'sessionsWithSpecificEvents': eventid, 'eventData': eventData };
        }	 
        return filtercriteria;
   }

   openSessionHavingEvents(i,$event)
   {
      $event.preventDefault();
      let filtercriteria = this.setFilterData(i,this.eventAggData);
      if(this.fromSessionFilter == "false" ){
         this.router.navigate(['/home/netvision/pages'],{ queryParams: { filterCriteria : JSON.stringify(filtercriteria) },replaceUrl : true} );
       }
       else
       {
         this.router.navigate(['/home/netvision/sessions'],{ queryParams: { filterCriteria : JSON.stringify(filtercriteria) },replaceUrl : true} );
       }
    }

    eventsTrends = [];

    getBucketDuration()
    {
           if( this.last !== null && this.last !== "")
           {
             let currentBucketSize = this.last;
             if (currentBucketSize == "15 Minutes")
             {
                   this.dur = 15 * 60;
             }
             else if (currentBucketSize == "1 Hour")
             {
                   this.dur = 1 * 60 * 60 ;
             }
             else if (currentBucketSize == "4 Hours")
             {
                   this.dur = 4 * 60 * 60;
             }
             else if (currentBucketSize == "1 Day")
             {
                   this.dur = 1 * 24 * 60 * 60;
             }
             else if (currentBucketSize == "1 Week")
             {
                   this.dur = 7 * 24 * 60 * 60;
             }
             else if (currentBucketSize == "1 Month")
             {
                   this.dur = 30 * 24 * 60 * 60;
             }
           }
           else
           {
                   let st = (new Date(this.stime).getTime()) - (1388534400000);
                   let et = (new Date(this.etime).getTime()) - (1388534400000);
                   this.dur = et - st;
                   this.dur = this.dur/1000;
           }
           let bucketSize = this.getBucketSize();
   
           this.tbuckets = Math.ceil(this.dur/bucketSize);
           this.eventsTrends = [];
           for(let i = 0; i < this.tbuckets; i++)
           {
                 this.eventsTrends.push({ "x": i, "y" : 0 });
           }
           this.chooseBucket();
           return bucketSize;
     }
    //to return bucket size.
    getBucketSize()
    {
   
       // no need to calculate for  other than auto granularity.
       if(this.granularity != "Auto") return this.buckets[this.granularity];
           let bucketSize;
           if ( this.dur <= (15 * 60) )
           {       //1 min
                   bucketSize = 1 * 60;
                   return bucketSize;
           }
           else if ( this.dur > (15 * 60 ) && this.dur <= (4 * 60 * 60))
           {       //5 min
                   bucketSize = 5 * 60;
                   return bucketSize;
           }
           else if (this.dur > (4 * 60 * 60) && this.dur <= (1 * 24 * 60 * 60))
           {       //1 hour
                   bucketSize = 1 * 60 * 60;
                   return bucketSize;
           } 
           else if ( this.dur > (1 * 24 * 60 * 60 ))
           {
                   //1 day
                   bucketSize = 1 * 24 * 60 * 60;
                   return bucketSize;
           }
    }
   
     updateBucket()
     {
        // update granularity and get session counts again.
        //this.granularity = $event;
        this.showtrend = true;
        this.trendloading = true;
        this.trendLoaded = false;
        this.getEventsCount();
     }
   
     // time string converted into seconds
     buckets= {
      "1 Minutes" : 1*60,
      "5 Minutes" : 5 * 60,
      "1 Hour" : 3600,
      "1 Day" : 24 * 3600
     };

     
     chooseBucket()
     {
          console.log(' trends_dur ' , this.dur);
          if(this.dur > (30 * 24 * 60 * 60))
      {
         this.cbuckets = [
          { label: '1 Day', value: '1 Day' },
          { label: 'Auto', value: 'Auto' } ];
      }
          else if(this.dur > (1 * 24 * 60 * 60) && this.dur < (31 * 24 * 60 * 60))
            {  this.cbuckets = [
            { label: '1 Hour', value: '1 Hour' },
            { label: '1 Day', value: '1 Day' },
            { label: 'Auto', value: 'Auto' }];
            }
    
          else
            {
              this.cbuckets = [
                { label : '5 Minutes', value : '5 Minutes'},
                { label: '1 Hour', value: '1 Hour' },
                { label: '1 Day', value: '1 Day' },
                { label: 'Auto', value: 'Auto' }
              ];
            }       
          console.log('buckets' , this.cbuckets);
     }
   
     openDialog(ev)  {
           // Check class of the target. if it is link then only open the popup  
     let elem = ev.target;
     let eData;
     if(elem.classList.contains("link"))  {
       //console.log("Click" , elem.parentElement.innerText);
       eData = elem.parentElement.innerText;
       this.dialogFlag = true;
       this.processAttribute(eData);
      }
     //document.getElementById("ebutton").click();
     }
     
     processAttribute(data)  
     {
        let pattern = data.match(/\*\*\*\*/g);
        if(pattern)  
            data = data.replace(/\*\*\*\*/g , "##\*\*##");
        data = encodeURIComponent(data);	
        //console.log("data " , data);
        this.httpService.getEventAggAttribute(this.stime, this.etime, this.last, this.eventname,data).subscribe((state: Store.State) => {
          if(state instanceof NVPreLoadedState){
             let response = state.data;
             this.eventAttribute = response;
             //console.table("@ attri " , this.eventAttribute);
             this.aggDataTable(this.eventAttribute);
          }
        });
     }
   
     aggDataTable(eventAttribute)  {
          this.attrData = [];
          this.attrindex = [];
          //console.log("aggDataTable " , eventAttribute);
          let i, tempAttribute = [];
          for(i = 0; i < eventAttribute.length ; i++)  {
              tempAttribute = JSON.parse(eventAttribute[i].attribute);
              //this.attrData[i]["eventdata"] = this.eventAttribute[i].eventdata;
              this.attrData.push({"eventdata":eventAttribute[i]["eventdata"]});
              let pattern = this.attrData[i].eventdata.match(/##\*\*##/g);
              let count = 0;
              if(pattern)  {
                //console.log("matched attr");
                while(count < pattern.length) {
                   this.attrData[i].eventdata = this.attrData[i].eventdata.replace("##\*\*##" , tempAttribute[count] );
                   setTimeout(() => {
                      document.getElementById("eventAgg").innerHTML = this.attrData[i].eventdata;
                   } , 300);
                count++; }
              }
              this.attrData[i]["count"] = eventAttribute[i].count;
          }
          this.attrData = [...this.attrData];
          //console.log("this.attrData " , this.attrData);
     }
     setOptions(){

      let options = {
            plotOptions: {
              column: {
                 stacking: 'normal'
              },
              series: {
                cursor: 'pointer',
                events: {
                    click: (event)=> {
                    console.log(event.point.index);
                      // if(event.point.y > 0)
                       //this.changeOffset.emit(event.point.index);
    
                    }
                }
            }
    
            },
            credits : { enabled : false},
            legend : { enabled : false},
            yAxis: {
                 min: 0,
            title: {
                text: 'Event(s)'
            }
            },
            chart: {
                    type: 'column',
                    height : 300,
                    width : 1300,
            },
            title: {
                    text: ''
            },
             time: {
              timezone: sessionStorage.getItem('_nvtimezone')
            },
            xAxis: {
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true,
            type : 'datetime',
            labels : { format: '{value:%e %b\'%y %H:%M:%S}'},
    
        },
    
            tooltip: {
                    pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b>',
                    shared: true
            },
            series: [{
                    name: 'Events',
                    data: this.eventsTrends
            }],
            exporting: {
                enabled: true,
                sourceWidth: 1200,
                sourceHeight: 500,
                title: 'Events Trend'
            }
    
    
     };
    this.eventTrendData = { title: null, highchart: options };
    this.trendloading = false;
    this.trendLoaded = true;
    this.showtrend = true;
  }
 
  toggleSessionTrend() {
    this.showtrend = !this.showtrend;
    if(this.showtrend == true)
      this.setOptions();
  }
  saveAsExcelFile(buffer: any): void {
    import('file-saver').then(FileSaver => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
     // const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, 'EventAggReport.xlsx');
    });
  }
  exportPdf() {
    const exportColumns = this.cols.map(col => ({ title: col.label, dataKey: col.field }));
    import('jspdf').then(jsPDF => {
      import('jspdf-autotable').then(x => {
        const doc = new jsPDF.default(0, 0);
        doc.autoTable(exportColumns, this.data.data);
        doc.save('EventAggReport.pdf');
      });
    });
  }
  exportExcel() {
    import('xlsx').then(xlsx => {    
     let f= [...this.data.data ] 
     for (var k of f) {
        delete k['urlnew']
      } 
      const worksheet = xlsx.utils.json_to_sheet(f);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer);
    });
  }

}
