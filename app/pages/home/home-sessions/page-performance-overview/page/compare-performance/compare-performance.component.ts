import { Component, EventEmitter, OnInit, Input, Output, ViewEncapsulation } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { COMPARE_TABLE } from './service/compare-performance.dummy';
import { ComparePerformanceTable } from './service/compare-performance.model';
import { HomePageTabLoadingState, HomePageTabLoadingErrorState, HomePageTabLoadedState } from '../service/page-service.state'
import { PageTabService } from '../service/pagetab.service';
import { Store } from 'src/app/core/store/store';
import { Metadata } from '../../../common/interfaces/metadata';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
import { ParsePagePerformanceFilters } from '../../../common/interfaces/parsepageperformancefilter';
import * as moment from 'moment';
import 'moment-timezone';
import { PagePerformanceFilter_TABLE } from '../page-performance-filter/service/page.dummy';
import { PageFilterTable } from '../page-performance-filter/service/page.model';


@Component({
  selector: 'app-compare-performance',
  templateUrl: './compare-performance.component.html',
  styleUrls: ['./compare-performance.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ComparePerformanceComponent implements OnInit {
  data: ComparePerformanceTable;
  cols: TableHeaderColumn[] = [];
  statCols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  _selectedStatColumns: TableHeaderColumn[] = [];
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  searchOptions: SelectItem[];
  analyticsOptions: MenuItem[];
  enableChart: boolean = false;
  isEnabledColumnFilter: boolean = false;
  pagedetailinfo: any;
  isShowPerformance: boolean = false;
  metadata: Metadata = null;
  filterforcompare = this.getinitfilter();
  globalFilterFields: string[] = [];
  cnamee = '';
  hnamee = '';
  Typee = '';
  isShowAll: boolean = true;
  selectedRow: any;
  colunheader: any = [];
  datapagefilter: PageFilterTable;
  @Output() arrowClick = new EventEmitter<boolean>();
  @Input() get cname() {
    return this.cnamee;
  }
  @Input() get hname() {
    return this.hnamee;
  }
  @Input() get Type() {
    return this.Typee;
  }
  set cname(cnamee) {
    this.cnamee = cnamee;
  }
  set hname(hnamee) {
    this.hnamee = hnamee;
  }
  set Type(Typee) {
    this.Typee = Typee;
  }
  @Input() get parsepagefilter() {
    return;
  }

  set parsepagefilter(filter: {}) {
    this.isShowAll = true;
    this.globalFilterFields.push(this.hnamee);
    if (filter !== null && filter != undefined) {
      this.filterforcompare = filter;
      this.loadCompareModeData(filter);
    }
  }
  constructor(private PageTabService: PageTabService, private metadataService: MetadataService) {
    this.metadataService.getMetadata().subscribe(metadata => {
      this.metadata = metadata;
    });
  }

  ngOnInit(): void {
    this.metadataService.getMetadata().subscribe(metadata => {
      this.metadata = metadata;
    });
    this.isShowAll = true;
    const me = this;
    me.data = COMPARE_TABLE;
    me.datapagefilter = PagePerformanceFilter_TABLE;
    me.searchOptions = [
      { label: 'POLICY', value: 'policy' },
    ];
    me.analyticsOptions = [
      { label: 'Page Performance Overview', routerLink: '/page-performance-overview' },
      { label: 'Revenue Analytics', routerLink: '/revenue-analytics' },
      { label: 'Custom Metrics' },
      { label: 'Path Analytics' },
      { label: 'Form Analytics' },
      { label: 'Marketing Analytics' }
    ];
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    console.log('cmpglobalFilterFields : ', this.globalFilterFields);
    console.log("this.parsepagefilter ngOnInit : ", this.parsepagefilter);
  }

  pageperformancefilter(parsepagefilter: string) {
    let filtercriteria = JSON.parse(parsepagefilter);
    console.log("pageperformancefilter filtercriteria", filtercriteria);
    this.filterforcompare = filtercriteria.pagePerformanceFilters;
    let cmptoggle = filtercriteria.showFilter.toggle;
    if (cmptoggle == true) {
      this.isShowAll = false;
      this.arrowClick.emit(true);
      return;
    }
    this.loadCompareModeData(filtercriteria.pagePerformanceFilters);
  }

  getinitfilter() {
    let parsepagefilter = null;
    parsepagefilter = new ParsePagePerformanceFilters();

    let time = ((new Date().getTime()) - 24 * 60 * 60 * 1000);
    let date = moment.tz(time, sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss');
    let d = new Date(moment.tz(time, sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
    let date1 = window["toDateString"](d);
    if (navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("rv:11.0") > -1 || navigator.userAgent.indexOf("Edge") > -1) {
      let tmpDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
      date1 = tmpDate;
    }
    let startT = date1 + " 00:00:00";
    let endT = date1 + " 23:59:00";
    parsepagefilter.pagePerformanceFilters.timeFilter.startTime = startT;
    parsepagefilter.pagePerformanceFilters.timeFilter.endTime = endT;
    parsepagefilter.pagePerformanceFilters.timeFiltercmp.startTime = startT;
    parsepagefilter.pagePerformanceFilters.timeFiltercmp.endTime = endT;
    return parsepagefilter.pagePerformanceFilters;
  }
 
  exportRumpageOverview() {
    let url = "/netvision/rest/webapi/exportrumanalytics?access_token=563e412ab7f5a282c15ae5de1732bfd1";
    let timezoneflag = sessionStorage.getItem('_nvtimezone');
    let timefilter = this.datapagefilter.filtercriteria.showFilter.timeFilter;
    let filterCriteria = this.datapagefilter.filtercriteria.filterCriteriaList;
    let timefiltercmp = this.datapagefilter.filtercriteria.showFilter.timeFiltercmp;
    let filterstring = "";
    if (timefilter.last !== null && timefilter.last !== '') // defined
    {
      filterstring += "Duration 1 Last : " + timefilter.last;
    }
    else
    {
      let startcmp = new Date(timefilter.startTime);
      let endcmp = new Date(timefilter.endTime);
      let stdatecmp = window["toDateString"](startcmp);
      let etdatecmp = window["toDateString"](endcmp);    
      filterstring += " Duration 1 : " + stdatecmp + " " + startcmp.toTimeString().split(" ")[0] + " - " + etdatecmp + " " + endcmp.toTimeString().split(" ")[0];
    }
    if(timefiltercmp.last !== null && timefiltercmp.last !== '')
    {
     filterstring += " Duration 2 Last : " + timefiltercmp.last;
    }
    else {
      let startcmp = new Date(timefiltercmp.startTime);
      let endcmp = new Date(timefiltercmp.endTime);
      let stdatecmp = window["toDateString"](startcmp);
      let etdatecmp = window["toDateString"](endcmp);
      filterstring += " Duration 2 : " + stdatecmp + " " + startcmp.toTimeString().split(" ")[0] + " - " + etdatecmp + " " + endcmp.toTimeString().split(" ")[0];
    }
    for (let i = 0; i < filterCriteria.length; i++) {
      if (filterCriteria[i].name.trim() !== 'Metric' && filterCriteria[i].name.trim() !== 'Error Message' && filterCriteria[i].name.trim() !== 'FileName' && filterCriteria[i].name.trim() !== 'Granularity' && filterCriteria[i].name.trim() !== 'Rolling Window') {
        filterstring += " , " + filterCriteria[i].name + " : " + filterCriteria[i].value;
      }
    }
    url += `&filterCriteria=` + JSON.stringify(this.filterforcompare) + "&timezoneflag=" + timezoneflag;
    url += `&description=` + filterstring;
    window.open(url);
  } 

  loadCompareModeData(filtercriteria) {
    const me = this;
    //me.graphInTreeService.load(payload).subscribe(
    console.log("filtercriteria loadCompareModeData : ", filtercriteria, ' this.Typee : ', this.Typee);
    me.PageTabService.LoadPageTabData(filtercriteria, this.Typee).subscribe(
      (state: Store.State) => {
        console.log(" state : ", state);
        if (state instanceof HomePageTabLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {
          //request for compare mode 
          if (filtercriteria.timeFiltercmp.startTime != "" && filtercriteria.timeFiltercmp.endTime != "") {
            let comparefilter = JSON.parse(JSON.stringify(filtercriteria));

            comparefilter.timeFilter.last = filtercriteria.timeFiltercmp.last;
            comparefilter.timeFilter.startTime = filtercriteria.timeFiltercmp.startTime;
            comparefilter.timeFilter.endTime = filtercriteria.timeFiltercmp.endTime;
            this.PageTabService.LoadPageTabData(comparefilter, this.Typee).subscribe(
              (statecmp: any) => {
                if (statecmp instanceof HomePageTabLoadingState) {
                  me.onLoading(statecmp);
                  return;
                }
                if (statecmp instanceof HomePageTabLoadedState)
                  me.onLoaded(state, statecmp);
              });
          }
          else
            me.onLoaded(state, []);
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
    console.log("state HomePageTabLoadingState : ", state);
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: HomePageTabLoadingErrorState) {
    console.log("HomePageTabLoadingErrorState state : ", state);
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state, statecmp) {
    console.log('state : ', state, ' statecmp : ', statecmp);
    const me = this;
    me.data = COMPARE_TABLE;
    this.enableChart = false;
    let rumdatanor = state.data.data;
    let rumdatacmp = [];
    if (Array.isArray(statecmp))
      rumdatacmp = [];
    else
      rumdatacmp = statecmp.data.data;
    //let Type = 'page';
    rumdatanor = this.processData(state.data.data);
    rumdatacmp = this.processData(rumdatacmp);
    let colheaader = me.data.headers[0].cols;
    console.log("this.type ", this.Typee, " cname : ", this.cnamee, " hname : ", this.hnamee);
    for (let i = 0; i < me.data.headers[0].cols.length; i++) {
      if (me.data.headers[0].cols[i].label == '')
        me.data.headers[0].cols[i].field = this.hnamee
    }
    me.colunheader = colheaader;//field
    me.colunheader = me.colunheader.filter(m => m['field'] !== this.hnamee);
    
    for (let i = 0; i < me.data.headers[0].cols.length; i++) {
      if (me.data.headers[0].cols[i].tooltip == '')
        me.data.headers[0].cols[i]["header"] = this.cnamee
      else
        me.data.headers[0].cols[i]["header"] = me.data.headers[0].cols[i].tooltip;
    }

    let rumData = this.calrumdata(rumdatanor, rumdatacmp, this.Typee);
    me.data.data = rumData;
    let xaxis = me.processxgraphData(rumData);
    let seriesdata = me.processygraphData(rumData);
    COMPARE_TABLE.charts[0]["highchart"]["chart"]["height"] = xaxis.length * seriesdata.length * 20;
    COMPARE_TABLE.charts[0]["highchart"]["series"] = seriesdata as Highcharts.SeriesOptionsType[];
    COMPARE_TABLE.charts[0]["highchart"]["xAxis"]["categories"] = xaxis;
    if (this.hnamee == "pagename") {
      COMPARE_TABLE.charts[0]["title"] = "Page Performance Report";
      COMPARE_TABLE.charts[0]["highchart"]["xAxis"]["title"]["text"] = "Page(s)";
    }
    if (this.hnamee == "browsername") {
      COMPARE_TABLE.charts[0]["title"] = "Browser Performance Report";
      COMPARE_TABLE.charts[0]["highchart"]["xAxis"]["title"]["text"] = "Browser(s)";
    }
    if (this.hnamee == "devicetype") {
      COMPARE_TABLE.charts[0]["title"] = "Device Performance Report";
      COMPARE_TABLE.charts[0]["highchart"]["xAxis"]["title"]["text"] = "Device(s)";
    }
    if (this.hnamee == "region") {
      COMPARE_TABLE.charts[0]["title"] = "Region Performance Report";
      COMPARE_TABLE.charts[0]["highchart"]["xAxis"]["title"]["text"] = "Region(s)";
    }
    if (this.hnamee == "country") {
      COMPARE_TABLE.charts[0]["title"] = "Location Performance Report";
      COMPARE_TABLE.charts[0]["highchart"]["xAxis"]["title"]["text"] = "Countrie(s)";
    }
    if (this.hnamee == "entityname") {
      COMPARE_TABLE.charts[0]["title"] = "Connection Performance Report";
      COMPARE_TABLE.charts[0]["highchart"]["xAxis"]["title"]["text"] = "Connection(s)";
    }
    if (this.hnamee == "osname") {
      COMPARE_TABLE.charts[0]["title"] = "Operating System Performance Report";
      COMPARE_TABLE.charts[0]["highchart"]["xAxis"]["title"]["text"] = "OS(s)";
    }
    if (this.hnamee == "detail") {
      COMPARE_TABLE.charts[0]["title"] = "Browser and OS Performance Report";
      COMPARE_TABLE.charts[0]["highchart"]["xAxis"]["title"]["text"] = "Browser/OS(s)";
    }
    if (this.hnamee == "browserall") {
      COMPARE_TABLE.charts[0]["title"] = "Browser Overall Report";
      COMPARE_TABLE.charts[0]["highchart"]["xAxis"]["title"]["text"] = "Browser(s)";
    }
    if (this.hnamee == "osall") {
      COMPARE_TABLE.charts[0]["title"] = "OS Overall Report";
      COMPARE_TABLE.charts[0]["highchart"]["xAxis"]["title"]["text"] = "Operating Systems(s)";
    }
    me.data.charts = COMPARE_TABLE.charts;
    setTimeout(() => {
      this.enableChart = true;
    }, 100);
    console.log("me.data.data : ", me.data.data);
    me.error = null;
    me.loading = false;
    me.empty = !me.data.data.length;

  }
  showResponse(key, overviewobj) {
    if (key == 2) {
      this.isShowAll = false;
      this.isShowPerformance = true;
      this.pagedetailinfo = overviewobj[this.hnamee];
      this.arrowClick.emit(this.isShowAll);
    }
  }

  processygraphData(yaxisdtarr) {
    let series = [];
    series.push({ "name": "onLoad", "pointWidth": 15, "data": [], "id": "onload", "duration": "Duration 1" });
    series.push({ "name": "onLoad", "pointWidth": 15, "data": [], "linkedTo": "onload", "duration": "Duration 2", "showInLegend": false });
    series.push({ "name": "Dom Interactive", "pointWidth": 15, "data": [], "id": "domintractive", "duration": "Duration 1" });
    series.push({ "name": "Dom Interactive", "pointWidth": 15, "data": [], "linkedTo": "domintractive", "duration": "Duration 2", "showInLegend": false });
    series.push({ "name": "Time to Domcontent Loaded", "pointWidth": 15, "data": [], "id": "ttdi", "duration": "Duration 1" });
    series.push({ "name": "Time to Domcontent Loaded", "pointWidth": 15, "data": [], "linkedTo": "ttdi", "duration": "Duration 2", "showInLegend": false });
    series.push({ "name": "Server Response", "pointWidth": 15, "data": [], "id": "serverres", "duration": "Duration 1" });
    series.push({ "name": "Server Response", "pointWidth": 15, "data": [], "linkedTo": "serverres", "duration": "Duration 2", "showInLegend": false });
    series.push({ "name": "First Byte", "pointWidth": 15, "visible": false, "data": [], "id": "firstbyte", "duration": "Duration 1" });
    series.push({ "name": "First Byte", "pointWidth": 15, "visible": false, "data": [], "linkedTo": "firstbyte", "duration": "Duration 2", "showInLegend": false });
    series.push({ "name": "Perceived Render ", "pointWidth": 15, "visible": false, "data": [], "id": "pcrt", "duration": "Duration 1" });
    series.push({ "name": "Perceived Render ", "pointWidth": 15, "visible": false, "data": [], "linkedTo": "pcrt", "duration": "Duration 2", "showInLegend": false });
    series.push({ "name": "DNS Time", "pointWidth": 15, "visible": false, "data": [], "id": "dnstime", "duration": "Duration 1" });
    series.push({ "name": "DNS Time", "pointWidth": 15, "visible": false, "data": [], "linkedTo": "dnstime", "duration": "Duration 2", "showInLegend": false });
    series.push({ "name": "Secure", "pointWidth": 15, "visible": false, "data": [], "id": "secure", "duration": "Duration 1" });
    series.push({ "name": "Secure", "pointWidth": 15, "visible": false, "data": [], "linkedTo": "secure", "duration": "Duration 2", "showInLegend": false });
    series.push({ "name": "Cache", "pointWidth": 15, "visible": false, "data": [], "id": "chache", "duration": "Duration 1" });
    series.push({ "name": "Cache", "pointWidth": 15, "visible": false, "data": [], "linkedTo": "chache", "duration": "Duration 2", "showInLegend": false });
    series.push({ "name": "Connection", "pointWidth": 15, "visible": false, "data": [], "id": "connection", "duration": "Duration 1" });
    series.push({ "name": "Connection", "pointWidth": 15, "visible": false, "data": [], "linkedTo": "connection", "duration": "Duration 2", "showInLegend": false });
    series.push({ "name": "Network", "pointWidth": 15, "visible": false, "data": [], "id": "network", "duration": "Duration 1" });
    series.push({ "name": "Network", "pointWidth": 15, "visible": false, "data": [], "linkedTo": "network", "duration": "Duration 2", "showInLegend": false });
    series.push({ "name": "Exit PCT", "pointWidth": 15, "visible": false, "data": [], "id": "exitrate", "duration": "Duration 1" });
    series.push({ "name": "Exit PCT", "pointWidth": 15, "visible": false, "data": [], "linkedTo": "exitrate", "duration": "Duration 2", "showInLegend": false });
    series.push({ "name": "First Paint", "pointWidth": 15, "visible": false, "data": [], "id": "firstpaint", "duration": "Duration 1" });
    series.push({ "name": "First Paint", "pointWidth": 15, "visible": false, "data": [], "linkedTo": "firstpaint", "duration": "Duration 2", "showInLegend": false });
    series.push({ "name": "First Content Paint", "pointWidth": 15, "visible": false, "data": [], "id": "firstcontentpaint", "duration": "Duration 1" });
    series.push({ "name": "First Content Paint", "pointWidth": 15, "visible": false, "data": [], "linkedTo": "firstcontentpaint", "duration": "Duration 2", "showInLegend": false });
    series.push({ "name": "Time to Interactive", "pointWidth": 15, "visible": false, "data": [], "id": "timetointractive", "duration": "Duration 1" });
    series.push({ "name": "Time to Interactive", "pointWidth": 15, "visible": false, "data": [], "linkedTo": "timetointeractive", "duration": "Duration 2", "showInLegend": false });
    series.push({ "name": "First Input Delay", "pointWidth": 15, "visible": false, "data": [], "id": "firstinputdelay", "duration": "Duration 1" });
    series.push({ "name": "First Input Delay", "pointWidth": 15, "visible": false, "data": [], "linkedTo": "firstinputdelay", "duration": "Duration 2", "showInLegend": false });
    let yaxisdt = [];
    for (let i = 0; i < yaxisdtarr.length; i++) {
      if (i < 50) {
        series[0].data.push(parseFloat(yaxisdtarr[i].timetoload));
        series[1].data.push(parseFloat(yaxisdtarr[i].timetoload1));
        series[2].data.push(parseFloat(yaxisdtarr[i].dominteractivetime));
        series[3].data.push(parseFloat(yaxisdtarr[i].dominteractivetime1));
        series[4].data.push(parseFloat(yaxisdtarr[i].domcomplete));
        series[5].data.push(parseFloat(yaxisdtarr[i].domcomplete1));
        series[6].data.push(parseFloat(yaxisdtarr[i].servertime));
        series[7].data.push(parseFloat(yaxisdtarr[i].servertime1));
        series[8].data.push(parseFloat(yaxisdtarr[i].firstbyte));
        series[9].data.push(parseFloat(yaxisdtarr[i].firstbyte1));
        series[10].data.push(parseFloat(yaxisdtarr[i].perceivedrendertime));
        series[11].data.push(parseFloat(yaxisdtarr[i].perceivedrendertime1));
        series[12].data.push(parseFloat(yaxisdtarr[i].dnstime));
        series[13].data.push(parseFloat(yaxisdtarr[i].dnstime1));
        series[14].data.push(parseFloat(yaxisdtarr[i].secure));
        series[15].data.push(parseFloat(yaxisdtarr[i].secure1));
        series[16].data.push(parseFloat(yaxisdtarr[i].cache));
        series[17].data.push(parseFloat(yaxisdtarr[i].cache1));
        series[18].data.push(parseFloat(yaxisdtarr[i].connectiontime));
        series[19].data.push(parseFloat(yaxisdtarr[i].connectiontime1));
        series[20].data.push(parseFloat(yaxisdtarr[i].network));
        series[21].data.push(parseFloat(yaxisdtarr[i].network1));
        series[22].data.push(parseFloat(yaxisdtarr[i].exitlt));
        series[23].data.push(parseFloat(yaxisdtarr[i].exitlt1));
        series[24].data.push(parseFloat(yaxisdtarr[i].firstpaint_count));
        series[25].data.push(parseFloat(yaxisdtarr[i].firstpaint_count1));
        series[26].data.push(parseFloat(yaxisdtarr[i].first_content_paint_count));
        series[27].data.push(parseFloat(yaxisdtarr[i].first_content_paint_count1));
        series[28].data.push(parseFloat(yaxisdtarr[i].time_to_interactive_count));
        series[29].data.push(parseFloat(yaxisdtarr[i].time_to_interactive_count1));
        series[30].data.push(parseFloat(yaxisdtarr[i].first_input_delay_count));
        series[31].data.push(parseFloat(yaxisdtarr[i].first_input_delay_count1));

      }
    }
    return series;
  }
  processxgraphData(xaxisnamearr) {
    let xaxisname = [];
    let obj = "";
    for (let i = 0; i < xaxisnamearr.length; i++) {
      var count = xaxisnamearr[i].pagecount.toLocaleString();
      if (i < 50) {
        if (this.hnamee == "pagename")
          obj = xaxisnamearr[i].pagename + "( " + count + " )";
        else if (this.hnamee == "browsername")
          obj = xaxisnamearr[i].browsername + "( " + count + " )";
        else if (this.hnamee == "devicetype")
          obj = xaxisnamearr[i].devicetype + "( " + count + " )";
        else if (this.hnamee == "region")
          obj = xaxisnamearr[i].region + "( " + count + " )";
        else if (this.hnamee == "country")
          obj = xaxisnamearr[i].country + "( " + count + " )";
        else if (this.hnamee == "entityname")
          obj = xaxisnamearr[i].entityname + "( " + count + " )";
        else if (this.hnamee == "osname")
          obj = xaxisnamearr[i].osname + "( " + count + " )";
        else if (this.hnamee == "detail")
          obj = xaxisnamearr[i].detail + "( " + count + " )";
        else if (this.hnamee == "browserall")
          obj = xaxisnamearr[i].browserall + "( " + count + " )";
        else if (this.hnamee == "osall")
          obj = xaxisnamearr[i].osall + "( " + count + " )";
        xaxisname.push(obj);
      }
    }
    return xaxisname;
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
      if (data[i].exitlt != null && data[i].exitlt != undefined)
        data[i].exitlt = parseFloat(data[i].exitlt);
      else
        data[i].exitlt = 0;
      data[i].firstpaint_count = parseFloat(data[i].firstpaint_count);
      data[i].first_content_paint_count = parseFloat(data[i].first_content_paint_count);
      data[i].time_to_interactive_count = parseFloat(data[i].time_to_interactive_count);
      data[i].first_input_delay_count = parseFloat(data[i].first_input_delay_count);
    }
    return data;
  }

  //Compare both response and generate a common rumdata[Type] as a response

  calrumdata(norrumdata, cmprumdata, Type) {
    norrumdata = this.sortFunction(norrumdata, Type);
    cmprumdata = this.sortFunction(cmprumdata, Type);
    let filldata = [];

    if (norrumdata.length == 0 && cmprumdata.length == 0) {
      filldata = [];
    }
    else {
      filldata = this.mergelist(norrumdata, cmprumdata, Type);
    }

    return filldata;
  }

  typeColumnMap = {
    page: 'pagename',
    device: 'devicetype',
    browserAll: 'browserall',
    browser: 'browsername',
    connection: 'entityname',
    location: 'country',
    region: 'region',
    osAll: 'osall',
    os: 'osname',
    browseros: 'detail'
  };

  mergelist(list1, list2, Type) {
    let i = 0, j = 0;
    let list = [];
    while (i < list1.length && j < list2.length) {
      if (list1[i][this.typeColumnMap[Type]] < list2[j][this.typeColumnMap[Type]]) {
        // add list1 record with default value for list2.
        list.push(this.duration1Response(list1[i]));
        i++;
      }
      else if (list1[i][this.typeColumnMap[Type]] > list2[j][this.typeColumnMap[Type]]) {
        // add list2 record with default value of list1.
        list.push(this.duration2Response(list2[j]));
        j++;
      }
      else {
        // add concated value of list1 and list2.
        list.push(this.commonResponse(list1[i], list2[j]));
        i++;
        j++;
      }
    }
    // add entries left in list.
    if (i < list1.length) {
      for (; i < list1.length; i++) {
        // add list1 record with default value of list2.
        list.push(this.duration1Response(list1[i]));
      }
    }

    if (j < list2.length) {
      for (; j < list2.length; j++) {
        // add list2 record with default value of list1.
        list.push(this.duration2Response(list2[j]));
      }
    }
    console.log('list : ', list);
    return list;
  }

  //method for return common jsonobject data of both duration1 and duration2
  commonResponse(norrumdata, cmprumdata) {
    let resobject = {};
    resobject["pagecount"] = parseInt(norrumdata["pagecount"]);
    resobject["timetoload"] = parseFloat(norrumdata["timetoload"]);
    resobject["dominteractivetime"] = parseFloat(norrumdata["dominteractivetime"]);
    resobject["domcomplete"] = parseFloat(norrumdata["domcomplete"]);
    resobject["servertime"] = parseFloat(norrumdata["servertime"]);
    resobject["perceivedrendertime"] = parseFloat(norrumdata["perceivedrendertime"]);
    resobject["firstbyte"] = parseFloat(norrumdata["firstbyte"]);
    resobject["dnstime"] = parseFloat(norrumdata["dnstime"]);
    resobject["secure"] = parseFloat(norrumdata["secure"]);
    resobject["cache"] = parseFloat(norrumdata["cache"]);
    resobject["network"] = parseFloat(norrumdata["network"]);
    resobject["connectiontime"] = parseFloat(norrumdata["connectiontime"]);
    resobject["exitlt"] = parseFloat(norrumdata["exitlt"]);
    resobject["pagecount1"] = parseInt(cmprumdata["pagecount"]);
    resobject["timetoload1"] = parseFloat(cmprumdata["timetoload"]);
    resobject["dominteractivetime1"] = parseFloat(cmprumdata["dominteractivetime"]);
    resobject["domcomplete1"] = parseFloat(cmprumdata["domcomplete"]);
    resobject["servertime1"] = parseFloat(cmprumdata["servertime"]);
    resobject["perceivedrendertime1"] = parseFloat(cmprumdata["perceivedrendertime"]);
    resobject["firstbyte1"] = parseFloat(cmprumdata["firstbyte"]);
    resobject["dnstime1"] = parseFloat(cmprumdata["dnstime"]);
    resobject["secure1"] = parseFloat(cmprumdata["secure"]);
    resobject["cache1"] = parseFloat(cmprumdata["cache"]);
    resobject["network1"] = parseFloat(cmprumdata["network"]);
    resobject["connectiontime1"] = parseFloat(cmprumdata["connectiontime"]);
    resobject["exitlt1"] = parseFloat(cmprumdata["exitlt"]);
    resobject["firstpaint_count"] = parseFloat(cmprumdata["firstpaint_count"]);
    resobject["first_content_paint_count"] = parseFloat(cmprumdata["first_content_paint_count"]);
    resobject["time_to_interactive_count"] = parseFloat(cmprumdata["time_to_interactive_count"]);
    resobject["first_input_delay_count"] = parseFloat(cmprumdata["first_input_delay_count"]);
    resobject["firstpaint_count1"] = parseFloat(cmprumdata["firstpaint_count"]);
    resobject["first_content_paint_count1"] = parseFloat(cmprumdata["first_content_paint_count"]);
    resobject["time_to_interactive_count1"] = parseFloat(cmprumdata["time_to_interactive_count"]);
    resobject["first_input_delay_count1"] = parseFloat(cmprumdata["first_input_delay_count"]);
    if (cmprumdata["pagename"] != undefined)
      resobject["pagename"] = cmprumdata["pagename"];
    else if (cmprumdata["devicetype"] != undefined)
      resobject["devicetype"] = cmprumdata["devicetype"];
    else if (cmprumdata["browserall"] != undefined)
      resobject["browserall"] = cmprumdata["browserall"];
    else if (cmprumdata["browsername"] != undefined)
      resobject["browsername"] = cmprumdata["browsername"];
    else if (cmprumdata["entityname"] != undefined)
      resobject["entityname"] = cmprumdata["entityname"];
    else if (cmprumdata["country"] != undefined)
      resobject["country"] = cmprumdata["country"];
    else if (cmprumdata["region"] != undefined)
      resobject["region"] = cmprumdata["region"];
    else if (cmprumdata["osall"] != undefined)
      resobject["osall"] = cmprumdata["osall"];
    else if (cmprumdata["osname"] != undefined)
      resobject["osname"] = cmprumdata["osname"];
    else if (cmprumdata["detail"] != undefined)
      resobject["detail"] = cmprumdata["detail"];
    return resobject;
  }

  //method for return duration1 jsonobject
  duration1Response(norres) {
    norres["pagecount1"] = '0.00';
    norres["timetoload1"] = '0.00';
    norres["dominteractivetime1"] = '0.00';
    norres["domcomplete1"] = '0.00';
    norres["servertime1"] = '0.00';
    norres["perceivedrendertime1"] = '0.00';
    norres["firstbyte1"] = '0.00';
    norres["dnstime1"] = '0.00';
    norres["secure1"] = '0.00';
    norres["cache1"] = '0.00';
    norres["network1"] = '0.00';
    norres["connectiontime1"] = '0.00';
    norres["exitlt1"] = '0.00';
    norres["firstpaint_count1"] = '0.00';
    norres["first_content_paint_count1"] = '0.00';
    norres["first_input_delay_count1"] = '0.00';
    norres["time_to_interactive_count1"] = '0.00';
    return norres;
  }

  //method for return duration 2 jsonobject
  duration2Response(cmprumdata) {
    cmprumdata["pagecount1"] = cmprumdata["pagecount"];
    cmprumdata["pagecount"] = '0.00';
    cmprumdata["timetoload1"] = cmprumdata["timetoload"];
    cmprumdata["timetoload"] = '0.00';
    cmprumdata["dominteractivetime1"] = cmprumdata["dominteractivetime"];
    cmprumdata["dominteractivetime"] = '0.00';
    cmprumdata["domcomplete1"] = cmprumdata["domcomplete"];
    cmprumdata["domcomplete"] = '0.00';
    cmprumdata["servertime1"] = cmprumdata["servertime"];
    cmprumdata["servertime"] = '0.00';
    cmprumdata["perceivedrendertime1"] = cmprumdata["perceivedrendertime"];
    cmprumdata["perceivedrendertime"] = '0.00';
    cmprumdata["firstbyte1"] = cmprumdata["firstbyte"];
    cmprumdata["firstbyte"] = '0.00';
    cmprumdata["dnstime1"] = cmprumdata["dnstime"];
    cmprumdata["dnstime"] = '0.00';
    cmprumdata["secure1"] = cmprumdata["secure"];
    cmprumdata["secure"] = '0.00';
    cmprumdata["cache1"] = cmprumdata["cache"];
    cmprumdata["cache"] = '0.00';
    cmprumdata["network1"] = cmprumdata["network"];
    cmprumdata["network"] = '0.00';
    cmprumdata["connectiontime1"] = cmprumdata["connectiontime"];
    cmprumdata["connectiontime"] = '0.00';
    cmprumdata["exitlt1"] = cmprumdata["exitlt"];
    cmprumdata["exitlt"] = '0.00';
    cmprumdata["firstpaint_count1"] = cmprumdata["firstpaint_count"];
    cmprumdata["firstpaint_count"] = '0.00';
    cmprumdata["first_content_paint_count1"] = cmprumdata["first_content_paint_count"];
    cmprumdata["first_content_paint_count"] = '0.00';
    cmprumdata["first_input_delay_count1"] = cmprumdata["first_input_delay_count"];
    cmprumdata["first_input_delay_count"] = '0.00';
    cmprumdata["time_to_interactive_count1"] = cmprumdata["time_to_interactive_count"];
    cmprumdata["time_to_interactive_count"] = '0.00';

    return cmprumdata;
  }

  //sort function
  sortFunction(sortdata, Type) {
    if (Type == "page") {
      sortdata.sort((a, b) => (a.pagename > b.pagename) ? 1 : ((b.pagename > a.pagename) ? -1 : 0));
    }
    else if (Type == "device") {
      sortdata.sort((a, b) => (a.devicename > b.devicename) ? 1 : ((b.devicename > a.devicename) ? -1 : 0));
    }
    else if (Type == "browserAll") {
      sortdata.sort((a, b) => (a.browserall > b.browserall) ? 1 : ((b.browserall > a.browserall) ? -1 : 0));
    }
    else if (Type == "browser") {
      sortdata.sort((a, b) => (a.browsername > b.browsername) ? 1 : ((b.browsername > a.browsername) ? -1 : 0));
    }
    else if (Type == "connection") {
      sortdata.sort((a, b) => (a.entityname > b.entityname) ? 1 : ((b.entityname > a.entityname) ? -1 : 0));
    }
    else if (Type == "location") {
      sortdata.sort((a, b) => (a.country > b.country) ? 1 : ((b.country > a.country) ? -1 : 0));
    }
    else if (Type == "region") {
      sortdata.sort((a, b) => (a.region > b.region) ? 1 : ((b.region > a.region) ? -1 : 0));
    }
    else if (Type == "osAll") {
      sortdata.sort((a, b) => (a.osall > b.osall) ? 1 : ((b.osall > a.osall) ? -1 : 0));
    }
    else if (Type == "os") {
      sortdata.sort((a, b) => (a.osname > b.osname) ? 1 : ((b.osname > a.osname) ? -1 : 0));
    }
    else if (Type == "browseros") {
      sortdata.sort((a, b) => (a.detail > b.detail) ? 1 : ((b.detail > a.detail) ? -1 : 0));
    }
    return sortdata;
  }


  hotspotSummary($event) {
    this.isShowAll = $event;
  }

  showOverview() {
    this.isShowAll = false;
    if (this.datapagefilter.filtercriteria) {
      if (this.datapagefilter.filtercriteria.showFilter)
        {
          this.datapagefilter.filtercriteria.showFilter.toggle = true;
          this.datapagefilter.filtercriteria.pagePerformanceFilters.timeFiltercmp.endTime = "";
          this.datapagefilter.filtercriteria.pagePerformanceFilters.timeFiltercmp.startTime = "";
          this.datapagefilter.filtercriteria.pagePerformanceFilters.timeFiltercmp.last = "";
        }
    }
    this.arrowClick.emit(true);
  }

}
