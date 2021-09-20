import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { from, Subscription } from 'rxjs';
import { MenuItem, MessageService } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { SaveDialogComponent } from 'src/app/shared/save-dialog/save-dialog.component';
import { LOGS_DATA } from './service/logstab.dummy';
import { LogsData } from './service/logstab.model';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { NfLogsService } from './service/nf-logs.service';
import { Store } from 'src/app/core/store/store';
import { AggDataLoadedState, AggDataLoadingErrorState, AggDataLoadingState, FieldsDataLoadedState, FieldsDataLoadingErrorState, FieldsDataLoadingState, LogsLoadedState, LogsLoadingErrorState, LogsLoadingState } from './service/logstab.state';
import { QuerySettingsService } from '../../query-settings/service/query-settings.service';
import { QuerySettingsLoadedState, QuerySettingsLoadingErrorState, QuerySettingsLoadingState } from '../../query-settings/service/query-settings.state';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { TimebarValue, TimebarValueInput } from 'src/app/shared/time-bar/service/time-bar.model';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { gte } from 'lodash';
import { DdrDataModelService } from '../../tools/actions/dumps/service/ddr-data-model.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';
import * as moment from 'moment';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  selector: 'app-logstab',
  templateUrl: './logstab.component.html',
  styleUrls: ['./logstab.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LogstabComponent implements OnInit {
  error: AppError;
  empty: boolean;
  loading: boolean;
  data: any;
  filteredReports: any[];
  reportitem: any[];
  chipsValues: string[] = [];
  widgetReportItems: MenuItem[];
  settingOptions: MenuItem[];
  checkTab: number = 0;
  checked: boolean = true;
  isOn: boolean;
  menuOptions: MenuItem[];
  badgeValue: string;
  selectedText: string = '';
  hitsValue=0
  isFromDDR = false;
  isTimeChangeByTB=false;
  searchVal=false
  isCustomTable= false;
  isCreateTable=false;
  sorting:string="desc"
  sorting_input:boolean=true;
  @Output() rowClick = new EventEmitter<boolean>();

  @ViewChild('saveSearchData', { read: SaveDialogComponent })
  private saveSearchData: SaveDialogComponent;

  showExpandedDiv = true;
  chartXaxisData = [];
  chartYaxisData = [];
  query='index=* query=*';
  tabledata = [];
  RowData: any;
  querySettingsdata:any
  Error: any
  pipetemindexvalue: boolean;
  _sourceformatvalue: any;
  tracktotalhitsvalue: number;
  isLargeDataSet: boolean = false;
  samplesizevalue: number;
  sortoptionsvalue: any;
  analyzewildcardvalue: any;
  responseformat:any
  fieldsdata:any
  stats=[];
  exist_arr=[]
  minus_arr=[]
  plus_arr=[]
  maxDocs: any;
  kpiURL = '/kpi';
  endToEndURL = '/end-to-end';
  geoLocationURL = '/geo-location';
  dbServerSubscriber : Subscription;
  gte: any;
  lte: any;
  title: any;
  initialdata: boolean = false;
  filtervalue: any;
  interval: any;
  timeZone: any;
  userPermission: any;
  constructor(private cd: ChangeDetectorRef,private _ddrData:DdrDataModelService,public breadcrumb:BreadcrumbService,private route:ActivatedRoute, private schedulerService: SchedulerService,private messageService: MessageService,private nf: NfLogsService, private router:Router, private tb: TimebarService,private qs:QuerySettingsService,public sessionService: SessionService) {}

  ngOnInit(): void {
    this.interval=this.tb.getValue().viewBy.selected.id+'s'
  this.gte=moment(this.tb.getValue().time.frameStart.value).format('MM/DD/YYYY HH:mm:ss')
  this.lte=moment(this.tb.getValue().time.frameEnd.value).format('MM/DD/YYYY HH:mm:ss')
    this.nf.timeDataCarrier.subscribe((data) => {
      console.log(data)
      if (data['time'] == true) {
        // this.searchVal=true
        this.isTimeChangeByTB = true;
        this.gte = undefined;
        this.lte = undefined;
        this.interval=data['view']+'s'
        this.fetchData();
      }
    })
   
    
   console.log(this.interval)
    this.schedulerService.unsubscribe('global-timebar');
    const perArray = this.sessionService.session.permissions;
    const nfPermission = perArray.filter((arr) => arr.key === 'NetforestUI');
    const permissionArr = nfPermission[0].permissions.filter((nfPer) => nfPer.feature === 'Searches');
    this.userPermission = permissionArr[0].permission;
    console.log('User permission is ::', this.userPermission);
    console.log(this.tb.getValue())
    const me = this;
    this.searchVal=true
    me.loading = true;
    me.settingOptions = [
      { label: 'Alerts' },
      { label: 'Dashboard' },
      { label: 'Tier Status' },
    ];
    me.widgetReportItems = [
      {
        label: 'HISTOGRAM',
        command: (event: any) => {
          me.checkTab = 0;
        },
      },
      {
        label: 'TABLE',
        command: (event: any) => {
          me.checkTab = 1;
        },
      },
      {
        label: 'REQUEST',
        command: (event: any) => {
          me.checkTab = 2;
        },
      },
      {
        label: 'RESPONSE',
        command: (event: any) => {
          me.checkTab = 3;
        },
      },
      {
        label: 'STATISTICS',
        command: (event: any) => {
          me.checkTab = 4;
        },
      },
    ];

    me.data = JSON.parse(JSON.stringify(LOGS_DATA));
   
    me.menuOptions = [
      // { label: 'Enable' },
      { label: 'Disable All',  command: (event: any) => {
        me.chipsValues = [];
        me.plus_arr=[]
        me.minus_arr=[]
        me.exist_arr=[]
        this.fetchData()
      }, },
      // { label: 'Pin' },
      // { label: 'Unpin' },
      // { label: 'Invert' },
      // { label: 'Toggle' },
      // { label: 'Remove' }
    ]
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

  onqueryDataLoading(state: QuerySettingsLoadingState) {
    const me = this;
    me.querySettingsdata = null;
    me.empty = false;
    me.error = null;
   
  }

  onqueryDataLoadingError(state: QuerySettingsLoadingErrorState) {
    const me = this;
    me.querySettingsdata = null;
    me.empty = false;
    me.Error = state.error['error'].text;
    
    this.searchVal=false
    this.loading=false
    console.log(this.Error)
    me.messageService.add({
      severity: 'error',
      summary: "Node Error:-",
      detail: me.Error,
      sticky: false,
      life: 10000
    });
   
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
      if(element.name=="track_total_hits"){
       this.tracktotalhitsvalue=element.value
       console.log(element.value)
      }
      if(element.name=="dateFormat:tz"){
        this.timeZone=element.value
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
      if(element.name=="responseformat"){

        this.responseformat=element.value

      }
    });
    this.route.queryParams.subscribe((data)=>{
      console.log(data)
      if(data.query){
      this.query=data.query
      document.getElementById('searchQuery')['value'] = this.query;
      this.gte=data.gte
      this.lte=data.lte
      // this.gte=moment(data.gte).format('HH:mm:ss YYYY/MM/DD')
      // this.lte=moment(data.lte).format('HH:mm:ss YYYY/MM/DD')
      this.title=data.title
      this.breadcrumb.removeAll();
      this.initialdata=true
      this.fetchData()
      }
      else if (data.queryStr && this.isTimeChangeByTB == false) {
          console.log('=======logstab query parameter =========')
          this.breadcrumb.add({ label: 'Logs', routerLink: '/home/logs', queryParams:data})
          this.isFromDDR = true;
          this.query = 'index=* query=' + data.queryStr;
          document.getElementById('searchQuery')['value'] = this.query;
          this.gte = data.startTime;
          this.lte = data.endTime;
          this.initialdata=true
          this.fetchData();
      }
      else {
        this.breadcrumb.removeAll();
      }
     
    })

    this.tb.instance.getInstance().subscribe(() => {
      const value = me.tb.getValue();
      const timePeriod = _.get(value, 'timePeriod.selected.id', null);
      const viewBy = _.get(value, 'viewBy.selected.id', null);
      const st = _.get(value, 'time.frameStart.value', null);
      const et = _.get(value, 'time.frameEnd.value', null);
      console.log(viewBy)

      if (timePeriod) {
        me.kpiURL += '/graphical';
        me.endToEndURL += '/graphical-tier/' + timePeriod + '/' + viewBy;
        me.geoLocationURL += '/details/' + timePeriod + '/' + st + '/' + et;
      }

      let timebarValueInput: TimebarValueInput = {
        timePeriod: value.timePeriod.selected.id,
        viewBy: value.viewBy.selected.id,
        running: value.running,
        discontinued: value.discontinued,
      };
      // if(this.gte!=undefined&&this.lte!=undefined){
      //   timebarValueInput.timePeriod="SPECIFIED_TIME_"+this.gte +"_"+this.lte+"_"+value.viewBy.selected.id
       
        
      // }
console.log(timebarValueInput)
      me.tb
        .prepareValue(timebarValueInput, me.tb.getValue())
        .subscribe((value: TimebarValue) => {
          setTimeout(() => {
            me.tb.setValue(value);
          });
        });
    });
if(me.querySettingsdata.length!=0 && !this.initialdata){
  this.nf.clientMsearch("*","*", this.tb.getValue().time.frameStart.value, this.tb.getValue().time.frameEnd.value, this.sorting, this.samplesizevalue, this.pipetemindexvalue,this.tracktotalhitsvalue,this._sourceformatvalue,this.plus_arr,this.minus_arr,this.exist_arr,this.maxDocs,this.isLargeDataSet,this.responseformat,this.interval,this.timeZone).subscribe(

    (state: Store.State) => {
      if (state instanceof LogsLoadingState) {
        this.oninitialLoading(state);
        return;
      }
  
      if (state instanceof LogsLoadedState) {
        this.oninitialLoaded(state);
        return;
      }
    },
    (state: LogsLoadingErrorState) => {
      this.oninitialLoadingError(state);
    }
  );
}


  }

  oninitialLoading(state: LogsLoadingState) {
    const me = this;
    me.data.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  oninitialLoadingError(state: LogsLoadingErrorState) {
    const me = this;
    me.data.data = null;
    me.empty = false;
    me.error = state.error;
    me.loading = true;
  }

  oninitialLoaded(state: LogsLoadedState) {
    const me = this;
  //  me.data.data = []
    console.log(state)
    document.getElementById('searchQuery')['value'] = me.query;
    me.data.data = state.data
    console.log(me.data.data)
    this.searchVal=false
    me.loading = false
    if(state.data['response']){
      this.hitsValue=0
      me.messageService.add({
        severity: 'error',
        summary: state.data['response'],
        sticky: false,
        life: 10000
      });
      
      }
      
      else{
      this.nf.getAggData().subscribe((state:Store.State) => {
            console.log("aggdata", state)
            
              if (state instanceof AggDataLoadingState) {
                this.onaggLoading(state);
                return;
              }
      
              if (state instanceof AggDataLoadedState) {
                this.onaggLoaded(state);
                return;
              }
            },
            (state: AggDataLoadingErrorState) => {
              this.onaggLoadingError(state);
            }
          );

          this.nf.getFieldsData().subscribe((state:Store.State) => {
            console.log("aggdata", state)
            
              if (state instanceof FieldsDataLoadingState) {
                this.onFieldsLoading(state);
                return;
              }
      
              if (state instanceof FieldsDataLoadedState) {
                this.onFieldsLoaded(state);
                return;
              }
            },
            (state: FieldsDataLoadingErrorState) => {
              this.onFieldsLoadingError(state);
            }
          ); 
            // this.chartXaxisData = state.data.timestamp
            // this.chartYaxisData = state.data.data
            // this.tabledata = state.data.tabledata
          
        
    }
  }

  setAutoCompleteTextInQuery(){
    this.query = document.getElementById('searchQuery')['value'];
  }
  filterFields(event) {
   
    let filtered: any[] = [];
    let query = event.query;
    let queryArray = query.split("");
    for (let i = 0; i < this.data.autocompleteData.length; i++) {
      let reportitem = this.data.autocompleteData[i];
      if (reportitem.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(reportitem);
      }
    }

    this.filteredReports = filtered;
    // if (queryArray.length <= 15) {
    //   this.query = this.filteredReports[0]['name']
    //   console.log(this.query)
    // } else {
    //   this.query = query
    // }
  }
  plus_filter(event){
    console.log(event)
    this.plus_arr.push(event)
    this.fetchData()
  }
  minus_filter(event){
    console.log(event)
    this.minus_arr.push(event)
    this.fetchData()
  }
  exist_filter(event){
    console.log(event)
    this.exist_arr.push(event)
    this.fetchData()
  }

  clearQuery(){
    this.query = 'index=* query=*';
    this.isCustomTable=false;
    document.getElementById('searchQuery')['value'] = this.query;
    this.fetchData();
  }

  zoomfun(val) {
        let zoomarr = Object.values(val);
    zoomarr = zoomarr.sort(function(a, b) { return a > b ? 1 : -1 });
    this.gte = zoomarr[0];
    this.lte = zoomarr[1];
   this.fetchData();
  }

  getFpi(tabData,isCheckForFpi) {
      let fp = tabData.filter(ele => ele.label == 'fp');
      if (fp.length > 0 ) {
        if(isCheckForFpi == true) {
          return true;
        }
        return fp[0].value.split(':')[1];
      }
      else {
        return false
      }
  }

  NDNVIntegration(productName, rowsData){
    let timestamp = rowsData.filter(ele => ele.label == '@timestamp');
    let startTime = moment(timestamp[0].value, 'MMMM Do YYYY, hh:mm:ss.SSS').valueOf();
    let flowPath = rowsData.filter(ele => ele.label == 'fp');
    var flowPathSplit = flowPath[0].value.split(":");
    if (productName == 'nd') {
        this._ddrData.isFromNF = '1';
        this._ddrData.flowpathID = flowPathSplit[1].match(/\d+/);
        this._ddrData.startTime = startTime.toString();
        this._ddrData.testRun = flowPathSplit[0].match(/\d+/);
        this.router.navigate(['/ddr/flowpath']);

    } else if(productName == 'nvr') {
        this.router.navigate(['/play-sessions'],{queryParams:{strOprName:'replay',testRun:flowPathSplit[0].match(/\d+/),flowpathID:(flowPathSplit[3]?flowPathSplit[3].match(/\d+/):flowPathSplit[1].match(/\d+/)),sid:(flowPathSplit[4]?flowPathSplit[4].match(/\d+/):''),pageInstance:(flowPathSplit[5]?flowPathSplit[5].match(/\d+/):0),strStartTime:startTime}});
    } else if (productName == 'nvt') {
        this.router.navigate(['/page-detail'],{queryParams:{strOprName:'timing',testRun:flowPathSplit[0].match(/\d+/),flowpathID:(flowPathSplit[3]?flowPathSplit[3].match(/\d+/):flowPathSplit[1].match(/\d+/)),sid:(flowPathSplit[4]?flowPathSplit[4].match(/\d+/):''),pageInstance:(flowPathSplit[5]?flowPathSplit[5].match(/\d+/):0),strStartTime:startTime}});
    } else {
      this.query = 'index=* query=fpi:"' + flowPathSplit[1].match(/\d+/)+'"';
      document.getElementById('searchQuery')['value'] = this.query;
      this.fetchData();
    }
  }

  addTableColumn(field) {
    console.log('field is adding:;',field)
    if (this.isCreateTable == false || this.isCustomTable == false) {
      console.log('table added first time')
      this.isCreateTable = true;
      this.data.headers[0].cols.forEach((element,index) => {
         console.log(element.label)
        if(element.label == 'Log Information') {
          this.data.headers[0].cols.splice(index,1);
        }
      });
    }
    let colLength = this.data.headers[0].cols.length
    let fieldObj = {
      label: field,
      valueField: field,
      classes: 'text-left',
      badgeField: true,
      width: '30%',
    }
    this.data.headers[0].cols.splice(colLength-1,0,fieldObj);
  }
  sorting_order() {
    this.sorting_input=!this.sorting_input
    console.log(this.sorting_input);
    this.fetchData();
  }
  searchData(){
    this.gte=undefined;
    this.lte=undefined;
    this.fetchData()
  }

  fetchData() {
  //  this.maxDocs=undefined
  console.log(this.interval)
  if(this.sorting_input==true){
    this. sorting="desc"
    console.log(this.sorting)
  }else{
    this. sorting="asc"
  console.log(this.sorting)
  }
  let from
  let to
  console.log(this.gte)
  if(this.gte!=undefined&&this.lte!=undefined){
    console.log("innnn")
from=this.gte
to=this.lte
console.log(this.tb.getValue().time.frameStart.value)
this.gte=moment(parseInt(this.gte)).format('MM/DD/YYYY HH:mm:ss')
this.lte=moment(parseInt(this.lte)).format('MM/DD/YYYY HH:mm:ss')
  }
  else{
 
    from=this.tb.getValue().time.frameStart.value
to=this.tb.getValue().time.frameEnd.value
this.gte=moment(this.tb.getValue().time.frameStart.value).format('MM/DD/YYYY HH:mm:ss')
this.lte=moment(this.tb.getValue().time.frameEnd.value).format('MM/DD/YYYY HH:mm:ss')
  }
  console.log(from)
  this.isCustomTable = false;
  this.searchVal=true
    console.log(this.query)
  //  console.log(this.tb.getValue())
    if(this.isCreateTable == false){
      this.data.headers[0].cols  = JSON.parse(JSON.stringify(LOGS_DATA.headers[0].cols));
    }
    let indexpattern
    let maxdoc_val
    let query_string
    if(this.query.indexOf('|table') > -1) {
            let tableField = [];
            this.isCustomTable = true;
            this.data.headers[0].cols.splice(1,this.data.headers[0].cols.length-1);
            let tableQuery = this.query.substring(this.query.indexOf('|table') + 7, this.query.length);
            console.log('table query is:::',tableQuery)
            tableField = tableQuery.split(',');
            tableField.forEach(field => {
              this.data.headers[0].cols.push({
                label: field,
                valueField: field,
                classes: 'text-left',
                badgeField: true,
                width: '30%',
              })
            });
            this.data.headers[0].cols.push({
              label: '',
              valueField: 'icon',
              classes: 'text-left',
              iconField: true,
              width: '15%',
            });
          }
    if (this.query.startsWith('index=')) {
    
      indexpattern = this.query.split(" ")[0].split("=")[1]

      console.log(indexpattern)
      if (this.query.indexOf("maxdocs=") > -1) {
        maxdoc_val = this.query.split(" ")[1].split("=")[1]
       this.maxDocs = maxdoc_val
        query_string = this.query.substr(this.query.indexOf("query=") + 6, this.query.length)
        console.log(maxdoc_val);
        console.log(query_string)


      } 
      else {
        maxdoc_val = undefined;
       this.maxDocs = maxdoc_val
        query_string = this.query.substr(this.query.indexOf("query=") + 6, this.query.length)
      }
    }
  
    // console.log(this.tb.getValue().time.frameStart)
    // console.log(this.tb.getValue().time.frameEnd)
    this.nf.clientMsearch(indexpattern, query_string, from, to, this.sorting, this.samplesizevalue, this.pipetemindexvalue,this.tracktotalhitsvalue,this._sourceformatvalue,this.plus_arr,this.minus_arr,this.exist_arr,this.maxDocs,this.isLargeDataSet,this.responseformat,this.interval,this.timeZone).subscribe(
      
     // this.data.data = data
      // if (data) {
      //   this.nf.getAggData().subscribe((data) => {
      //     console.log("aggdata", data)
      //     this.chartXaxisData = data.timestamp
      //     this.chartYaxisData = data.data
      //     this.tabledata = data.tabledata
      //   })
      // }
      
      (state: Store.State) => {
        if (state instanceof LogsLoadingState) {
          this.onLoading(state);
          return;
        }

        if (state instanceof LogsLoadedState) {
          this.onLoaded(state);
          return;
        }
      },
      (state: LogsLoadingErrorState) => {
        this.onLoadingError(state);
      }
    );

  }
  onLoading(state: LogsLoadingState) {
    const me = this;
    // me.data.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  onLoadingError(state: LogsLoadingErrorState) {
    const me = this;
    me.data.data = null;
    me.empty = false;
    me.Error = state.error['error'].text;
    
    this.searchVal=false
    this.loading=false
    console.log(this.Error)
    me.messageService.add({
      severity: 'error',
      summary: "Node Error",
      detail: me.Error,
      sticky: false,
      life: 10000
    });
  }

  onLoaded(state: LogsLoadedState) {
    const me = this;
    console.log(state)
    console.log(state.data['response'])
    console.log(this.searchVal)
    this.searchVal=false
    me.loading = false
  //  me.data.data = null
    if(state.data['response']){
    this.hitsValue=0
    me.messageService.add({
      severity: 'error',
      summary: 'Error:-',
      detail: state.data['msg'],
      sticky: false,
      life: 10000
    });
    
    }
    
    else{
    me.data.data = state.data
    console.log(me.data.data)
    
      this.nf.getAggData().subscribe((state:Store.State) => {
            console.log("aggdata", state)
            
              if (state instanceof AggDataLoadingState) {
                this.onaggLoading(state);
                return;
              }
      
              if (state instanceof AggDataLoadedState) {
                this.onaggLoaded(state);
                return;
              }
            },
            (state: AggDataLoadingErrorState) => {
              this.onaggLoadingError(state);
            }
          );
            // this.chartXaxisData = state.data.timestamp
            // this.chartYaxisData = state.data.data
            // this.tabledata = state.data.tabledata


      this.nf.getFieldsData().subscribe((state:Store.State) => {
        console.log("aggdata", state)
        
          if (state instanceof FieldsDataLoadingState) {
            this.onFieldsLoading(state);
            return;
          }
  
          if (state instanceof FieldsDataLoadedState) {
            this.onFieldsLoaded(state);
            return;
          }
        },
        (state: FieldsDataLoadingErrorState) => {
          this.onFieldsLoadingError(state);
        }
      );      
          
        
    }
  }
  onaggLoading(state:AggDataLoadingState){
    const me = this;
  
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  onaggLoaded(state:AggDataLoadedState){
//this.chartXaxisData = state.data.data
          console.log(state)
           this.chartXaxisData = state.data.timestamp
            this.chartYaxisData = state.data.data
            this.tabledata = state.data.tabledata
            this.stats=state.data.stats
            this.hitsValue=state.data.stats[2].count
            this.loading = false

  }

  onaggLoadingError(state:AggDataLoadingErrorState){
    const me = this;
    me.empty = false;
    me.error = state.error;
    me.loading = true;
  }
  onFieldsLoading(state:AggDataLoadingState){
    const me = this;
  
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  onFieldsLoaded(state:AggDataLoadedState){
//this.chartXaxisData = state.data.data
          console.log(state)
          this.fieldsdata=state.data
          console.log(this.fieldsdata)
          this.loading=false
           

  }

  onFieldsLoadingError(state:AggDataLoadingErrorState){
    const me = this;
    me.empty = false;
    me.error = state.error;
    me.loading = true;
  }

    

  
    serviceMethodTiming($event) {
      this.isOn = $event;
    }
    hotspotSummary($event) {
      this.isOn = $event;
    }
    toLogDetails(value){
      this.isOn = true;
      this.RowData=value
      console.log(this.RowData)
      this.rowClick.emit(this.isOn)
    }

    copyLabel(item,isResponse)
    {
      this.query = document.getElementById('searchQuery')['value'];
      let value = {label:''}
      if (isResponse) {
        value.label = item;
      }
      else
        value = item;
      let queryKey = value.label.substring(0, value.label.indexOf(':'))
      let queryValue =  value.label.substring(value.label.indexOf(':') + 1, value.label.length)
      this.badgeValue = queryKey + ':"' + queryValue + '"';
      console.log(queryKey + ':"' + queryValue + '"');
      if (this.query.includes('|')) {
        let preQuery = this.query.substring(0, this.query.indexOf('query=') + 6);
        let subQuery = this.query.substring(this.query.indexOf('query=') + 6, this.query.indexOf('|'));
        let restQuery = this.query.substring(this.query.indexOf('|'), this.query.length);
        subQuery = subQuery + ' AND ' + this.badgeValue;
        this.query = preQuery + subQuery + restQuery;
      }
      else {
        this.query = this.query + ' AND ' + this.badgeValue;
      }
      document.getElementById('searchQuery')['value'] = this.query;
      this.fetchData()
    }
    copyText(event) {
      // console.log(event[0]+':'+event[1])
      var text = "";
      text = window.getSelection().toString();
      if(text == '')
        return;
      this.selectedText = text;
      if (this.query.includes('|')) {
        let preQuery = this.query.substring(0, this.query.indexOf('query=') + 6);
        let subQuery = this.query.substring(this.query.indexOf('query=') + 6, this.query.indexOf('|'));
        let restQuery = this.query.substring(this.query.indexOf('|'), this.query.length);
        subQuery = subQuery + ' AND "' + this.selectedText + '"';
        this.query = preQuery + subQuery + restQuery;
      }
      else {
        this.query = this.query + ' AND "' + this.selectedText + '"';
      }
      document.getElementById('searchQuery')['value'] = this.query;
      this.fetchData()
      console.log(this.chipsValues)
    }

    deleteColumn(index, fieldName) {
      this.data.headers[0].cols.splice(index,1);
      console.log(this.fieldsdata)
      this.fieldsdata.forEach(element => {
        if (element.name == fieldName) {
          element.isSelected = false;
        }
      });
      if (this.data.headers[0].cols.length == 2) {
        this.isCreateTable = false;
        this.isCustomTable = false;
        let respCol =  {
          label: 'Log Information',
          valueField: 'keyword',
          classes: 'text-left',
          badgeField: true,
          width: '70%',
        }
        this.data.headers[0].cols.splice(1,0,respCol);
      }
    }

    copyTextFilter(event){
      console.log(event[0]+':'+event[1])
      this.chipsValues.push(event[0]+':'+event[1])
      console.log(this.chipsValues)

    }
    onRemoveTag(event){
console.log(event)

let eventval=event.value.split(":")
console.log(eventval[0])
this.filtervalue=eventval[0]

for(let i=0;i<this.plus_arr.length;i++){
  console.log(Object.keys(this.plus_arr[i].match_phrase)[0])
if(Object.keys(this.plus_arr[i].match_phrase)[0]==eventval[0]){
console.log("inloop")
  this.plus_arr.splice(i,1)
}
}
for(let i=0;i<this.minus_arr.length;i++){
  console.log(Object.keys(this.minus_arr[i].match_phrase)[0])
if(Object.keys(this.minus_arr[i].match_phrase)[0]==eventval[0]){
console.log("inloop")
  this.minus_arr.splice(i,1)
}
}
for(let i=0;i<this.exist_arr.length;i++){
  console.log(Object.values(this.exist_arr[i].exists)[0])
if(Object.values(this.exist_arr[i].exists)[0]==eventval[1]){
console.log("inloop")
  this.exist_arr.splice(i,1)
}
}

console.log(this.plus_arr)
this.fetchData()

    }

  }
