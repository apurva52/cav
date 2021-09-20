import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { MenuItem, MessageService } from 'primeng';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import { Store } from 'src/app/core/store/store';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { CommonfilterComponent } from 'src/app/shared/search-sidebar/commonfilter/commonfilter.component';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { NfLogsService } from '../home/logstab/service/nf-logs.service';
import { QuerySettingsService } from '../query-settings/service/query-settings.service';
import { QuerySettingsLoadedState, QuerySettingsLoadingErrorState, QuerySettingsLoadingState } from '../query-settings/service/query-settings.state';
import { DdrDataModelService } from '../tools/actions/dumps/service/ddr-data-model.service';
import { mappingLoadedState, mappingLoadingErrorState, mappingLoadingState, visualLoadedState, visualLoadingErrorState, visualLoadingState } from './service/visualization-state';
import { VisualizationService } from './service/visualization.service';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  selector: 'app-create-visualization',
  templateUrl: './create-visualization.component.html',
  styleUrls: ['./create-visualization.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe],
})
export class CreateVisualizationComponent implements OnInit {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  // breadcrumb: MenuItem[];
  checked: boolean = false;
  selectedCountry: any;        
  countries: any[];
  filteredCountries: any[];
  selectedCountryAdvanced: any[];
  filteredBrands: any[];
  checkTab: number = 0;
  widgetReportItems: MenuItem[];
  settingOptions: MenuItem[];
  isShowColumnFilter: boolean = false;
  query: any;
  mapping_fieldsdata: any;
  empty: boolean;
  Error: any;
  loading: boolean;
  optionConfigValue = {legendPosition: {label: 'right'}, tooltipEnable: true, gaugeMinVal: 0, gaugeMaxVal: 100, gaugeLevelArr: []}
  bucketAggregation=[{id: '2', aggType: 'date_histogram', field: '@timestamp',interval:{name:'auto',val:'15m'},customName: '@timestamp'}];
  timeZone: any;
  metricAggregation=[{id: '1', aggType: 'count', field: '', customName: 'count'}];
  visual_fieldsdata: any;
  Xaxis_data=[]
  Yaxis_data=[];
  legendValue=[];
  chart_type: any;
  querySettingsdata: any;
  pipetemindexvalue: any;
   _sourceformatvalue: any;
  tracktotalhitsvalue: any;
  samplesizevalue: any;
  sortoptionsvalue: any;
  analyzewildcardvalue: any;
  log_table_data: boolean;
  visTimeFilterChangeSubscription: Subscription;
  timebarService: any;
  gte: number;
  lte: number;
  indexpattern="*"
query_string="*"
  vis_resp: any;
  stats_data: any;
  hitsValue=0
  xAxisTitle:string="@timestamp";
  yAxisTitle:string="count";
  tableData:[];
  customXLabel = '';
  customYLabel = '';
  sorting_input: boolean;
 sorting:string="desc"
  xaxisLabel: any;
  title: any;
  userPermission: any;
  // customlabel: any;
  constructor(private vs:VisualizationService,private _ddrData:DdrDataModelService,private router:Router,private messageService:MessageService,private route:ActivatedRoute,private qs:QuerySettingsService,private timebarservice:TimebarService,public breadcrumb: BreadcrumbService,public sessionService: SessionService) { 
    let me=this
    console.log("cons")
   
    CommonfilterComponent.getInstance().subscribe(
      (commonTimeFilterComponent: CommonfilterComponent) => {
         console.log(commonTimeFilterComponent.onChange)
        if (me.visTimeFilterChangeSubscription) {
          console.log("subs")
          me.visTimeFilterChangeSubscription.unsubscribe();
        }
         
        me.visTimeFilterChangeSubscription = commonTimeFilterComponent.onChange.subscribe(
          (data) => {
            console.log(data)
            // TO-DO : Time Period state management
            if (
              commonTimeFilterComponent.type === 'CUSTOM' &&
              commonTimeFilterComponent.customTimeFrame &&
              commonTimeFilterComponent.customTimeFrame.length === 2
            ){
              me.vs.setDuration(me.vs.createDuration(data.customTimeFrame[0].valueOf(), data.customTimeFrame[1].valueOf(),data.timePeriod.selected.id,+data.viewBy.selected.id));
            console.log(me.vs.getDuration());
            this.gte=this.vs.getDuration().gte
            this.lte=this.vs.getDuration().lte
            this.onload(this.vs.getDuration().gte,this.vs.getDuration().lte)
            }
            else if(data.type=="PRESET"&&!route.queryParams['value'].title){
              console.log(route.queryParams['value'])
            me.vs.setDuration(me.vs.createDuration(data.temporaryTimeFrame[1],data.temporaryTimeFrame[2],data.timePeriod.selected.id,+data.viewBy.selected.id));
            console.log(me.vs.getDuration());
            this.gte=this.vs.getDuration().gte
            this.lte=this.vs.getDuration().lte
            this.onload(this.vs.getDuration().gte,this.vs.getDuration().lte)
          }
         
        }
        );
      }
    );
    console.log(me.visTimeFilterChangeSubscription)
  }

