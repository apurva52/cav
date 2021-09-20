import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppError } from 'src/app/core/error/error.model';
import { SessionService } from 'src/app/core/session/session.service';
import { DashboardComponent } from '../../../dashboard.component';
import { DashboardWidgetLayout } from '../../../../dashboard/service/dashboard.model';
import {
  TreeOperationsLoadingState,
  TreeOperationsLoadingErrorState,
  TreeOperationsLoadedState,
} from './graph-in-tree.state';
import { MetricsTable } from './../../../../../shared/metrics-settings/service/metrics-settings.model';
import { DashboardGraphService } from './../../../../dashboard/service/dashboard-graph.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { status } from './graph-in-tree.model'
@Injectable({
  providedIn: 'root'
})
export class TreeOperationsService extends Store.AbstractService {
  metaDatapath = environment.api.dashboard.metaData.endpoint;
  dashboardCom: DashboardComponent;
  error: AppError;
  empty: boolean;
  loading: boolean;
  duration: any;
  layoutType: any;
  excOverallMetric: boolean = true;
  openWithNewLayout: boolean = true;
  filter = {};
  grpBy = {};
  graphSettings = {};
  subjecttags = [];
  MetaDataInfo = [];
  metricData = [];
  graphNames = [];
  graphID = [];
  loadData = [];
  GroupId: number
  GroupName: string;
  graphName: string;
  featureName: string;
  showTogether: number = 127;
  tDashbord: any;
  menuData: any;
  stopCounter: any;
  GRID_ROWHEIGHT = 1;
  GRID_MAXCOLS = 200;
  WIDGETS_MARGIN = 5;
  widgetLayouts: DashboardWidgetLayout[] = [];
  mergeMetric: boolean = false;
  isgdfChange: boolean = false;
  selectedcriteria: string;
  graphStatsType: number = 0;

  constructor(private sessionService: SessionService, private dashboardGraphService: DashboardGraphService,
    private messageService: MessageService) {
    super()

  }

