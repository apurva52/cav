import { Component, Input, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { LazyLoadEvent, MenuItem, MessageService, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { HTTP_DETAIL_FILTER_TABLE , SCATTER_MAP_DATA} from './service/http-detail.dummy'
import { AutoCompleteData, HttpAggFilterTable, HttpAggFilterTableHeaderColumn } from './../http-filter/service/http-filter.model';
import { Store } from 'src/app/core/store/store';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
import { Util } from '../common/util/util';
import { NVAppConfigService } from '../common/service/nvappconfig.service';
import { ParseHttpFilters } from '../common/interfaces/parsehttpfilters';
import { HttpDataService } from '../http-filter/service/http-filter.service';
import { NvhttpService, NVPreLoadingState, NVPreLoadedState, NVPreLoadingErrorState } from '../common/service/nvhttp.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Metadata } from '../common/interfaces/metadata';
import * as moment from 'moment';
import 'moment-timezone';
import { HttpDetailData } from '../common/interfaces/http-detail-data';
import { HttpScatterGraphData } from '../common/interfaces/httpgraphdata';
import { DrillDownDDRService } from '../common/service/drilldownddrservice.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { Table } from 'primeng';
import { HttpFilterSmartSearch } from '../http-filter/httpfiltersmartsearch';
import { HttpClient } from '@angular/common/http';
import { SessionStateService } from '../session-state.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportUtil } from '../common/util/export-util';

@Component({
  selector: 'app-http-detail',
  templateUrl: './http-detail.component.html',
  styleUrls: ['./http-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class  HttpDetailComponent extends HttpFilterSmartSearch implements OnInit {

  @ViewChild('session') session: Table ;
  @ViewChild('searchInput') searchInput: ElementRef;
  data: HttpAggFilterTable;
  error: AppError;
  loading: boolean = false;
  empty: boolean;
  ischecked: boolean = false;
  key: string;
  cols: HttpAggFilterTableHeaderColumn[];
  selected: boolean = false;
  totalRecords = 0;
  downloadOptions: MenuItem[];
  _selectedColumns: HttpAggFilterTableHeaderColumn[] = [];
  emptyTable: boolean;
  globalFilterFields: string[] = [];
  selectedRow: any;
  isEnabledColumnFilter: boolean;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  analyticsOptions: MenuItem[];
  linkOptions: MenuItem[];

  selectedCars2: string[] = [];
  multiOptions: SelectItem[];
  nvAppConfigService : NVAppConfigService;
  nvconfigurations : any;
  filter : any;
  metadata : Metadata;
  objectKeys = Object.keys;
  mapdata : any;
  metricType : any;
  bucketflag : boolean = false;
  //for httpscatter gui
  httpFilterMode : boolean = false;
   currentBucketSize = "5 Minutes";
   scatterstartTime = "";
   scatterendTime = "";
   offsetWindow = null;
   metric = "HttpResponsetime";
   metricIndex = 0;
   httpscatterdata : any;
   sessions : any;
   sessionddrflag: boolean = false;
   //for httpscatter gui
   particularPage : boolean = true;
   xhrRequestData :any;
   xhrDataOffset: number;
   xhrDataView: number;
   xhrDataCount = null;
   StartTime :any;
  chartData: any;
  outlier = 120;
  options : any;
  ddrflag : boolean = false;
  ready : boolean = false;
  groupData : any = [];
  customTimeError   = "";
  customTime: Date[] = [];
  maxDate: Date;
  customStartDateTime : any;
  customEndDateTime :any;
  currentPerformanceMetric = "HttpResponsetime";
  currentMetricIndex =  0;
  metricoptions : any;
  selectedRowIndex: any;
  breadcrumb: BreadcrumbService;
  groupDataTemp = [];
  paginationEvent:any;
  sessionsOffset: number;
  first: number = 0;
  rows: number = 15;
  limit: number = 15;
  offset: number = 0;
  sessionWithND : boolean = false;  
  scatter : boolean = true;
  httpofsetfilter = ParseHttpFilters.httpFilters.offset;
  totalBuckets = Math.ceil(ParseHttpFilters.httpFilters.totalBuckets);
  countLoading : boolean = false;
  //smartsearch
  autoCompleteList: AutoCompleteData;
  filteredReports: any[];
  smartSearchFilterApplied : boolean = false;
  fromBreadcrumb : boolean = false;
  className : string = "http-detail";
  static filterhtml = "Last 1 Day";
  static timeFilter = "";

  constructor(http: HttpClient, private httpDataService : HttpDataService, private metadataService : MetadataService, private router: Router, private route : ActivatedRoute, private httpService : NvhttpService, nvAppConfigService : NVAppConfigService, private messageService: MessageService,private ddrService : DrillDownDDRService, breadcrumb: BreadcrumbService, private stateService: SessionStateService) {
    super(http);   
    this.nvAppConfigService = nvAppConfigService;
    this.breadcrumb = breadcrumb;
    this.downloadOptions = [
      { label: 'CSV', command: () => { this.exportCSV(); } },
      { label: 'Excel', command: () => { this.exportExcel(); } },
      { label: 'PDF', command: () => { this.exportPdf(); } }
    ];

    this.multiOptions = [
      {label: 'Audi', value: 'Audi'},
      {label: 'BMW', value: 'BMW'},
      {label: 'Fiat', value: 'Fiat'},
      {label: 'Ford', value: 'Ford'},
    ],
    this.linkOptions = [
      { label: 'Sessions' ,routerLink: '/sessions-details' }
    ],
    this.analyticsOptions = [
      { label: 'Page Performance Overview', routerLink: '/page-performance-overview' },
      { label: 'Revenue Analytics' ,routerLink: '/revenue-analytics' },
      { label: 'Ux Agent Setting' ,routerLink: '/ux-agent-setting' },
      { label: 'Custom Metrics' },
      { label: 'Path Analytics', routerLink: '/path-analytics' },
      { label: 'Form Analytics' },
      { label: 'Marketing Analytics',routerLink: '/marketing-analytics' }
    ]

    this.metricoptions = [
      {
        label : 'HttpResponsetime' , value : 'HttpResponsetime'
      }
    ];


    this.metadataService.getMetadata().subscribe(metadata => {
      //init smart search.
      this.init(metadata, this.applySmartSearchFilter, this);
    });
   }

  ngOnInit(): void {
    const me = this;
    me.data = {...HTTP_DETAIL_FILTER_TABLE};
    me.first = this.data.paginator.first;
    me.rows = this.data.paginator.rows;
    me.mapdata = SCATTER_MAP_DATA;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    this.nvAppConfigService.getdata().subscribe(response => {
      this.nvconfigurations = response;
    });
    
    // set breadcrumb.
    let qp = {...this.route.snapshot.queryParams};
    qp['from'] = "breadcrumb";
    me.breadcrumb.add({label: 'HttpRequest', routerLink: '/http-detail', queryParams: qp } as MenuItem);

   // restore to previuos state only if we are coming from breadcrumb
   let from = this.route.snapshot.queryParams.from;
   if(from && from == "breadcrumb")
     this.fromBreadcrumb = true;

   // try to restore from state
   const oldFilter = this.stateService.get('http.filterCriteria');
   console.log('http-detail | oldFilter : ', oldFilter);

   if (oldFilter != null && this.fromBreadcrumb) {
     ParseHttpFilters.httpFilters = oldFilter;
     let data = this.stateService.get('http.data', []);

     if (data && data.length) {
       this.groupData = this.stateService.get('http.data', []);
       this.rows = this.stateService.get('http.rows', this.rows);
       this.first = this.stateService.get('http.first', this.first);
       this.totalRecords = this.stateService.get('http.totalRecords', 0);
     }
     return;

   } else {
    me.route.queryParams.subscribe(params=>{
      console.log("params in http detail : ", params);
      this.filter = params['filterCriteria'];
      this.metadataService.getMetadata().subscribe(response => {
        this.metadata = response
        this.getInitPagePerformance(this.filter);
        });
    });
   }

  }


  @Input() get selectedColumns(): HttpAggFilterTableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: HttpAggFilterTableHeaderColumn[]) {
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

  applyFilter(){
    this.first = this.data.paginator.first;
    this.rows = this.data.paginator.rows;
    this.totalRecords = 0;
    this.loadXhrData(true);
  }
  
  getInitPagePerformance(filter)
    {
    if(filter === undefined || filter === null || filter.length == 0)
    {
      //let d = moment(new Date().getTime() - 24*60*60*1000,AppComponent.config.timeZone).toDate();
      let time = ((new Date().getTime()) -  24*60*60*1000);
      let date = moment.tz(time,sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss');
      let d = new Date(moment.tz(time,sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
      let date1 = window["toDateString"](d);
      if(navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("rv:11.0") > -1 || navigator.userAgent.indexOf("Edge") > -1)
      {
         let tmpDate = (d.getMonth() + 1) + "/" + d.getDate()  + "/" + d.getFullYear();
         date1 = tmpDate;
      }
      let startT = date1 + " 00:00:00";
      let endT = date1 + " 23:59:00";
      ParseHttpFilters.httpFilters.timeFilter.startTime =  startT;
      ParseHttpFilters.httpFilters.timeFilter.endTime =  endT;
      // return pages from all bp having checkout flag true
      //this.getCheckoutBPpagelist();
	  //HttpFiltersComponent.parsepagefilter.pagePerformanceFilters.pageName = this.checkbpPageNames.join();
      //HttpFiltersComponent.parsepagefilter.pagePerformanceFilters.pages = this.checkbpPageIds.join();
      //HttpFiltersComponent.parsepagefilter.pagePerformanceFilters.metricType = "onload";
      
	    ParseHttpFilters.httpFilters.channel  = undefined;
      ParseHttpFilters.httpFilters.userSegment  = undefined;

      let selectedChannel = null;
      let chm: any[] =  Array.from(this.metadata.channelMap.keys());
      let cn = null;
      if(chm.length > 0)
      {
        selectedChannel = this.metadata.channelMap.get(chm[0]).id.toString();
        cn = this.metadata.channelMap.get(chm[0]).name;
      }
      ParseHttpFilters.httpFilters.channel = "-1";
      //RevenueanalysisComponent.filterhtml += "Metric : Onload ,  Granularity : 0.1 ,  Page :" +  this.checkbpPageNames.join();
       //PageperformancefilterComponent.filterhtml = "Last : 1 Day";
       //HttpfiltercriteriaComponent.setTimeHtml("Last : 1 Day");
    }
    else
    {
       try{
         ParseHttpFilters.httpFilters =  JSON.parse(decodeURIComponent(filter));
       }
       catch(e) {}
      let filc =  JSON.parse(decodeURIComponent(filter));
    
    }
    //ddr from dashboard to open scatter chart on the basis of flag
    if(ParseHttpFilters.httpFilters.ddrscatterflag == true)
     {
      //this.sessionddrflag = false;
      //this.httpFilterMode = true;
      console.log("ParseHttpFilters.httpFilters.ddrscatterflag true : ",ParseHttpFilters.httpFilters.ddrscatterflag);
      //this.changeMode(true); 
     }
    else
     {
      console.log("ParseHttpFilters.httpFilters.ddrscatterflag false: ",ParseHttpFilters.httpFilters.ddrscatterflag);
      ParseHttpFilters.httpFilters.limit = 15;
      ParseHttpFilters.httpFilters.offset =  0;
      this.httpFilterMode = false;
      this.sessionddrflag = false;
      ParseHttpFilters.httpFilters.ddrscatterflag = false; 
      this.loadXhrData(true);
     }
    
  }

  loadXhrData(count){
    const me = this;
    let f = {...ParseHttpFilters.httpFilters};
    this.stateService.set('http.filterCriteria', f);
    this.httpService.getXhrRequests(f).subscribe(
      (state: Store.State) => {
  
        if (state instanceof NVPreLoadingState) {
          me.onLoading(state);
          return;
        }
  
        if (state instanceof NVPreLoadedState) {
          me.onLoaded(state,count);
          return;
        }
        if (state instanceof NVPreLoadingErrorState) {
         me.onLoadingError(state);
          return;
        }
      },
      (err: Store.State) => {
        if (err instanceof NVPreLoadingErrorState) {
        me.onLoadingError(err);
        }
      }
    );

  }

  private onLoading(state) {
    const me = this;
    me.data.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state) {
    const me = this;
    me.data.data = null;
    me.empty = false;
    me.loading = false;
    me.error = state.error;
    me.error.msg = "Error while loading data.";
  }

  private onLoaded(state,count) {
    const me = this;
    me.metadataService.getMetadata().subscribe(metadata => {
      me.data = HTTP_DETAIL_FILTER_TABLE;
      me.data.data =[]; 
      let a = null;
      for(var i = 0 ; i < state.data.data.length; i++){
        a =  new HttpDetailData(state.data.data[i], metadata,i);
        me.data.data.push(a);
      }
      if(count && me.data.data.length >= ParseHttpFilters.httpFilters.limit){
        me.getXhrDataCount();
     }
     else{
        if(count)
          me.totalRecords = me.data.data.length;
          this.customSort(this.paginationEvent);
     }
     me.groupData = me.data.data;
     me.empty = !me.data.data.length;
     me.loading = false;
  });
 }

 getXhrDataCount()
 {
     ParseHttpFilters.httpFilters.pageCount = true;
     this.countLoading = true;
     this.httpService.getXhrRequests(ParseHttpFilters.httpFilters).subscribe(
      (state: Store.State) => {
  
      
        if (state instanceof NVPreLoadedState) {
          this.totalRecords = state.data['count'];
          // reset 
          ParseHttpFilters.httpFilters.pageCount = false;
          this.countLoading = false;
          return;
        }
       
      },
      (err: Store.State) => {
        if (err instanceof NVPreLoadingErrorState) {
          console.log('error in fetching http detail count');
          this.countLoading = false;
        }
      }
    );
  }

 
 changeMode(flag)
   {
     this.httpFilterMode = flag;
     if(flag == false)
     { 
       this.scatter = true; 
      ParseHttpFilters.httpFilters.ddrscatterflag = false;
      ParseHttpFilters.httpFilters.limit = 15;
      ParseHttpFilters.httpFilters.offset =  0;      
      this.loadXhrData(true);
     } 
     else  //if(flag === true)
     { 
       this.scatter = false; 
       this.sessionddrflag = false;
       console.log("ParseHttpFilters.httpFilters : ",ParseHttpFilters.httpFilters);
       this.httpscatterdata = null;
       ParseHttpFilters.httpFilters.limit = 300;
       ParseHttpFilters.httpFilters.offset = 1;
       ParseHttpFilters.httpFilters.bucketString = "5 Minutes";
       this.setScatterTime();
       this.updateOffsetScatter(ParseHttpFilters.httpFilters.offset);
       ParseHttpFilters.httpFilters.pageCount = false; 
       //ParseHttpFilters.httpFilters.totalBuckets = null; 
       //ParseHttpFilters.httpFilters.limit = 0;     
       this.httpService.getHttpScatteredChartData(ParseHttpFilters.httpFilters).subscribe(
        (state: Store.State) => {
    
          if (state instanceof NVPreLoadingState) {
              return;
          }
    
          if (state instanceof NVPreLoadedState) {
            if(state.data != null){
               this.httpscatterdata = state.data["data"];
               this.chartData = new HttpScatterGraphData(this.metric,this.httpscatterdata,this.metricIndex,this.outlier);
               this.setOptions();
               return;
            }
          }
          if (state instanceof NVPreLoadingErrorState) {
            console.log('error in fetching scatter map data');
            return;
          }
        },
        (err: Store.State) => {
          if (err instanceof NVPreLoadingErrorState) {
            console.log('error in fetching scatter map data');
          }
        }
      );
  
     }
   }

   setScatterTime()
   {
     let startTime ;
     let endTime ;
        if(ParseHttpFilters.httpFilters.timeFilter.last !== "")
        { 
          let timee = Util.convertLastToFormatted(ParseHttpFilters.httpFilters.timeFilter.last);
          startTime = timee.startTime;
          endTime = timee.endTime;
        }
        else
        {  
           startTime = ParseHttpFilters.httpFilters.timeFilter.startTime;
           endTime = ParseHttpFilters.httpFilters.timeFilter.endTime;
        }   
        let time = new Date(startTime).getTime()/1000;
        let limit = ParseHttpFilters.httpFilters.limit;
        let timeZone = sessionStorage.getItem("_nvtimezone");
        let offset = ParseHttpFilters.httpFilters.offset;
        let tmpTime = time + (offset - 1) * limit;
        let etime = new Date(endTime).getTime()/1000;
     this.scatterstartTime =  window["toDateString"](new Date(tmpTime*1000)) + " " + new Date(tmpTime*1000).toTimeString().split(" ")[0];    //     moment.tz(tmpTime * 1000,timeZone).format('MM/DD/YYYY HH:mm:ss');
     //this.scatterStart = new Date(moment.tz(tmpTime * 1000,timeZone).format('MM/DD/YYYY HH:mm:ss'));
     tmpTime = time + offset * limit;
     if(limit === 0)
       tmpTime = etime;
     this.scatterendTime =  window["toDateString"](new Date(tmpTime*1000)) + " " + new Date(tmpTime*1000).toTimeString().split(" ")[0]; //moment.tz(tmpTime * 1000,timeZone).format('MM/DD/YYYY HH:mm:ss');
 
       
   }
   
   getChartData()
   {
     this.setScatterTime();
     this.calculateTime();
     this.httpscatterdata = null;
     this.ready= false;
     this.httpService.getHttpScatteredChartData(ParseHttpFilters.httpFilters).subscribe(
      (state: Store.State) => {
  
        if (state instanceof NVPreLoadingState) {
            return;
        }
  
        if (state instanceof NVPreLoadedState) {
          if(state.data != null){
             this.httpscatterdata = state.data["data"];
             this.metric = "HttpResponsetime";
             this.metricIndex = 0;
             this.chartData = new HttpScatterGraphData(this.metric,this.httpscatterdata,this.metricIndex,this.outlier);
             this.setOptions();
             return;
          }
        }
        if (state instanceof NVPreLoadingErrorState) {
          console.log('error in fetching scatter map data');
          return;
        }
      },
      (err: Store.State) => {
        if (err instanceof NVPreLoadingErrorState) {
          console.log('error in fetching scatter map data');
        }
      }
    );

     
   } 
   updateMetric($event)
   {
     this.metricIndex = parseInt($event.split(":")[1]);
     this.metric = $event.split(":")[0];
     this.currentPerformanceMetric = this.metric;
     this.currentMetricIndex = this.metricIndex;
     this.chartData = new HttpScatterGraphData(this.currentPerformanceMetric,this.httpscatterdata,this.currentMetricIndex,this.outlier);
     this.setOptions();

   }
   
  calculateTime()
   {
     let duration = 15 * 60 * 1000;
     if(ParseHttpFilters.httpFilters.timeFilter.last !== "")
     {
       let val = ParseHttpFilters.httpFilters.timeFilter.last;
       if(val == "15 Minutes")
        duration = 15 * 60 * 1000;
       else if(val == "1 Hour")
        duration = 1 * 60 * 60 * 1000;
       else if(val == "4 Hours")
        duration = 4 * 60 * 60 * 1000;
       else if(val == "8 Hours")
        duration = 8 * 60 * 60 * 1000;
       else if(val == "12 Hours")
        duration = 12 * 60 * 60 * 1000;
       else if(val == "16 Hours")
        duration = 16 * 60 * 60 * 1000;
       else if(val == "20 Hours")
        duration = 20 * 60 * 60 * 1000;
       else if(val == "1 Day")
        duration = 1 * 24 * 60 * 60 * 1000;
       else if(val == "1 Week")
        duration = 7 * 24 * 60 * 60 * 1000;
       else if(val == "1 Month")
        duration = 30 * 24 * 60 * 60 * 1000;
       else
         duration = 1 * 12 * 365 * 24 * 60 * 60 * 1000;
    }
    else
    {
      let st = (new Date(ParseHttpFilters.httpFilters.timeFilter.startTime).getTime()) - (1388534400000);
      let et = (new Date(ParseHttpFilters.httpFilters.timeFilter.endTime).getTime()) - (1388534400000);
      duration = et - st;
    }
    ParseHttpFilters.httpFilters.duration = duration / 1000;
    ParseHttpFilters.httpFilters.totalBuckets = ParseHttpFilters.httpFilters.duration / ParseHttpFilters.httpFilters.limit;
    
   }
   setOptions(){
    this.options = {
    chart: {
        type: 'scatter',
        zoomType: 'x',
        width : window.innerWidth - 100,//1300, // window.innerWidth
        height : window.innerHeight  -100 //500 // window.innerHeight
    },
    title: {  
        text: "Http Scatter Map"
    },
     time: {
          timezone: sessionStorage.getItem('_nvtimezone')
        },
    xAxis: {
        title: {
            enabled: true,
            text: this.chartData.xtype
        }
        ,
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true,
        type : 'datetime',
        labels : { format: '{value:%e %b\'%y %H:%M:%S}'} 
    },
    yAxis: {
        title: {
            text: this.chartData.ytype
        }
    },
    legend: {
        borderWidth: 1,
        layout: 'vertical',
        verticalAlign: 'bottom',
        floating: false

    },
    plotOptions: {
        series : {  events: {
                click: (event) => {
                          let series = event.point.series.index;
                          let point = event.point.index;
                          let data = this.chartData.data[series][point];
                          // if(this.ddrflag == true) 
                           //this.sessionddrflag = true;
                           if (this.sessionddrflag == true)
                           {
                             let sid = data["sid"];
                             let pageInstance = data["pageinstance"];
                             let from = 'http-detail'
                             console.log("plotOptions onclick : ", data, "sid", sid, "pageInstance", pageInstance);
                             //this.openPage({"sid": sid,"pageInstance" : pi}); 
                             this.router.navigate(['/page-detail/http-request'], { queryParams: { sid, pageInstance, from }, replaceUrl: true });
                           }
                          else
                           {
                             let sid = data["sid"];
                             let pageInstance = data["pageinstance"];
                             let from = 'http-detail'
                             console.log("plotOptions onclick : ", data ,"sid", sid, "pageInstance" , pageInstance);
                             //this.openPage({"sid": sid,"pageInstance" : pi}); 
                             this.router.navigate(['/page-detail/http-request'], { queryParams: { sid, pageInstance, from }, replaceUrl: true });
                           }
                }
            }},
        scatter: {
            marker: {
                radius: 3,
                states: {
                    hover: {
                        enabled: true,
                        lineColor: 'rgb(231, 76, 60)'
                    }
                }
            },
            turboThreshold : 10000,
            states: {
                hover: {
                    marker: {
                        enabled: true
                    }
                }
            },
           tooltip: {
                pointFormat: this.chartData.pointFormat
            }
        }
    },
    series : this.chartData.series,  
     credits: {
      enabled: false
  },
   exporting: {
        enabled: false
    }

} 
   this.mapdata.chartMap.highchart = this.options;
   this.ready = true;
  }

  submit(): void {

    // validate the custom time
    if (this.customTime[0] === null) {
      this.customTimeError = 'Start time cannot be greater than end time.';
      return;
    }

    if (new Date(this.customTime[0]).getTime() > new Date(this.customTime[1]).getTime()) {
      this.customTimeError = 'Start time cannot be greater than end time.';
      return;
    }

    this.customTimeError = '';

    //this.getSessions(true);
  }
  
  outlierChange()
  {
     if(isNaN(this.outlier))
     {
       //MsgService.error("Invalid Max Metric Value");
       return;
     }
     else if(this.outlier < 0)
     {
       //MsgService.error("Invalid Max Metric Value");
       return;
     }
     this.chartData = new HttpScatterGraphData(this.currentPerformanceMetric,this.httpscatterdata,this.currentMetricIndex,this.outlier);
     this.setOptions();
  }
 
  getBucketSize()
  {
    return ParseHttpFilters.httpFilters.bucketString;
  }
  updateBucket1(b)
  {
    let bucketSize = b.value;
    this.currentBucketSize = bucketSize;
    ParseHttpFilters.httpFilters.bucketString = bucketSize;
    this.offsetWindow = null;
  }
   // time string converted into seconds
   buckett = {
    "5 Minutes" : 5*60, 
    "15 Minutes" : 15 * 60,
    "30 Minutes" : 30 * 60,
    "1 Hour" : 3600,
    "4 Hours" : 3600 * 4,
    "1 Day" : 24 * 3600,
    "1 Week" : 7 * 24 * 3600,
    "1 Month" : 30 * 24 * 3600,
    "All" : 0
   }
  updateBucket(b)
  {
    this.currentBucketSize = b.value;
    ParseHttpFilters.httpFilters.limit = this.buckett[b.value];

    if(b.value !== 0)
     ParseHttpFilters.httpFilters.totalBuckets = Math.ceil(ParseHttpFilters.httpFilters.duration / this.buckett[b.value]);
    else
    {
     ParseHttpFilters.httpFilters.totalBuckets = 0;
     this.offsetWindow = null;
    }
    this.updateOffsetScatter(1);
  }
  updateOffsetScatter($event)
  {
    if(this.httpFilterMode){
    ParseHttpFilters.httpFilters.offset = $event;
    this.offsetWindow = [];
    let i = $event;
    if($event > 2)
      i = $event - 2;
    for(let n=1; i <= ParseHttpFilters.httpFilters.totalBuckets; i++,n++)
    {
      
      this.offsetWindow.push(i);
      if(n === 5)
         break;
    }
    this.getChartData();
    //this.setOptions();
   }
  } 

  
   updateMetric1(metricName,metricIndex)
  {
    this.currentPerformanceMetric = metricName;
    this.currentMetricIndex = metricIndex;
    this.chartData = new HttpScatterGraphData(this.currentPerformanceMetric,this.httpscatterdata,this.currentMetricIndex,this.outlier);

  }
  
   bucket  = "5 Minutes";
   buckets = [
   {label:"5 Minutes",value:"5 Minutes"},
   {label:"15 Minutes",value:"15 Minutes"},
   {label:"30 Minutes",value:"30 Minutes"},
   {label:"1 Hour",value:"1 Hour"},
   {label:"4 Hours",value:"4 Hours"},
   {label:"All",value:"All"}
  ];
 
  handleRowSelection($event) {
    this.selectedRow = $event.data;
    this.selectedRowIndex = $event.index;
    if (this.selectedRowIndex === undefined) {
       this.groupData.forEach((val, i) => {
         if (val === this.selectedRow) {
            this.selectedRowIndex = i;
            return true;
            
         }
       });
       this.selectedRowIndex = this.selectedRowIndex || 0;
    }
    
  }
  exportPdf() {
    // save current state of table. 
    const rows = this.session.rows;
    const first = this.session.first;
    this.session.rows = this.totalRecords;
    this.session.first = 0;

    setTimeout(() => {
      try {
        const doc = new jsPDF('p', 'pt', ExportUtil.getPageFormat(this.session.el.nativeElement));
        //autoTable(doc, {html: this.table.el.nativeElement});
        const jsonData = ExportUtil.generatePDFData(this.session.el.nativeElement, 1);
        console.log('session-page export json data - ', jsonData);
        autoTable(doc, jsonData);
        doc.save('http-filter.pdf');
      } catch(e) {
        console.error('error while exporting in pdf. error - ', e);
      }
      
      //revert back to previous state. 
      this.session.rows = rows;
      this.session.first = first;
    });
    
  }

  exportCSV() {
    // save current state of table. 
    const rows = this.session.rows;
    const first = this.session.first;
    this.session.rows = this.totalRecords;
    this.session.first = 0;

    setTimeout(() => {
      try {
        ExportUtil.exportToCSV(this.session.el.nativeElement, 1, 'session-page.csv');
      } catch(e) {
        console.error('Error while exporting into CSV');
      }

      //revert back to previous state. 
      this.session.rows = rows;
      this.session.first = first;
    });
  }

  exportExcel() {
    import('xlsx').then(xlsx => {
      // save the current state. 
      // get rows and first value. 
      const rows = this.session.rows;
      const first = this.session.first;

      this.session.rows = this.totalRecords;
      this.session.first = 0;
      setTimeout(() => {
        try {
          const jsonData = ExportUtil.getXLSData(this.session.el.nativeElement, 1);
          const worksheet = xlsx.utils.json_to_sheet(jsonData.data, {header: jsonData.headers, skipHeader: true});
          const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer);
        }catch(e) {
          console.error('error while exporting in xls, error - ', e);
        }

        //reset table properties. 
        this.session.rows = rows;
        this.session.first = first;
      });
    });
  }


  saveAsExcelFile(buffer: any): void {
    import('file-saver').then(FileSaver => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      // const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, 'session-page.xlsx');
    });
  }
  
  openMenu(menuOptions,$event,row){
    this.selectedRow = row;
    let oldLinks = [
      { label: 'Sessions' ,command : ()=>{this.ddrToSessions();} }
    ];
  
    let newLinks = [
      { label: 'Sessions' ,command : ()=>{this.ddrToSessions();} },
      //{ label : 'View Logs'}, // NF // todo: add the handling
      { label : 'View Flowpath', command : (event:any)=>{this.openNDFlowpath();}} // ND
    ]
    this.linkOptions = oldLinks;
    if(row.flowpathinstance != null  && row.flowpathinstance != -1 && row.flowpathinstance != 0)
     this.linkOptions = newLinks;
    menuOptions.toggle($event);
  }
  openNDFlowpath()
  {
     let st = parseInt(this.selectedRow.sessionstarttime);
     let et = parseInt(this.selectedRow.sessionendtime);
     st += this.nvconfigurations.cavEpochDiff;
     et += this.nvconfigurations.cavEpochDiff;
     
     this.ddrService.ndFlowpathDdr((st * 1000).toString(), (et * 1000).toString(), this.selectedRow.trnum + '',   this.selectedRow.flowpathinstance);
 }
 updateOffset(offset, limit) {
   
  // this.pagination = true;
   // set limit as per remaining counts. 
   ParseHttpFilters.httpFilters.limit = (this.totalRecords - offset > limit) ? limit : (this.totalRecords - offset);
   this.sessionsOffset = offset / limit;
   ParseHttpFilters.httpFilters.offset = offset;//(index) * parseInt(ParseSessionFilters.sessionFilters.limit+""); 
   this.loadXhrData(true);
   
 }
 onPageChange(e) {
  console.log("onPageChange called with : ", e);
}
 loadPagination(e: LazyLoadEvent) {
  this.loading = true;
  if (Object.keys(e.filters).length == 0) {
    this.updateOffset(e.first, e.rows);
    console.log('loadPagination');
    this.paginationEvent = e;
    this.loadXhrData(false);
    return;
  }

  this.first = this.sessionsOffset * this.limit;
  try{
    this.session.first = this.first;
  }catch(e){}
  

setTimeout(() => {
  // update offset only when first or rows are changed
  if (this.data.data) {
    this.groupDataTemp = this.data.data.filter((row) =>
      this.filterCol(row, e.filters)
    );
    this.groupDataTemp.sort(
      (a, b) => this.sortField(a, b, e.sortField) * e.sortOrder
    );
    this.groupData = [...this.groupDataTemp];
    this.loading = false;
  }
}, 0);


}
filterCol(row, filter) {
let isInFilter = false;
let noFilter = true;
for (var columnName in filter) {
  if (row[columnName] == null) {
    return;
  }
  noFilter = false;
  let rowValue: String = row[columnName].toString().toLowerCase();
  let filterMatchMode: String = filter[columnName].matchMode;
  if ( filterMatchMode.includes('contain') )
  {
    // 
    if(columnName === "browser")
    {
      rowValue = row[columnName].name.toString().toLowerCase();
    }
    else if(columnName === "os")
    {
      rowValue = row[columnName].toString().toLowerCase();
    }
    else if(columnName === "devicetype")
     {
       rowValue = row[columnName].name.toString().toLowerCase();
     }
     else if(columnName === "mobileCarrier")
     {
       rowValue = row[columnName].name.toString().toLowerCase();
     }
    else if(columnName === "terminalid")
    {
        rowValue = row[columnName].toString().toLowerCase();
     }
     else if(columnName=== "store")
     {
       rowValue = row[columnName].name.toString().toLowerCase();
     }
    else if(columnName === "location")
    {
      let a = row;
      if((a.location.state === undefined || a.location.state === "") )
         rowValue = a.location.country;
      if((a.location.state !== undefined || a.location.state !== "" ))
         rowValue = a.location.state +","+ a.location.country;
      else
        rowValue = a.location.state; 
      rowValue = rowValue.toLowerCase();
    }
    if(rowValue.includes(filter[columnName].value.toLowerCase()))
      isInFilter = true
  } else if (
    filterMatchMode.includes('custom') &&
    rowValue.includes(filter[columnName].value)
  ) {
    isInFilter = true;
  }
}
if (noFilter) {
  isInFilter = true;
}
return isInFilter;
}



sortField(rowA, rowB, field: string): number {
if (rowA[field] == null) return 1;
if (typeof rowA[field] === 'string') {
  return rowA[field].localeCompare(rowB[field]);
}
if (typeof rowA[field] === 'number') {
  if (rowA[field] > rowB[field]) return 1;
  else return -1;
}
}
customSort(event) {
  if(!event) return;
this.changeSort(event);
}

/***Sorting */
sclick = 0;
iclick = 0;

changeSort(event) {
this.sclick = event.sortOrder;
this.iclick = event.sortOrder;
 if (event.sortField === "browser") {
  if (this.iclick == -1) {
    this.iclick = 1;
    this.data.data.sort(this.icompare);
  }
  else {
    this.iclick = -1;
    this.data.data.sort(this.icompare2);
  }
  this.groupData = [...this.data.data];
}
else if (event.sortField === "os") {
  if (this.iclick === -1) {
    this.iclick = 1;
    this.data.data.sort(this.oscompare);
  }
  else {
    this.iclick = -1;
    this.data.data.sort(this.oscompare2);
  }
  this.groupData = [...this.data.data];
}else if(event.sortField === "store")
{
  if(this.iclick === -1)
  {
   this.iclick = 1;
   this.data.data.sort(this.storecompare);
  }
  else
  {
    this.iclick = -1;
    this.data.data.sort(this.storecompare1);
  }
   this.groupData = [...this.data.data];
 }
else if(event.sortField === "terminalid")
 {
  if(this.iclick === -1)
  {
   this.iclick = 1;
   this.data.data.sort(this.terminalcompare);
  }
  else
  {
    this.iclick = -1;
    this.data.data.sort(this.terminalcompare1);
  }
   this.groupData = [...this.data.data];
 }
else if(event.sortField === "devicetype")
{
 if(this.iclick === -1)
 {
  this.iclick = 1;
  this.data.data.sort(this.devicecompare);
 }
 else 
 {
   this.iclick = -1;
   this.data.data.sort(this.devicecompare2);
 }
  this.groupData = [...this.data.data];
}
else if(event.sortField === "location")
{
 if(this.iclick === -1)
 {
  this.iclick = 1;
  this.data.data.sort(this.locationcompare);
 }
 else 
 {
   this.iclick = -1;
   this.data.data.sort(this.locationcompare2);
 }
  this.groupData = [...this.data.data];
}
 else {
  this.data.data.sort(
    (a, b) => this.sortField(a, b, event.sortField) * event.sortOrder
  );
  this.groupData = [...this.data.data];
}

}

icompare(a, b) {
if ((a.browserVersion === undefined || a.browserVersion === "") && (b.browserVersion === undefined || b.browserVersion === ""))
  return (a.browser.name < b.browser.name) ? -1 : (a.browser.name > b.browser.name) ? 1 : 0;
else
  return ((a.browser.name.localeCompare(b.browser.name)) || (a.browserVersion.localeCompare(b.browserVersion)));
}

icompare2(a, b) {
if ((b.browserVersion === undefined || b.browserVersion === "") && (a.browserVersion === undefined || b.browserVersion === ""))
  return (b.browser.name < a.browser.name) ? -1 : (b.browser.name > a.browser.name) ? 1 : 0;
else
  return ((b.browser.name.localeCompare(a.browser.name)) || (b.browserVersion.localeCompare(a.browserVersion)));
}

oscompare(a, b) {
if ((a.mobileOSVersion != '' && a.mobileOSVersion != null && a.mobileOSVersion != 'null') && (b.mobileOSVersion != '' && b.mobileOSVersion != null && b.mobileOSVersion != 'null'))

  return ((a.os.name.localeCompare(b.os.name)) || (a.mobileOSVersion.localeCompare(b.mobileOSVersion)));
if ((a.mobileOSVersion == '' || a.mobileOSVersion == null || a.mobileOSVersion == 'null') && (b.mobileOSVersion == '' || b.mobileOSVersion == null || b.mobileOSVersion != 'null'))
  return (a.os.name < b.os.name) ? -1 : (a.os.name > b.os.name) ? 1 : 0;
}
oscompare2(a, b) {
if ((b.mobileOSVersion != '' && b.mobileOSVersion != null && b.mobileOSVersion != 'null') && (a.mobileOSVersion != '' && a.mobileOSVersion != null && a.mobileOSVersion != 'null'))

  return ((b.os.name.localeCompare(a.os.name)) || (b.mobileOSVersion.localeCompare(a.mobileOSVersion)));
if ((b.mobileOSVersion == '' || b.mobileOSVersion == null || b.mobileOSVersion == 'null') && (a.mobileOSVersion == '' || a.mobileOSVersion == null || a.mobileOSVersion == 'null'))
  return (b.os.name < a.os.name) ? -1 : (b.os.name > a.os.name) ? 1 : 0;
}
storecompare(a,b)
{
if ((parseInt(a.store.name)) < (parseInt(b.store.name)))
return -1;
if ((parseInt(a.store.name)) > (parseInt(b.store.name)))
return 1;
return 0;
}

storecompare1(a,b)
{
if ((parseInt(a.store.name)) < (parseInt(b.store.name)))
return 1;
if ((parseInt(a.store.name)) > (parseInt(b.store.name)))
return -1;
return 0;
}

terminalcompare(a,b)
{
if ((parseInt(a.terminalid)) < (parseInt(b.terminalid)))
return -1;
if ((parseInt(a.terminalid)) > (parseInt(b.terminalid)))
return 1;
return 0;
}

terminalcompare1(a,b)
{
if ((parseInt(a.terminalid)) < (parseInt(b.terminalid)))
return 1;
if ((parseInt(a.terminalid)) > (parseInt(b.terminalid)))
return -1;
return 0;
}
devicecompare(a,b)
{
return (a.devicetype.name.localeCompare(b.devicetype.name)) ;
}

devicecompare2(a,b)
{
return (b.devicetype.name.localeCompare(a.devicetype.name));
}

locationcompare(a,b)
{
if((a.location.state === undefined || a.location.state === "") && (b.location.state === undefined || b.location.state === "") )
return  (a.location.country < b.location.country) ? -1 : (a.location.country > b.location.country) ? 1 : 0;
if((a.location.state === undefined || a.location.state === "") && (b.location.state !== undefined || b.location.state === "" ))
return (a.location.country < b.location.state) ? -1 : (a.location.country > b.location.state) ? 1 : 0;
if((a.location.state !== undefined || a.location.state !== "" ) && ( b.location.state === undefined || b.location.state === "" ) )
return  (a.location.state < b.location.country) ? -1 : (a.location.state > b.location.country) ? 1 : 0;
else
return (a.location.state < b.location.state) ? -1 : 1;
}

locationcompare2(a,b)
{
if((a.location.state === undefined || a.location.state === "") && (b.location.state === undefined || b.location.state === ""))
return  (a.location.country < b.location.country) ? 1 : (a.location.country > b.location.country) ? -1 : 0;
if((a.location.state === undefined || a.location.state === "") && (b.location.state !== undefined || b.location.state === "" ))
return (a.location.country < b.location.state) ? 1 : (a.location.country > b.location.state) ? -1 : 0;
if((a.location.state !== undefined || a.location.state !== "" ) && ( b.location.state === undefined || b.location.state === "" ))
return  (a.location.state < b.location.country) ? 1 : (a.location.state > b.location.country) ? -1 : 0; 
else
return (a.location.state < b.location.state) ? 1 : -1;
}

compare(a,b) {

if ((new Date(a.timestamp).getTime()) < (new Date(b.timestamp).getTime()))
return -1;
if ((new Date(a.timestamp).getTime()) > (new Date(b.timestamp).getTime()))
return 1;
return 0;
}

compare1(a,b){ 
if ((new Date(a.timestamp).getTime()) < (new Date(b.timestamp).getTime()))
return 1;
if ((new Date(a.timestamp).getTime()) > (new Date(b.timestamp).getTime()))
return -1;
return 0;
}

handlingNDSessions(e)  {
	//console.log("handlingNDSessions " , e);
/*	let filterCriteria = [];
	if(e == true)  {
          ParseHttpFilters.httpFilters.sessionWithND = e;
	  filterCriteria.push(new ViewFilter('Call(s)WithND', 'true', null));
	  this.sessionWithND = e;
      	}
	else {
	  ParseHttpFilters.httpFilters.sessionWithND = e;
	  this.sessionWithND = e;
	  filterCriteria = [];
	}
	this.router.navigate([''],{ queryParams: { filterCriteria:  JSON.stringify(ParseHttpFilters.httpFilters),filterCriteriaList:JSON.stringify(filterCriteria) }, replaceUrl : true} );*/
  } 

  ddrToSessions(){
    this.router.navigate(['/sessions-details'], { queryParams: { sid: this.selectedRow.sid, from: 'http-detail', filter: this.filter }, replaceUrl: true });
  }

  applySmartSearchFilter(force: boolean = false) {
    
    if (!force && (!this.smartSearchInput || !this.smartSearchInput.length)) {
      console.log('No Smart Filter selected. ');
      return;
    }
    this.smartSearchFilterApplied = true;
  
    ParseHttpFilters.httpFilters.limit = 15;
    ParseHttpFilters.httpFilters.offset =  0; 


    // parse smartsearch filters. 
    this.parseFilter();
  
    // reset pagination flag. 
    //this.pagination = false;
  
    this.loadXhrData(false);
  }

  ngOnDestroy(): void { 
    this.stateService.setAll({
      'http.rows': ParseHttpFilters.httpFilters.limit,
      'http.first': ParseHttpFilters.httpFilters.offset,
      'http.totalRecords': this.totalRecords,
      'http.data': this.groupData,
      prevRoute: 'http-detail'
    }); 
  }
  
}
