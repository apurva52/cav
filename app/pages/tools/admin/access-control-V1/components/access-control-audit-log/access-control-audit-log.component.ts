import { Component, OnInit, ViewChild, OnDestroy  } from '@angular/core';
import { AccesControlDataService } from "../../services/acces-control-data.service";
import { Subscription } from "rxjs";
import { AUDIT_LOG_DATA_AVAILABLE , AUDIT_LOG_DATA_SEARCH} from "../../constants/access-control-constants";
import * as moment from 'moment';
import { Message, Paginator } from "primeng/primeng";
//import { Paginator } from '../../../../../vendors/prime-ng/paginator/paginator';


@Component({
  selector: 'app-access-control-audit-log',
  templateUrl: './access-control-audit-log.component.html',
  styleUrls: ['./access-control-audit-log.component.css']
})
export class AccessControlAuditLogComponent implements OnInit ,OnDestroy {
 

  @ViewChild('dt')
  dtObj;
  @ViewChild('p') paginator: Paginator;
  dataSubscription: Subscription;
  ROWINDEX = [];
  errorMessage: Message[] = [];
  logData = [];
  enableVirtualScroll = true
  LogsDataToPopulate = [];
  filteredData = [];
  columnOptions = [];
  totalRecords ;
  activeUsers: number;
  activeSessions: number;
  groupOptions = [];
  groupBy: string = '';
  enableFilter: boolean = false
  cols = [];
  tableHeight: boolean = false;
  // searchTerm$ = new Subject<string>();
  filteredCol = ''
  filterObj = [];
  ischecked: boolean = true;
  isSearchTab: boolean = true;
  dataFor =[];
  activeUserList = [];
  date: string;
  filterData = [];

  // Report variable
  startDateTimeforLogReport: string;
  endDateTimeforLogReport: string;
  currentTime: any = '';
  timeZoneId = sessionStorage.getItem('timeZoneId');
  timeZone = sessionStorage.getItem('timeZone');
  defaultendTime = moment.tz(this.currentTime, this.timeZoneId).format('HH:mm');
  endTime = this.defaultendTime;
  currentDateTime = moment.tz(this.currentTime, this.timeZoneId).format('MM-DD-YYYY HH:mm').replace(/-/g,' ');
  dater= Date.parse(this.currentDateTime);
  lastonehour=this.dater-3600000;  //last one hours time in milliseconds
  ddt2=moment(this.lastonehour).format("MM-DD-YYYY HH:mm");
  dtt3=this.ddt2.toString();
  dtt4=this.dtt3.split(" ");
  arr2=this.dtt4[1];  
  defaultstartTime =this.arr2;
  startTime = this.defaultstartTime;
  defaultstartDate = moment(new Date(this.lastonehour)).format('MM/DD/YYYY');
  startDate:any = this.defaultstartDate;
  defaultendDate = new Date();
  endDate: any = this.defaultendDate;
  sDate:any = moment(this.lastonehour).format("MM-DD-YYYY HH:mm");
  eDate:any = moment(this.currentDateTime).format("MM-DD-YYYY HH:mm");
  changeinstartDate = false;
  firstPage = 0;
  rows= 40;
  constructor( private _dataservice: AccesControlDataService ) {
   
/* This is done as we need proper order of columns instead coming from server */
    this.getColumnsToDisplay();

  }

   
  ngOnInit() {

     this._dataservice.fetchAuditLogData(null, null,null);

    this.dataSubscription = this._dataservice.AccesscontrolAuditLogInfoProvider$.subscribe(
      action => {
        if (action == AUDIT_LOG_DATA_AVAILABLE) {
          this.logData = this._dataservice.$auditLogData;
          /*----code for add colon b/w sec and ms in Activity Time---*/
          if(this.logData.length!=0){
          for(let i=0;i<this.logData.length;i++)
          { 
            var actTime=this.logData[i].activityTime;
            let arr=actTime.split(" ").join(":");
            var actTimeModified=arr.replace(":"," ");
            this.logData[i].activityTime = actTimeModified; 
          }
  
           this.totalRecords = this.logData.length;
           this.LogsDataToPopulate=this.logData.slice(0,40);
                 
          this.generatColumns();
          this.onChngeColumn();
         // this.filterGroupBy();

	        for(let i = 0;i < this.logData.length;i++)
             this.ROWINDEX[i] = i + 1;
          }else{
            this.LogsDataToPopulate=this.logData.slice(0,40);
          }
         }
         else{
          if(action == AUDIT_LOG_DATA_SEARCH){
           
           this.logData = this._dataservice.$auditLogData;
           this.filterObj = this._dataservice.$searchObj;
           this.totalRecords = this.logData.length;
           this.LogsDataToPopulate=this.logData.slice(0,40);

           for (let j = 0; j < this.filterObj.length; j++) {
            if (this.filterObj[j].value != '') 
            {
              this.searchinTable();
              break;
            }
               
          }
         
           //this.filterGroupBy();
           this.onChngeColumn();         
           for(let i = 0;i < this.logData.length;i++)
             this.ROWINDEX[i] = i + 1;
          }
        }
          this.activeUsers = this._dataservice.$activeUsers;
          this.activeSessions = this._dataservice.$activeSessions;
          this.activeUserList = this._dataservice.$activeUserList;
         
      },
      err => { console.log('Error while filling data ', err); },
      () => {
            
      }
      
      )

  }


