import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { AUTOCOMPLETE_DATA } from '../../service/home-sessions.dummy';
import { AutoCompleteData } from '../../service/home-sessions.model';
import { PAGE_TABLE } from './service/os.dummy';
import { PageTable } from './service/os.model';
import { Store } from 'src/app/core/store/store';
import { HomePageTabLoadingState,HomePageTabLoadingErrorState,HomePageTabLoadedState } from './service/os-service.state'
import { PageTabService } from './service/ostab.service';
import { ParsePagePerformanceFilters } from './../../common/interfaces/parsepageperformancefilter';
import { Metadata } from '../../common/interfaces/metadata';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
import * as moment from 'moment';
import 'moment-timezone';
import { PagePerformanceFilter_TABLE } from '../page/page-performance-filter/service/page.dummy';
import { PageFilterTable } from '../page/page-performance-filter/service/page.model';
import { PagePerformanceOverviewService } from '../page-performance-overview.service';
import { Util } from '../../common/util/util';
@Component({
  selector: 'app-os',
  templateUrl: './os.component.html',
  styleUrls: ['./os.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OsComponent implements OnInit {
  datapagefilter: PageFilterTable;
  breadcrumb: MenuItem[] = [];
   msg: any = [];
  activeTab: MenuItem;
  filterforcompare = this.getinitfilter();
  pagedetailinfo : any ={};
  data: PageTable;
  totalRecords = 0;
  isShowPerformancedetail: boolean = false;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;

  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];

  downloadOptions: MenuItem[];
  analyticsOptions: MenuItem[];
  alertSetting: MenuItem[];
  searchOptions: SelectItem[];
  selectedRow: any;
  isEnabledColumnFilter: boolean;

  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  isShowComparePerformance: boolean = false;
  isShowPerformance: boolean = false;
  isShowResourcePerformance: boolean = false;
  isShowAll: boolean = true;
  isShowDomainPerformance: boolean = false;

  autoCompleteList: AutoCompleteData
  filteredReports: any[];
  reportitem: any[];
  enableChart:boolean = false;

  @Output() rowClick = new EventEmitter<boolean>();
  @Output() rowClick1 = new EventEmitter<boolean>();
  metadata: Metadata = null;
  constructor(private PagePerformanceOverviewService: PagePerformanceOverviewService,private router: Router,private pageTabService : PageTabService,private metadataService: MetadataService) {
   this.metadataService.getMetadata().subscribe(metadata => {
     this.metadata = metadata;
  });
  }

  ngOnInit(): void {
    this.metadataService.getMetadata().subscribe(metadata => {
      this.metadata = metadata;
 });
    const me = this;
    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ];
    me.alertSetting = [
      {
        label: 'Alert Maintenance',
        routerLink: ['/alert-maintenance'],
      },
      {
        label: 'Alert Settings',
        routerLink: ['/alert-configure'],
      },
    ];
    me.searchOptions = [
      { label: 'All', value: 'all' },
      { label: 'Active', value: 'active' },
    ];
    me.analyticsOptions = [
      { label: 'Page Performance Overview', routerLink: '/page-performance-overview' },
      { label : 'Page Performance Detail', routerLink: '/performance-details' },
      { label: 'Revenue Analytics', routerLink: '/revenue-analytics' },
      { label: 'Custom Metrics' },
      { label: 'Path Analytics' },
      { label: 'Form Analytics' },
      { label: 'Marketing Analytics' }
    ]

    me.autoCompleteList = AUTOCOMPLETE_DATA;

    me.data = PAGE_TABLE;
    //this.totalRecords = me.data.data.length;
    for (let i = 0; i < me.data.headers[0].cols.length; i++) {
      me.data.headers[0].cols[i]["header"] = me.data.headers[0].cols[i].label;
    }
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.field);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    me.datapagefilter = PagePerformanceFilter_TABLE;
  if (me.datapagefilter.filtercriteria)
     {
      if (me.datapagefilter.filtercriteria.showFilter) {
        let compareflag = me.datapagefilter.filtercriteria.showFilter.toggle;
        if (compareflag == false) {
          this.isShowAll = false;
          this.isShowPerformance = false;
          this.isShowResourcePerformance = false;
          this.isShowDomainPerformance = false;
          this.isShowComparePerformance = true;
	this.filterforcompare = me.datapagefilter.filtercriteria.pagePerformanceFilters;
          this.rowClick.emit(this.isShowAll);
        }
        else{
 		this.filterforcompare = me.datapagefilter.filtercriteria.pagePerformanceFilters;
          me.loadPagePerformanceData(me.datapagefilter.filtercriteria.pagePerformanceFilters);
       }
      }
      else
        me.loadPagePerformanceData(me.datapagefilter.filtercriteria.pagePerformanceFilters);
    }
    else {
      let filtercriteria: any = {};
      filtercriteria = this.getinitfilter();
      me.loadPagePerformanceData(filtercriteria);
    }
  }
  showPerformanceDetails() {
    this.isShowAll = false;
    this.isShowPerformance = false;
    this.isShowResourcePerformance = false;
    this.isShowDomainPerformance = false;
    this.isShowComparePerformance = false;
    this.isShowPerformancedetail = true;
    this.rowClick.emit(this.isShowAll);
    this.PagePerformanceOverviewService.broadcast('closeChild', false);
	}

  getinitfilter()
  {
    let parsepagefilter = null;
    parsepagefilter = new ParsePagePerformanceFilters();
    
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
    parsepagefilter.pagePerformanceFilters.timeFilter.startTime = Util.convertLocalTimeZoeToUTC(startT);
    parsepagefilter.pagePerformanceFilters.timeFilter.endTime = Util.convertLocalTimeZoeToUTC(endT);
    return parsepagefilter.pagePerformanceFilters;
  }	
  pageperformancefilter(parsepagefilter : string)
  {
    console.log("addItem :", parsepagefilter);
    let filtercriteria = JSON.parse(parsepagefilter);
    this.filterforcompare  = filtercriteria.pagePerformanceFilters;
    let cmptoggle = filtercriteria.showFilter.toggle;
    if (cmptoggle == false) {
      this.isShowAll = false;
      this.isShowPerformance = false;
      this.isShowResourcePerformance = false;
      this.isShowDomainPerformance = false;
      this.isShowComparePerformance = true;
      this.rowClick.emit(this.isShowAll);
    }
    this.loadPagePerformanceData(filtercriteria.pagePerformanceFilters);
  }
  loadPagePerformanceData(filtercriteria)
  {
    console.log("loadPagePerformanceData method start");
    const me = this;
    //me.graphInTreeService.load(payload).subscribe(
    me.pageTabService.LoadPageTabData(filtercriteria).subscribe(
      (state: Store.State) => {
        console.log(" state : ", state);
        if (state instanceof HomePageTabLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {
          me.onLoaded(state);
          return;
        }
        if (state instanceof HomePageTabLoadingErrorState) {
          me.onLoadingError(state);
          return;
        }

      },
      (state: HomePageTabLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }
   
  private onLoading(state: HomePageTabLoadingState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: HomePageTabLoadingErrorState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = state.error;
    me.loading = false;
  }

  private processxgraphData(xaxisnamearr) {
    let xaxisname = [];
    for(let i =0; i < xaxisnamearr.length; i++)
     {
       let count = xaxisnamearr[i].pagecount.toLocaleString();
       let obj= xaxisnamearr[i].osall +"( " + count + " )";
       xaxisname.push(obj)
     }
     return xaxisname;
  }
  private processygraphData(yaxisdtarr) {
    let series = [];
    console.log("processygraphData method start : ",yaxisdtarr);
    series.push({"name" : "onLoad", "pointWidth": 15,"data" : []});
    series.push({"name" : "Dom Interactive", "pointWidth": 15,"data" : []});
    series.push({"name" : "Time to Domcontent Loaded","pointWidth": 15, "data" : []});
    series.push({"name" : "Server Response", "pointWidth": 15,"data" : []});
    series.push({"name" : "First Byte","visible": false ,"pointWidth": 15,"data" : []});
    series.push({"name" : "Perceived Render ","visible": false ,"pointWidth": 15,"data" : []});
    series.push({"name" : "DNS Time","visible": false ,"pointWidth": 15,"data" : []});
    series.push({"name" : "Secure","visible": false ,"pointWidth": 15,"data" : []});
    series.push({"name" : "Cache","visible": false ,"pointWidth": 15,"data" : []});
    series.push({"name" : "Connection","visible": false ,"pointWidth": 15,"data" : []});
    series.push({"name" : "Network","visible": false ,"pointWidth": 15,"data" : []});
    series.push({"name" : "Exit PCT","visible": false ,"pointWidth": 15,"data" : []});
    series.push({"name" : "First Paint","visible": false ,"pointWidth": 15,"data" : []});
    series.push({"name" : "First Content Paint","visible": false ,"pointWidth": 15,"data" : []});
    series.push({"name" : "Time to Interactive","visible": false ,"pointWidth": 15,"data" : []});
    series.push({"name" : "First Input Delay","visible": false ,"pointWidth": 15,"data" : []});
 
    for(let i =0; i < yaxisdtarr.length; i++)
   {
     
     series[0].data.push(parseFloat(yaxisdtarr[i].timetoload));
     series[1].data.push(parseFloat(yaxisdtarr[i].dominteractivetime));
     series[2].data.push(parseFloat(yaxisdtarr[i].domcomplete));
     series[3].data.push(parseFloat(yaxisdtarr[i].servertime));
     series[4].data.push(parseFloat(yaxisdtarr[i].firstbyte));
     series[5].data.push(parseFloat(yaxisdtarr[i].perceivedrendertime));
     series[6].data.push(parseFloat(yaxisdtarr[i].dnstime));
     series[7].data.push(parseFloat(yaxisdtarr[i].secure));
     series[8].data.push(parseFloat(yaxisdtarr[i].cache));
     series[9].data.push(parseFloat(yaxisdtarr[i].connectiontime));
     series[10].data.push(parseFloat(yaxisdtarr[i].network));
     series[11].data.push(parseFloat(yaxisdtarr[i].exitlt));
     series[12].data.push(parseFloat(yaxisdtarr[i].firstpaint_count));
     series[13].data.push(parseFloat(yaxisdtarr[i].first_content_paint_count));
     series[14].data.push(parseFloat(yaxisdtarr[i].time_to_interactive_count));
     series[15].data.push(parseFloat(yaxisdtarr[i].first_input_delay_count));
   
    }
     return series;
  }

  processData(data) {
    for (let i = 0; i < data.length; i++) {
      data[i].pagecount = parseInt(data[i].pagecount);
      data[i].timetoload = parseFloat(data[i].timetoload);
      data[i].dominteractivetime = parseFloat(data[i].dominteractivetime);
      data[i].domcomplete = parseFloat(data[i].domcomplete);
      data[i].servertime = parseFloat(data[i].servertime);
      data[i].perceivedrendertime = parseFloat(data[i].perceivedrendertime);
      data[i].firstbyte = parseFloat(data[i].firstbyte);
      data[i].dnstime = parseFloat(data[i].dnstime);
      data[i].secure = parseFloat(data[i].secure);
      data[i].cache = parseFloat(data[i].cache);
      data[i].network = parseFloat(data[i].network);
      data[i].connectiontime = parseFloat(data[i].connectiontime);
      data[i].firstpaint_count = parseFloat(data[i].firstpaint_count);
      data[i].first_content_paint_count = parseFloat(data[i].first_content_paint_count);
      data[i].time_to_interactive_count = parseFloat(data[i].time_to_interactive_count);
      data[i].first_input_delay_count = parseFloat(data[i].first_input_delay_count);
      if (data[i].exitlt != null && data[i].exitlt != undefined)
        data[i].exitlt = parseFloat(data[i].exitlt);
      else
        data[i].exitlt = 0;
    }
    return data;
  }
  private onLoaded(state: HomePageTabLoadedState) {
    const me = this;
      this.enableChart = false;
      me.data = PAGE_TABLE;
      me.data.data = this.processData(state.data.data);
      let xaxis = me.processxgraphData(state.data.charts);
      let seriesdata = me.processygraphData(state.data.charts);
      me.data.charts[0]["highchart"]["chart"]["height"] = xaxis.length * seriesdata.length * 20;
      me.data.charts[0]["highchart"]["series"] = seriesdata as Highcharts.SeriesOptionsType[];
      
      me.data.charts[0]["highchart"]["xAxis"]["categories"] = xaxis;
      setTimeout(() => {
      this.enableChart = true;
    }, 100);
      me.error = null;
      me.loading = false;
      me.empty = !me.data.data.length;

  }
  

  filterFields(event) {
    const me = this;
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < me.autoCompleteList.autocompleteData.length; i++) {
      let reportitem = me.autoCompleteList.autocompleteData[i];
      if (reportitem.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(reportitem);
      }
    }

    me.filteredReports = filtered;
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

  serviceMethodTiming($event) {
    this.isShowAll = $event;
  }
  hotspotSummary($event) {
   const me = this;
   this.msg=[];
    this.isShowAll = $event;
	if (me.datapagefilter.filtercriteria) {
      if (me.datapagefilter.filtercriteria.pagePerformanceFilters)
	{
         me.loadPagePerformanceData(me.datapagefilter.filtercriteria.pagePerformanceFilters);
         this.filterforcompare = me.datapagefilter.filtercriteria.pagePerformanceFilters;
        }
    }
  }
  exportRumpageOverview() {
    let url = "/netvision/rest/webapi/exportrumanalytics?access_token=563e412ab7f5a282c15ae5de1732bfd1";
    let timezoneflag = sessionStorage.getItem('_nvtimezone');
    let filterstring = "";
    let timefilter = this.datapagefilter.filtercriteria.showFilter.timeFilter;
    let filterCriteria = this.datapagefilter.filtercriteria.filterCriteriaList;
    if (timefilter.last !== null && timefilter.last !== '') // defined
    { 
      filterstring += "Last : " + timefilter.last;
    }
    else {
      let start = new Date(timefilter.startTime);
      let end = new Date(timefilter.endTime);
      let stdate = window["toDateString"](start);
      let etdate = window["toDateString"](end);
      filterstring += stdate + " " + start.toTimeString().split(" ")[0] + " - " + etdate + " " + end.toTimeString().split(" ")[0];
    }
    for (let i = 0; i < filterCriteria.length; i++) {      if (filterCriteria[i].name.trim() !== 'Metric' && filterCriteria[i].name.trim() !== 'Error Message' && filterCriteria[i].name.trim() !== 'FileName' && filterCriteria[i].name.trim() !== 'Granularity' && filterCriteria[i].name.trim() !== 'Rolling Window') {
        filterstring += " , " + filterCriteria[i].name + " : " + filterCriteria[i].value;
      }
    }
    url += `&filterCriteria=` + JSON.stringify(this.filterforcompare) + "&timezoneflag=" + timezoneflag;
    url += `&description=` + filterstring;
    window.open(url);
  }	
  showResponse(key,overviewobj){
    this.pagedetailinfo = overviewobj;
    if(key == 1){
      if (this.filterforcompare.timeFiltercmp.startTime == "" && this.filterforcompare.timeFiltercmp.endTime == "") {
        this.msg = [{ severity: 'error', detail: 'Please Select Compare Time i.e. duration 2 from Page Performance Filter and click on Apply button' }];
        return;
      }	  
      this.msg = [];
      this.isShowAll = false;
      this.isShowPerformance = false;
      this.isShowResourcePerformance = false;
      this.isShowDomainPerformance = false;
      this.isShowComparePerformance = true;
      this.rowClick.emit(this.isShowAll);
    }else if(key == 2){
      this.isShowAll = false;
      this.isShowComparePerformance = false;
      this.isShowResourcePerformance = false;
      this.isShowDomainPerformance = false;
      this.isShowPerformance = true;
      this.rowClick.emit(this.isShowAll);
      this.PagePerformanceOverviewService.broadcast('closeChild', false);
    }else if(key == 3){
      this.isShowAll = false;
      this.isShowComparePerformance = false;
      this.isShowPerformance = false;
      this.isShowDomainPerformance = false;
      this.isShowResourcePerformance = true;
      this.rowClick.emit(this.isShowAll);
    }else if(key == 4){
      this.isShowAll = false;
      this.isShowComparePerformance = false;
      this.isShowPerformance = false;
      this.isShowResourcePerformance = false;
      this.isShowDomainPerformance = true;
      this.rowClick.emit(this.isShowAll);
    }
    
  }


}