  ngOnInit(): void {
    const me = this;
    me.route.queryParams.subscribe((data)=>{
      console.log(data)
      if(data.name){
      
      this.chart_type=data.name
      }
    })
    const perArray = this.sessionService.session.permissions;
    const nfPermission = perArray.filter((arr) => arr.key === 'NetforestUI');
    const permissionArr = nfPermission[0].permissions.filter((nfPer) => nfPer.feature === 'Visualizations');
    this.userPermission = permissionArr[0].permission;
    console.log('User permission is ::', this.userPermission);
  
console.log("intititit")
   



    // me.breadcrumb = [
    //   { label: 'Home', routerLink: '/home/dashboard' },
    //   { label: 'My Library' },
    //   { label: 'Visualization' },
    //   { label: 'Create Visualization'},
    // ];

    me.countries = [
      { name: 'index=* query=*' },
    { name: 'index=* maxdocs=10000 query=*' }
    ];

    me.widgetReportItems = [
      {label: 'CHART', command: (event: any) => {me.checkTab = 0 }},
      {label: 'TABLE', command: (event: any) => {me.checkTab = 1 }},
      {label: 'REQUEST', command: (event: any) => {me.checkTab = 2 }},
      {label: 'RESPONSE', command: (event: any) => {me.checkTab = 3 }},
      {label: 'STATISTICS', command: (event: any) => {me.checkTab = 4 }}   
    ];

    me.settingOptions = [
      { label: 'Alerts'},
      { label: 'Dashboard'},
      { label: 'Tier Status'}
    ];
    this.qs.initialsettings().subscribe(
      (state: Store.State) => {
        if (state instanceof QuerySettingsLoadingState) {
          this.onqueryDataLoading(state);
          return;
        }

        if (state instanceof QuerySettingsLoadedState) {
          this.onqueryDataLoaded(state);
          return;
        }
      },
      (state: QuerySettingsLoadingErrorState) => {
        this.onqueryDataLoadingError(state);
      }
    );

   
 

  }

  zoomfun(val) {
    console.log(val)
    console.log('datachanging due to zoom')
    this.gte = val.gte;
    this.lte = val.lte;
    this.visData()
  }
  
NDNVIntegration(drillDownData){
  let productName = drillDownData.prodName;
  let rowsData = drillDownData.rowData
  let startTime;
  let flowPath = rowsData.filter(ele => ele.label == 'fp');
  var flowPathSplit = flowPath[0].value.split(":");
  if (productName == 'nd') {
      this._ddrData.isFromNF = '1';
      this._ddrData.flowpathID = flowPathSplit[1].match(/\d+/);
      this._ddrData.startTime = startTime;
      this._ddrData.testRun = flowPathSplit[0].match(/\d+/);
      this.router.navigate(['/ddr/flowpath']);

  } else if(productName == 'nvr') {
      this.router.navigate(['/play-sessions'],{queryParams:{strOprName:'replay',testRun:flowPathSplit[0].match(/\d+/),flowpathID:(flowPathSplit[3]?flowPathSplit[3].match(/\d+/):flowPathSplit[1].match(/\d+/)),sid:(flowPathSplit[4]?flowPathSplit[4].match(/\d+/):''),pageInstance:(flowPathSplit[5]?flowPathSplit[5].match(/\d+/):0),strStartTime:startTime}});
  } else if (productName == 'nvt') {
      this.router.navigate(['/page-detail'],{queryParams:{strOprName:'timing',testRun:flowPathSplit[0].match(/\d+/),flowpathID:(flowPathSplit[3]?flowPathSplit[3].match(/\d+/):flowPathSplit[1].match(/\d+/)),sid:(flowPathSplit[4]?flowPathSplit[4].match(/\d+/):''),pageInstance:(flowPathSplit[5]?flowPathSplit[5].match(/\d+/):0),strStartTime:startTime}});
  } else {
    this.query = 'index=* query=fpi:"' + flowPathSplit[1].match(/\d+/)+'"';
    document.getElementById('searchQuery')['value'] = this.query;
    this.visData();
  }
}