  filterGroupBy(){
    let key = this.groupBy;
       //for(let i=0; i<this.logData.length;i++){      
        this.logData.sort(function(a, b) {
          var aA = a[key].split(":");
          var bB = b[key].split(":");

          const nameA = aA[2];
          const nameB = bB[2];
             if(!nameA || !nameB)
               return 0;

             return nameB.localeCompare(nameA);
          });
        // }
       } 
  
       

       /**method to create search filters */
setSearchFilters(){
 
  let tableObj = this.logData[0]
  let keys = Object.keys(tableObj);
  
  for (let i = 0; i < keys.length; i++) {

  if (sessionStorage.getItem('isMultiDCMode') && sessionStorage.getItem('activeDC') !="ALL" && keys[i] === "dCName")
      continue;
  /* In Normal Case, DC Name textbox is hidden */
  if (!sessionStorage.getItem('isMultiDCMode') && keys[i] === "dCName")
      continue;
  
    let matches = keys[i].match(/[A-Z]/g);
    let substr =''
    let label
     if(matches != null&&matches.length!=0){
     let index = keys[i].indexOf(matches[0]);
       substr = keys[i].slice(index ,keys[i].length)
        label= keys[i].slice(0 ,index) + ' ' + substr
  }
  else{
     label= keys[i]
  }

if (keys[i] === "dCName")
      label = "DC Name";
if(keys[i] === "responseTime")
        label = "Response Time";	
  
    if(keys[i] !='sessionId'){
      if(keys[i] == 'ip')
      {
        label= 'IP Address'
      }

      if(keys[i] === "responseTime")
      this.filterObj.push({ field: keys[i], value: '', label: 'Response Time',  hoverName: 'Use operator(>,<,=<,>=,= and-(treat as between))to use filter.If no operator is used than it will act as ’>=' })
 


      else
    this.filterObj.push({ field: keys[i], value: '', label: label.charAt(0).toUpperCase() + label.slice(1), hoverName:label.charAt(0).toUpperCase() + label.slice(1) })
    } 
 }
}

  loadLogDataLazy(event) {
    setTimeout(() => {
      let count=event.first;
        for(let i = 0;i < event.rows;i++){
        if(this.LogsDataToPopulate.length != 0){
        count=count+1;
        this.ROWINDEX[i] = count;
      }
        }
        this.firstPage = event.first;
        this.rows = event.rows;
        this.LogsDataToPopulate = this.logData.slice(event.first, (event.first + event.rows))
        this.LogsDataToPopulate = [...this.LogsDataToPopulate]
     }, 100);

    
  }

