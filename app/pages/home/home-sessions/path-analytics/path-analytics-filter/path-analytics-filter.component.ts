import { Component, EventEmitter, OnInit, ViewEncapsulation, Output, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Moment } from 'moment-timezone';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { LAST_TIME_OPTIONS } from '../../common/constants/constants';
import { ParsePagePerformanceFilters } from '../../common/interfaces/parsepageperformancefilter';
import { MetadataService } from '../../common/service/metadata.service';
import { TimebarValue, TimebarValueInput } from 'src/app/shared/time-bar/service/time-bar.model';
//import * as _ from 'lodash';
import { MenuItem, MessageService } from 'primeng';
import { Observable, Subject } from 'rxjs';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import * as moment from 'moment';
import { PathAnalysisFilters } from './pathanalysisfilter';
import { Metadata } from '../../common/interfaces/metadata';
import { MsgService } from '../../common/service/msg.service';
//import { PathAnalyticsFilter } from '../service/path-analytics.model';

@Component({
  selector: 'app-path-analytics-filter',
  templateUrl: './path-analytics-filter.component.html',
  styleUrls: ['./path-analytics-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
 
})
export class PathAnalyticsFilterComponent extends PageSidebarComponent implements OnInit {
  classes = 'path-analytics-filter-sidebar';

  //form group
  form: FormGroup;
  /*form: FormGroup;
  metricOptions: any[];
  rollingWindowOptions: any[];
  granularityOptions: any[];
  npage: any[] = [];
  nchannel : any[] = [];
  checkoutbpPagelist : any[] = [];
  usersegmentoption: any;
  @Output() filterChange: EventEmitter<any>;*/
  @Output() filterChange: EventEmitter<any>;
  @Input() random: any;
  analysisForm: FormGroup;
  static filterhtml: any;
  st: any;
  et: any;
  lasttime: any;
  maxDate = new Date(moment.tz(new Date(),sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
  types: any[];
  selectedType: string;
  pathfilter: PathAnalysisFilters;
  usersegmentoption: any;
  nchannel: any = [];
  nlocation: any = [];
  npage: any = [];
  newbs : any = [];
  newos: any = [];
  os: any[];
  @Input() mode: any;
  metadata:Metadata = null;
  dimensions: any;
  device =[];
  @Input() showFilter = null;
  @Input() filter = null;
  ln : any[];
  nthreshold: any[]; 
  lastval : string = '1 Day' 
  timefilter :any = 'last';
  reloading = false;

  
  
 
  /*constructor(private timebarService: TimebarService,private metadataService: MetadataService, private msgService: MessageService) { 
    super();

    this.filterChange = new EventEmitter();

    this.metricOptions = [{
      label: 'On Load',
      value: 'onload'
    }, {
      label: 'Dom Interactive',
      value: 'dominteractive'
    }];

    // set rolling window options. 
    this.rollingWindowOptions = [{
      label: 'Select Rolling Window',
      value: ''
    }];
    // fill till 30 days.
    for (let i = 1; i < 31; i++) {
      this.rollingWindowOptions.push(
        {
          value: i,
          label: `${i} Day`
        }
      );
    }

    // set granularity options. 
    this.granularityOptions = [{
      label: 'Select Granularity',
      value: '0.1'
    }];

    for (let i = 1; i <= 10; i++) {
      this.granularityOptions.push({
        label: `${(i/10).toFixed(1)}`,
        value: `${(i/10).toFixed(1)}`
      });
    }

    this.metadataService.getMetadata().subscribe(metadata => {
      let channelm: any[] =  Array.from(metadata.channelMap.keys());
      this.nchannel = channelm.map(key => {
        return {label: metadata.channelMap.get(key).name, value: metadata.channelMap.get(key).id }
      });

      let pagem: any[] =  Array.from(metadata.pageNameMap.keys());
      this.npage = pagem.map(key => {
        return {label: metadata.pageNameMap.get(key).name, value: metadata.pageNameMap.get(key).id }
      });
    });
    

    this.form = new FormGroup({
      channels : new FormControl(null),
      entryPage : new FormControl(null),
      timeFilter: new FormControl(null),
      granular : new FormControl('0.1'),
      metric: new FormControl('onload'),
      rollingwindow: new FormControl(''),
    });
  }*/

  constructor(private messageService: MessageService,private metadataService: MetadataService) {
    super();
    this.filterChange = new EventEmitter();
    this.lasttime = ['1 Day', '2 Day', '4 Day', '1 Week', '1 Month', '1 Year'];
    this.types = [];
    this.newos = [];
    this.ln = []; 
    this.lastval  = '1 Day';
    this.pathfilter = new PathAnalysisFilters();
    //this.nlocation.push({label:'Select Location' ,value:null});
    this.device.push({label: 'PC', value: 'PC'});
    this.device.push({label: 'Mobile', value: 'Mobile'});
    this.device.push({label: 'Tablet', value: 'Tablet'});
    this.dimensions = [];
    this.dimensions.push({label:'Select Dimension', value:null});
    this.dimensions.push({label:'Browser', value:'Browser'});
    this.dimensions.push({label:'Location', value:'Location'});
    this.dimensions.push({label:'OS', value:'OS'});
    this.dimensions.push({label:'Device', value: 'Device'});
    this.dimensions.push({label:'Referrer', value:'Referrer'});
    this.device = [
             {label:'Select Device', value:null},
             {label:'PC', value:'PC'},
             {label:'Mobile', value:'Mobile'},
             {label:'Tablet', value:'Tablet'},
    ]


    
  this.analysisForm = new FormGroup({
    lastval: new FormControl('1 Day'),
   // _timefilter: new FormControl('false'),
    //stime: new FormControl(null),
    //etime: new FormControl(null), 
    timeFilter: new FormControl(),
    channel : new FormControl(null),
    browser: new FormControl(null),
    platform: new FormControl(null),
    location: new FormControl(null),
    device: new FormControl(null),
    page: new FormControl(null),
    dimType: new FormControl(null),
    userSegment: new FormControl(null),
    threshold: new FormControl(null)
    });  
    let nestedGroup: FormGroup = <FormGroup>this.analysisForm.controls['timeFilter'];
    nestedGroup.patchValue({ last: '1 Day' }); 
    


    this.metadataService.getMetadata().subscribe(metadata => {
      this.metadata = metadata;

   
    if(this.showFilter === null)
      this.setForm();
    else
     {
      this.setAfterChangedForm(this.showFilter);
     }
    })
  }

  

   ngOnInit() { 
     this.lastval = '1 Day';
    console.log('this.filter',this.filter);
    console.log('this.showFilter',this.showFilter);

   
     this.metadataService.getMetadata().subscribe(metadata => {
      this.metadata = metadata;

    if(this.showFilter === null)
      this.setForm();
    else
     {
      this.setAfterChangedForm(this.showFilter);
     }
    let channelm: any[] =  Array.from(this.metadata.channelMap.keys());
    this.nchannel = channelm.map(key => {
      return {label: this.metadata.channelMap.get(key).name, value: this.metadata.channelMap.get(key).id }
    });
   this.nchannel = channelm.map(key => {
         return {label: this.metadata.channelMap.get(key).name, value: this.metadata.channelMap.get(key).id }
       });
    let pagem: any[] =  Array.from(this.metadata.pageNameMap.keys());
     console.log("pagem =========="+JSON.stringify(pagem));
     this.npage = pagem.map(key => {
         return {label: this.metadata.pageNameMap.get(key).name, value: this.metadata.pageNameMap.get(key).id }
       });
      let p = [];
      p.push({label:'Select Location',value:null});
      this.ln.push({label:'Select Location',value:null});
      this.metadata.locationMap.forEach(function (item, key, mapObj) {
        let loc = item.state ? (item.state + ','): '';
        return p.push({label: loc + item.country , value:item.id });
     });
     this.nlocation = p;
    let platform = Array.from( this.metadata.osMap.keys() );
    let osn = [];
    for ( let i = 0; i < platform.length ; i++)
      {
         osn.push(this.metadata.osMap.get(platform[i]).name);
      }
    osn = osn.filter((x, i, a) => a.indexOf(x) == i);
    this.newos.push({label: 'Select OS' , value: null});
    for ( let i = 0; i < osn.length ; i++)
    {
 
       this.newos.push({label: osn[i] , value: osn[i]});
    }
    let usersegment:  any[] = Array.from(this.metadata.userSegmentMap.keys());
    try{
    this.usersegmentoption = usersegment.map(key => {
         return {label: this.metadata.userSegmentMap.get(key).name, value: this.metadata.userSegmentMap.get(key).id }
       });
    }catch(e){ console.log(e);}
    this.getBrowserM();
    this.nthreshold = [{'label':'Select Threshold','value':'null'},{'label': 10,'value': 10},{'label': 15,'value': 15},{'label': 25,'value': 25},{'label': 50,'value': 50},{'label': 100,'value': 100},{'label': 125,'value': 125},{'label': 150,'value': 150},{'label': 1024,'value': 1024}]
  }
)}

  
  onSelectMethodLast(event)
  {
     let nestedGroup: FormGroup = <FormGroup>this.analysisForm.controls['timeFilter'];
     let lastvalue = this.analysisForm.controls['lastval'].value;
      nestedGroup.patchValue({last: lastvalue});
  }  


  

  setForm()
  {
   let pagem: any[] =  Array.from(this.metadata.pageNameMap.keys());
   console.log("pagem set"+ pagem);
   let pagesm = 0;
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
        pagesm = this.metadata.pageNameMap.get(id).id;
     }
   }
   catch(e)
   {console.log(e);}
  let time = ((new Date().getTime()));
  let date = moment.tz(time,sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss');
  let d = new Date(moment.tz(time,sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
  let startT = new Date(d.toDateString() + " 00:00:00");
  let endT = new Date(d.toDateString() + ' 23:59:00');
  
   
    let nestedGroup: FormGroup = <FormGroup>this.analysisForm.controls['timeFilter'];
    nestedGroup.patchValue({ last: '1 Day' }); 
    this.timefilter = 'last'; 
    this.lastval = '1 Day';
    this.analysisForm.controls['page'].patchValue(pagesm); 
   
 }   




  

 setAfterChangedForm(filter){
  let f = filter;
  console.log('f',f);
  this.analysisForm = new FormGroup({
  lastval: new FormControl(f.lastval),
  _timefilter: new FormControl(f._timefilter),
  timeFilter: new FormControl(f.timeFilter),
  channel : new FormControl(f.channel),
  userSegment: new FormControl(f.userSegment),
  browser: new FormControl(f.browser),
  platform: new FormControl(f.platform),
  location: new FormControl(f.location),
  device: new FormControl(f.device),
  page: new FormControl(f.page),
  dimType: new FormControl(f.dimType),
  stime: new FormControl(new Date(f.stime)),
  etime: new FormControl(new Date(f.etime)),
  threshold: new FormControl(f.threshold)
  }); 
   let nestedGroup: FormGroup = <FormGroup>this.analysisForm.controls['timeFilter'];
    nestedGroup.patchValue({ last: '1 Day' });
  console.log('this.filter',this.filter);
  this.setFilterCriteria(this.filter,JSON.parse(this.filter).timeFilter,'ddr');
 }

 setFilterCriteria(filterc,timefilter,val)
 {

   let filterp = filterc;
   console.log('p',filterp,timefilter);
   PathAnalyticsFilterComponent.filterhtml = "";
   let filterCriteria = filterp.filterCriteriaList;
   let tfilter = timefilter;
   let last = ''
   let lasttime = '';
   console.log('last',last,lasttime);
   if(val === 'ddr')
   {
    filterCriteria = JSON.parse(filterp).filterCriteriaList;
    console.log("filter",JSON.parse(filterp));
    tfilter = JSON.parse(filterp).filter.timeFilter;
    last = JSON.parse(filterp).showFilter.lastval;
    lasttime = JSON.parse(filterp).showFilter._timefilter;
   }
   else
   {
    last = filterp.showFilter.lastval;
    lasttime = filterp.showFilter._timefilter;
   }
   if(lasttime == "true") // defined
   {
    PathAnalyticsFilterComponent.filterhtml += "Last " + last;
   }
   else
   {
      let d = new Date(tfilter.startTime);
      let e = new Date(tfilter.endTime);
      PathAnalyticsFilterComponent.filterhtml += tfilter.startTime + " - " + tfilter.endTime;
    }
     for(let i = 0; i < filterCriteria.length;i++)
     {
      if((i < filterCriteria.length - 1))
       {
        PathAnalyticsFilterComponent.filterhtml += " , ";
       }
       if(filterCriteria[i].name === 'Page' && this.mode === 'ViewPath')
        {}
       else
       PathAnalyticsFilterComponent.filterhtml += " " + filterCriteria[i].name + " : " + filterCriteria[i].value;
    }

    this.closeClick();
 }

 getFilterHtml(type)
 {
   if(type === 1)
    return PathAnalyticsFilterComponent.filterhtml;
    if(PathAnalyticsFilterComponent.filterhtml.length > 160)
      return PathAnalyticsFilterComponent.filterhtml.substring(0,160) + "...";
   return PathAnalyticsFilterComponent.filterhtml;
 }

 triggerfilter()
  {
     let val = this.analysisForm.controls['_timefilter'].value;
     let nestedGroup: FormGroup = <FormGroup>this.analysisForm.controls['timeFilter'];
     if (val === 'true')
       {
          let lastvalue = this.analysisForm.controls['lastval'].value;
          nestedGroup.patchValue({startTime: null});
          nestedGroup.patchValue({endTime: null});
          nestedGroup.patchValue({last: lastvalue});
       }
     else
        {
         nestedGroup.patchValue({last: null});
         this.st = window["toDateString"](this.analysisForm.controls['stime'].value) + ' ' + this.analysisForm.controls['stime'].value.toLocaleTimeString();
         nestedGroup.patchValue({startTime: this.st});
         this.et = window["toDateString"](this.analysisForm.controls['etime'].value) + ' ' + this.analysisForm.controls['etime'].value.toLocaleTimeString();
         nestedGroup.patchValue({endTime: this.et});
        }
  }

  warn(msg: string) {
    this.messageService.add({ key : "my key", severity: 'warn', summary: 'Warning', detail: msg });
}

  onSubmit()
  {
    const f = this.analysisForm.value;
    console.log("on submit call !", f);
    //console.log("global filters",AppComponent.filters,f);
    let gchannel = [];
    /*if(AppComponent.filters !== undefined && AppComponent.filters.channel !== undefined && AppComponent.filters.channel !== null)
    {
         gchannel = [AppComponent.filters.channel.id];
    }*/
    if(f.channel !== null && f.channel !== "" && f.channel !== "null" && f.channel.length > 0)
    {
         gchannel = f.channel;
    }
    f.channel = gchannel;
    if(f.timeFilter.last === null || f.timeFilter.last === '' || f.timeFilter.last === 'null'){
    if(f.timeFilter.startTime === null || f.timeFilter.endTime === null)
      {
        this.warn("Please Enter Valid Date and Time.");
         return true;
      }
     if(new Date(f.timeFilter.startTime).getTime() > new Date(f.timeFilter.endTime).getTime())
    {
      this.warn("Start Time cannot be greater than End Time.");
         return;
    }
    }
    console.log('check for f',f);
    f.lastval = f.timeFilter.last;
    f.stime = f.timeFilter.startTime;
    f.etime = f.timeFilter.endTime;
    this.pathfilter.getPathFilter(f,this.metadata);
    console.log('check for data', this.pathfilter);
    this.filterChange.emit(this.pathfilter);
    this.setFilterCriteria(this.pathfilter,this.pathfilter.filter.timeFilter,'noddr');

   
  }
  getBrowserM()
  {
    let bsm = [];
    bsm.push({label:'Select Browser',value:null});
    this.metadata.browserMap.forEach(function (item, key, mapObj) {
       return bsm.push({label: item.name , value:item.id });
    });
    this.newbs = bsm;
  }

  selectDimension(event)
  {
    console.log(event);
    for(let i = 1;i <= 4;i++)
    {
     document.getElementById('dim'+i).style.display = 'none';
    }
   this.analysisForm.controls['browser'].patchValue(null);
   this.analysisForm.controls['platform'].patchValue(null);
   this.analysisForm.controls['location'].patchValue(null);
   this.analysisForm.controls['device'].patchValue(null);
   if(event.value == 'Browser')
    document.getElementById('dim1').style.display = 'block';
   else if(event.value == 'OS')
    document.getElementById('dim2').style.display = 'block';
   else if(event.value == 'Location')
    document.getElementById('dim3').style.display = 'block';
   else if(event.value == 'Device')
    document.getElementById('dim4').style.display = 'block';
  }
  showCalendar()  {
    let time = (new Date().getTime());
    let dt = new Date(moment.tz(time,sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
this.maxDate = new Date(moment.tz(new Date(),sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
}

closeClick() {
  const me = this;
  me.hide();
}
open() {
  const me = this;
  me.show();
}
resetForm(){
  this.reloading = true;
    //this.customTimeFrame = [];

    setTimeout(()=> {
      this.setForm();
      this.reloading = false;
    }, 0);
}
}
