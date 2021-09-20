// import { Observable } from 'rxjs/Rx';
import { ExecDashboardDataContainerService } from './../../../services/exec-dashboard-data-container.service';
import { ExecDashboardGraphicalKpiService } from './../../../services/exec-dashboard-graphical-kpi.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ExecDashboardGraphicalKpiComponent } from './../exec-dashboard-graphical-kpi.component';
import { ExecDashboardUtil } from './../../../utils/exec-dashboard-util';

@Component({
  selector: 'app-exec-dashboard-single-view-panel',
  templateUrl: './exec-dashboard-single-view-panel.component.html',
  styleUrls: ['./exec-dashboard-single-view-panel.component.css']
})
export class ExecDashboardSingleViewPanelComponent implements OnInit, OnChanges, OnDestroy {
  @Input('chartData')
  chartData

  /*Data Subscriber of service.*/
  dataSubscription: Subscription;

  chart: any;
  chartArr;
  options;
  panelChartObj: any;
  pannel1: any = [];
  pannel2: any = [];
  widgetsArr;
  widgetID;
  panelDialObj: any;
  
  constructor(public _graphicalKpiService: ExecDashboardGraphicalKpiService,
    public _dataContainerService: ExecDashboardDataContainerService,
    public _graphicalKpiComponent: ExecDashboardGraphicalKpiComponent) { }

  ngOnInit() {
    this.chart = Object.assign(this.chartData);
    this.onLoadDrawChart();

    this.dataSubscription = this._graphicalKpiComponent.Observable$.subscribe(
      action => {
		if (action === 'UPDATE_DATA_AVAILABLE') {
          this.updateSinglePanelWidget();
        }
        else {
          this.widgetsArr = action;
          let dialArr = this._dataContainerService.getdialChartArr()[this.widgetID];
          if (this._dataContainerService.getOrderRevPanel() == this.widgetID) {
            this.pannel1 = dialArr[0];
            this.options = this.pannel1;
            this.pannel2 = dialArr[1];
          }
          else
            this.chart = Object.assign(this.widgetsArr[this.widgetID]);

          for (let i = 0; i < this.chart.options.series.length; i++) {
            let tempSeriesData = this.chart.options.series[i].data;
            this.panelChartObj.series[i].setData(tempSeriesData);
          }
        }
      },
      err => {
        this.dataSubscription.unsubscribe();
      }
    );
  }
  
  updateSinglePanelWidget() {
    try {
      if (!this.panelChartObj.hasOwnProperty('options')) {
        return;
      }

      if (this.panelChartObj.options.chart.type === 'spline') {
        let chartData = this._graphicalKpiService.getPanelDataByTitle(this.panelChartObj.title.textStr);
        this.panelChartObj.series[0].setData(chartData.chart.series[0].data, false, false, false)
        this.panelChartObj.series[1].setData(chartData.chart.series[1].data, false, false, false)
        this.panelChartObj.redraw();
      }
      // for dial charts.
      else if (this.panelChartObj.options.chart.type === 'gauge') {
        this.appendPanelData(this._dataContainerService.$panelGraphData[this.widgetID])
      }


    } catch (error) {
      console.log('updateSinglePanelWidget called ');
      console.log(error);
    }
  }
  

  onLoadDrawChart = function () {
    try {
      this.widgetID = this.chart.widgetId;
      this.options = this.chart.options;
      this.appendPanelData(this._dataContainerService.$panelGraphData[this.widgetID])
    } catch (error) {
      console.log('Error in  onLoadDrawChart ');
      console.log(error);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  /* on load resizing charts  */
  load(nativeChartRef) {
    this.panelChartObj = nativeChartRef;
    /* Now Resizing chart based on widget width and height. */
    if (this.pannel2 != undefined && this.panelChartObj.options.chart.type == "gauge") {
      // this.options = this.pannel1;
      this.panelChartObj.setSize(550, 450, false);
      this.panelChartObj.redraw();
    }
    else {
      this.panelChartObj.setSize(1150, "40%", false);
      this.panelChartObj.redraw();
    }
  }
  
  /**
   * appendPanelData
   */
  public appendPanelData(dialArr: any) {
    if (dialArr != undefined) {
      if (dialArr.length >= 2) {
        this.pannel1 = dialArr[0];
        this.pannel2 = dialArr[1];
        this.options = this.pannel1;
      } else if (dialArr.length == 1) {
        this.pannel1 = dialArr[0];
        this.options = this.pannel1;
      }
      if (this._dataContainerService.getOrderRevPanel().includes(this.widgetID)) {
        this.options = this.pannel1;
      }
    }
  }

  public changeFont(panel: any, additionValue: number = 9): any {
    if (panel == undefined) {
      return panel;
    }
    panel.yAxis.title.style.fontSize = additionValue + "px";
    return panel;
  }

  public ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }
  
} // End of file.
