import { Component, Input, OnInit, ViewEncapsulation,ChangeDetectorRef } from '@angular/core';
import { GraphDataService } from './service/graph-data.service';
import { merge } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { GraphDataLoadingState, GraphDataLoadingErrorState, GraphDataLoadedState } from './service/graph-data.state';
import { GraphDataTable, GraphDataTableHeaderCols } from './service/graph-data.model';
import { GRAPH_DATA_TABLE } from './service/graph-data.dummy';
import { AppError } from 'src/app/core/error/error.model';
import { MenuItem } from 'primeng';
import { SessionService } from 'src/app/core/session/session.service';
import { DownloadShowGrapDataLoadedState, DownloadShowGrapDataLoadingErrorState, DownloadShowGrapDataLoadingState } from './service/graph-data.state';
import { ViewChild } from '@angular/core';
import { FilterUtils } from 'primeng/utils';

@Component({
  selector: 'app-graph-data',
  templateUrl: './graph-data.component.html',
  styleUrls: ['./graph-data.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GraphDataComponent implements OnInit {
  [x: string]: any;

  data: GraphDataTable;
  error: AppError;
  empty: boolean;
  emptyTable: boolean;
  loading: boolean;
  isVisible = false;
  currentDate = new Date();
  displayBasic2 = false;
  cols: GraphDataTableHeaderCols[];
  _selectedColumns: GraphDataTableHeaderCols[];
  //_selectedColumns: GraphDataTableHeaderCols[];
  numData = [];
  widgetGraphs = [];
  seriesData = [];
  viewBy = -1;
  avgCount = -1;
  graphStatsType = [];
  startTime:String = "";
  endTime:String = "";
  StartTimePeriod :String = "";;
  endTimePeriod :String = "";;
  startTimeZoom :number = -1;
  endTimeZoom :number = -1;
  selectedRow: any;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  paginatorTitle: string = 'Show Pagination';
  tooltipzindex = 100000;
  globalFilterFields: string[] = [];
  items: MenuItem[];
  tableData = [];
  isPercentile = false;
  isSlabCount = false;
  isZoom = false;
  zoomInfo:any;
  timePeriod:string = "";
  testRun:string = "";
  inertval: boolean = false;
  isCompare : boolean = false;
  compareGraphName:string  = "";
  widgetWiseInfo:any;
  delayTime:number = 0;
  defaultAvgCount:number = 1;
  @ViewChild('graphdata') graphdata: any;
  constructor(
    private graphDataService: GraphDataService,
    private sessionService: SessionService,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    const me = this;
    //me.load();
    me.avgCount = -1;
    me.data = GRAPH_DATA_TABLE;
    me.cols = me.data.headers[0].cols;
    me.getColumns(me.cols);
    me.items = [
      {
        label: 'WORD',
        icon: "icons8-doc",
        command: () => {
          const me = this;
          me.downloadShowGraphData("worddoc");
        }
      },
      {
        label: 'EXCEL',
        icon:"icons8-xml-file",
        command: () => {
          const me = this;
          me.downloadShowGraphData("excel");
        }
      },
      {
        label: 'PDF',
        icon: "icons8-pdf-2",
        command: () => {
          const me = this;
          me.downloadShowGraphData("pdf");
        }
      }
    ]
  }

  filter() {
    const me = this;
    FilterUtils['custom'] = (value, filter): boolean => {
      if (filter === undefined || filter === null || filter.trim() === '') {
        return true;
      }

      if (value === undefined || value === null) {
        return false;
      } else {
        const operator1 = filter.slice(0, 2);
        const operator2 = filter.slice(0, 1);

        // console.log("print" ,operator1, typeof(operator1))

        // Filter if value >= ,<=, ==
        if (
          operator1.length === 2 &&
          (operator1 === '>=' || operator1 === '<=' || operator1 === '==')
        ) {
          if (operator1 === '>=') {
            me.finalValue =
              value >= parseFloat(filter.slice(2, filter.length));
          } else if (operator1 === '<=') {
            me.finalValue =
              value <= parseFloat(filter.slice(2, filter.length));
          } else if (operator1 === '==') {
            me.finalValue =
              value == parseFloat(filter.slice(2, filter.length));
              // console.log("comigng" , me.finalValue)
          }
        } else if (
          operator2.length === 1 &&
          (operator2 === '>' || operator2 === '<' || operator2 === '=')
        ) {
          if (operator2 === '>') {
            me.finalValue =
              value > parseFloat(filter.slice(1, filter.length));
          } else if (operator2 === '<') {
            me.finalValue =
              value < parseFloat(filter.slice(1, filter.length));
          } else if (operator2 === '=') {
            me.finalValue =
              parseFloat(filter.slice(1, filter.length)) == value;
          }
        } else if (filter !== '' && filter.indexOf('-') >= 1) {
          const stIndex = filter.substr(0, filter.indexOf('-'));
          const enIndex = filter.substr(filter.indexOf('-') + 1, filter.length);

          if (
            parseFloat(stIndex) <= parseFloat(enIndex) &&
            enIndex.indexOf('-') === -1
          ) {
            if (
              parseFloat(stIndex) <= parseFloat(value) &&
              parseFloat(enIndex) >= parseFloat(value)
            ) {
              me.finalValue = true;
            } else {
              me.finalValue = false;
            }
          } else if (
            parseFloat(stIndex) >= parseFloat(enIndex) &&
            enIndex.indexOf('-') === -1
          ) {
            if (
              parseInt(stIndex, 0) >= parseInt(value, 0) &&
              parseInt(enIndex, 0) <= parseInt(value, 0)
            ) {
              me.finalValue = true;
            } else {
              me.finalValue = false;
            }
          } else {
            me.finalValue = false;
          }
        } else {
          me.finalValue = value >= parseFloat(filter);
        }
      }
      return me.finalValue;
    };
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
}

set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
}


  clickInterval(){
    this.inertval = !this.inertval;
  }

  getColumns(cols){

    const me = this;
    me.globalFilterFields = [];
    me.selectedColumns = [];
    this._selectedColumns = me.cols;
    for (const c of cols) {
      me.globalFilterFields.push(c.valueField);
      //if (c.selected) {
        //me.selectedColumns.push(c);
      //}
    }
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

  // Form Modal open
  open(Selwidget) {
  const me = this;
  me.numData = [];
  me.widgetGraphs = [];
  me.tableData = [];
  me.selectedColumns= [];
  me._selectedColumns = [];
  me.graphStatsType = [];
  me.object = {};
  me.compareGraphName  = "";
  me.isPercentile = false;
  me.isSlabCount = false;
  me.delayTime = 0;
  me.testRun = me.sessionService.testRun.id;
  me.numData = Selwidget.data.grpData;
  me.graphStatsType = Selwidget.widget.settings.graphStatsType.split(",").map(i=>Number(i)).sort();
  me.makeShowGraphData(me.numData,Selwidget);
    me.isVisible = true;
  }

  makeShowGraphData(numData,Selwidget){
    const me = this;
    me.timePeriod = Selwidget.dashboardService.timebarService.tmpValue.timePeriod.selected.label;
    me.widgetWiseInfo = Selwidget.widget.widgetWiseInfo;
    if(Selwidget.delayTimeToolTip && Selwidget.delayTimeToolTip.indexOf("-1") == -1){
      me.delayTime = Number(Selwidget.delayTimeToolTip.match(/\d/g).join(""));
    }


    if(me.widgetWiseInfo && me.widgetWiseInfo.widgetWise == true ){
      me.StartTimePeriod = me.sessionService.convertTimeToSelectedTimeZone(me.widgetWiseInfo.duration.st);
      me.endTimePeriod =  me.sessionService.convertTimeToSelectedTimeZone(me.widgetWiseInfo.duration.et);
      me.timePeriod = me.selectPreset(me.widgetWiseInfo.duration.preset);
    }else{
      me.StartTimePeriod = me.sessionService.convertTimeToSelectedTimeZone(Selwidget.dashboardService.timebarService.tmpValue.time.frameStart.value - me.delayTime*60*1000);
      me.endTimePeriod =  me.sessionService.convertTimeToSelectedTimeZone(Selwidget.dashboardService.timebarService.tmpValue.time.frameEnd.value - me.delayTime*60*1000);
    }

    me.zoomInfo = Selwidget.widget.zoomInfo;
    let slabName = [];
    let starttime = numData.mFrequency[0].tsDetail.st - me.delayTime*60*1000 ;
    let tempData = numData.mFrequency[0].data;
    me.avgCount  = numData.mFrequency[0].avgCount;

    if(me.avgCount < me.defaultAvgCount)                            //In case of copyLink
      me.avgCount = me.defaultAvgCount

    if (Selwidget.widget && Selwidget.widget.compareData) {
      me.isCompare = true;
      if (!Selwidget.widget.compareData.trendCompare){
        if (Selwidget.widget.compareZoomInfo && Selwidget.widget.compareZoomInfo.length > 0) {
          starttime = Math.round(Selwidget.widget.compareZoomInfo[Selwidget.widget.compareZoomInfo.length - 1][0].zoomSt / 60000) * 60000;
        }
        else
          starttime = 0;
      }
    }
    else
      me.isCompare = false;

    if(numData.viewBy!== undefined && numData.viewBy!== null){
      me.viewBy = numData.viewBy;
    }else if(Selwidget.dashboardService.timebarService.value.viewBy.selected.id){
      me.viewBy = Number(Selwidget.dashboardService.timebarService.value.viewBy.selected.id);
    }else{
      me.viewBy = 60;
    }
    me.tableData = [];
    let time:String= "";
    if(tempData[0].percentile){
      me.isPercentile = true;
    }else if(tempData[0].slabCount){
      me.isSlabCount = true;
    }

    if(me.isSlabCount&&tempData[0].slabName.length >0){
      slabName = tempData[0].slabName;
    }

    if(me.zoomInfo){
      me.isZoom = me.zoomInfo.isZoom;
      let len = me.zoomInfo.times.length;
      me.startTimeZoom = me.zoomInfo.times[len-1].zoomSt;
      me.endTimeZoom = me.zoomInfo.times[len-1].zoomEt;
      starttime = me.startTimeZoom;
      me.startTime = me.sessionService.convertTimeToSelectedTimeZone(me.startTimeZoom);
      me.endTime = me.sessionService.convertTimeToSelectedTimeZone(me.endTimeZoom);
    }
    if(!me.isZoom){
        me.startTime = me.StartTimePeriod;
        me.endTime = me.endTimePeriod;
    }

    me.makeColumn(tempData,Selwidget);

     let sDatalen = me.seriesData[0].length
    for(let i= 0;i<sDatalen;i++){
        if(i==0){
          if (Selwidget.widget && Selwidget.widget.compareData){
            if (Selwidget.widget.compareData.trendCompare) {
              time = Selwidget.widget.compareData.compareData[i].name + "(" +me.sessionService.convertTimeToSelectedTimeZone(Selwidget.widget.compareData.compareData[i].start) + " - " + me.sessionService.convertTimeToSelectedTimeZone(Selwidget.widget.compareData.compareData[i].end) + ")";
            }
            else
              time = me.sessionService.convertTimeWithZero(starttime);
          }
          else
            time = me.sessionService.convertTimeToSelectedTimeZone(starttime);
        }else{
          if(!me.isSlabCount && !me.isPercentile){
            starttime += me.viewBy*1000;
            if (Selwidget.widget && Selwidget.widget.compareData) {
              if (Selwidget.widget.compareData.trendCompare) {
                time = Selwidget.widget.compareData.compareData[i].name + "(" + me.sessionService.convertTimeToSelectedTimeZone(Selwidget.widget.compareData.compareData[i].start) + " - " + me.sessionService.convertTimeToSelectedTimeZone(Selwidget.widget.compareData.compareData[i].end) + ")";
              }
              else
                time = me.sessionService.convertTimeWithZero(starttime);
            }
            else
              time = me.sessionService.convertTimeToSelectedTimeZone(starttime);
          }
        }

      let objs = me.makeTableData(i,me.seriesData,time,me.isPercentile,me.isSlabCount,slabName);
      me.tableData.push({...objs});
    }
    me.data.data = [];
    me.data.data = [...me.tableData];
    this.graphdata.reset();
    this.filter();
    this.ref.detectChanges();
  }

  makeColumn(tData,Selwidget){
    const me = this;
    me.cols = [];
    me.seriesData = [];
    let colsData = [];
    let colData = {};
   // me.graphStatsType = tData[0].dataType;
    let slabel = 'Sample Time';
    let svalueField = 'sampleTime';
    if(me.isPercentile){
      slabel = 'Percentile';
    svalueField = 'percentile';
    }else if(me.isSlabCount){
      slabel = 'SlabCount';
      svalueField = 'slabCount';
    }

    /*For making serial No column for table*/
    if(!me.isPercentile){
      colData = {
        label: 'SNO',
        valueField: 'sNo',
        classes: 'text-left',
        filter: {
         isFilter: false,
         type:''
        },
        isSort: false,
        "width":'80px',
        }
        colsData.push(colData);
    }

    colData = {
      label: slabel,
      valueField: svalueField,
      classes: 'text-left',
      filter: {
       isFilter: true,
       type:'contains'
      },
      isSort: true,
      "width":"150px",
      }
      colsData.push(colData);
    for(let i= 0;i<tData.length;i++){
      for(let j=0; j<me.graphStatsType.length; j++){

        let lable = tData[i].measure.metric ;
        if(tData[i].subject.tags[0].sName !== "NA") {
        lable = lable +"-" +tData[i].subject.tags[0].sName;

        }
        if(me.graphStatsType[j] == 1){
          lable = "Min"+" "+lable;
        }else if(me.graphStatsType[j] == 2){
          lable = "Max"+" "+lable;
        }else if(me.graphStatsType[j] == 3){
          lable = "Count"+" "+lable;
        }else if(me.graphStatsType[j] == 4){
          lable = "SumCount"+" "+lable;
        }else{
          lable;
        }
    if(me.isApplyCompare){
      me.isCompare =me.isApplyCompare;
    }
      if(me.isCompare === true && i==0 && !Selwidget.widget.isTrendCompare){
        me.compareGraphName = tData[i].measure.metric.split("-")[1] +"-" +tData[i].subject.tags[0].sName;
      }
      if(Selwidget.widget.isTrendCompare){
        me.compareGraphName =Selwidget.widget.dataCtx.gCtx[0].measure.metric + "->"+ tData[i].subject.tags[0].sName;
      }
      if(me.compareGraphName == ""  && me.isCompare ){
        me.isCompare =false;
      }
      colData = {
        "label": lable,
        "valueField": lable,
        "classes": 'text-left',
        "filter": {
         "isFilter": true,
         "type":'custom'
        },
        "isSort": true,
        "width":"150px",
        }
    colsData.push(colData);
     me.seriesData.push(me.seriesDatas(tData[i],me.graphStatsType[j]));
      }
    }
    me.cols = colsData;
    me.getColumns(me.cols);
    let headers= [
      {
      "cols":me.cols,
    },
   ]
     me.data = {
       "headers" :headers,
       "data":me.data.data,
       "paginator": {
        "first": 0,
        "rows": 15,
        "rowsPerPageOptions": [15, 25, 50, 100],
      },
      "tableFilter": false,
     }

}

seriesDatas(Data,graphStatsType:Number){
  if(!Data.percentile&&!Data.slabCount){
  if(graphStatsType == 0){
    return Data.avg;
  }else if(graphStatsType == 1){
    return Data.min;
  }else if(graphStatsType == 2){
    return Data.max;
  }else if(graphStatsType == 3){
    return Data.count;
  }else if(graphStatsType == 4){
    return Data.sumCount;
  }
} else if (Data.percentile){
  return Data.percentile;
}else if (Data.slabCount){
  return Data.slabCount;
}

}

  makeTableData(i,seriesData,time,isPercentile,isSlabCount,slabNamearr){
    const me = this;
    let obj = {};
    if(isPercentile){
      obj['percentile'] = i+1;
    }else if(isSlabCount){
      obj['slabCount'] = slabNamearr[i];
    }else{
      obj['sampleTime'] = time;
    }
    if(!isPercentile)
      obj['sNo'] = i+1;

    for(let j= 0; j < seriesData.length; j++){
      let data = seriesData[j];
      let col;
      if(!isPercentile)
       col = me.cols[j+2];
      else
      col = me.cols[j+1];

      if(data[i] === -123456789 ||data[i] === "-" || data[i] == undefined || data[i] == null){
       data[i] = "-";
       obj[col.label] = data[i];
      }else{
        obj[col.label] = Number(data[i].toFixed(3));
      }
      }

    return obj;
  }
  // Form Modal Close
  showBasicDialog2() {
    this.displayBasic2 = true;
  }

  /*Download data (WORD,PDF,EXCEL)*/
  downloadShowGraphData(label) {
    const me = this;
    try {
      me.graphDataService.downloadShowGraphData(label, [...me.tableData],me.cols).subscribe(
        (state: Store.State) => {
          if (state instanceof DownloadShowGrapDataLoadingState) {
            me.onLoadingData(state);

            return;
          }

          if (state instanceof DownloadShowGrapDataLoadedState) {
            me.onLoadedData(state);
            return;
          }
        },
        (state: DownloadShowGrapDataLoadingErrorState) => {
          me.onLoadingDataError(state);

        }
      );
    } catch (err) {
      console.error("Exception in downloadShowGraphData method in graph Data  component :", err);
    }
  }

  private onLoadingData(state: DownloadShowGrapDataLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }
  private onLoadedData(state: DownloadShowGrapDataLoadedState) {
    const me = this;
    me.error = null;
    me.loading = false;
    let path = state.data.comment.trim();
    let url = window.location.protocol + '//' + window.location.host;
    path = url + "/common/" + path;
    window.open(path + "#page=1&zoom=85", "_blank");

  }
  private onLoadingDataError(state: DownloadShowGrapDataLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  selectPreset(dataOfEdit){
    switch(dataOfEdit){
      case 'LIVE0':
        return 'Last 5 Minutes';
      case 'LIVE1':
        return 'Last 10 Minutes';
      case 'LIVE2':
        return 'Last 30 Minutes';
      case 'LIVE3':
        return 'Last 1 Hour';
      case 'LIVE4':
        return 'Last 2 Hours';
      case 'LIVE5':
        return 'Last 4 Hours';
      case 'LIVE6':
        return 'Last 6 Hours';
      case 'LIVE7':
        return 'Last 8 Hours';
      case 'LIVE8':
        return 'Last 12 Hours';
      case 'LIVE9':
        return 'Last 24 Hours';
      case 'LIVE10':
        return 'Today';
      case 'LIVE11':
        return 'Last 7 Days';
      case 'LIVE12':
        return 'Last 30 Days';
      case 'LIVE13':
        return 'Last 90 Days';
      case 'LIVE14':
        return 'This Week';
      case 'LIVE15':
        return 'This Month';
      case 'LIVE16':
        return 'This Year';
      case 'PAST1':
        return 'Yesterday';
      case 'PAST2':
        return 'Last Week';
      case 'PAST3':
        return 'Last 2 Weeks';
      case 'PAST4':
        return 'Last 3 Weeks';
      case 'PAST5':
        return 'Last 4 Weeks';
      case 'PAST6':
        return 'Last Month';
      case 'PAST7':
        return 'Last 2 Months';
      case 'PAST8':
        return 'Last 3 Months';
      case 'PAST9':
        return 'Last 6 Months';
      case 'PAST10':
        return 'Last Year';
      case 'TB0':
        return 'Hour Back';
      case 'TB1':
        return 'Day Back';
      case 'TB2':
        return 'Week Back';
      case 'TB3':
        return 'Month Back';
      default:
        if(dataOfEdit.startsWith("EV1"))
          return "Black Friday" + " " + dataOfEdit.substring(4);
        else if (dataOfEdit.startsWith("EV2"))
          return "Christmas Day" + " " + dataOfEdit.substring(4);
        else if (dataOfEdit.startsWith("EV3"))
          return "Cyber Monday" + " " + dataOfEdit.substring(4);
        else if (dataOfEdit.startsWith("EV4"))
          return "Good Friday" + " " + dataOfEdit.substring(4);
        else if (dataOfEdit.startsWith("EV5"))
          return "New Years Day" + " " + dataOfEdit.substring(4);
        else if (dataOfEdit.startsWith("EV6"))
          return "President's Day" + " " + dataOfEdit.substring(4);
        else if (dataOfEdit.startsWith("EV7"))
          return "Thanks Giving Day" + " " + dataOfEdit.substring(4);
        else if (dataOfEdit.startsWith("EV8"))
          return "Valentines Day" + " " + dataOfEdit.substring(4);
        else
          return "Last 4 Hours";
    }

  }

}
