import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { BlockUIModule, SelectItem,InputTextModule,CheckboxModule,DropdownModule, Message, MessageService } from 'primeng';
import { InstanceInterface, FlightRecorderInterface } from '../dumps/heap-dump/interfaces/take-heap-dump-info';
// import { MatDialog } from '@angular/material';
// import { Logger } from '../../../../../vendors/angular2-logger/core';
// import { CavTopPanelNavigationService } from '../../../../main/services/cav-top-panel-navigation.service';
import { HttpClient } from "@angular/common/http";
import { DdrDataModelService } from '../dumps/thread-dump/service/ddr-data-model.service';
// import { CavConfigService } from '../../../../main/services/cav-config.service';
// import {  } from 'primeng/primeng';
import { Subscription, Subject } from 'rxjs';
import { DashboardRESTDataAPIService } from '../dumps/service/dashboard-rest-data-api.service';
// import { ChartModule } from 'angular2-highcharts';
// import { Highcharts } from '../../constants/common-constants';
// import { Observable } from 'rxjs/Observable';
// import { interval } from 'rxjs/observable/interval';
import { timer } from 'rxjs';
import * as Highcharts from 'highcharts';
import { SessionService } from 'src/app/core/session/session.service';
import { ActivatedRoute, NavigationEnd, Route, Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-mission-control',
  templateUrl: './mission-control.component.html',
  styleUrls: ['./mission-control.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MissionControlComponent implements OnInit {
  highcharts = Highcharts;
  productKey: string;
  showTable = 0;
  showAll = false;
  selectedServerVal: string;
  selectedTierVal: string;
  showThreadDumpOption = false;
  tierServerJsonList: Object;
  tierNameList: any[];
  tiers: SelectItem[];
  servers: SelectItem[];
  instanceInfo: Array<InstanceInterface>;
  selectedInstanceInfo: InstanceInterface[] = [];
  processIDWithInstance;
  isNDCase = false;
  isChecked = false;
  instanceDetail: Object[] = [{ "pid": "", "appName": "", "arguments": "", "status": "" }];
  ErrorResult: string;
  selectedRowIndex = 0;
  isCompressed = false;
  disableMsg = true;
  showMessageArr: any[];
  display = false;
  showDialog = false;
  maxTimeOut = 10;
  interval = 60;
  sampleCount = 2;
  filterByColumn;
  checkCmdArgs = true;
  startFlight = false;
  showFlight = false;
  showMemLeak = false;
  tabView = true;
  chartView = false;
  compareView = false;
  fileName = '/tmp/';
  selectTime: SelectItem[];
  selectFileSize: SelectItem[];
  selectFilter: SelectItem[];
  selectOperation: SelectItem[];
  selectedTime = 'Second(s)';
  selectedSize = 'MB';
  selectedFilter: string;
  selectedOperation: any;
  fileSize: any = undefined;
  convertedTime: number;
  convertedFileSize: number;
  colsForFlight: any;
  colsForMemLeak: any;
  message: Message;
  isOverwrite = false;
  checkMaxTimeOut = true;
  selectedValues: string[] = ['checkMaxTimeOut'];
  flightData: Array<FlightRecorderInterface>;
  selectedRowInfo: FlightRecorderInterface;
  public _message: Message;
 timeLimitForMessage = 15000;
 serverNameforTD: string;
 maxTime = 10;
nodeValueToDelete;
jfrList: any;
confirmationPopup = false;
 headerName;
 Options;
 options1;
 options2;
 showMemLeakTab = false;
 memLeakData: any;
 updateData:Subscription;
 firstMemLeakData: any;
 samlpleArrList = [];
 isPlay=true;
 isPause=false;
 isStop=false;
 loading = false;

/*Observable for update message sources.*/
private _messageObser = new Subject<Message>();

/*Service Observable for getting update message.*/
messageProvider$ = this._messageObser.asObservable();
  productType: string;
  userName: string;
  testRun: string;
  name: any;
  featureName: string;

/** Message subscriber */
  missionControlMsgSubscription: Subscription;
  /*Service message commands.*/
  messageEmit(message) {
    this._messageObser.next(message);
  }

  constructor(private sessionService: SessionService, 
    // private log: Logger, private dialog: MatDialog,
      // private _navService: CavTopPanelNavigationService,
      private http: HttpClient, private id: DdrDataModelService,
      // private _cavConfigService: CavConfigService,
      private route: ActivatedRoute,
      private messageService: MessageService,
      private _restAPI: DashboardRESTDataAPIService) {

          console.log(this.route.snapshot.paramMap.get('name'));
          this.headerName = this.route.snapshot.paramMap.get('name');
          if(this.headerName == 'mission_control') {
            this.featureName = 'Mission Control';
          } else {
            this.featureName = 'Java Flight Recording'
          }
  }
  ngOnDestroy() {
      if (this.missionControlMsgSubscription !== null && this.missionControlMsgSubscription !== undefined) {
            this.missionControlMsgSubscription.unsubscribe();
          }
if(this.updateData && null !== this.updateData)
              this.updateData.unsubscribe();
  }
  ngOnInit() {
    // this.router.events.pipe(
    //   filter((event: RouterEvent) => event instanceof NavigationEnd)
    // ).subscribe(() => {
    //   this.fetchData();
    // });
    console.log("Session Service ===> ", this.sessionService.session);
      this.productKey = this.sessionService.session.cctx.pk;
      // this.headerName = this.id.featureName;
      this.productType = this.sessionService.session.cctx.prodType;
      if(this.productType == 'NetDiagnostics')
        this.productType = 'netdiagnostics';
      this.userName = this.sessionService.session.cctx.u;
      this.testRun = this.sessionService.testRun.id;
      console.log("Header Name ======> ", this.headerName);
      if (this.headerName == 'mission_control') {
          this.showMemLeak = true;
      }
//console.log("productkey kya h bhaiiiiii", this.productKey);
      this.getTierList();
      this.missionControlMsgSubscription = this.messageProvider$.subscribe(data => this.messageService.add(data));
  }

  showNotification(result) {
      //console.log("response of Flight Recording rest call ", result);
      this.disableMsg = false;
      if (!result)
 {
  this.id.setInLogger("","Java Flight Recording","Java Flight Recording Started","Unable to open window since no response coming from agent");
        this.errorMessage("Unable to open window since no response coming from agent");
 }
      console.log("result log is ", result[0].split(':')[0]);
        if (result[0].startsWith("Pass")) {
           // this.startFlight = false;
    this.id.setInLogger("","Java Flight Recording","Java Flight Recording Started",""+result[0].split(":")[2]);
          this.multiSuccessMessage(result[0].split(":")[2], result[0].split(":")[1]);
        }
        if (result[0].startsWith("Fail")) {
           // this.startFlight = false;
            if (result[0].split(":")[3] && result[0].split(":")[2]) {
      this.id.setInLogger("","Java Flight Recording","Java Flight Recording Started",""+result[0].split(":")[2]+result[0].split(":")[3]);
                this.multiErrorMessage(result[0].split(":")[2] + result[0].split(":")[3], result[0].split(":")[1]);
             }
            else if (result[0].split(":")[2]) {
      this.id.setInLogger("","Java Flight Recording","Java Flight Recording Started",""+result[0].split(":")[2]);
                this.multiErrorMessage(result[0].split(":")[2] , result[0].split(":")[1]);
  }
        }
    }

  getTierList() {
      this.showTable = 0;
      this.selectedServerVal = '';
      this.selectedTierVal = '';
      this.showThreadDumpOption = false;
      // var url = "http://10.10.40.3:8001/netdiagnostics/v1/cavisson/netdiagnostics/ddr/getTierServerListFromTopology?testRun=1250"
      var url = this.getHostUrl() + '/' + this.productType + "/v1/cavisson/netdiagnostics/ddr/getTierServerListFromTopology?testRun=" + this.testRun;
      console.log("URL  =====> ", url);
      return this.http.get(url).subscribe(data => (this.setTierValues(data)));
  }
  

  getHostUrl(): string {
      var hostDcName;
      // if (this._navService.getDCNameForScreen("viewThreadDump") === undefined)
      //     hostDcName = this._cavConfigService.getINSPrefix();
      // else
      //     hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("viewThreadDump");

      // if (hostDcName.length > 0) {
      //     sessionStorage.removeItem("hostDcName");
      //     sessionStorage.setItem("hostDcName", hostDcName);
      // }
      // else

      // hostDcName = window.location.protocol + '//' + window.location.host;
      if (this.sessionService.preSession.multiDc === true) {
        hostDcName = this.id.getHostUrl() + "/node/ALL"
        console.log('*************hostDcName =**********', hostDcName);

      } else {
        hostDcName = this.id.getHostUrl();
      }

      //console.log('hostDcName =', hostDcName);
      return hostDcName;
  }

  setTierValues(jsondata: any) {
      //console.log("jsondata ---- ", jsondata);
      this.tierServerJsonList = jsondata;
      this.tierNameList = Object.keys(jsondata);
      this.tiers = [];
      this.tiers.push({ label: "-- Select Tier --", value: null });
      for (var i = 0; i < this.tierNameList.length; i++) {
          this.tiers.push({ label: this.tierNameList[i], value: this.tierNameList[i] });
      }
  }

  getJavaInstances() {
      this.instanceInfo = [];
      this.selectedInstanceInfo = undefined;
      this.isNDCase = false;
      console.log("kjhl=========> ", this.selectedServerVal);
      if(this.selectedServerVal.indexOf('(') != -1)
          this.serverNameforTD = this.selectedServerVal.substring(this.selectedServerVal.indexOf('(')+1,this.selectedServerVal.indexOf(')'));
      else 
          this.serverNameforTD = this.selectedServerVal;

      var url = this.getHostUrl() + '/' + this.productType + "/v1/cavisson/netdiagnostics/ddr/getJavaInstances?server=" + this.serverNameforTD+"&testRun="+this.testRun;
      return this.http.get(url).subscribe(data => (this.doAssignValues(data)));
  }
  getNDInstances() {
      this.instanceInfo = [];
      this.selectedInstanceInfo = undefined;
      this.isNDCase = true;
  
      if(this.selectedServerVal.indexOf('(') != -1)
          this.serverNameforTD = this.selectedServerVal.substring(0,this.selectedServerVal.indexOf('('));
      else 
          this.serverNameforTD = this.selectedServerVal;

      var url = this.getHostUrl() + '/' + this.productType + "/v1/cavisson/netdiagnostics/ddr/getNDInstances?server=" + this.serverNameforTD + "&tier=" + this.selectedTierVal;
      return this.http.get(url).subscribe(data => (this.doAssignValues(data)));
    }

  doAssignValues(res: any) {
      //console.log("res --- ", res);
      this.showTable = 1;
      this.showThreadDumpOption = true;
      this.instanceDetail = res.data;
      //console.log("instance detail --- " , this.instanceDetail);

      if (this.instanceDetail.toString().startsWith("Unable to get instance") || this.instanceDetail.toString().toLowerCase().includes("error")) {
          this.ErrorResult = this.instanceDetail.toString();
          this.showTable = 0;
          this.showThreadDumpOption = false;
      }
      else {
          this.instanceInfo = this.getInstanceInfo();
          this.showTable = 1;
          this.showThreadDumpOption = true;
      }
  }
  getInstanceInfo(): Array<InstanceInterface> {
      let instArr = [];
      for (var i = 0; i < this.instanceDetail.length; i++) {
          if (this.isNDCase) {
              if (this.instanceDetail[i]["agentType"].trim().toLowerCase() === 'java')
                  instArr[i] = { pid: this.instanceDetail[i]["pid"], appName: this.instanceDetail[i]["appName"], agentType: this.instanceDetail[i]["agentType"], status: this.instanceDetail[i]["status"].replace(",", "") };
          }
          else
              instArr[i] = { pid: this.instanceDetail[i]["pid"], appName: this.instanceDetail[i]["appName"], arguments: this.instanceDetail[i]["arguments"], status: this.instanceDetail[i]["status"].replace(",", "") };
      }
      return instArr;
  }

  onRowSelectData(selectedRowData: any) {
      //console.log("rowData ---- ", selectedRowData);
      this.selectedRowIndex++;
      //this.selectedInstanceInfo.push(selectedRowData);
  }
  onRowUnselectData(unSelectedRowData: any) {
      this.selectedRowIndex--;
      let index: number = this.selectedInstanceInfo.indexOf(unSelectedRowData);
      if (index !== -1) {
          this.selectedInstanceInfo.splice(index, 1);
      }
      //console.log('after deletion --- ', this.selectedInstanceInfo);
  }
  resetData() {
      //this.instanceInfo = [];
      this.selectedInstanceInfo = [];
      this.servers = [];
      this.selectedTierVal = this.tiers[0].value;
      this.servers.push({ label: "", value: "" });
      this.ErrorResult = "";
      this.showTable = 0;
      this.showThreadDumpOption = false;
  }

  close() {
      // try {
      //     this.log.info('Closing JFR window');
      //     // this.showFlight = false;
      //     this.dialog.closeAll();
      // } catch (e) {
      //     this.log.error('Error in closing JFR window', e);
      // }
  };

  getServerValue(selectedValue: any) {
      var serverNameList = [];
      this.servers = [];
      this.selectedServerVal = "";

      for (var i = 0; i < this.tierNameList.length; i++) {
          if (selectedValue == this.tierNameList[i]) {
              serverNameList.push(this.tierServerJsonList[this.tierNameList[i]]);
              //serverNameList = Object.keys(this.tierServerJsonList[this.tierNameList[i]]);
          }
      }

      this.servers.push({ label: "-- Select Server --", value: null });
      for (var obj of serverNameList) {
          for(var str in obj){
            if(obj[str] == str)
            {
              this.servers.push({ label: str, value: str });
            }
            else
            {
              this.servers.push({ label: str+"("+obj[str]+")", value: str+"("+obj[str]+")" });
            }
          }
        }
      /*for (var k = 0; k < serverNameList.length; k++) {
          this.servers.push({ label: serverNameList[k], value: serverNameList[k] });
      }*/
      //this.selectedServerVal = this.servers[0].value;
  }

  openStartFlightRecorder() {
      this.processIDWithInstance = "";
      this.resetAllFields();
      //console.log("this.selectedInstanceInfo======",this.selectedInstanceInfo)
      if (this.selectedInstanceInfo != null && Object.keys(this.selectedInstanceInfo).length>0) {
      
          this.processIDWithInstance += this.selectedInstanceInfo["pid"] + ":" + this.selectedInstanceInfo["appName"];

      if (this.processIDWithInstance.startsWith(","))
          this.processIDWithInstance = this.processIDWithInstance.substring(1);
          
              this.selectTime = [];
              this.selectTime.push({ label: 'Second(s)', value: 'Second(s)' });
              this.selectTime.push({ label: 'Minute(s)', value: 'Minute(s)' });
              this.selectTime.push({ label: 'Hour(s)', value: 'Hour(s)' });
      
              this.selectFileSize = [];
              this.selectFileSize.push({ label: 'KB', value: 'KB' });
              this.selectFileSize.push({ label: 'MB', value: 'MB' });
              this.selectFileSize.push({ label: 'GB', value: 'GB' });
      
              this.startFlight = true;
      }else {
          alert("Please select instance");
    return;
      }

  }

  showFlightRecording()
  {
      if(!this.selectedInstanceInfo)
      {
          alert("First select an instance from table to show recording");
          return;
      }
      this.selectedRowInfo = undefined;
      let url = '';
      let strCmdArgs = '';
      if (this.selectedInstanceInfo != null && Object.keys(this.selectedInstanceInfo).length>0){
          this.processIDWithInstance = this.selectedInstanceInfo["pid"] + ":" + this.selectedInstanceInfo["appName"];
          url = this.getHostUrl() + '/' + this.productType + '/v1/cavisson/netdiagnostics/ddr/missionControl?testRun=' + this.testRun + '&userName=' + this.userName + '&isNDCase=' + this.isNDCase+'&pidwithapp='+ this.processIDWithInstance;
      }
      else
        alert("Please select one insatnce to show flight recording");


      //console.log(this.id.product);
      if(this.selectedTierVal != null) {
          url += '&tierName=' + this.selectedTierVal;
      }

      if(this.isNDCase) {
       if(this.selectedServerVal != null) {
          if(this.selectedServerVal.indexOf('(') != -1)
              this.serverNameforTD = this.selectedServerVal.substring(0,this.selectedServerVal.indexOf('('));
          else 
              this.serverNameforTD = this.selectedServerVal;
        }
}
       else {
           if(this.selectedServerVal.indexOf('(') != -1)
              this.serverNameforTD = this.selectedServerVal.substring(this.selectedServerVal.indexOf('(')+1,this.selectedServerVal.indexOf(')'));
           else
              this.serverNameforTD = this.selectedServerVal;
        } 

        url += '&serverName=' + this.serverNameforTD;

      url += '&operation=show&cmdArgs= -u ' + this.userName;

      console.log('url======', url);
      this.http.get(url).subscribe(data => { this.doAssignFlightRecData(data) })
  }
  doAssignFlightRecData(data) {
      if (data) {
          this.flightData = undefined;
          this.showFlight = true;
      }
      this.flightData = data.frData;
      //console.log('this.flightData **** ', this.flightData);
      this.showFlight = true;
      this.showNotification(data.status);
  }
  openFlightRecording() {
      if (this.selectedInstanceInfo != null && Object.keys(this.selectedInstanceInfo).length>0) {

          this.colsForFlight = [
              { field: 'id', header: 'Recording ID'},
              { field: 'name', header: 'Recording Name'},
              { field: 'status', header: 'Status'},
              { field: 'duration', header: 'Duration'},
              { field: 'file', header: 'Recording File'},
              { field: 'size', header: 'File Size'},
              { field: 'lastmodification', header: 'Last Modification Time'},
              { field: 'compression', header: 'Compression'},
          ];

      }else {
          alert('Please select instance');
    return;
      }
  }

  startMemLeakAnalyzer() {
    this.loading=true;
      if (this.selectedInstanceInfo && Object.keys(this.selectedInstanceInfo).length >0) {
          this.colsForMemLeak = [
              { field: 'objectNameChanged', header: 'Object Type', sortable: 'custom', width: '200', align: 'left'},
              { field: 'growthRate', header: 'Growth Rate (KB/s)', sortable: 'custom', width: '100', align: 'right'},
              { field: 'heapPct', header: 'Heap Usage (in %)', sortable: 'custom',width: '100', align: 'right'},
              { field: 'memorySizeInUnit', header: 'Size (MB)', sortable: 'custom', width: '100', align: 'right'},
              { field: 'deltaSizeInUnit', header: 'Delta Size (KB)', sortable: 'custom', width: '100', align: 'right'},
              { field: 'objectCount', header: 'Count', sortable: 'custom', width: '100', align: 'right'},
              { field: 'deltaCount', header: 'Delta Count', sortable: 'custom', width: '100', align: 'right'}
          ];

          this.selectFilter = [];
          this.selectFilter.push({ label: 'Object Type', value: 'Object Type'});
          this.selectFilter.push({ label: 'Growth Rate', value: 'Growth Rate'});
          this.selectFilter.push({ label: 'Heap Usage', value: 'Heap Usage'});
          this.selectFilter.push({ label: 'Size', value: 'Size'});
          this.selectFilter.push({ label: 'Delta Size', value: 'Delta Size'});
          this.selectFilter.push({ label: 'Count', value: 'Count'});
          this.selectFilter.push({ label: 'Delta Count', value: 'Delta Count'});

          this.selectOperation = [];
          this.selectOperation.push({ label: '>', value: 'greater' });
          this.selectOperation.push({ label: '>=', value: 'greaterequal' });
          this.selectOperation.push({ label: '<', value: 'less' });
          this.selectOperation.push({ label: '<=', value: 'lessequal' });
          this.selectOperation.push({ label: '==', value: 'equal' });
          this.showMemLeakTab = true;
          //console.log('Interval-----', this.interval);
    this.startMemLeakTimer();
       /*   let updateinterval = this.interval * 1000;
          let updateMemLeakData = timer(0, updateinterval);
          this.updateData = updateMemLeakData.subscribe(t => {
            //  console.log('MemleakJsondata----', t);
              this.getMemLeakData(t);
            });*/
      }else {
        this.loading=false;
          alert('Please select instance');
    return;
      }
  }
  refresh() {
    this.play();
  }

  resetDelta() {
      this.memLeakData.forEach((val, index) => {
          val['deltaCount'] = '0';
          val['deltaSizeInUnit'] = '0';
      });

  }

  pause() {
this.isPause=true;
this.isPlay=false;
  }

  play() {
this.isPlay=true;
this.isPause=false;
this.isStop=false;
     /* let updateinterval = this.interval * 1000;
          let updateMemLeakData = timer(0, updateinterval);
          this.updateData = updateMemLeakData.subscribe(t => {
              //console.log('MemleakJsondata----', t);
              this.getMemLeakData(t);
          }); */
    this.startMemLeakTimer();
  }

stop() {
  this.isPause = true;
  this.isStop = true;
  this.isPlay = false;
  this.updateData.unsubscribe();
}

  getMemLeakData(CallTime: Number) {
      if (!this.selectedInstanceInfo) {
          alert('First select an instance from table to show recording');
          return;
      }
      this.selectedRowInfo = undefined;
      let url = '';
      let strCmdArgs = '';
      if (this.selectedInstanceInfo && Object.keys(this.selectedInstanceInfo).length > 0) {
          this.processIDWithInstance = this.selectedInstanceInfo['pid'] + ':' + this.selectedInstanceInfo['appName'];
          url = this.getHostUrl() + '/' + this.productType + '/v1/cavisson/netdiagnostics/webddr/getMemoryLeakAnalyzerData?testRun=' +
           this.testRun + '&userName=' + this.userName + '&isNDCase=' + this.isNDCase + '&pidwithapp=' +
            this.processIDWithInstance + '&productKey=' + this.productKey;
      } else {
        alert('Please select one insatnce to show MemoryLeak Analyzer');
        return;
      }


      //console.log(this.id.product);
      if(this.selectedTierVal != null) {
          url += '&tierName=' + this.selectedTierVal;
      }

      if(this.isNDCase) {
       if(this.selectedServerVal != null) {
          if(this.selectedServerVal.indexOf('(') !== -1) {
              this.serverNameforTD = this.selectedServerVal.substring(0,this.selectedServerVal.indexOf('('));
          } else {
              this.serverNameforTD = this.selectedServerVal;
          }
        }
      } else {
           if(this.selectedServerVal.indexOf('(') != -1) {
              this.serverNameforTD = this.selectedServerVal.substring(this.selectedServerVal.indexOf('(')+1,this.selectedServerVal.indexOf(')'));
           } else {
              this.serverNameforTD = this.selectedServerVal;
           }
        }

        url += '&serverName=' + this.serverNameforTD;

      url += '&operation=show&cmdArgs= -u ' + this.userName;

      if (this.firstMemLeakData != null && this.firstMemLeakData !== undefined) {
          var filename = this.firstMemLeakData.fileName;
          url+= '&fileName=' + filename + '&firstExecutionTime=' + this.firstMemLeakData.firstExecutionTime;
      }
      console.log("first memleak data -======> ", this.firstMemLeakData);
      console.log('url======', url, 'filename--', filename);
      this.http.get(url).subscribe( (data :any) => { this.doAssignMemLeakData(data, CallTime) })
  }

  doAssignMemLeakData(data: any, callTime: Number) {
      //console.log('callTime', callTime);
      this.loading=false;
if(data.errorMsg && data.errorMsg != "")
  {
    this.errorMessage(data.errorMsg);
    this.updateData.unsubscribe();
    this.showMemLeakTab = false;
    return;
  }
      if (callTime === 0) {
          this.firstMemLeakData = data;
          console.log("first memleak data -======> ", this.firstMemLeakData);
      }
      //console.log('data=-==', data.listData, 'firstMemLeakData----', this.firstMemLeakData);
if(!this.isPause) {
        this.memLeakData = data.listData;
        this.getChartData(JSON.parse(JSON.stringify(this.memLeakData)), callTime);
}
  }

  apply() {
    //console.log('Interval value---->', this.interval);
    this.play();
  }

  getChartData(pieData: any, callTime: any) {
      pieData = pieData.sort((a, b) => (a.heapPct > b.heapPct) ? -1 : 1);
      let pieArr = [];
      let barArr = [];
      let barXArr = [];
      if (pieData.length !== 0 && pieData.length > 10) {
          for (let i = 0; i < pieData.length; i++) {
              if (i === 10) {
                  break;
              }
              pieArr.push({'name': pieData[i].objectNameChanged, 'y': pieData[i].heapPct});
              barArr.push(pieData[i].heapPct);
              barXArr.push(pieData[i].objectNameChanged);
          }
      }

      let dateTimeFormat = new Date() ;
      let format = dateTimeFormat.getDate() + '/' + dateTimeFormat.getMonth() + ' '
                  + dateTimeFormat.getHours() +  ':' + dateTimeFormat.getMinutes() + ':' + dateTimeFormat.getSeconds();
       
                  let seriesObj = {};
                  seriesObj['name'] = 'Sample' +  (callTime + 1) + ' (' + format + ')' ;
                  seriesObj['data'] = barArr;

      this.samlpleArrList.push(seriesObj);


      let sampleArrCount = this.samlpleArrList.length;
      if (this.sampleCount < sampleArrCount) {
          this.samlpleArrList.splice(0, 1);
      }
      var removeSample = 'Sample' +  (callTime + 1)
      if(this.samlpleArrList.length > 0) {
          for (let k = 0 ; k < this.samlpleArrList.length ; k++) {
               let  key = this.samlpleArrList[k];
               if (key.hasOwnProperty('_colorIndex')) {
                     delete key['_colorIndex'];
               }
          }
      }
      for (let j = 0; j < this.sampleCount; j++) {
          let sample = 'Sample' + ( j + 1)
               if (this.samlpleArrList.hasOwnProperty('name')) {
                  this.samlpleArrList['name'] = this.samlpleArrList['name'].replace(removeSample, sample);
            }
      }
    if (this.samlpleArrList.length == 2) {
      this.options2 = {
        chart: {
          type: 'column',
          width: 1200,
          responsive: true,
          zoomType: 'x',
        },
        title: {
          text: 'Heap Usage comparision (Top 10 Objects)'
        },
        credits: {
          enabled: false
        },
        subtitle: {
          text: ''
        },
        xAxis: {
          crosshair: true,
          categories: barXArr,
          labels: {
            rotation: -45,
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: '% of Heap'
          },
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: this.samlpleArrList
      }
    }
      this.Options = {
          chart: {
              type: 'pie',
              width: 1200,
              responsive: true,
            },
            credits: {
              enabled: false
            },
            title: { text: 'Heap Usage (Top 10 Objects)', style: { 'fontSize': '13px' } },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
              pie: {
                cursor: 'pointer',
                allowPointSelect: true,
                dataLabels: {
                  enabled: true,
                  format: '<b> {point.name} </b>: {point.percentage:.2f} %',
                },
                showInLegend: true,
                borderWidth: 0
              }
            },
            legend: {
              enabled: true,
              layout: 'horizental',
              align: 'right',
              width: 200,
              verticalAlign: 'middle'
            },
            series: [
              {
                name: '',
                data: pieArr,
                colorByPoint: true,
                enableMouseTracking: true
              }
            ]
      };
    this.options1 = {
      chart: {
        type: 'column',
        width: 1200,
        responsive: true,
        zoomType: 'x',
      },
      title: {
        text: 'Heap Usage comparision (Top 10 Objects)'
      },
      credits: {
        enabled: false
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        crosshair: true,
        categories: barXArr,
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: '% of Heap'
        },
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: this.samlpleArrList
    };
      

  }

  tabViewTab(event) {
      //console.log(event);
      if(event.index == 0) {
          this.chartView = false;
          this.compareView = false;
          this.tabView = true;
      } else if(event.index == 1) {
          this.compareView = false;
          this.tabView = false;
          this.chartView = true;
      } else {
          this.chartView = false;
          this.tabView = false;
          this.compareView = true;
      }
  }



  closeFlightRecording() {
      this.startFlight = false;
      this.showFlight = false;
  }

  flightRecordingData(operation:string){
      let url = '';
      let strCmdArgs = '';
      let rowData = this.selectedRowInfo["recordingId"]+":"+this.selectedRowInfo["recordingFileName"]+":"+this.selectedRowInfo["status"];
      if (this.selectedInstanceInfo && Object.keys(this.selectedInstanceInfo).length>0){
          this.processIDWithInstance = this.selectedInstanceInfo["pid"] + ":" + this.selectedInstanceInfo["appName"];
          url = this.getHostUrl() + '/' + this.productType + '/v1/cavisson/netdiagnostics/ddr/missionControl?testRun=' + this.testRun + '&userName=' + this.userName + '&isNDCase=' + this.isNDCase+'&pidwithapp='+ this.processIDWithInstance+'&rowData='+rowData ;
      }
      else {
        alert("Please select one insatnce to show flight recording");
  return;
 }

        if(this.selectedTierVal != null) {
          url += '&tierName=' + this.selectedTierVal;
      }

if(this.isNDCase) {
       if(this.selectedServerVal != null) {
          if(this.selectedServerVal.indexOf('(') != -1)
              this.serverNameforTD = this.selectedServerVal.substring(0,this.selectedServerVal.indexOf('('));
          else 
              this.serverNameforTD = this.selectedServerVal;
        }
 }
 else {
           if(this.selectedServerVal.indexOf('(') != -1)
              this.serverNameforTD = this.selectedServerVal.substring(this.selectedServerVal.indexOf('(')+1,this.selectedServerVal.indexOf(')'));
           else
              this.serverNameforTD = this.selectedServerVal;
        } 

        url += '&serverName=' + this.serverNameforTD;

        url += '&operation='+operation+'&cmdArgs= -u '+this.userName;

        //console.log('url ',operation,' case======', url);
        this.http.get(url).subscribe(data => { this.doAssignFlightRecData(data) })
  }

  stopFlightRecording(){
      this.flightRecordingData("stop");
  }
  removeFlightRecording()
  {
      this.flightRecordingData("remove");
  }

  resetAllFields(){
      this.fileName = '/tmp/' ;
      this.isOverwrite = false;
      this.maxTimeOut = 10;
      this.selectedTime = 'Second(s)';
      this.fileSize = undefined;
      this.selectedSize = 'MB';
      this.isCompressed = false;
      this.maxTime = 10;
  }
  startFlightRecording() {
      let url = '';
      let strCmdArgs = '';

      url = this.getHostUrl() + '/' + this.productType + '/v1/cavisson/netdiagnostics/ddr/missionControl?testRun=' + this.testRun + '&userName=' + this.userName + '&isNDCase=' + this.isNDCase;
      //console.log(this.id.product);
      if(this.selectedTierVal != null) {
          url += '&tierName=' + this.selectedTierVal;
      }
if(this.isNDCase) {
       if(this.selectedServerVal != null) {
          if(this.selectedServerVal.indexOf('(') != -1)
              this.serverNameforTD = this.selectedServerVal.substring(0,this.selectedServerVal.indexOf('('));
          else 
              this.serverNameforTD = this.selectedServerVal;
        }
 }
       else {
           if(this.selectedServerVal.indexOf('(') != -1)
              this.serverNameforTD = this.selectedServerVal.substring(this.selectedServerVal.indexOf('(')+1,this.selectedServerVal.indexOf(')'));
           else
              this.serverNameforTD = this.selectedServerVal;
        } 

        url += '&serverName=' + this.serverNameforTD;

      if(this.processIDWithInstance != null) {
          url += '&pidwithapp=' + this.processIDWithInstance;
      }


      if(this.fileName == '' || null == this.fileName || this.fileName == undefined || !this.fileName.startsWith('/')) {
          alert("Please enter file name with absolute path to start flight recording");
          return;
      }else if(this.fileName == '/') {
          alert("Please enter file name to start flight recording");
          return;
      }else {
      
      let path = this.fileName.split('/');
          console.log('path==============',path);
          if(path[path.length - 1] == "") {
              alert("Enter file name");
              return;
          }else {
              url += '&filePath='+this.fileName; 
          }
      }
      if (this.maxTime != undefined && this.maxTime > 0)
          url += '&timeout=' + this.maxTime;
      else
      {
          alert("Timeout should be greater than zero");
          return;
      }
      if(this.maxTimeOut > 0 && undefined != this.maxTimeOut) {
          if(this.selectedTime === 'Minute(s)') {
              strCmdArgs += ' -d ' + this.maxTimeOut + 'm'; 
          }else if(this.selectedTime === 'Hour(s)') {
              strCmdArgs += ' -d ' + this.maxTimeOut + 'h'; 
          }
          else {
              strCmdArgs += ' -d ' + this.maxTimeOut + 's';
          }
      }else {
          alert("Duration should be greater than zero to start flight recording");
          return;
      }
      if (this.fileSize === undefined)
      {
          //do nothing 
          //console.log('this.fileSize ****** ',this.fileSize)
      }
      else if (this.fileSize > 0) {
          if(this.selectedSize === 'MB') {
              strCmdArgs += ' -S ' + this.fileSize + 'M';
          }else if(this.selectedSize === 'GB') {
              strCmdArgs += ' -S ' + this.fileSize + 'G';
          }
          else {
              strCmdArgs += ' -S ' + this.fileSize + 'K';
          }
      }else {
          alert("Expected file size should be greater than zero to start flight recording");
          return;
      }
      if(this.isOverwrite)
          strCmdArgs += ' -O 1 ';
      else
          strCmdArgs += ' -O 0 ';
      if (this.isCompressed)
          url += '&isCompress=1';
      else
          url += '&isCompress=0';

      url += '&operation=start&cmdArgs=' + strCmdArgs;

      //console.log('strCmdArgs======',strCmdArgs);
      console.log('url======',url);

this.startFlight = false;
      this.http.get(url).subscribe(res => (this.showNotification(res)));
      let dataSubscription = this._restAPI.getDataByRESTAPI(url, '')
      .subscribe(
      result => {
        this.showNotification(result);
      },

      err => { this.showNotification(err); },
      () => {
        console.log('Dashboard Filght Recorder request failed.');

        /*unsubscribe/releasing resources.*/
        dataSubscription.unsubscribe();
      }
      );

  }

  validateDuration(key)
  {
      let keycode = (key.which) ? key.which : key.keyCode;
      if(this.maxTimeOut.toString().length == 4) {
          return false;
      }
      if (!(keycode == 8 || keycode == 46) && (keycode < 48 || keycode > 57)) {
          return false;
      }else {
          return true;
      }
  }

  validate(key)
  {
      let keycode = (key.which) ? key.which : key.keyCode;
      console.log("KEY PRESS ======> ", keycode);
      if(this.fileSize.toString().length === 8) {
          return false;
      }
      if (!(keycode === 8 || keycode === 46) && (keycode < 48 || keycode > 57)) {
          return false;
      }else {
          return true;
      }
  }

  public multiSuccessMessage(detail: string, summary?: string) {
      this.timeLimitForMessage = 10000;
      this._message = { severity: 'success', summary: summary, detail: detail };
      this.messageEmit(this._message);
      setTimeout(() => {
        this._message = {};

        this.messageEmit(this._message);
      }, this.timeLimitForMessage);

    }
    public multiErrorMessage(detail: string, summary?: string) {
      this.timeLimitForMessage = 15000;
      this._message = { severity: 'error', summary: summary, detail: detail };
      this.messageEmit(this._message);
      setTimeout(() => {
        this._message = {};

        this.messageEmit(this._message);
      }, this.timeLimitForMessage);

    }
    public errorMessage(detail: string, summary?: string) {
      this.timeLimitForMessage = 30000;
      if (summary == undefined)
        this._message = { severity: 'error', detail: detail };
      else
        this._message = { severity: 'error', summary: summary, detail: detail };

      this.messageEmit(this._message);
      setTimeout(() => {
        this._message = {};
        this.messageEmit(this._message);
      }, 30000);
    }

    public infoMessage(detail: string, summary?: string) {
      this.timeLimitForMessage = 10000;
      if (summary == undefined)
        this._message = { severity: 'info', detail: detail };
      else
        this._message = { severity: 'info', summary: summary, detail: detail };

      this.messageEmit(this._message);
      setTimeout(() => {
        this._message = {};

        this.messageEmit(this._message);
      }, this.timeLimitForMessage);
    }

    public successMessage(detail: string, summary?: string) {
      this.timeLimitForMessage = 10000;
      if (summary == undefined)
        this._message = { severity: 'success', detail: detail };
      else
        this._message = { severity: 'success', summary: summary, detail: detail };
      this.messageEmit(this._message);
      setTimeout(() => {
        this._message = {};
        this.messageEmit(this._message);
      }, this.timeLimitForMessage);
    }


    CustomsortOnColumnsforCustom(event, tempData) {
      // console.log('Inside Sort');
      if (event["field"] === 'objectNameChanged') {
        // console.log('Inside Sort of Object name');
        if (event.order == -1) {
          var temp = (event["field"]);
          event.order = 1
          var reA = /[^a-zA-Z]/g;
          var reN = /[^0-9]/g;
          tempData = tempData.sort(function (a, b) {
            var v1 = a[temp];
            var v2 = b[temp];
            let value;
            let value2;
            v1 = v1.replace(reA, "");
            v2 = v2.replace(reA, "");
            if (v1 === v2) {
              value = parseInt(a[temp].replace(reN, ""), 10);
              value2 = parseInt(b[temp].replace(reN, ""), 10);
              return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
            } else {
              value = a[temp];
              value2 = b[temp];
              return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
            }
          });
        } else {
          var temp = (event["field"]);
          event.order = -1
          var reA = /[^a-zA-Z]/g;
          var reN = /[^0-9]/g;
          tempData = tempData.sort(function (a, b) {
            let v1 = a[temp];
            let v2 = b[temp];
            let value;
            let value2;
            v1 = v1.replace(reA, "");
            v2 = v2.replace(reA, "");
            if (v1 === v2) {
              value = parseInt(a[temp].toString().replace(reN, ""), 10);
              value2 = parseInt(b[temp].toString().replace(reN, ""), 10);
              return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
            } else {
              value = a[temp];
              value2 = b[temp];
              return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
            }
          });
        }
      } else {
      let fieldValue = event['field'];
      if (event.order === -1) {
        event.order = 1
        tempData = tempData.sort(function (a, b) {
          var value = parseFloat(a[fieldValue]);
          var value2 = parseFloat(b[fieldValue]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      } else {
        event.order = -1;
        // asecding order
        tempData = tempData.sort(function (a, b) {
          var value = parseFloat(a[fieldValue]);
          var value2 = parseFloat(b[fieldValue]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
        this.memLeakData = [];
        // console.log(JSON.stringify(tempData));
        if (tempData) {
          tempData.map((rowdata) => { this.memLeakData = this.Immutablepush(this.memLeakData, rowdata) });
      }
  }



     /* ******** Custom Sorting  **********/ 
CustomSort(event, tempData) {

  //for date type data type
  //alert("event.field>>>"+ event["field"] + "    and "+ event["order"]);
  if(event["field"] == "fileLastModificationTime"){
    if (event.order == -1) {
      var temp = (event["field"]);
      event.order = 1
      tempData = tempData.sort(function (a, b) {
        var value = Date.parse(a[temp]);
        var value2 = Date.parse(b[temp]);
        return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
      });
    }
    else {
      var temp = (event["field"]);
      event.order = -1;
      //asecding order
      tempData = tempData.sort(function (a, b) {
        var value = Date.parse(a[temp]);
        var value2 = Date.parse(b[temp]);
        return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
      });
    }
  } else {
    if (event.order == -1) {
      var temp = (event["field"]);
      event.order = 1
      tempData = tempData.sort(function (a, b) {
        var value = Number(a[temp].replace(/,/g,''));
        var value2 = Number(b[temp].replace(/,/g,''));
        return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
      });
    }
    else {
      var temp = (event["field"]);
      event.order = -1;
      //asecding order
      tempData = tempData.sort(function (a, b) {
        var value = Number(a[temp].replace(/,/g,''));
        var value2 = Number(b[temp].replace(/,/g,''));
        return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
      });
    }
  }

  this.flightData = [];
  //console.log(JSON.stringify(tempData));
  if (tempData) {
     tempData.map((rowdata) => { this.flightData = this.Immutablepush(this.flightData, rowdata) });
  }

}
Immutablepush(arr, newEntry) {
  return [...arr, newEntry]
}

openAvailableRecording(isAll? : string){
  if(isAll)
    this.showAll = true;
  else
    this.showAll = false;
    
  var url = this.getHostUrl() + '/' + this.productType + "/v1/cavisson/netdiagnostics/ddr/getJFRList?testRun=" + this.testRun +
  '&tierName=' + this.selectedTierVal +
  '&server=' + this.selectedServerVal +
  '&isAllData='+isAll;
  
  console.log('JFR list url= ',url);
  return this.http.get(url).subscribe(data => (this.setJFRTableValues(data)));
}

setJFRTableValues(res:any) {
  this.confirmationPopup = false;
  if(res.hasOwnProperty("errorStatus"))
  {
      this.multiErrorMessage (res.errorStatus.split(":")[0],res.errorStatus.split(":")[1])
  }
  else if (res.jfrList) {
      this.jfrList = res.jfrList;

      this.showTable = 2;
  }
}

downloadFile(node: any) {
  //console.log('filePath is ', node);
  let urlInfo = '&tierName=' + node.tierName + '&serverName=' + node.serverName + '&instanceName=' + node.instanceName + '&pid=' + node.pid + '&partition=' + node.partition + '&timestamp=' + node.timestamp + '&fileName=' + node.fileName + '&filePath=' + node.filePath + '&userName=' + node.userName + '&mode=' + node.mode + '&isFrom=' + node.isFrom + '&index=' + node.index + '&location=' + node.location;

  let url = this.getHostUrl() + '/' + this.productType + "/v1/cavisson/netdiagnostics/ddr/downloadJFRFile?testRun=" + this.testRun + urlInfo;
   console.log('download url ', url);
   this.id.setInLogger('','Java Flight Recording','Java Flight Recording Download','Java Flight Recording Download Successfully');
window.open(url,"_blank");
  // this.refreshGui =  setInterval(() => { this.openHeapDumpList() }, 10000);

  setTimeout(() => {
    this.openAvailableRecording();
  }, 10000);
}

assignNodevalueToDelete(node){
  
  this.nodeValueToDelete = node;
  
}
removeFile() {
  if(this.nodeValueToDelete.location === "-"){
    this.confirmationPopup = false;
    alert("File doesn't exist at NDE, So couldn't be deleted.");
    return;
  }
  // tierName|serverName|instanceName|pid|partition|startTime|endTime|timestamp|fileName|filePath|userName|mode|isFrom
  // let url = '&tierName='+node.tierName+'&serverName='+node.serverName+'&instanceName='+node.instanceName+
  // +'&pid='+node.pid+'&partition='+node.partition+'&startTime='+node.startTime+'&endTime='+node.endTime+'&timestamp='+node.timestamp+
  // +'&fileName='+node.fileName+'&filePath='+node.filePath+'&userName='+node.userName+'&mode='+node.mode+'&isFrom='+node.isFrom+'&index='+node.index;
  let fileName = this.nodeValueToDelete.filePath.substring(this.nodeValueToDelete.filePath.lastIndexOf("/")+1);
  let urlInfo = '&tierName=' + this.nodeValueToDelete.tierName + '&serverName=' + this.nodeValueToDelete.serverName + '&instanceName=' + this.nodeValueToDelete.instanceName + '&pid=' + this.nodeValueToDelete.pid + '&partition=' + this.nodeValueToDelete.partition  + '&timestamp=' + this.nodeValueToDelete.timestamp + '&filePath=' + this.nodeValueToDelete.filePath + '&userName=' + this.nodeValueToDelete.userName + '&mode=' + this.nodeValueToDelete.mode + '&isFrom=' + this.nodeValueToDelete.isFrom + '&index=' + this.nodeValueToDelete.index + '&location=' + this.nodeValueToDelete.location + '&productKey=' + this.productKey;
  let jfr_list_url = this.getHostUrl() + '/' + this.productType + "/v1/cavisson/netdiagnostics/ddr/removeJFR?testRun=" + this.testRun + '&removeFile=' + this.nodeValueToDelete.location + "/" + fileName + urlInfo;
  this._restAPI.getDataByRESTAPIInString(jfr_list_url,'').subscribe( data => {
                 this.confirmationPopup = false;
              if(data == 'Successfully updated')
               {
                 this.openAvailableRecording();
               }
              else
                this.errorMessage(data);
      },
      err =>
              {
                 this.confirmationPopup = false;
                this.errorMessage('Error is coming while removing JFR');
              });
}

resetInstanceTable()
{
    this.instanceInfo = undefined;
}

 /*Custom Sorting*/ 
 customsort(event, tempData) {

  //for interger type data type
    if (event.order == -1) {
      var temp = (event["field"]);
      event.order = 1
      tempData = tempData.sort(function (a, b) {
        var value = Date.parse(a[temp]);
        var value2 = Date.parse(b[temp]);
        return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
      });
    }
    else {
      var temp = (event["field"]);
      event.order = -1;
      //asecding order
      tempData = tempData.sort(function (a, b) {
        var value = Date.parse(a[temp]);
        var value2 = Date.parse(b[temp]);
        return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
      });
    }

  this.jfrList = [];
  //console.log(JSON.stringify(tempData));
  if (tempData) {
     tempData.map((rowdata) => { this.jfrList = this.Immutablepush(this.jfrList, rowdata) });
  }

}

showAllData()
{
    this.showAll = true;
    this.openAvailableRecording("All");
}
refreshGUI()
{
    if (this.showAll)
        this.openAvailableRecording("All");
    else
        this.openAvailableRecording();
}
onClose(event) {
this.updateData.unsubscribe();
this.resetScreen();
}
resetScreen(){
 this.interval =60;
 this.sampleCount = 2
}
startMemLeakTimer() {
    if(this.updateData && null !== this.updateData)
      this.updateData.unsubscribe();

    let updateinterval = this.interval * 1000;
          let updateMemLeakData = timer(0, updateinterval);
          this.updateData = updateMemLeakData.subscribe(t => {
            //  console.log('MemleakJsondata----', t);
              this.getMemLeakData(t);
            });  
 }
}
