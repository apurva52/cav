import { Component, EventEmitter, OnInit, Output, ViewEncapsulation,ViewChild,ElementRef } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Moment } from 'moment-timezone';
import { MenuItem } from 'primeng';
import { Observable, Subject } from 'rxjs';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import {
  TimebarValue,
  TimebarValueInput,
} from 'src/app/shared/time-bar/service/time-bar.model';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { ParseJsErrorFilters } from '../../../common/interfaces/parsejserrorfilters';
//import { PAGE_FILTER_SIDEBAR_DATA } from './service/http-filter-sidebar.dummy';
//import { PageFilterSidebar } from './service/http-filter-sidebar.model';
import { ParseSessionFilters } from '../../../common/interfaces/parsesessionfilters';
import { MsgService } from '../../../common/service/msg.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeFilter } from '../../../common/interfaces/timefilter';
import { MetadataService } from '../../../common/service/metadata.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ParsePagePerformanceFilters } from '../../../common/interfaces/parsepageperformancefilter';
import { Metadata } from '../../../common/interfaces/metadata';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-js-error-sidebar',
  templateUrl: './js-error-filter-sidebar.component.html',
  styleUrls: ['./js-error-filter-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class JsErrorFilterSidebarComponent
  extends PageSidebarComponent
  implements OnInit {

    // ViewChild is used to access the input element.
    // this InputVar is a reference to our input..
  
  @ViewChild('clearinput') clearinput: ElementRef;
  @ViewChild('resetInput') resetInput: ElementRef; 
    
  classes = 'page-sidebar page-filter-manager';
  duration: MenuItem[];
  customTimeFrame: Moment[] = null;
  customTimeFrameMax: Moment = null;
  timeFilterEnableApply: boolean = false;
  invalidDate: boolean = false;
  tmpValue: TimebarValue = null;
  val1: number;
  val2: number;
  
  timefilter : String = 'last';
  lasttime = {label: "1 Hour"};
  npage: any[] = [];
  nchannel : any[] = [];
  searchInput: any;
  searchInput1: any;
  usersegmentoption :any;
  nGrouping : any;
  defaultgroupby : any;
  entryPage : any;
  channels : any;
  userSegment : any;
  IncludeOS : any;
  IncludeBrowser : any;
  selected_device : any;
  device : any[];



  //data:PageFilterSidebar
  @Output() getData: EventEmitter<ParsePagePerformanceFilters>; 
  bucketflag = true;
  currentBucketSize = "5 Minutes";
  os: any;
  newos: any;
  newbs: { label: any; value: any; }[];
  pageForm: FormGroup;
  nlocation: { label: string; value: any; }[];
  lasttimeoption : any;
  excludeosicon: any[];
  excludebrowsericon: any[];
  devicei: number;
  browseri: number;
  osi: number;
  parsepagefilter: ParsePagePerformanceFilters;
  metadata : Metadata;
  reloading = false;
  
  constructor(private timebarService: TimebarService, private route: ActivatedRoute,private router: Router,private metadataService: MetadataService, private messageService: MessageService) {

    super();
    this.getData = new EventEmitter();
    this.searchInput = "";
   this.searchInput1 = "";
   this.customTimeFrame = [];
    }

  ngOnInit(): void {
    const me = this;
    /*me.duration = [
      { label: '15 Minutes' },
      { label: '1 Hour' },
      { label: '4 Hours' },
      { label: '8 Hours' },
      { label: '12 Hours' },
      { label: '16 Hours' },
      { label: '20 Hours' },
      { label: '1 Day' },
      { label: '1 Week' },
      { label: '1 Month' },
      { label: '1 Year' }
    ];*/
    this.lasttimeoption = [
      { label: '15 Minutes', value: '15 Minutes' },
      { label: '1 Hour', value: '1 Hour' },
      { label: '4 Hours', value: '4 Hours' },  
      { label: '12 Hours', value: '12 Hours' },
      { label: '1 Day', value: '1 Day' },
      { label: '1 week', value: '1 Week' },
      { label: '1 Month', value: '1 Month' },
      { label: '1 Year', value: '1 Year' }
    ];
    this.parsepagefilter = new ParsePagePerformanceFilters();
    this.metadataService.getMetadata().subscribe(metadata => {
      this.metadata = metadata;
      let channelm: any[] =  Array.from(metadata.channelMap.keys());
      this.nchannel = channelm.map(key => {
        return {label: metadata.channelMap.get(key).name, value: metadata.channelMap.get(key).id }
      });

      let pagem: any[] =  Array.from(metadata.pageNameMap.keys());
      this.npage = pagem.map(key => {
        return {label: metadata.pageNameMap.get(key).name, value: metadata.pageNameMap.get(key).id }
      });

      let usersegment:  any[] = Array.from(metadata.userSegmentMap.keys());
      this.usersegmentoption = usersegment.map(key => {
        return {label: metadata.userSegmentMap.get(key).name, value: metadata.userSegmentMap.get(key).id }
      });

      this.nGrouping = [
        {"label":"Pages","value":"pageid"},
        {"label":"OS","value":"platform"},
        {"label":"OS and Version","value":"platform,mobileosversion"},
        {"label":"Browsers","value":"browserid"},
        {"label":"Browser and Version","value":"browserid,mobileappversion"}
        ];

      this.os=[];
      this.newos=[];
      this.newbs = [];
      this.devicei = 0;
      this.osi = 0;
      this.browseri = 0;
      
      let platform = Array.from( metadata.osMap.keys() );
      for ( let i = 0; i < platform.length ; i++)
      {
            this.os.push({name:metadata.osMap.get(platform[i]).name,value:metadata.osMap.get(platform[i]).name,version:metadata.osMap.get(platform[i]).version}) ;
            let version = metadata.osMap.get(platform[i]).version == 'null' ? '' : ' ( '+ metadata.osMap.get(platform[i]).version + ' ) ';
            this.newos.push({label: metadata.osMap.get(platform[i]).name  + version , value: metadata.osMap.get(platform[i]).name + version });
      }
  
      let bsm: any[] =  Array.from(metadata.browserMap.keys());
      this.newbs = bsm.map(key => {
        return {label: metadata.browserMap.get(key).name, value: metadata.browserMap.get(key).id }
      });

      let locationm: any[] =  Array.from(metadata.locationMap.keys());
      this.nlocation = locationm.map(key => {
        let loc = metadata.locationMap.get(key).state ? (metadata.locationMap.get(key).state + ','): '';
        return {label: loc + metadata.locationMap.get(key).country, value: metadata.locationMap.get(key).id }
      });
      
     this.device = [];
     this.device.push({ label: 'PC', value: 'PC' });
     this.device.push({ label: 'Mobile', value: 'Mobile' });
     this.device.push({ label: 'Tablet', value: 'Tablet' });
    
    
    });


    this.setForm();
    //me.data = PAGE_FILTER_SIDEBAR_DATA
  }

  closeClick() {
    const me = this;
    me.hide();
  }

  open() {
    const me = this;
    me.show();
  }
  onTimeFilterCustomTimeChange(timeType) {
    switch (timeType) {
      case 'start':
        this.customTimeFrame[0] = this.pageForm.get('customTime').value[0];
        break;
      
      case 'end':
        this.customTimeFrame[1] = this.pageForm.get('customTime').value[1];
        break;
    }

    this.pageForm.get('customTime').patchValue(this.customTimeFrame);

    const me = this;
    setTimeout(() => {
      if (me.customTimeFrame && me.customTimeFrame.length === 2) {
        if (
          me.customTimeFrame[0].valueOf() == me.customTimeFrame[1].valueOf()
        ) {
          const me = this;
          me.timeFilterEnableApply = false;
          me.invalidDate = true;
        } else {
          me.invalidDate = false;
          const timePeriod = me.timebarService.getCustomTime(
            me.customTimeFrame[0].valueOf(),
            me.customTimeFrame[1].valueOf()
          );

          me.setTmpValue({
            timePeriod: timePeriod,
          });
        }
      }
    });
  }

  private setTmpValue(input: TimebarValueInput): Observable<TimebarValue> {
    const me = this;
    const output = new Subject<TimebarValue>();
    me.timeFilterEnableApply = false;

    me.timebarService
      .prepareValue(input, me.tmpValue)
      .subscribe((value: TimebarValue) => {
        const timeValuePresent = _.has(value, 'time.frameStart.value');

        if (value && timeValuePresent) {
          me.tmpValue = me.prepareValue(value);
          me.timeFilterEnableApply = true;
          output.next(me.tmpValue);
          output.complete();
        } else {
          me.tmpValue = null;
          me.timeFilterEnableApply = false;
          output.next(me.tmpValue);
          output.complete();
        }
      });

    return output;
  }

  prepareValue(value: TimebarValue): TimebarValue {
    const me = this;

    MenuItemUtility.map((item: MenuItem) => {
      item.url = '';
      item.command = () => {
        if (!item.items) {
          me.tmpValue.timePeriod.selected = item;
          me.validateTimeFilter(true);
        }
      };
    }, value.timePeriod.options);

    MenuItemUtility.map((item: MenuItem) => {
      item.url = '';
      item.command = () => {
        if (!item.items) {
          me.tmpValue.viewBy.selected = item;
          me.validateTimeFilter();
        }
      };
    }, value.viewBy.options);

    return value;
  }
  private validateTimeFilter(clearViewBy?: boolean) {
    const me = this;

    const input: TimebarValueInput = {
      timePeriod: me.tmpValue.timePeriod.selected.id,
      viewBy: me.tmpValue.viewBy.selected.id,
      running: me.tmpValue.running,
      discontinued: me.tmpValue.discontinued,
      includeCurrent: me.tmpValue.includeCurrent,
    };

    if (clearViewBy) {
      input.viewBy = null;
    }

    me.setTmpValue(input);
  }
  
    resetFilter() 
    {
      
  // We will clear the value of the input 
  // field using the reference variable.
    
     
      this.clearinput.nativeElement.value = "";
      this.resetInput.nativeElement.value = "";
      

    }
    onSelectChannel(e){

    }
    onSelectOS(e){

    }
    onSelectBrowser(e){

    }
    setForm(){
      this.pageForm = new FormGroup({
       channel : new FormControl(null),
       userSegment: new FormControl(),
       //device: new FormControl(['PC','Mobile','Tablet']),
       device: new FormControl(null),
       entryPage : new FormControl(null),
       browser: new FormControl(null),
       platform: new FormControl(),
       platformversion: new FormControl(null),
       connectionType: new FormControl(null),
       location: new FormControl(null),
       IncludeLocation: new FormControl(null),
       ExcludeLocation: new FormControl(null),
       IncludeBrowser: new FormControl(null),
       ExcludeBrowser: new FormControl(null),
       IncludeOS: new FormControl(null),
       ExcludeOS: new FormControl(null),
       Includepage: new FormControl(null),
       ExcludePage: new FormControl(null),
       bucket:  new FormControl('Auto'),
       formosicon: new FormControl(),
       formbrowsericon: new FormControl(),
       customTime: new FormControl(),
       lastval: new FormControl('1 Day'),
       _timefilter: new FormControl('last'),
       groups : new FormControl(),
       granular : new FormControl('0.1'),
       metric: new FormControl('onload'),
       metric1 : new FormControl(""),
       granular1 : new FormControl("")
      });
      this.pageForm.get('customTime').disable();
    }
    warn(msg: string) {
      this.messageService.add({ key : "my key", severity: 'warn', summary: 'Warning', detail: msg });
  }
    onSubmit(f : any){
      console.log("onsubmit : ", f);
      if(this.match(this.pageForm.controls['Includepage'].value,this.pageForm.controls['ExcludePage'].value))
      return;
    if(this.match(this.pageForm.controls['IncludeLocation'].value,this.pageForm.controls['ExcludeLocation'].value))
      return;
    if(this.match(this.pageForm.controls['IncludeBrowser'].value,this.pageForm.controls['ExcludeBrowser'].value))
      return;
    if(this.match(this.pageForm.controls['IncludeOS'].value,this.pageForm.controls['ExcludeOS'].value))
      return;
    if(this.match(this.pageForm.controls['entryPage'].value,this.pageForm.controls['ExcludePage'].value))
      return;

    let timeFilter = {};
    let timeFiltercmp = {};
    timeFilter["last"] = this.pageForm.get('lastval');
    if(this.pageForm.get('_timefilter').value === 'last')
    {
      timeFilter["last"] = this.pageForm.get('lastval').value;
      timeFilter["endTime"] = "";
      timeFilter["startTime"] = "";
      
    }
    else
    {
      timeFilter["last"] = null;
      timeFilter["endTime"] = this.customTimeFrame[1];
      timeFilter["startTime"] = this.customTimeFrame[0];
    }
    
    
    timeFiltercmp["last"] = "";
    timeFiltercmp["endTime"] = "";
    timeFiltercmp["startTime"] = "";
   
    f["timeFilter"] = timeFilter;
    f["timeFiltercmp"] =timeFiltercmp ;
    
    
    if(this.pageForm.get('_timefilter').value === 'last')
    {
    f["stime"] = "";
    f["etime"] = "";
    }
    else
    {
      f["stime"] = this.customTimeFrame[0];
      f["etime"] = this.customTimeFrame[1];
    }


    let osm = [];
    this.newos.forEach(function(record) {
     if(record.selectedos === true)
       osm.push(record.name);
    });
    this.excludeosicon = osm;
    let bsm = [];
    /*this.newbs.forEach(function(record) {
     if(record.selectedbrowser === true)
       bsm.push(record.id);
    });*/
	  this.excludebrowsericon = bsm;
    let filteros = this.pageForm.controls['IncludeOS'].value;
    let filterbrowser = this.pageForm.controls['IncludeBrowser'].value;
    if((this.excludeosicon.length > 0 && this.osi !== 0 ))
    {
     if(this.match(this.excludeosicon,this.pageForm.controls['ExcludeOS'].value))
      return;
     f.formosicon = this.excludeosicon;
    }
    else if((this.excludeosicon.length === 0 &&  this.osi === 0) || (this.excludeosicon.length === 0 &&  this.osi !== 0) )
    { 
      f.formosicon = null;
    }  
    if((this.excludebrowsericon.length > 0 &&  this.browseri !== 0))
    {
     if(this.match(this.excludebrowsericon,this.pageForm.controls['ExcludeBrowser'].value))
        return;
       f.formbrowsericon = this.excludebrowsericon;
    }    
    else if((this.excludebrowsericon.length === 0  && this.browseri === 0) || (this.excludebrowsericon.length === 0  && this.browseri !== 0))
    {
      f.formbrowsericon = null;
    }
     if(this.devicei === 0 && f.device !== null && f.device.length === 3)
      f.device = null;
    if(f.timeFilter.last === null || f.timeFilter.last === '' || f.timeFilter.last === 'null'){
    if(f.stime === null || f.etime === null)
      {
         this.warn("Please Enter Valid Date and Time.");
         return true;
      }
     if(new Date(f.stime).getTime() > new Date(f.etime).getTime())
    {
      this.warn("Start Time cannot be greater than End Time.");
         return;
    }
    }
    
    f.channel = f.channel;
    let gsegment = [];
    gsegment = f.userSegment;
    let rw = "";
    if( f.rollingwindow !== null &&  f.rollingwindow !== "" &&  f.rollingwindow !== "null" )
    {
         rw = f.rollingwindow;
    }

    f.userSegment = gsegment;
    f.timeFilter.startTime = f.stime;
    f.timeFilter.endTime = f.etime;

    f.rollingwindow = rw;
    console.log("getPagePerformanceFilter f form value : ",f);
    this.parsepagefilter.getPagePerformanceFilter(f,this.metadata,this.bucketflag);
    console.log("this.parsepagefilter : ",this.parsepagefilter);
    this.getData.emit(this.parsepagefilter);
    this.closeClick();
      
    }
    triggerfilter()
 {
   console.log('triggerfilter : ',this.pageForm.get('_timefilter'));
  if (this.pageForm.get('_timefilter').value === 'last') {
    this.pageForm.get('customTime').disable();
    this.pageForm.get('lastval').enable();

  } else {
    this.pageForm.get('customTime').enable();
    this.pageForm.get('lastval').disable();

  }
 }
 match(list1,list2)
 {
   if(list1 === null || list1 === "null" )
      return false;
   if(list2 === null || list2 === "null")
      return false;
   let compare = list1;
   let compareWith = list2;
   if(list1.length > list2.length)
   {
     compare = list2;
     compareWith = list1;
   }

   for(let i = 0; i < compare.length; i++)
   {
     if(compareWith.indexOf(compare[i]) > -1)
     {
       MsgService.warn("Include and Exclude Property are same");
       return true;
     }
   }
   return false;
 }

  resetInfo()
  {
    let val = this.pageForm.controls['entryPage'].value;
    if(val !== null || val !== "null")
      this.pageForm.controls['entryPage'].patchValue(null);
  }
  getBucketSize()
  {
    return ParseJsErrorFilters.jserrorFilters.bucketString;
  }
  buckett = {
    "5 Minutes" : 5*60, 
    "15 Minutes" : 15 * 60,
    "30 Minutes" : 30 * 60,
    "1 Hour" : 3600,
    "4 Hours" : 3600 * 4,
    "8 Hours" : 3600 * 8,
    "24 Hours" : 24 * 3600,
    "1 Week" : 7 * 24 * 3600,
    "1 Month" : 30 * 24 * 3600,
    "All" : 0
   }
   updateBucket(b)
  {
    console.log("updateBucket method called : ", b);
    this.currentBucketSize = b.value;
    ParseJsErrorFilters.jserrorFilters.limit = this.buckett[b.value];

    if(b.value !== 0)
    ParseJsErrorFilters.jserrorFilters.totalBuckets = Math.ceil(ParseJsErrorFilters.jserrorFilters.duration / this.buckett[b.value]);
    else
    {
      ParseJsErrorFilters.jserrorFilters.totalBuckets = 0;
    
    }
    
  }

  bucket  = "Auto";
  buckets = [
  {label:"5 Minutes",value:"5 Minutes"},
  {label:"15 Minutes",value:"15 Minutes"},
  {label:"30 Minutes",value:"30 Minutes"},
  {label:"1 Hour",value:"1 Hour"},
  {label:"4 Hours",value:"4 Hours"},
  {label:"8 Hours",value:"8 Hours"},
  {label:"24 Hours",value:"24 Hours"},
  {label:"Auto",value:"Auto"},
 ];


   resetForm(){
    this.reloading = true;
    this.customTimeFrame = [];

    setTimeout(()=> {
      this.setForm();
      this.reloading = false;
    }, 0);
   }
}
