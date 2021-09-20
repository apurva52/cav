import { TimeFilter } from '../../common/interfaces/timefilter';
import { MsgService } from '../../common/service/msg.service';
import { Component, OnInit, Input, EventEmitter, Output,ViewEncapsulation } from '@angular/core';
import { TransactionFilterComponent } from '../../transaction-filter/transaction-filter.component'; 
import { TransactionFilter } from '../../common/interfaces/transactionfilter';
import * as moment from 'moment';
import 'moment-timezone';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event-revenue-sidebar',
  templateUrl: './event-revenue-sidebar.component.html',
  styleUrls: ['./event-revenue-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EventFilterComponent implements OnInit {

  private h : any;
  @Input() filterhtml :any;
  filter : any;
  timeFilter : any;
  startTime: any;
  endTime: any;
  maxDate = new Date(moment.tz(new Date(),sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
  timeFltr :any;
  showTimeFilter = false;
  stime : any;
  etime : any;
  @Input() showlast = false;
  @Output() getData: EventEmitter<boolean>;

  @Input() get timeFltrData() {
        return this.h;
    }

  set timeFltrData(timeF: any) {
        this.timeFltr = timeF;
        this.setTimeHtml(timeF);
    }

  constructor(private route: ActivatedRoute,
    private router: Router) { 

    this.getData = new EventEmitter();
    let d = new Date();
    let f = window["toDateString"](d);  
    this.filterhtml = "";
    this.timeFltr = "";
    this.filter = ""
    this.showTimeFilter = false; 
    this.startTime = new Date(d.toDateString() + " 00:00:00");
    //this.endTime = new Date(d.toDateString() + ' 23:59:00');
    let dt = moment.tz(new Date().getTime(),sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss');
        console.log("dt",dt);
        this.endTime = new Date(dt);
        this.stime = this.startTime.toLocaleDateString().trimStart() + "  " + " 00:00:00";
        this.etime = this.endTime.toLocaleDateString() + "  " + " 23:59:59" ;
  }

  ngOnInit() {
  }

  setFilterCriteria(filterCriteria)
  {
     this.filterhtml = "";
     for(let i = 0; i < filterCriteria.length;i++)
     {
      if(filterCriteria[i].value === 'true')
       {
        this.filterhtml += "<strong>" + filterCriteria[i].name ;
       }
      else
       {
        this.filterhtml += "<strong>" + filterCriteria[i].name + " :</strong> " + filterCriteria[i].value;
       }
       if(i < filterCriteria.length - 1)
       {
         this.filterhtml += ", ";
       }
     }
  }

   setTimeHtml(timeFilterCriteria)
  {
    this.timeFltr = timeFilterCriteria;
  }

  getFilterHtml(type)
  {
    if(this.filterhtml == undefined) return "";
    if(type === 1)
     return this.filterhtml.split("<strong>").join("").split("</strong>").join("");
    if(this.filterhtml.split("<strong>").join("").split("</strong>").join("").length > 50)
      return this.filterhtml.substring(0,47) + "...";
    return this.filterhtml;
  }

  openSessionFilter()
  {
    //SessionsComponent.setShowFilter(true);
    this.showTimeFilter = true;
  }

  getTimeHtml()
  {
     return this.timeFltr;
  }

  // resetFilters()
  // {
  //     let tempTimeFilter =   TransactionFilterComponent.tfilter.timeFilter;
  //     TransactionFilterComponent.tfilter = new TransactionFilter();
  //     TransactionFilterComponent.tfilter.timeFilter= tempTimeFilter;
  //     this.setFilterCriteria([]);
  //     TransactionFilter.resetSmartFilters();  
  //     TransactionFilterComponent.filterhtml = "";
      
  //     this.router.navigate(['/home/netvision/transactions'],{ queryParams: { filterCriteria:  JSON.stringify(TransactionFilterComponent.tfilter) }} ); 
  // }


  setTimeFilter(sessionFilter, metadata)
  {
    let filter = this.filter;

    if (!sessionFilter.timeFilter.last)
    {
      let d = new Date(sessionFilter.stime);
      filter.timeFilter.startTime = window["toDateString"](d) + ' ' + d.toTimeString().split(" ")[0];
      let e  = new Date(sessionFilter.etime);
      filter.timeFilter.endTime = window["toDateString"](e) + ' ' + e.toTimeString().split(" ")[0];
      this.setTimeHtml(window["toDateString"](d) + ' ' + d.toTimeString().split(" ")[0] + " - " + window["toDateString"](e) + ' ' + e.toTimeString().split(" ")[0]);
    }
    else
    {
      filter.timeFilter.last = sessionFilter.timeFilter.last;
      this.setTimeHtml('Last ' + sessionFilter.timeFilter.last);
      // this.filterCriteriaList.push(new ViewFilter('Last', sessionFilter.timeFilter.last, null));
      }
  }

   getSessionsForTimeFilter(time)
   {
    console.log("time:" +time);
    this.timeFilter = new TimeFilter();
    if(time !== null) // defined
    {
      // set time filter in filter obj with other filters applied currently
      this.timeFilter.last = time;
      this.setTimeHtml("Last " + time);
    }
    else
    {
      if(this.startTime === null || this.endTime === null)
      {
         //MsgService.warn("Please Enter Valid Date and Time.");
         console.log("this.startTime: ",this.startTime, " endTime: ", this.endTime);
         return;
      }

      let a = new Date(this.startTime);
      let b = new Date(this.endTime);
      let f = new Date();
      if(a.getTime() > b.getTime())
      {
        MsgService.warn("Start Time cannot be greater than End Time");
        return;
      }

      let d = new Date(this.startTime);
      this.timeFilter.startTime = window["toDateString"](d) + ' ' + d.toTimeString().split(" ")[0];
      let e  = new Date(this.endTime);
      this.timeFilter.endTime = window["toDateString"](e) + ' ' + e.toTimeString().split(" ")[0];
      this.setTimeHtml(window["toDateString"](d) + ' ' + d.toTimeString().split(" ")[0] + " - " + window["toDateString"](e) + ' ' + e.toTimeString().split(" ")[0]);
    }
    console.log("getSessionsForTimeFilter: ",this.timeFilter, "s : ", this.timeFilter.startTime, "e: ", this.timeFilter.endTime );
    this.getData.emit(this.timeFilter);
    this.showTimeFilter = false;
  }

  showCalendar()  {
        let tz = sessionStorage.getItem("_nvtimezone");
        this.maxDate = new Date(moment.tz(new Date(),sessionStorage.getItem("_nvtimezone")).format('MM/DD/YYYY HH:mm:ss'));
   }

}