  onqueryDataLoading(state: QuerySettingsLoadingState) {
    const me = this;
    me.querySettingsdata = null;
    me.empty = false;
    me.Error = null;
   // me.loading = true;
  }

  onqueryDataLoadingError(state: QuerySettingsLoadingErrorState) {
    const me = this;
    me.querySettingsdata = null;
    me.empty = false;
    me.Error = true;
 //   me.loading = true;
  }

  onqueryDataLoaded(state: QuerySettingsLoadedState) {
    const me = this;
    me.querySettingsdata = state.data
    console.log(me.querySettingsdata)
  me.querySettingsdata.forEach(element => {
      console.log(element.name)
      if(element.name=="pipetempindex"){
       this.pipetemindexvalue=element.value
      }
      if(element.name=="_sourceformat"){
       this._sourceformatvalue=element.value
      }
      if(element.name==" Track_Total_Hits"){
       this.tracktotalhitsvalue=element.value
      }
      if(element.name=="discover:sampleSize"){
       this.samplesizevalue=element.value
      }
      if(element.name=="sort:options"){
        this.sortoptionsvalue=element.value
       
      }
      if(element.name=="query:queryString:options"){

        this.analyzewildcardvalue=element.value

      }


    });
    if(me.querySettingsdata.length!=0){
    //  console.log(this.gte)
     // this.onload()
     me.route.queryParams.subscribe((data)=>{
      console.log(data)
      if(data.title){
        console.log(data.title)
        this.chart_type=data.chartType
        this.query=data.query
        this.gte=data.gte
        this.lte=data.lte
        this.title=data.title
        this.vs.fieldDataCarrier.subscribe(data=>{
          console.log(data)
          this.metricAggregation=data.met
          this.bucketAggregation=data.buck

          })
          this.visData()

      }
    })


    }

  }
 

  
   
    
  
    visinitialLoading(state:visualLoadingState){
      const me = this;
      me.visual_fieldsdata = null;
      me.empty = false;
      me.Error = null;
      me.loading = true;
    }

 visinitialLoadingError(state:visualLoadingErrorState){
  const me = this;
  me.visual_fieldsdata = null;
  me.empty = false;
  console.log(state.error)
  me.Error = state.error['error'].text
  console.log(this.Error)
  me.messageService.add({
    severity: 'error',
    summary: me.Error,
    detail: "Node Error",
  });
  me.loading = false;
 }

