import { Component, Input, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent, MenuItem, MessageService, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { Metadata } from '../common/interfaces/metadata';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
import { NVAppConfigService } from '../common/service/nvappconfig.service';
import { JSErrorData } from '../common/interfaces/jserrordata';
import { JSERROR_DETAIL_FILTER_TABLE } from './service/jserror-detail.dummy';
import { JsErrorAggFilterTable, JsErrorAggFilterTableHeaderColumn } from './../js-error-filter/service/js-error.model';
import { ParseSessionFilters } from '../common/interfaces/parsesessionfilters'
import { JsErrorService } from './../js-error-filter/service/js-error.service';
import { JsErrorAggListLoadedState, JsErrorAggListLoadingErrorState, JsErrorAggListLoadingState } from './../js-error-filter/service/js-error.state';
import { ParsePagePerformanceFilters } from '../common/interfaces/parsepageperformancefilter';
import * as moment from 'moment';
import { JsErrorDetailData } from '../common/interfaces/jserror-detail-data';
import { NvhttpService, NVPreLoadingState, NVPreLoadedState, NVPreLoadingErrorState } from '../common/service/nvhttp.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { Table } from 'primeng';
//import { TimeFilter } from '../common/interfaces/timefilter';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExportUtil } from '../common/util/export-util';

@Component({
  selector: 'app-jserror-detail',
  templateUrl: './jserror-detail.component.html',
  styleUrls: ['./jserror-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class JsErrorDetailComponent implements OnInit {

  @ViewChild('session') session: Table ;
  paginationEvent:any;
  data: JsErrorAggFilterTable;
  error: AppError;
  loading: boolean = false;
  empty: boolean;
  ischecked: boolean = false;
  key: string;
  cols: JsErrorAggFilterTableHeaderColumn[];
  selected: boolean = false;
  totalRecords = 0;
  downloadOptions: MenuItem[];
  _selectedColumns: JsErrorAggFilterTableHeaderColumn[] = [];
  emptyTable: boolean;
  globalFilterFields: string[] = [];
  filter: any;
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
  sessions : any;

  filterCriteria : any = '';
  groupData = [];
  groupDataTemp = [];
  first : number = 0;
  parsepagefilter: ParsePagePerformanceFilters; 
  filterCriterialist: ParsePagePerformanceFilters;
  metadata: Metadata = null;
  breadcrumb: BreadcrumbService;
   rowdata: any;   
  countLoading: boolean = false;
  

  constructor(private jserrorService : JsErrorService, private metadataService : MetadataService, private router: Router,private route : ActivatedRoute, private messageService: MessageService, private nvhttpService : NvhttpService, breadcrumb: BreadcrumbService) {
    this.breadcrumb = breadcrumb;
   }

  ngOnInit(): void {
    const me = this;
    me.data = {...JSERROR_DETAIL_FILTER_TABLE};
  

    me.route.queryParams.subscribe(params=>{
      console.log("params in jserror detail : ", params);
      this.filter = params['filterCriteria'];
      this.metadataService.getMetadata().subscribe(metadata => {
        this.metadata = metadata;
        this.getInitData(this.filter);
        this.loadXhrData(true);
        });
    });

   // set breadcrumb.
   this.breadcrumb.add({label: 'JSErrors', routerLink: '/jserror-detail', queryParams: {...this.route.snapshot.queryParams}} as MenuItem);
   me.downloadOptions = [
    { label: 'CSV', command: () => { this.exportCSV(); } },
    { label: 'Excel', command: () => { this.exportExcel(); } },
    { label: 'PDF', command: () => { this.exportPdf(); } }
  ];
    me.multiOptions = [
      {label: 'Audi', value: 'Audi'},
      {label: 'BMW', value: 'BMW'},
      {label: 'Fiat', value: 'Fiat'},
      {label: 'Ford', value: 'Ford'},
  ],
  me.linkOptions = [
  { label: 'Sessions', command: (event: any) => { this.rowClicked(); } }
  ],
    me.analyticsOptions = [
      { label: 'Page Performance Overview', routerLink: '/page-performance-overview' },
      { label: 'Revenue Analytics' ,routerLink: '/revenue-analytics' },
      { label: 'Ux Agent Setting' ,routerLink: '/ux-agent-setting' },
      { label: 'Custom Metrics' },
      { label: 'Path Analytics', routerLink: '/path-analytics' },
      { label: 'Form Analytics' },
      { label: 'Marketing Analytics',routerLink: '/marketing-analytics' }
    ]

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }


  @Input() get selectedColumns():JsErrorAggFilterTableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: JsErrorAggFilterTableHeaderColumn[]) {
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
 /* loadPagination(event: LazyLoadEvent){
    console.log("loadPagination : " , JSON.stringify(event));
    this.parsepagefilter.pagePerformanceFilters.limit = event.rows;
     this.parsepagefilter.pagePerformanceFilters.offset = event.first;
     this.loadXhrData(false);
  }*/
  loadXhrData(count){
    console.log("loadXHRData called with flag : ", count);
    console.count('callcount');
    this.parsepagefilter.pagePerformanceFilters.count = false;
    const me = this;
    this.nvhttpService.getJSErrorDetails( this.parsepagefilter.pagePerformanceFilters).subscribe(
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

 openMenu(menuOptions, $event, row) {
    this.rowdata = row;
    menuOptions.toggle($event);
  }

  private onLoading(state: JsErrorAggListLoadingState) {
    const me = this;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: JsErrorAggListLoadingErrorState) {
    const me = this;
    me.empty = false;
    me.loading = false;
    me.error = state.error;
   // me.error.msg = "Error while loading data.";
  }

  private onLoaded(state: JsErrorAggListLoadedState , count:boolean) {
    const me = this;
    const reserror = state.data['error'];
    if (reserror !== '' && reserror !== undefined && reserror !== 'NA') {
      console.log('error in data : ', reserror);
      me.error = {};
      me.error['msg'] = reserror;
      return;
      //this.messageService.add({ severity: 'info', summary: reserror, detail: '' });
      //state.data.data = [];
      // me.error.msg = state.data['error'];
    }
    me.metadataService.getMetadata().subscribe(metadata => {
      me.metadata=metadata;
      me.data = JSERROR_DETAIL_FILTER_TABLE;
      if(state.data.data == "NA") 
      {
        state.data.data =[];
      }

      me.data.data =[]; 
      let a = null;
      let counter = 0;
      for(var i = 0 ; i < state.data.data.length; i++){
        a =  new JsErrorDetailData(state.data.data[i], metadata);
        a['counter'] = counter++;
        me.data.data.push(a);
      }
      if(count && me.data.data.length >= this.parsepagefilter.pagePerformanceFilters.limit){
        console.log("calling getXhrDataCount from onloaded");
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
   this.countLoading= true;
    const me = this;
    this.parsepagefilter.pagePerformanceFilters.count = true;
    //let filter  = JSON.stringify(this.parsepagefilter.pagePerformanceFilters);
    me.nvhttpService.getJSErrorDetails( (this.parsepagefilter.pagePerformanceFilters)).subscribe(
    //me.jserrorService.LoadJsErrorAggListTableData(filter).subscribe(
      (state: Store.State) => {
  
      
        if (state instanceof NVPreLoadedState) {
          me.totalRecords = state.data['count']; 
          this.countLoading = false;
          // reset 
          if(state instanceof NVPreLoadingErrorState){
                      console.log("Error fetching count data");
                      return;
                   }
                  }
       
      },
      (err) =>{
        console.log("Error fetching count data");

      }
      );
  }
 applyFilter(filters : any){
   console.log("applyfilter of filter called : ", filters);
   this.parsepagefilter = filters;
   this.parsepagefilter.pagePerformanceFilters.limit = 15;
   this.parsepagefilter.pagePerformanceFilters.offset = 0;
   this.loadXhrData(true);
 }
 rowClicked()
   {
     let sid = this.rowdata.sid;
     this.router.navigate(['/sessions-details'], { queryParams: { sid: sid, from: 'js-error-detail', filter: this.filter }, replaceUrl: true });
    //this.breadCrumbService.removeBreadCrumb('JSError Detail',NVBreadCrumbService.currentBreadInfo.seq);
   //ParseSessionFilters.sessionFilters.timeFilter = new TimeFilter();
   /*
 ParseSessionFilters.sessionFilters.timeFilter = this.parsepagefilter.pagePerformanceFilters.timeFilter;
 ParseSessionFilters.sessionFilters.autoCommand.nvSessionId = sid;
 ParseSessionFilters.sessionFilters.autoCommand.pageTab.jserrorflag.jsError = true;
 ParseSessionFilters.sessionFilters.autoCommand.nvSessionId = sid;
 ParseSessionFilters.sessionFilters.autoCommand.particularPage = true;
 ParseSessionFilters.sessionFilters.autoCommand.pageinstance = pageinstance;
  this.router.navigate(['/home-sessions'],{ queryParams: { filterCriteria: JSON.stringify(ParseSessionFilters.sessionFilters),random:Math.random()}} );
  this.router.navigate(['/home-sessions'],{ queryParams: { filterCriteria: JSON.stringify(ParseSessionFilters.sessionFilters),random:Math.random()}, replaceUrl : true} );
    */
   }  
   getInitData(filter){
   
    this.parsepagefilter = new ParsePagePerformanceFilters();
    //this.metadataService.getMetadata().subscribe(metadata => {
      //this.metadata=metadata;
     /* if(filter === undefined || filter === null || filter.length == 0)
      {
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
      this.parsepagefilter.pagePerformanceFilters.timeFilter.startTime =  startT;
      this.parsepagefilter.pagePerformanceFilters.timeFilter.endTime =  endT;
     // this.parsepagefilter.pagePerformanceFilters.channels = "-1";
      //this.parsepagefilter.pagePerformanceFilters.limit = 15;
      //this.parsepagefilter.pagePerformanceFilters.offset = 0;
     // this.loadXhrData(true); 
      
    //});
    let selectedChannel = null;
    let chm: any[] =  Array.from(this.metadata.channelMap.keys());
    let cn = null;
    if(chm.length > 0)
    {
      selectedChannel = this.metadata.channelMap.get(chm[0]).id.toString();
      cn = this.metadata.channelMap.get(chm[0]).name;
    }
    this.parsepagefilter.pagePerformanceFilters.channels = "-1";
    this.parsepagefilter.pagePerformanceFilters.limit = 15;
    this.parsepagefilter.pagePerformanceFilters.offset = 0;
    //this.getDataForTable(true); 
    
      //});
   }
   else
    {
     try{
       //ParseJSErrors.jsErrors =  JSON.parse(decodeURIComponent(filter));
       this.filterCriterialist = JSON.parse(decodeURIComponent(filter));
       this.parsepagefilter.pagePerformanceFilters = JSON.parse(decodeURIComponent(filter)).pagePerformanceFilters;
       console.log('filtercriteria'+ this.filterCriterialist);
     }
     catch(e) {}
   //let filc =  JSON.parse(decodeURIComponent(filter));
   // let filc =  JSON.parse(decodeURIComponent(filter));
   // this.filterCriterialist = JSON.parse(decodeURIComponent(filter)); 
   // ParseHttpFilters.httpFilters = JSON.parse(decodeURIComponent(filter));
    //ParseJSErrors.jsErrors.limit = 15;
    //ParseJSErrors.jsErrors.offset =  0;
    this.parsepagefilter.pagePerformanceFilters.limit = 15;
    this.parsepagefilter.pagePerformanceFilters.offset =  0;
    /*if(AppComponent.filters.channel != null)
     {
       //ParseJSErrors.jsErrors.channel  = "" + AppComponent.filters.channel.id;
     }
     if(AppComponent.filters.userSegment != null)
     {
       //ParseJSErrors.jsErrors.channel  = "" + AppComponent.filters.userSegment.id;
     }
     
  }
  this.loadXhrData(true);  */
  // show overall graph

  //init
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
      this.parsepagefilter.pagePerformanceFilters.timeFilter.startTime =  startT;
      this.parsepagefilter.pagePerformanceFilters.timeFilter.endTime =  endT;

      this.parsepagefilter.pagePerformanceFilters.channels  = undefined;
      this.parsepagefilter.pagePerformanceFilters.userSegments  = undefined;

      let selectedChannel = null;
      let chm: any[] =  Array.from(this.metadata.channelMap.keys());
      let cn = null;
      if(chm.length > 0)
      {
        selectedChannel = this.metadata.channelMap.get(chm[0]).id.toString();
        cn = this.metadata.channelMap.get(chm[0]).name;
      }
      this.parsepagefilter.pagePerformanceFilters.channels = "-1";

    }
    else
    {
       try{
        this.parsepagefilter.pagePerformanceFilters =  JSON.parse(decodeURIComponent(filter));
        
       }
       catch(e) {}
      let filc =  JSON.parse(decodeURIComponent(filter));
    }

  }

    loadPagination(e: LazyLoadEvent) {
      this.loading = true;
      if (Object.keys(e.filters).length == 0) {
      this.parsepagefilter.pagePerformanceFilters.limit = e.rows;
      this.parsepagefilter.pagePerformanceFilters.offset = e.first;
  
      console.log('loadPagination');
      this.paginationEvent = e;
        this.loadXhrData(false);
        return;
  
  
  
    }
  
     //console.log('loadPagination');
      // this.getDataForTable();
      // in case of filters, first may got reset. update that. 
      // update first. 
      
      this.first = this.parsepagefilter.pagePerformanceFilters.offset * this.parsepagefilter.pagePerformanceFilters.limit;
      this.session.first = this.first;
      
  
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
          rowValue = row[columnName].name.toString().toLowerCase();
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
    else if(event.sortField === "terminal")
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
    else if(event.sortField === "deviceType")
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
 if ((parseInt(a.store.id)) < (parseInt(b.store.id)))
   return -1;
 if ((parseInt(a.store.id)) > (parseInt(b.store.id)))
   return 1;
 return 0;
}

storecompare1(a,b)
{
 if ((parseInt(a.store.id)) < (parseInt(b.store.id)))
   return 1;
 if ((parseInt(a.store.id)) > (parseInt(b.store.id)))
   return -1;
 return 0;
}

terminalcompare(a,b)
{
 if ((parseInt(a.terminalId)) < (parseInt(b.terminalId)))
   return -1;
 if ((parseInt(a.terminalId)) > (parseInt(b.terminalId)))
   return 1;
 return 0;
}

terminalcompare1(a,b)
{
 if ((parseInt(a.terminalId)) < (parseInt(b.terminalId)))
   return 1;
 if ((parseInt(a.terminalId)) > (parseInt(b.terminalId)))
   return -1;
 return 0;
}
devicecompare(a,b)
{
 console.log(a,b);
return (a.deviceType.name.localeCompare(b.deviceType.name)) ;
}

devicecompare2(a,b)
{
 return (b.deviceType.name.localeCompare(a.deviceType.name));
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

if ((new Date(a.formattedStartTime).getTime()) < (new Date(b.formattedStartTime).getTime()))
  return -1;
if ((new Date(a.formattedStartTime).getTime()) > (new Date(b.formattedStartTime).getTime()))
  return 1;
return 0;
}

compare1(a,b){ 
 if ((new Date(a.formattedStartTime).getTime()) < (new Date(b.formattedStartTime).getTime()))
  return 1;
if ((new Date(a.formattedStartTime).getTime()) > (new Date(b.formattedStartTime).getTime()))
  return -1;
return 0;
}

exportPdf() {
  // save current state of table. 
  const rows = this.totalRecords;
  const first = this.session.first;
  this.session.rows = this.totalRecords;
  this.session.first = 0;

  setTimeout(() => {
    try {
      const doc = new jsPDF('p', 'pt', ExportUtil.getPageFormat(this.session.el.nativeElement));
      //autoTable(doc, {html: this.table.el.nativeElement});
      const jsonData = ExportUtil.generatePDFData(this.session.el.nativeElement, 1);
      console.log('jserror-detail export json data - ', jsonData);
      autoTable(doc, jsonData);
      doc.save('jserror-detail.pdf');
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
  const rows = this.totalRecords;
  const first = this.session.first;
  this.session.rows = this.totalRecords;
  this.session.first = 0;

  setTimeout(() => {
    try {
      ExportUtil.exportToCSV(this.session.el.nativeElement, 1, 'jserror-detail.csv');
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
    const rows = this.totalRecords;
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
    FileSaver.saveAs(data, 'jserror-detail.xlsx');
  });
}

  

   

}