  generatColumns() {  
    this.columnOptions = [];
    this.groupOptions = [];
    let index = 0

    for (let i = 0; i < this.cols.length; i++) {
      this.columnOptions.push({ label: this.cols[i].header, value: this.cols[i]});
      
      if (this.cols[i].field == "sessionId") {
        this.groupBy = this.cols[i].field
        index =i;
      }
      if(this.cols[i].header !='Description' || this.cols[i].field !='description' )
      this.groupOptions.push({ label: this.cols[i].header, value: this.cols[i].field})

    }
    this.cols.splice(index ,0);
    
  }


  sortfunction(event) {
    let key = this.groupBy;
    for (let i = 0; i < this.cols.length; i++) {
    if(key == this.cols[i].field){
    this.cols[i].sortable='custom';
    }
    else{
      this.cols[i].sortable= false;
    }
}
if(this.ischecked===false){
  this.activeUserList= this._dataservice.$activeUserList;
 this.dataFor= [];
 for(let i=0;i<this.logData.length;i++){
   for(let j=0;j<this.activeUserList.length;j++){
     if(this.logData[i].sessionId == this.activeUserList[j])
       this.dataFor.push(this.logData[i]);
   } 
 }
this.logData = [];
this.logData = this.dataFor;
}
     if(key == "sessionId"){
      if(event.order != -1)
      {
       this.filterGroupBy();
       
      }
       else{
         //for(let i=0; i<this.logData.length;i++){      
           this.logData.sort(function(a, b) {
             var aA = a[key].split(":");
             var bB = b[key].split(":");
   
             const nameA = aA[2];
             const nameB = bB[2];
                if(!nameA || !nameB)
                  return 0;
   
                return nameA.localeCompare(nameB);
             });
           // }
       }
     }
     else{
       this.customSorting(event, this.logData);
      }
       this.LogsDataToPopulate = this.logData.slice(this.firstPage, (this.firstPage + this.rows));
       this.LogsDataToPopulate = [...this.LogsDataToPopulate]; 
}
  onChngeColumn() {

    let key = this.groupBy;
    event["field"] = key;
    this.sortfunction(event);

  }
  
 
  enable_disableFilter() {
    if(this.filterObj.length == 0)
      this.setSearchFilters();

    this.enableFilter = !this.enableFilter;
    this.tableHeight = !this.tableHeight; 
  }

  
  searchinTable() { 
    var data =[]; 
    if(this.ischecked===false){
      data = this.logData;
    }
    else{
    data = jQuery.extend(true,[],this._dataservice.$auditLogData);
    }
    this.filteredData = [];
   
    for (let j = 0; j < this.filterObj.length; j++) {
      let filterarray = [];
      for (let i = 0; i < data.length; i++) {
     
        if (this.filterObj[j].value == '') {
          break;
        }
       
        let stringtocheck = data[i][this.filterObj[j].field];
       
        if(this.filterObj[j].field == "responseTime"){ 
          let value = this.filterObj[j].value.replace(/[^\w\s]/gi, '');
          if(this.filterObj[j].value.includes(">") && (parseInt(stringtocheck) > parseInt(value))){
                   filterarray.push(data[i]);
          }else if(this.filterObj[j].value.includes("<") && (parseInt(stringtocheck)< parseInt(value))){
                   filterarray.push(data[i]);
          }else if(this.filterObj[j].value.includes(">=") &&(parseInt(stringtocheck) >= parseInt(value))){
                   filterarray.push(data[i]);
          }else if(this.filterObj[j].value.includes("<=") && (parseInt(stringtocheck) <= parseInt(value))){
                   filterarray.push(data[i]);
          }else if(this.filterObj[j].value.includes("=") && (parseInt(stringtocheck) === parseInt(value))){
            filterarray.push(data[i]);
          }else if(this.filterObj[j].value.includes("-") ){
            let stindx = this.filterObj[j].value.substr(0, this.filterObj[j].value.indexOf('-'));
             let enindx = this.filterObj[j].value.substr(this.filterObj[j].value.indexOf('-') + 1, this.filterObj[j].value.length);
             if (parseInt(stindx) <= parseInt(enindx)) {
              if (parseInt(stindx) <= parseInt(stringtocheck) && parseInt(enindx) >= parseInt(stringtocheck)) 
                  filterarray.push(data[i]);
             } else {
              if (parseInt(stindx, 0) >= parseInt(stringtocheck, 0) && parseInt(enindx, 0) <= parseInt(stringtocheck, 0))
                   filterarray.push(data[i]);
            }
          } else{
            if (parseInt(stringtocheck) >= parseInt(this.filterObj[j].value))
                   filterarray.push(data[i]);   
          }

        } else{
      	     if(stringtocheck){
            if(this.filterObj[j].value.toLowerCase() === 'cavisson'.toLowerCase()){
              if(stringtocheck.toLowerCase().indexOf('@') === -1){
                  if (stringtocheck.toLowerCase().indexOf(this.filterObj[j].value.toLowerCase()) !== -1) 
                      filterarray.push(data[i]);            
              }else
                 continue;  
              }else{
                if (stringtocheck.toLowerCase().indexOf(this.filterObj[j].value.toLowerCase()) !== -1) 
                 filterarray.push(data[i]);
               }
             }
         }
      }
      if (this.filterObj[j].value != '') {
        data = filterarray;
        data = data.slice();
      }
  
    }

      this.logData = data;
     this.LogsDataToPopulate = jQuery.extend(true,[], data.slice(0,40));
     this.LogsDataToPopulate = [...this.LogsDataToPopulate];
     this.totalRecords = data.length;
     
  }
  