 visinitialLoaded(state:visualLoadedState){
  const me = this;
  this.Yaxis_data = [];
  this.legendValue = [];
console.log(state.data)
  if(state.data.error){
    this.hitsValue=0
    me.messageService.add({
      severity: 'error',
      summary: state.data.error,
     
    });
    me.loading = false;
    }
    
    else{
  me.visual_fieldsdata = state.data;
  this.vis_resp=this.visual_fieldsdata;
  this.stats_data=this.visual_fieldsdata[0].statsData;
  console.log(me.visual_fieldsdata[0])
 this.Xaxis_data=me.visual_fieldsdata[0].arrTimeStamp;
 this.xAxisTitle= me.customXLabel=='' ? me.visual_fieldsdata[0].xAxisTitle : me.customXLabel;
 this.yAxisTitle= me.customYLabel=='' ? me.visual_fieldsdata[0].yAxisTitle : me.customYLabel;
 this.tableData = me.visual_fieldsdata[0].tableData;
     
 for (let i = 0; i < me.visual_fieldsdata[0].visualizationData.length; i++) {
  this.Yaxis_data.push(me.visual_fieldsdata[0].visualizationData[i].data)
  if (me.visual_fieldsdata[0].visualizationData[i].vectorName == '_all') {
    this.legendValue.push(me.visual_fieldsdata[0].visualizationData[i].metricName)
  } else {
    this.legendValue.push(me.visual_fieldsdata[0].visualizationData[i].vectorName)
  }
  console.log('========legendvalue=====', this.legendValue)
}
 console.log(this.Yaxis_data)
 this.log_table_data=me.visual_fieldsdata[0].logTableData
 console.log(this.log_table_data)
  me.empty = false;
  me.Error = null;
  me.loading = false;

 }
}

clearQuery(){
  this.query = 'index=* query=*';
  document.getElementById('searchQuery')['value'] = this.query;
  this.visData();
}
getOptionVal(optionValue) {
   this.optionConfigValue.legendPosition = optionValue.positionLegend;
   this.optionConfigValue.tooltipEnable = optionValue.tooltipEnable;
   this.optionConfigValue.gaugeMaxVal = optionValue.gaugeMaxVal;
   this.optionConfigValue.gaugeMinVal = optionValue.gaugeMinVal;
   this.optionConfigValue.gaugeLevelArr = optionValue.gaugeLevelArr;
  }

  filterCountry(event) {
    const me = this;

    let filtered : any[] = [];
    let query = event.query;
    let queryArray = query.split("");
    for(let i = 0; i < me.countries.length; i++) {
        let country = me.countries[i];
        if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(country);
        }
    }
    
    me.filteredCountries = filtered;
    if (queryArray.length <= 15) {
      this.query = this.filteredCountries[0]['name']
      console.log(this.query)
    } else {
      this.query = query
    }

}
xcustomlabel(val){
  console.log(val)
  if(val){
    this.customXLabel=val
  }
  else {
    this.customXLabel='';
  }
}
ycustomlabel(val){
  console.log(val)
  if(val){
    this.customYLabel=val
  }
  else {
    this.customYLabel=''
  }
}
vis_data(val){
  console.log(val)
 
  this.metricAggregation=val.met
  this.bucketAggregation=val.buck
  this.customXLabel = this.bucketAggregation[0].customName;
  this.customYLabel = this.metricAggregation[0].customName;
  this.visData()
}
sorting_order(sorting_input){
    console.log(sorting_input)
    this.sorting_input=sorting_input
    if(this.sorting_input==true){
     this.sorting="desc"
     console.log(this.sorting)
   }else{
      this.sorting="asc"
   console.log(this.sorting)
   }
  this.visData();
  
  }

visData(){

    let maxdoc_val
    if(!this.route.queryParams['value'].title){
      this.query = document.getElementById('searchQuery')['value'];
    }
   
  if(this.query==undefined || this.query==''){
this.indexpattern="*"
this.query_string="*"
  }
  else if (this.query.startsWith('index=')) {
    
      this.indexpattern = this.query.split(" ")[0].split("=")[1]

      console.log(this.indexpattern)
      if (this.query.indexOf("maxdocs=") > -1) {
        maxdoc_val = this.query.split(" ")[1].split("=")[1]
        this.query_string = this.query.substr(this.query.indexOf("query=") + 6, this.query.length)
        console.log(maxdoc_val);
        console.log(this.query.query_string.query)

      }
      else {
       this. query_string = this.query.substr(this.query.indexOf("query=") + 6, this.query.length)
      }
    }
  
 
  console.log(this.metricAggregation)
  console.log(this.bucketAggregation)
console.log(this.gte)
  this.onload(this.gte,this.lte)

}

onload(gte?,lte?){
  this.loading=true
  console.log(this.sorting)
  this.vs.visualization(this.query_string,this.indexpattern,gte,lte,this.sorting,this.metricAggregation,this.bucketAggregation,this.timeZone,this.pipetemindexvalue,this._sourceformatvalue,this.samplesizevalue).subscribe(

    (state: Store.State) => {
      if (state instanceof visualLoadingState) {
        this.visinitialLoading(state);
        return;
      }
  
      if (state instanceof visualLoadedState) {
        this.visinitialLoaded(state);
        return;
      }
    },
    (state: visualLoadingErrorState) => {
      this.visinitialLoadingError(state);
    }
  );
}

}
