import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { Table, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { BreadCrumbInfo } from '../common/interfaces/breadcrumbinfo';
import { PathAnalyticsDataService } from 'src/app/pages/home/home-sessions/common/interfaces/pathanalyticsservice';
import { PathAnalyticsService } from './service/path-analytics.service';
import { PathAnalyticsErrorState, PathAnalyticsLoadedState, PathAnalyticsLoadingState } from './service/path-analytics.state';
import { NgZone, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { D3Service,D3,Selection} from 'd3-ng2-service';
import { NvhttpService, NVPreLoadedState, NVPreLoadingState } from '../common/service/nvhttp.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Metadata } from '../common/interfaces/metadata';
import { MetadataService } from '../common/service/metadata.service';
import { NavigationPath } from './navigationpath';
import { DataManager } from '../common/datamanager/datamanager';
import { ParsePagePerformanceFilters } from '../common/interfaces/parsepageperformancefilter';
import { PathAnalysisFilters } from './path-analytics-filter/pathanalysisfilter';
import { Store } from 'src/app/core/store/store';
import * as moment from 'moment';
import { PathAnalyticsFilter } from '../common/interfaces/pathanalyticsfilter';

@Component({
  selector: 'app-path-analytics',
  providers:[D3Service],
  templateUrl: './path-analytics.component.html',
  styleUrls: ['./path-analytics.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PathAnalyticsComponent implements OnInit {
   
  height: any;
  error: any; 
  dimType: any;
  @Output() onChange: EventEmitter<any>;
  
  changemode = false;
  @Output() onFilterData: EventEmitter<any>;
  
  
  loading: boolean;
  _selectedColumns: TableHeaderColumn[];
  cols: any;
  httpService: NvhttpService;
  isEnabledColumnFilter: boolean;
  filterTitle: string;
  pathDataService: PathAnalyticsDataService;
  service: any;
  tableData: any;
  summaryData: any;
  graph0Data: any;
  graphsData: any[];
  graph1Data: any;
  graph2Data: any;
  
  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  navdata: any = null;
  metadata: Metadata = null;
  metadataService: MetadataService ;
  mode = '';  
  maxnodelength: any;
  pathfilter: ParsePagePerformanceFilters;
  filter: any = null;
  showFilter: any = null;
  maxSankeyChartDepth: any;
  len : any;
  responsedata: any;
  totalCount = 0;
  random = 0;
  breadcrumb: MenuItem[];

  constructor(metaDataService: MetadataService, httpService: NvhttpService, private route: ActivatedRoute,private router: Router) {
    
    this.httpService = httpService;
    this.metadataService = metaDataService;
    this.pathfilter = new ParsePagePerformanceFilters();

    this.metadataService.getMetadata().subscribe(metadata => {
      this.metadata = metadata;
    })
   }


     

showFilterAppliedData(event)
{
 this.changemode = true;
 let f = JSON.parse(this.filter).filter;
 let eventdata = {};
 eventdata["name"] = event.name;
 if(f.dimName != 'EntryPage')
  eventdata["startPage"] = false;
 else
  eventdata["startPage"] = true;
 this.onFilterData.emit(eventdata);
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



  ngOnInit() {
    this.random = Math.random();
    this.route
       .queryParams
       .subscribe(params => {
       this.mode = params['mode'];
       this.breadcrumb = [
      
        { label: this.mode },
      ];
       
       this.filter = params['filterCriteria'];
       this.showFilter = params['showFilter'] || null;

       this.metadataService.getMetadata().subscribe(metadata => {
        this.metadata = metadata;
        this.checkforfilter(null);
      })

       
      
 });
}


checkforfilter(filter)
{
  if(filter === undefined || filter === null)
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
      this.pathfilter.filter.timeFilter.startTime =  startT;
      this.pathfilter.filter.timeFilter.endTime =  endT;
      let pagem: any[] =  Array.from(this.metadata.pageNameMap.keys());
      let key = null;
      let arr = [];
      try{
        if(pagem.length > 0){
        pagem.sort(
        function(a, b){return a - b});
        let id = 0;
        if(pagem[0] !== -1)
          id = pagem[0];
        else
          id = pagem[1];

          if(pagem.length == 1 && pagem[0] == -1)
          id = -1;

       this.pathfilter.filter.pages = this.metadata.pageNameMap.get(id).id;
       this.pathfilter.filter.pageName = this.metadata.pageNameMap.get(id).name;}
       filter = JSON.stringify(this.pathfilter);

       }
   catch(e)
    {  }
    }
  else
   {
      this.pathfilter.filter = filter.filter;
      this.showFilter = filter.showFilter;
   }
  this.checkData(this.pathfilter.filter);
}

checkData(filter)
{
   if(this.mode === 'NavigationSummary')
   {
    this.processPathAnalysisRequest(filter);
   }
   else
   {
     this.processViewAnalysis(filter);
   }
}

processViewAnalysis(filter)
 {
  this.navdata = null;
  this.totalCount = 0;
  // fetching data for navigation path analysis
    this.httpService.getFlowPathAnalysisData(filter).subscribe((state: Store.State ) => {
      
      if (state instanceof NVPreLoadingState) {
          this.loading = state.loading;
          this.error = state.error;
       }
 
        if (state instanceof NVPreLoadedState) {
          this.loading = state.loading;
       let response = state.data;   
      if(response != null)
      {
        // process raw data
        if(response.data === null || response.data === 'NA')
        {
         this.navdata = [];
         this.len = 0;
         return;
        }
        this.navdata = JSON.parse(response.data);
        this.len = Object.keys(this.navdata).length;
        if(Object.keys(this.navdata).length === 0)
        {
         return;
        }
        let presponse = JSON.parse(response.data);
        this.responsedata = presponse;
        let res = this.createLinks(null);
        if(filter !== undefined && filter != null && filter.startpage === true)
        {
         let data = this.showEntryPageData(res);
         this.pathDataService = new PathAnalyticsDataService(data);
        }
       else{
         this.pathDataService = new PathAnalyticsDataService(res);
        }
        if(this.pathDataService.refinedData != null)
        {
          this.navdata = this.pathDataService;
          this.maxnodelength = this.pathDataService.maxNodeLength * 100;
          this.maxSankeyChartDepth = this.pathDataService.maxSankeyChartDepth * 450;
        }
        this.getTotalCounts(this.responsedata,null);
      }
     }
    });
 }

setValue()
{
 if(this.filter != undefined)
 {
  let f = JSON.parse(this.filter);

  let val = this.getDimType(this.dimType);
  f.filter.dimType = val;
  f.filter.dimName = this.dimType;
  if(this.dimType === 'EntryPage')
   f.filter.startpage = true;
  else
   f.filter.startpage = false;
  if(f.filter.browsers !== undefined && f.filter.browsers !== null)
   f.filter.browsers = null;
  if(f.filter.os !== undefined && f.filter.os !== null)
   f.filter.os = null;
  if(f.filter.locations !== undefined && f.filter.location !== null)
   f.filter.location = null;
  if(f.filter.devices !== undefined && f.filter.devices !== null)
   f.filter.devices = null;
   for(let i = 0;i<f.filterCriteriaList.length;i++)
   {
     if(f.filterCriteriaList[i].name === "Dimension Type")
      f.filterCriteriaList[i].value = this.dimType;
      if(this.dimType === undefined)
      {
       f.filterCriteriaList[i].value = 'Browser';
       f.filter.dimType = 0;
      }
    if(f.filterCriteriaList[i].name === 'Browser' || f.filterCriteriaList[i].name === 'OS' || f.filterCriteriaList[i].name === 'Location' || f.filterCriteriaList[i].name === 'Device')
        continue;
   }
   this.setFilterCriteria(f,f.filter.timeFilter);
   this.onChange.emit(f);
  }
  else
  {
    let filter = {};
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
    filter["timeFilter"].startTime =  startT;
    filter["timeFilter"].endTime =  endT;
    filter["dimType"] =  this.getDimType(this.dimType);
    this.onChange.emit(filter);
  }
 }
  
 getDimType(dimval)
 {
  if(dimval === 'Browser')
    return 0;
  else if(dimval === 'OS')
    return 3
  else if(dimval === 'Location')
    return 1
  else if(dimval === 'Device')
   return 2;
  else if(dimval === 'Referrer')
   return 4;
  else if(dimval === 'EntryPage')
   return 1;
 }


 setFilterCriteria(filterc,timefilter)
 {
   let filterp = filterc;
   //PathanalysisfilterComponent.filterhtml = "";
   let filterCriteria = filterp.filterCriteriaList;
   let tfilter = timefilter;
   if(tfilter.last !== null && tfilter.last !== '') // defined
   {
     // PathanalysisfilterComponent.filterhtml += "Last " + tfilter.last;
   }
   else
   {
      let d = new Date(tfilter.startTime);
      let e = new Date(tfilter.endTime);
      //PathanalysisfilterComponent.filterhtml += tfilter.startTime + " - " + tfilter.endTime;
    }
     for(let i = 0; i < filterCriteria.length;i++)
     {
      if((i < filterCriteria.length - 1))
       {
        // PathanalysisfilterComponent.filterhtml += " , ";
       }
      if(filterCriteria[i].name === 'Page')
      {}
      else
         "";//PathanalysisfilterComponent.filterhtml += " " + filterCriteria[i].name + " : " + filterCriteria[i].value;
    }
 }

  applyFilter(filter: PathAnalyticsFilter) {

    this.filter = filter;
    this.checkforfilter(filter);
  }



  
  
  loadPathGraphData(filter: PathAnalyticsFilter) {
    this.service.LoadPathAnalyticsData(filter, 'pagePerformanceFilter').subscribe((state) => {
      if (state instanceof PathAnalyticsLoadingState) {
       
      } else if (state instanceof PathAnalyticsLoadedState) {
        this.graph0Data.loading = false;
        //calculate overall graph data. 
        let data = state.data as any[];
             } else if (state instanceof PathAnalyticsErrorState) {
        this.graph0Data.loading = false;
        this.graph0Data.error = {
          message: 'Error in loading Path analytics data'
        }
      }
    });
  }

  sortFunction(a, b) {
    if (a[0] === b[0]) {
      return 0;
    }
    else {
      return (a[0] < b[0]) ? -1 : 1;
    }
  }

  calculateGraph0Data(data: any, metric: string) {
    let sessionCount = [];
    let pageviews = [];
    let ordertotal = [];
    let ordercount = [];
    let conversion = [];

    let res = data.sort(this.sortFunction);

    let categories = [];
    for (let r = 0; r < res.length; r++)
    {
           categories.push(res[r][0]);
           sessionCount.push(parseFloat(res[r][1]));
           pageviews.push(parseFloat(res[r][2]));
           ordertotal.push(parseFloat(res[r][3]));
           ordercount.push(parseFloat(res[r][4]));
           conversion.push(parseFloat(res[r][5]));
    }

    let graphData = {};

    
    this.graph0Data.data = graphData;

    this.graphsData = [];

    const me = this;
    setTimeout(() => {
      this.graphsData = [this.graph0Data, this.graph1Data, this.graph2Data]
    }, 0);
    
  }

  loadOptimizedPagePerformanceGraphData(filter: PathAnalyticsFilter) {
    this.service.LoadPathAnalyticsData(filter, 'pagePathList').subscribe((state) => {
      if (state instanceof PathAnalyticsLoadingState) {

      } else if (state instanceof PathAnalyticsLoadedState) {

      } else if (state instanceof PathAnalyticsErrorState) {

      }
    });
  }

  loadPagePerformanceImprovementGraphData(filter: PathAnalyticsFilter) {
    this.service.LoadPathAnalyticsData(filter, 'pagePathList').subscribe((state) => {
      if (state instanceof PathAnalyticsLoadingState) {

      } else if (state instanceof PathAnalyticsLoadedState) {

      } else if (state instanceof PathAnalyticsErrorState) {

      }
    });
  }

 
  processPathAnalysisRequest(filter)
  {
    this.navdata = null;
   // fetching data for navigation path analysis
     this.httpService.getNavigationPathAnalysisData(filter).subscribe((state: Store.State ) => {
      
      if (state instanceof NVPreLoadingState) {
          this.loading = state.loading;
          this.error = state.error;
       }
 
        if (state instanceof NVPreLoadedState) {
          this.loading = state.loading;
       let response = state.data;   

       if(response != null)
       {
         // process raw data
         if(response.data === null || (response.data === "[]") || ( response.data["Entries"].length === 0 && response.data["Exit"].length === 0 ))
         {
            this.len = 0;
            this.navdata = {};
            return;
         }
         this.len = 1;
         let res = NavigationPath.fillingdata(response,this.metadata);
         this.pathDataService = new PathAnalyticsDataService(res);
         if(this.pathDataService.refinedData != null)
         {
           this.navdata = this.pathDataService;
           this.maxnodelength = this.pathDataService.maxNodeLength * 200;
         }
       }
      }
     });

  }
showData(event)
{
  console.log('====event====',event,event !== undefined,event !== null,event["startPage"] == false);
  if(event !== undefined && event["startPage"] == false)
  {
   this.totalCount = 0;
   let res = this.createLinks(event["name"]);
   this.pathDataService = new PathAnalyticsDataService(res);
   this.getTotalCounts(this.responsedata,event["name"]);
   if(this.pathDataService.refinedData != null)
    {
          this.navdata = this.pathDataService;
          this.maxnodelength = this.pathDataService.maxNodeLength * 100;
          this.maxSankeyChartDepth = this.pathDataService.maxSankeyChartDepth * 450;
    }
  }
 else
  {
    let data = [];
    if(event !== undefined && event !== null && event["name"] !== null)
    {
      data = this.createLinksForPage(event.name);
    }
    else
    {
      let res = this.createLinks(null);
      data = this.showEntryPageData(res);
    }
    this.pathDataService = new PathAnalyticsDataService(data);
    if(this.pathDataService.refinedData != null)
    {
          this.navdata = this.pathDataService;
          this.maxnodelength = this.pathDataService.maxNodeLength * 100;
          this.maxSankeyChartDepth = this.pathDataService.maxSankeyChartDepth * 450;
    }
  }
}


showEntryPageData(response)
{
  let r = response;
  for(var i = 0;i<r.length;i++)
  {
    if(r[i].depth === 1)
    {
      r[i].source = r[i].target;
    }
  }
  return r;
}

getTotalCounts(resdata,name)
{
  let data = resdata;
  let dimkeys = Object.keys(data);
  // for each dimension element
  for(let i = 0; i < dimkeys.length; i++)
  {
    if(name === null)
      this.totalCount += data[dimkeys[i]].totalVisit;
    if(name !== null && dimkeys[i] === name)
      this.totalCount = data[dimkeys[i]].totalVisit;
  }
}

createLinksForPage(name)
{
 let rawLinks = [];
 let data = this.responsedata;
 let dimkeys = Object.keys(data);
 // for each dimension element
 for(let i = 0; i < dimkeys.length; i++)
 {
    let dimension = data[dimkeys[i]];
    let depth = 1;
    let pageKeys = Object.keys(dimension.pages);
    for(let j = 0; j < pageKeys.length; j++)
    {
     let page = dimension.pages[pageKeys[j]];
     if(this.metadata.getPageName(parseInt(pageKeys[j])).name === name){
      rawLinks.push(new RawLinks(this.metadata.getPageName(parseInt(pageKeys[j])).name,pageKeys[j],depth,page.totalVisit,this.metadata));
      this.addNextPageLinks(pageKeys[j],page,rawLinks,depth);
     }
    }
  }
 return rawLinks;
}

addNextPageLinks(pagekey,page,rawLinks,depth)
{
  let nextPageKeys = Object.keys(page.nextPage);
  depth++;
  if(nextPageKeys.length == 0) {
    rawLinks.push(new RawLinks(pagekey,'EXIT',depth,page.totalDrop,this.metadata));
    return;
  }
  if(page.totalDrop > 0)
  {
    rawLinks.push(new RawLinks(pagekey,'EXIT',depth,page.totalDrop,this.metadata));
  }

  //depth++;
  for(let i = 0; i < nextPageKeys.length; i++)
  {

    let nextPage = page.nextPage[nextPageKeys[i]];
    rawLinks.push(new RawLinks(pagekey,nextPageKeys[i],depth,nextPage.totalVisit,this.metadata));
    this.addNextPageLinks(nextPageKeys[i],nextPage,rawLinks,depth);
  }
}

createLinks(filter)
{
  let rawLinks = [];
  let data = this.responsedata;
  let dimkeys = Object.keys(data);
  // for each dimension element
  for(let i = 0; i < dimkeys.length; i++)
  {
    if(filter !== null && filter !== dimkeys[i]) continue;
    let dimension = data[dimkeys[i]];
    let depth = 1;
    let pageKeys = Object.keys(dimension.pages);

    for(let j = 0; j < pageKeys.length; j++)
    {
     let page = dimension.pages[pageKeys[j]];
     rawLinks.push(new RawLinks(dimkeys[i],pageKeys[j],depth,page.totalVisit,this.metadata));
     this.addNextPageLinks(pageKeys[j],page,rawLinks,depth);
    }
    
  }
 rawLinks.sort(
      function(a, b){return parseInt(a.depth) - parseInt(b.depth)});
 return rawLinks;
}


}


export class RawLinks
{
  source:string;
  target:string;
  value:number;
  depth:number;

  constructor(source,target,depth,value,metadata)
  {
    if(depth > 1)
     this.source = metadata.getPageName(parseInt(source)).name;
    else
     this.source = source;
     if(target === 'EXIT')
      this.target = 'EXIT';
     else
      this.target = metadata.getPageName(parseInt(target)).name;
     this.value = value;
     this.depth = depth;
  }
}