  customSorting(event, tempData) {
    
    if (event.order == -1) {
      var temp = (event["field"]);
      event.order = 1
      tempData = tempData.sort(function (a, b) {
        if(temp == "responseTime"){
        var value = Number(a[temp]);
        var value2 = Number(b[temp]);
        return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        }else{
          return b[temp].toLowerCase().localeCompare(a[temp].toLowerCase());
        }
        
      });
    }
    else {
      var temp = (event["field"]);
      event.order = -1;
      //asecding order
      tempData = tempData.sort(function (a, b) {
        if(temp == "responseTime"){
        var value = Number(a[temp]);
        var value2 = Number(b[temp]);
        return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        }else{         
        return a[temp].toLowerCase().localeCompare(b[temp].toLowerCase());
        }
      });

  
    }

    
    this.LogsDataToPopulate = [];
    if (tempData) {
      tempData.map((rowdata) => { this.LogsDataToPopulate = this.Immutablepush(this.LogsDataToPopulate, rowdata) });
    }
  }

  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

  resetData() {
    this.ischecked=true;
    this.isSearchTab = true;
   this._dataservice.fetchAuditLogData(null, null, null);
    for (let j = 0; j < this.filterObj.length; j++) {
        this.filterObj[j].value = '';
      }

    this.startDate = '';
    this.startTime = '';
    this.endDate = '';
    this.endTime = '';
    this.enableFilter = true;
    this.timeZoneId = sessionStorage.getItem('timeZoneId');
    this.timeZone = sessionStorage.getItem('timeZone');
    this.defaultendTime = moment.tz(this.currentTime, this.timeZoneId).format('HH:mm');
    this.endTime = this.defaultendTime;
    this.currentDateTime= moment.tz(this.currentTime, this.timeZoneId).format('MM-DD-YYYY HH:mm').replace(/-/g,' ');
    this.dater= Date.parse(this.currentDateTime);
    this.lastonehour=this.dater-3600000;  //last one hours time in milliseconds
    this.defaultstartDate = moment(new Date(this.lastonehour)).format('MM/DD/YYYY');
    this.startDate = this.defaultstartDate;
    this.defaultendDate = new Date();
    this.endDate = this.defaultendDate;
    this.ddt2=moment(this.lastonehour).format("MM-DD-YYYY HH:mm");
    this.dtt3=this.ddt2.toString();
    this.dtt4=this.dtt3.split(" ");
    this.arr2=this.dtt4[1];  
    this.defaultstartTime =this.arr2;
    this.startTime = this.defaultstartTime;
    this.sDate  = moment(this.lastonehour).format("MM-DD-YYYY HH:mm");
    this.eDate = moment(this.currentDateTime).format("MM-DD-YYYY HH:mm");
    // report variable
    this.startDateTimeforLogReport = null;
    this.endDateTimeforLogReport = null;
    
    this.cols = [
      { field: 'activityTime', header: 'Activity Time' },
      { field: 'ip', header: 'IP Address' },
      { field: 'sessionId', header: 'Session Id' },
      { field: 'userName', header: 'User Name' },
      { field: 'moduleName', header: 'Module Name' },
      { field: 'activityName', header: 'Activity Name' },
      { field: 'description', header: 'Description' },
      { field: 'responseTime', header: 'Response Time (ms)'}
    ];
  }

