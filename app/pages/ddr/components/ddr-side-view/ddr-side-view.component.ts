import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonServices } from '../../services/common.services';
import { DdrTxnFlowmapDataService } from './../../services/ddr-txn-flowmap-data.service';
import { DdrDataModelService } from "../../../tools/actions/dumps/service/ddr-data-model.service";

@Component({
  selector: 'app-ddr-side-view',
  templateUrl: './ddr-side-view.component.html',
  styleUrls: ['./ddr-side-view.component.css']
})
export class DdrSideViewComponent implements OnInit {

  @Input() flowpathData;
  @Input() selectedData;
  @Input() sortField;
  @Input() order;
  @Input() index;
  @Output() flowpathSelected = new EventEmitter();
  @Output() txnToggle: EventEmitter<boolean>;
  hide: boolean;

  constructor(private commonService: CommonServices, private flowmapDataService: DdrTxnFlowmapDataService, private _ddrData: DdrDataModelService) {
    this.txnToggle = new EventEmitter();
   }

  ngOnChanges() {
    if(this._ddrData.ndDCNameInfo && this._ddrData.ndDCNameInfo.length > 0 && this._ddrData.isFromNV && this._ddrData.isFromNV == "1"){
      for(let i=0; i<this._ddrData.ndDCNameInfo.length; i++){
        if(this._ddrData.ndDCNameInfo[i].displayName == this.selectedData.dcName){
          this._ddrData.dcName = this.selectedData.dcName;
          this._ddrData.testRun = this._ddrData.ndDCNameInfo[i].ndeTestRun;
          console.log(" test open report in Side view", this._ddrData.testRun, " ",this._ddrData.dcName );
          break;
        }
      }
    }
    console.log("onchanges side data======", this.selectedData);
    if(this.sortField && this.order) {
      this.sortColumnsOnCustom(this.sortField,this.order,this.flowpathData)
    }
  }

  ngOnInit() {
    console.log("data===", this.flowpathData, this.selectedData);
    let highObj= {};
    for(let i=0;i<this.flowpathData.length;i++) {
      if(this.selectedData.flowpathInstance == this.flowpathData[i].flowpathInstance) {
        highObj = this.flowpathData[i];
        this.flowpathData.splice(i,1);
      }
    }
    this.flowpathData.unshift(highObj);
  }
  rowClick(rowData) {
    this.commonService.hsData = undefined;
    console.log("side view emit====", rowData)
    this.flowpathSelected.emit(rowData);
    this.txnToggle.emit(false);
    if(this.index == 7) {
      let columnFlowpathData = JSON.parse(JSON.stringify(rowData));
      if (columnFlowpathData.fpDuration == '< 1')
      columnFlowpathData.fpDuration = 0;
      this.flowmapDataService.resetFlag();
      this.flowmapDataService.getDataForTxnFlowpath(columnFlowpathData.flowpathInstance, columnFlowpathData);
    }
  }

  changeStyle($event) {
    this.hide = $event.type === 'mouseenter' ? false : true;
  }
  
  formatter(val) {
    if (val.length > 18)
      return val.substring(0, 18) + "...";
    else
      return val;
  }

  formatterTSA(val) {
    if (val.length > 16)
      return val.substring(0, 16) + "...";
    else
      return val;
  }

  sortColumnsOnCustom(field, order, tempData) {
    console.log("yaha aara hu ki ni");
    //for interger type data type
    if (field == "startTime") {
      if (order == -1) {
        var temp = (field);
        order = 1
        tempData = tempData.sort(function (a, b) {
          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = field;
        order = -1;
        //asecding order
        tempData = tempData.sort(function (a, b) {
          var value = Date.parse(a[temp]);
          var value2 = Date.parse(b[temp]);
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    } else if (field == "appName" || field == "correlationId") {
      if (order == -1) {
        var temp = field;
        order = 1
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
        var temp = field;
        order = -1
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
    }
    else if(field == "methodsCount" || field == "callOutCount" || field == "coherenceCallOut" || field == "jmsCallOut" || field == "dbCallCounts" || field == "totalError" || field == "statusCode" || field == "flowpathInstance" || field == "ndSessionId" || field == "nvPageId" || field == "syncTime" || field == "nvSessionId" || field == "btCpuTime" || field == "storeId" || field == "terminalId" || field == "QTimeInMS" || field == "suspensiontime" || field == "iotime" || field == "waitTime") {
      if (order == -1) {
        var temp = field;
        order = 1;
        tempData = tempData.sort(function (a, b) {
          if (a[temp].startsWith('<') && b[temp].startsWith('<')) {
            return 0;
          } else if (a[temp].startsWith('<')) {
            return 1;
          } else if (b[temp].startsWith('<')) {
            return -1;
          }

          var value = Number(a[temp].replace(/,/g, ''));
          var value2 = Number(b[temp].replace(/,/g, ''));
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        var temp = field;
        order = -1;
        //asecding order
        tempData = tempData.sort(function (a, b) {
          if (a[temp].startsWith('<') && b[temp].startsWith('<')) {
            return 0;
          } else if (a[temp].startsWith('<')) {
            return -1;
          } else if (b[temp].startsWith('<')) {
            return 1;
          }
          var value = Number(a[temp].replace(/,/g, ''));
          var value2 = Number(b[temp].replace(/,/g, ''));
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    else {
      if (order == -1) {
        var temp = field;
        order = 1;
        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;
        tempData = tempData.sort(function (a, b) {
          let value;
          let value2;
          value = a[temp];
          value2 = b[temp];
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      } else {
        var temp = field;
        order = -1;
        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;
        tempData = tempData.sort(function (a, b) {
          let value;
          let value2;
          value = a[temp];
          value2 = b[temp];
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }

    }
    this.flowpathData = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
      tempData.map((rowdata) => { this.flowpathData = this.Immutablepush(this.flowpathData, rowdata) });
    }

  }
  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

}