  getMetaData(MetaData) {
    const me = this;
    me.graphNames = [], me.graphID = [];
    me.featureName = me.menuData['Sublabel'] + " " + "Metrics";
    if (MetaData.length > 1) {
      me.graphName = '';
    } else {
      me.graphName = MetaData[0].measureTags.metric;
    }
    for (let i = 0; i < MetaData.length; i++) {
      me.graphNames.push(MetaData[i].measureTags.metric);
      me.graphID.push(MetaData[i].measureTags.metricId);
      if (i == 0) {
        //me.graphID.push(MetaData[i].measureTags.metricId); 
        me.GroupId = MetaData[i].measureTags.mgId;
        me.GroupName = MetaData[i].measureTags.mg;
        me.subjecttags = MetaData[i].subjectTags.reverse();
        for (let i = 0; i < me.subjecttags.length; i++) {
          if (me.menuData['Sublabel'] == "Merge") {
            if (me.menuData['itemsLable'] == "Group Metrics") {
              me.subjecttags[i].mode = 1;
              me.showTogether = 128;
            } else {
              if (i == me.subjecttags.length - 1) {
                me.subjecttags[i].mode = 130;
                me.showTogether = 128;
              } else {
                me.subjecttags[i].mode = 129;
                me.showTogether = 128;
              }

            }
          }
          else if (me.menuData['Sublabel'] == "Open") {
            if (me.menuData['itemsLable'] == "Group Metrics") {
              me.subjecttags[i].mode = 1;
              me.showTogether = 127;
            } else {
              if (i == me.subjecttags.length - 1) {
                me.subjecttags[i].mode = 2;
                me.showTogether = 127;
              } else {
                me.subjecttags[i].mode = 1;
                me.showTogether = 127;
              }

            }
          }
          else if (me.menuData['Sublabel'] == "Compare Members") {
            if (i !== me.subjecttags.length - 1) {
              me.subjecttags[i].mode = 1;
              me.showTogether = 127;
            } else {
              if (me.graphName !== '' && me.graphName !== null && me.graphName !== undefined) {
                me.subjecttags[i].mode = 130;
                me.showTogether = 127;
              } else {
                me.subjecttags[i].mode = 130;
                me.showTogether = 127;
              }
            }
          }
        }
      }
    }
  }
  openMergeMetrics(dashboard, dataMe) {
    try {
      const me = this;
      me.mergeMetric = false;
      me.isgdfChange = false;
      me.tDashbord = dashboard;
      me.menuData = dataMe;
      me.loadData = [];
      me.layoutType = 3;
      me.selectedcriteria ="Include";
      me.graphStatsType = 0;
      if (me.stopCounter)
        clearInterval(this.stopCounter);

      if (dashboard.finalArr)
        me.getMetaData(dashboard.finalArr);
      else
        me.getMetaData(dashboard);
      me.filter = null;
      let exclOverall = 0;
      if (me.excOverallMetric === true) {
        exclOverall = 1;
      } else {
        exclOverall = 0;
      }
      let subject = {
        'tags': me.subjecttags,
      }
      let measure = {
        "mgType": "NA",
        "mgTypeId": -1,
        "mg": me.GroupName,
        "mgId": me.GroupId,
        "metrics": me.graphNames,
        "metricIds": me.graphID,
        "showTogether": me.showTogether
      }
      let groupBy = {
        "subject": subject,
        "measure": measure,
      }
      let typ = [];
      let Value2 = -1;
      // let criteriaChk = 0;
      let Value1 = 0;
      let opt = "=";
      if (dataMe['selectedItem'] == 'All') {
        me.filter = null;
      }
      if (dataMe['selectedItem'] !== 'All') {
        let enablefilter = 7;
        if (dataMe['selectedItem'] == 'Non Zero') {
          const me = this;
          typ.push(1);
          typ.push(enablefilter);
          Value2 = -1;
          //criteriaChk = 1;
          Value1 = 0;
          opt = ">";
        }
        else if (dataMe['selectedItem'] == 'Zero') {
          const me = this;
          typ.push(2);
          typ.push(enablefilter);
          Value2 = -1;
          //criteriaChk = 1;
          Value1 = 0;
          opt = "=";
        }

        let filter = {
          "typ": typ,
          //"in": criteriaChk,
          "opt": opt,
          "val1": Value1,
          "val2": Value2
        }
        me.filter = filter;
      }
      /*****Making payload regarding the operation and sending through /metaData RestApi */
      const treeOperationsPayload = {
        opType: 6,
        cctx: me.sessionService.session.cctx,
        duration: dataMe['duration'],
        tr: me.sessionService.testRun.id,
        clientId: "Default",
        appId: "Default",
        etag: "version_for_etag_provided_by_tsdb",
        grpBy: groupBy,
        ft: me.filter,
        exclOverall: exclOverall,
      };

      me.metaDataCall(treeOperationsPayload);


    } catch (e) {
      console.error("error in TreeOperations--", e);
    }
  }
  metaDataCall(treeOperationsPayload) {
    const me = this;
    me.loadTreeOperation(treeOperationsPayload).subscribe(
      (state: Store.State) => {
        if (state instanceof TreeOperationsLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof TreeOperationsLoadedState) {
          if (me.loadData.length == 0) {
            me.onLoaded(state);
          }
          else {
            me.checkData(state);
          }
          return;
        }
      },
      (state: TreeOperationsLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );

    if (me.sessionService.testRun.id && me.sessionService.testRun.running) {
      if (me.stopCounter)
        clearInterval(this.stopCounter);

      me.stopCounter = setInterval(() => {
        me.metaDataCall(treeOperationsPayload);
      }, 5000 * 60);
    }

  }

  loadTreeOperation(treeOperationsPayload): Observable<Store.State> {
    const me = this;
    const output = new Subject<Store.State>();

    setTimeout(() => {
      output.next(new TreeOperationsLoadingState());
    }, 0);


    me.controller.post(me.metaDatapath, treeOperationsPayload).subscribe(
      (data: MetricsTable) => {
        output.next(new TreeOperationsLoadedState(data));
        output.complete();
      },
      (e: any) => {
        output.error(new TreeOperationsLoadingErrorState(e));
        output.complete();

        me.logger.error('TreeOperations Data loading failed', e);
      }
    );
    return output;
  }
  private onLoading(state: TreeOperationsLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: TreeOperationsLoadingErrorState) {
    const me = this;
    me.metricData = null;
    me.empty = null;
    me.error = state.error;
    me.loading = false;
    console.error(me.error);
  }

  private onLoaded(state: TreeOperationsLoadedState) {
    const me = this;
    me.loadData = [];
    let msg = "Data Not Available.";
    let status: status = {
      code: -1,
      detailedMsg: "",
      msg: ""
    };
    if (state.data && state.data['grpMetaData'] !== undefined) {
      me.loadData = state.data['grpMetaData'];
      status = state.data['status'];
    }
    if (me.loadData.length == 0) {
      if (status.msg.includes("Metric not found for the applied filter")) {
        msg = status.msg;
      }
      me.messageService.add({ severity: 'error', summary: 'Error message', detail: msg });
      return
    }
    me.dashboardInstance(me.loadData);
    me.error = null;
    me.loading = false;
  }

  public checkData(state: TreeOperationsLoadedState) {
    const me = this;
    let tempData = [];
    if (state.data && state.data['grpMetaData'] !== undefined) {
      tempData = state.data['grpMetaData'];
      if ( tempData.length > 0) {
        me.isgdfChange = me.getGdfChange(tempData,me.loadData);
        if(me.isgdfChange){
          me.loadData = tempData;
          me.dashboardInstance(tempData);
        }
      }
    }

    me.error = null;
    me.loading = false;
  }

  getGdfChange(tempData,loadData){
    let isgdfChange = false;

    if(JSON.stringify(tempData) != JSON.stringify(loadData))
       isgdfChange = true;

  return isgdfChange
  }

  dashboardInstance(data) {
    const me = this;
    me.graphSettings = {};
    let finalobj = [];
    let obj1 = {};
    if (data.length == 1) {
      let meData = data[0].mdata;
      obj1['mData'] = this.makeData(meData);
      obj1['pCaption'] = data[0].title;
      obj1['graphSettings'] = {};
      finalobj.push(obj1);
    } else {
      for (let i = 0; i < data.length; i++) {
        let obj1 = {};
        let meData = data[i].mdata;
        obj1['mData'] = this.makeData(meData);
        obj1['pCaption'] = data[i].title;
        obj1['graphSettings'] = {};
        finalobj.push(obj1);
      }
    }
    me.metricData = [];
    me.metricData = finalobj;

    if(!me.isgdfChange){
      me.makeDashboardInstance(me.metricData);
    }else{
      me.makeDashboardInstanceForGdf(me.metricData);
      }
  }

  makeDashboardInstance(metricData){
    const me = this;
    if (me.menuData['Sublabel'] == "Merge") {
      DashboardComponent.getInstance().subscribe((dc: DashboardComponent) => {
        me.mergeMetric = true;
        dc.MergeMetrics(me.metricData, me.graphStatsType, me.selectedcriteria, me.GroupId, me.filter, this.featureName);
      });
    } else {
      DashboardComponent.getInstance().subscribe((dc: DashboardComponent) => {
        //dc.selectedWidget.widget.widgetIndex = 0;
        let length = (this.layoutType * this.layoutType);

        if (this.metricData.length > length) {
          length = this.metricData.length;
        }
        //if (this.metricData.length > dc.data.favDetailCtx.widgets.length) {
        dc.data.favDetailCtx.widgets = [];
        this.widgetLayouts = this.getWidgetLayouts(this.layoutType, this.layoutType, length);
        dc.data.favDetailCtx.layout.configGrid.cols = this.GRID_MAXCOLS;
        dc.data.favDetailCtx.layout.configGrid.rowHeight = this.GRID_ROWHEIGHT;
        dc.data.favDetailCtx.layout.configGrid.widgetLayouts = this.widgetLayouts;

        for (let i = 0; i < length; i++) {

          let newWidget = dc.getNewWidget('GRAPH');
          newWidget.name = "";
          newWidget.id = "";

          dc.data.favDetailCtx.widgets.push(newWidget);
          me.setPanelCaption(i,dc);
        }
        if (me.mergeMetric == false) {
          dc.changeLayout(dc.data.favDetailCtx.layout);
          dc.renderMetricsSetting(me.metricData, me.graphStatsType, me.selectedcriteria, me.GroupId, me.filter, this.featureName);
        }

      });
    }
  }
  makeDashboardInstanceForGdf(metricData){
    const me = this;
    DashboardComponent.getInstance().subscribe((dc: DashboardComponent) => {
    length = dc.data.favDetailCtx.widgets.length;

    if (this.metricData.length > dc.data.favDetailCtx.widgets.length) {
      length = this.metricData.length;
      this.widgetLayouts = this.getWidgetLayouts(this.layoutType, this.layoutType, length);
      dc.data.favDetailCtx.layout.configGrid.widgetLayouts = this.widgetLayouts;
    }else{
      this.widgetLayouts = [];
        if (dc.data.favDetailCtx.layout.configGrid.widgetLayouts == undefined || dc.data.favDetailCtx.layout.configGrid.widgetLayouts == null) {
          for (let i = 0; i < length; i++) {
            this.widgetLayouts.push(dc.data.favDetailCtx.widgets[i].layout);
          }
          dc.data.favDetailCtx.layout.configGrid['widgetLayouts'] = this.widgetLayouts;
        }
    }

    if (this.metricData.length == 1) {
      me.mergeMetric = true;
     dc.MergeMetrics(me.metricData, me.graphStatsType, me.selectedcriteria, me.GroupId, me.filter, this.featureName);
  }else {
    for (let i = 0; i < length; i++) {
      if (i < this.metricData.length) {
      if( i >= dc.data.favDetailCtx.widgets.length){
        let newWidget = dc.getNewWidget('GRAPH');
        newWidget.name = "";
        newWidget.id = "";
        dc.data.favDetailCtx.widgets[i] = newWidget;
        me.setPanelCaption(i,dc);
      }
      me.setPanelCaptionForWidgets(i,dc);
      }
    }
    dc.changeLayout(dc.data.favDetailCtx.layout);
    dc.renderMetricsSetting(me.metricData, me.graphStatsType, me.selectedcriteria, me.GroupId, me.filter, this.featureName);
  }

  });
  }


  setPanelCaption(i,dc: DashboardComponent) {
    const me = this;
    dc.data.favDetailCtx.widgets[i].widgetIndex = i;
    if (me.metricData[i]) {
      dc.data.favDetailCtx.widgets[i].id = me.metricData[i].pCaption;
      dc.data.favDetailCtx.widgets[i].name = me.metricData[i].pCaption;
    }
    dc.data.favDetailCtx.widgets[i].dataAttrName = "avg";
    dc.data.favDetailCtx.widgets[i].description = "";
    dc.data.favDetailCtx.widgets[i].graphs = {};
    dc.data.favDetailCtx.widgets[i].layout = dc.data.favDetailCtx.layout.configGrid.widgetLayouts[i];
  }

  setPanelCaptionForWidgets(i,dc: DashboardComponent) {
    const me = this;
    dc.data.favDetailCtx.widgets[i].widgetIndex = i;
    if (me.metricData[i]) {
      dc.data.favDetailCtx.widgets[i].id = me.metricData[i].pCaption;
      dc.data.favDetailCtx.widgets[i].name = me.metricData[i].pCaption;
    }
    dc.data.favDetailCtx.widgets[i].layout = dc.data.favDetailCtx.layout.configGrid.widgetLayouts[i];
  }

  makeData(meData) {
    let objs = [];
    for (let j = 0; j < meData.length; j++) {
      let subject = [];
      let vectorName = '';
      let subj = meData[j].subject;
      for (let k = 0; k < subj.length; k++) {
        if (k == 0)
          vectorName = subj[k].value;
        else
          vectorName = vectorName + ">" + subj[k].value;
        subject.push({ key: subj[k].key, value: subj[k].value, mode: 1 });
      }
      objs.push(
        {
          "measure": meData[j].measure,
          "subject": subject,
          "glbMetricId": meData[j].glbMetricId,
          "vectorName": vectorName,
        }
      );
    }
    return objs;
  }
  getWidgetLayouts(rowsCalc, colsCalc, length) {
    const me = this;
    let viewPortContainerHeight = this.calculateContainerHeight();
    let fixedRowHeight = this.GRID_ROWHEIGHT; //rowheight of grids
    let margin = this.WIDGETS_MARGIN; // margin between widgets
    let totalRowHeight = fixedRowHeight + margin;
    let maxCols = this.GRID_MAXCOLS; // fixed cols in layout
    let totalNoOfRows = Math.floor(viewPortContainerHeight / totalRowHeight);
    let widgetPerRowHeight = Math.floor(totalNoOfRows / rowsCalc);
    let widgetHeightCalc = widgetPerRowHeight * rowsCalc;
    let wHeight = totalNoOfRows > widgetHeightCalc ? totalNoOfRows - widgetHeightCalc : widgetHeightCalc - totalNoOfRows;
    let islessHeight = totalNoOfRows > widgetHeightCalc ? true : false;
    let calc = rowsCalc;
    let counter = 1;
    let rowCounter = 1;
    let widgetPerColWidth = colsCalc <= 0 ? maxCols : Math.floor(maxCols / colsCalc);
    let widgetWidthCalc = widgetPerColWidth * colsCalc;
    let wWidth = maxCols > widgetWidthCalc ? maxCols - widgetWidthCalc : widgetWidthCalc - maxCols;
    let islessWidth = maxCols > widgetWidthCalc ? true : false;
    let colNewCalc = colsCalc - 1;
    let widgetLayouts: DashboardWidgetLayout[] = [];
    widgetLayouts.push({ cols: widgetPerColWidth, rows: widgetPerRowHeight, x: 0, y: 0 });
    //convert according to widget length

    for (let i = 0; i < length; i++) {

      //ignoring first widget
      if (i == 0) {
        continue;
      }

      else if (i % colsCalc == 0) {
        let rows = widgetPerRowHeight;
        counter++;
        if (counter == rowsCalc) {
          rows = islessHeight ? widgetPerRowHeight + wHeight : widgetPerRowHeight - wHeight;
          counter = 0;
        }

        widgetLayouts.push({ cols: widgetPerColWidth, rows: rows, x: 0, y: widgetLayouts[i - 1].rows + widgetLayouts[i - 1].y });
        continue;
      }
      //for same row for another cols
      let cols = widgetPerColWidth;
      if (rowCounter == colNewCalc) {
        cols = islessWidth ? widgetPerColWidth + wWidth : widgetPerColWidth - wWidth;
        rowCounter = 0;
      }
      rowCounter++;
      widgetLayouts.push({ cols: cols, rows: widgetLayouts[i - 1].rows, x: widgetLayouts[i - 1].cols + widgetLayouts[i - 1].x, y: widgetLayouts[i - 1].y });
      continue;
    }
    return widgetLayouts;
  }

  calculateContainerHeight() {
    if (document.getElementsByClassName('scrollVertical')[0] !== undefined) {
      let totalheight = (<HTMLElement>document.getElementsByClassName('scrollVertical')[0]).clientHeight;
      if (document.getElementsByClassName('open')[0] !== undefined) {
        let lowerPanelHeight = (<HTMLElement>document.getElementsByClassName('scrollVertical')[0]).clientHeight;
        totalheight = totalheight + lowerPanelHeight + 2;
      }
      return totalheight;
    }

    let height = Math.round(document.getElementsByClassName('selected-widget-container')[0].getBoundingClientRect().height);
    let x = Math.floor(document.getElementsByClassName('ui-carousel-items-container')[0].getBoundingClientRect().x) + Math.floor(document.getElementsByClassName('selected-widget-container')[0].getBoundingClientRect().x);
    let totalheight = height + x + (2 * this.WIDGETS_MARGIN);
    return totalheight;
  }
}