  searchdata()
  { 
 
  if(this.changeinstartDate == true)
  {
    this.isSearchTab = true;
    this.applyTimePeriod();
    this.changeinstartDate = false;
  }
  else{
    if(this.isSearchTab){
    this.searchinTable();
  }
  }
  
}

checkdata()
{
 this.changeinstartDate = true;
}
  applyTimePeriod() {
    let startDate:any;
    startDate = moment(new Date(this.startDate)).format('MM-DD-YYYY');
    let tstartDateTime =  startDate + ' ' + this.startTime;
    
    if(!(startDate instanceof Date && !isNaN))
    {
      startDate = startDate.replace(/-/g, ' ') ;
     }
    let startDateTime = startDate + ' ' + this.startTime;
    let endDate:any;
    endDate = moment(new Date(this.endDate)).format('MM-DD-YYYY');
    let tendDateTime = endDate + ' ' + this.endTime;
   
    if(!(endDate instanceof Date && !isNaN))
    {
      endDate = endDate.replace(/-/g, ' ') ;
     }
    let endDateTime = endDate + ' ' + this.endTime;
    let comparestarttime = new Date(startDateTime);
    let compareEndTime = new Date(endDateTime);
    console.log(comparestarttime, compareEndTime, );
    this.timeZoneId = sessionStorage.getItem('timeZoneId');
    this.timeZone = sessionStorage.getItem('timeZone');
    var timer=Date.parse(endDateTime);  //value in milliseconds
    this.date = moment.tz(this.currentTime, this.timeZoneId).format('MM-DD-YYYY HH:mm').replace(/-/g,' ');
    var dater= Date.parse(this.date);   //value in milliseconds
    var difference=Math.abs(dater-timer);
               /*---------To restrict Future Date when apply Time Period--------------*/
     var endDateTimemilli = Date.parse(endDateTime);
     var endDatemilli = Date.parse(endDate);

     var startDateTimemilli = Date.parse(startDateTime);
     var startDatemilli = Date.parse(startDate);
    
     this.timeZoneId = sessionStorage.getItem('timeZoneId');
     let currentDateTime:any;
     currentDateTime = moment.tz(this.currentTime, this.timeZoneId).format('MM-DD-YYYY HH:mm');
     if(!(currentDateTime instanceof Date && !isNaN))
     {
      currentDateTime = currentDateTime.replace(/-/g, ' ') ;
      }
     var currentDateTimemilli = Date.parse(currentDateTime);
     let currentDate:any;
     currentDate = moment.tz(this.currentTime,this.timeZoneId).format('MM-DD-YYYY');
     if(!(currentDate instanceof Date && !isNaN))
     {
      currentDate = currentDate.replace(/-/g, ' ') ;
      }
     var currentDatemilli = Date.parse(currentDate);

     if((startDatemilli == currentDatemilli) && (startDateTimemilli > currentDateTimemilli))
     {
       this.errorMessage = [];
       this.errorMessage.push({ severity: 'error', summary: 'Error', detail: "Start Time should be less than or equal to Current Time" });
       this.isSearchTab = false;
       return;
     }

     if(startDatemilli > currentDatemilli)
     {
       this.errorMessage = [];
       this.errorMessage.push({ severity: 'error', summary: 'Error', detail: "Start Date should be less than or equal to Today's Date" });
       this.isSearchTab = false;
       return;
     }

     if((endDatemilli == currentDatemilli) && (endDateTimemilli > currentDateTimemilli))
     {
       this.errorMessage = [];
       this.errorMessage.push({ severity: 'error', summary: 'Error', detail: "End Time should be less than or equal to Current Time" });
       this.isSearchTab = false;
       return;
     }
 
     if(endDatemilli > currentDatemilli)
     {
       this.errorMessage = [];
       this.errorMessage.push({ severity: 'error', summary: 'Error', detail: "End Date should be less than or equal to Today's Date" });
       this.isSearchTab = false;
       return;
     }
     
    /*----------- start time validation ----------*/
    let arr=this.startTime.split(":");
    let beforecolon = arr[0];
    let aftercolon = arr[1];
    if(beforecolon.length < 2 || aftercolon.length < 2)
    {
      this.errorMessage=[];
      this.errorMessage.push({ severity: 'error', summary: 'Error', detail: "Start Time should be in the Format HH:MM" });
      this.isSearchTab = false;
      return;
    }
    /*---------- End time validation ------------*/
    let arr1=this.endTime.split(":");
    let beforecolon1 = arr1[0];
    let aftercolon1 = arr1[1];
    if(beforecolon1.length < 2 || aftercolon1.length < 2)
    {
      this.errorMessage=[];
      this.errorMessage.push({ severity : 'error', summary: 'Error', detail: "End Time should be in the Format HH:MM" });
      this.isSearchTab = false;
      return;
    }

    if (!comparestarttime.getDate()) {
      this.errorMessage = []; 
      this.errorMessage.push({ severity: 'error', summary: 'Error', detail: "Specify Correct Start date/time" });
      this.isSearchTab = false;
      return;
    }
    else if (!compareEndTime.getDate()) {
      this.errorMessage = [];
      this.errorMessage.push({ severity: 'error', summary: 'Error', detail: "Specify Correct End date/time" });
      this.isSearchTab = false;
      return;
    }
    if (comparestarttime > compareEndTime) {
      this.errorMessage = [];
      this.errorMessage.push({ severity: 'error', summary: 'Error', detail: "Start date/time must be smaller than end date/time " });
      this.isSearchTab = false;
      return;
    }
    if (this.endTime == '' || this.startTime == '') {
      this.errorMessage = [];
      this.errorMessage.push({ severity: 'error', summary: 'Error', detail: "Please Specify time " });
      this.isSearchTab = false;
      return;
    }
    
    this.sDate = tstartDateTime;
    this.eDate = tendDateTime;
    //Report start and End Date after apply
    this.startDateTimeforLogReport = tstartDateTime;
    this.endDateTimeforLogReport = tendDateTime;
  
  

    this._dataservice.fetchAuditLogData(tstartDateTime, tendDateTime, this.filterObj);

    
  }

  generateReportAudit() {
    this._dataservice.generateAuditLogReport(this.startDateTimeforLogReport, this.endDateTimeforLogReport);
  }

  /**This method is responsible to download td as per downloadType
     * @param {type} downloadType
     * @returns {undefined}
     */
  downloadLogReports(downloadType: String)
  {
    try{
          let header = new Array();
          let fieldArr = new Array();

          for(let i = 0;i <this.cols.length;i++){
            header[i] = this.cols[i].header;
            fieldArr[i] = this.cols[i].field;
          }
     let dateTime=this.sDate +"|"+this.eDate; 
     var filterValues= []
     for(let i=0; i< this.filterObj.length; i++)
     { if(this.filterObj[i].value != '')
        filterValues.push(this.filterObj[i].value);
     }
          this._dataservice.downloadLog(downloadType,this.logData, fieldArr.toString(),header.toString(),dateTime,filterValues.toString());
    }
    catch( e){
       console.log("error --> ",e);
    }

  }
  
  getColumnsToDisplay(){
          /* Handling of dc name column for multi-dc */
        if(sessionStorage.getItem('isMultiDCMode') && sessionStorage.getItem('activeDC') == 'ALL'){
          this.cols = [
            { field: 'activityTime', header: 'Activity Time'},
            { field: 'ip', header: 'IP Address'},
            { field: 'sessionId', header: 'Session Id'},
            { field: 'userName', header: 'User Name'},
            { field: 'moduleName', header: 'Module Name'},
            { field: 'activityName', header: 'Activity Name'},
            { field: 'dCName', header: 'DC Name'},
            { field: 'description', header: 'Description'},
            { field: 'responseTime', header: 'Response Time (ms)'}
        ];
        }
        else{
        this.cols = [
          { field: 'activityTime', header: 'Activity Time'},
          { field: 'ip', header: 'IP Address'},
          { field: 'sessionId', header: 'Session Id'},
          { field: 'userName', header: 'User Name'},
          { field: 'moduleName', header: 'Module Name'},
          { field: 'activityName', header: 'Activity Name'},
          { field: 'description', header: 'Description'},
          { field: 'responseTime', header: 'Response Time (ms)'}
        ];
        }

      
              }

    /* This Method is called when click on Include In-Active Sessions checkbox */
  checkValue(event) {
    try {
      this.logData = this._dataservice.$auditLogData;
      if(this.logData.length !== 0){
        this.dataFor= [];
        if(!event.checked){
            this.ischecked=false;
            this.activeUserList= this._dataservice.$activeUserList;
            for(let i=0;i<this.logData.length;i++){
              for(let j=0;j<this.activeUserList.length;j++){
                if(this.logData[i].sessionId == this.activeUserList[j])
                  this.dataFor.push(this.logData[i]);
              } 
            }
          }else{
             this.ischecked=true;
             this.dataFor=this._dataservice.$auditLogData; 
          }
          this.logData = [];
          this.logData = this.dataFor
          this.totalRecords=this.dataFor.length;
        //  this.paginator.changePage(0,event,1);
          this.firstPage = 0;
          this.LogsDataToPopulate = this.dataFor.slice(this.firstPage, (this.firstPage + this.rows));
          this.LogsDataToPopulate = [...this.LogsDataToPopulate];
        }else{
          this.LogsDataToPopulate=this.logData.slice(0,40);
        }
    } 
    catch (error) {
      console.log('error in intailization component ->', error);
    } } 

    refreshData()
     {
      this.firstPage = 0;
       this.startDate = '';
       this.startTime = '';
       this.endDate = '';
       this.endTime = '';
       this.enableFilter = false;
       this.isSearchTab = true;
       this.timeZoneId = sessionStorage.getItem('timeZoneId');
       this.timeZone = sessionStorage.getItem('timeZone');
       this.defaultendTime = moment.tz(this.currentTime, this.timeZoneId).format('HH:mm');
       this.endTime = this.defaultendTime;
       this.currentDateTime= moment.tz(this.currentTime, this.timeZoneId).format('MM-DD-YYYY HH:mm').replace(/-/g,' ');
       this.dater= Date.parse(this.currentDateTime);
       this.lastonehour=this.dater-3600000;  //last one hours time in milliseconds
       this.defaultstartDate = moment(new Date(this.lastonehour)).format('MM/DD/YYYY');
       this.startDate = this.defaultstartDate;
       this.defaultendDate = new Date();
       this.endDate = this.defaultendDate;
       this.ddt2=moment(this.lastonehour).format("MM-DD-YYYY HH:mm");
       this.dtt3=this.ddt2.toString();
       this.dtt4=this.dtt3.split(" ");
       this.arr2=this.dtt4[1];
       this.defaultstartTime =this.arr2;
       this.startTime = this.defaultstartTime;
       this.sDate  = moment(this.lastonehour).format("MM-DD-YYYY HH:mm");
       this.eDate = moment(this.currentDateTime).format("MM-DD-YYYY HH:mm");
       
       // report variable for refresh Audit log date and time 
       this.startDateTimeforLogReport = this.sDate;
       this.endDateTimeforLogReport = this.eDate;
      
        this.ischecked=true;
       this._dataservice.fetchAuditLogData(null,null, null);
  
       this.cols = [
        { field: 'activityTime', header: 'Activity Time' },
        { field: 'ip', header: 'IP Address' },
        { field: 'sessionId', header: 'Session Id' },
        { field: 'userName', header: 'User Name' },
        { field: 'moduleName', header: 'Module Name' },
        { field: 'activityName', header: 'Activity Name' },
        { field: 'description', header: 'Description' },
        { field: 'responseTime', header: 'Response Time (ms)'}
      ];
    }


     ngOnDestroy(): void {
      if(this.dataSubscription)
       this.dataSubscription.unsubscribe();
    }
  
  }
