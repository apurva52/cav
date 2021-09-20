import { ExecDashboardPanelData } from './../../interfaces/exec-dashboard-panel-data';
import { ExecWidgetActionInputs } from './../../containers/widget-action-Inputs';
import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Widget } from '../../containers/widget';
import { ExecDashboardChartProviderService } from '../../services/exec-dashboard-chart-provider.service';
import { ExecDashboardDataContainerService } from '../../services/exec-dashboard-data-container.service';
import { Subscription } from 'rxjs';
import { ExecDashboardGraphicalKpiComponent } from './../exec-dashboard-graphical-kpi/exec-dashboard-graphical-kpi.component'
import { ExecDashboardGraphicalKpiService } from './../../services/exec-dashboard-graphical-kpi.service';
import { ExecDashboardUtil } from './../../utils/exec-dashboard-util';

@Component({
  selector: 'app-exec-dashboard-widget',
  templateUrl: './exec-dashboard-widget.component.html',
  styleUrls: ['./exec-dashboard-widget.component.css']
})
export class ExecDashboardWidgetComponent implements OnInit, OnDestroy {
  @Input() widgetInfo;
  
  /*Data Subscriber of service.*/
  dataSubscription: Subscription;

  /* Getting Widget DOM Object */
  @ViewChild('widgetRef') widgetRef: any;
  panelData: ExecDashboardPanelData = null;
  panelChartObj: any;
  dialChartObj: any;
  pannel1: any = []; // for revenue
  pannel2: any = []; // for order
  constructor(public execDashboardChartProviderService: ExecDashboardChartProviderService,
    public _dataContainerService: ExecDashboardDataContainerService,
	public _graphicalKpiComponent: ExecDashboardGraphicalKpiComponent,
    public _graphicalKpiService: ExecDashboardGraphicalKpiService) {
  }
  ngOnInit() {
    // console.log('getPanelDataArr', this._dataContainerService.getPanelDataArr())
    let dialArr = this._dataContainerService.$panelGraphData[this.widgetInfo.widgetId];
    if (dialArr != undefined) {
      if (dialArr.length >= 2) {
        this.pannel1 = dialArr[0];
        this.pannel2 = dialArr[1];
      } else {
        this.pannel1 = dialArr;
      }
    }

    if (this._dataContainerService.getOrderRevPanel().includes(this.widgetInfo.widgetId)) {
      this.widgetInfo.options = this.pannel1;
    }
	
	this.dataSubscription = this._graphicalKpiComponent.Observable$.subscribe(
      action => {
        console.log(action);
        // alert('inside widget compomnent');
        this.updateWidget(action);
        // this.dataSubscription.unsubscribe();
      },
      err => {
        this.dataSubscription.unsubscribe();
      }
    );
	
  }
  
  updateWidget = function (action) {
    try {
      if (action === 'UPDATE_DATA_AVAILABLE') {
        this.updateWidgetOnUpdation();
      }
    } catch (error) {
      console.log('error in updateWidget called ');
    }
  }
  
    updateWidgetOnUpdation() {
    try {
      if (this.panelChartObj == undefined || this.panelChartObj == null || !this.panelChartObj.hasOwnProperty('series')) {
        return;
      }
      if (!this.panelChartObj.hasOwnProperty('options')) {
        return;
      }
      // for line charts.
      if (this.panelChartObj.options.chart.type === 'spline') {
        let chartData = this._graphicalKpiService.getPanelDataByTitle(this.panelChartObj.title.textStr);
        this.panelChartObj.series[0].setData(chartData.chart.series[0].data, false, false, false)
        this.panelChartObj.series[1].setData(chartData.chart.series[1].data, false, false, false)
        this.panelChartObj.redraw();

      }
      // for dial charts.
      else if (this.panelChartObj.options.chart.type === 'gauge') {
        let dialArr = this._dataContainerService.$panelGraphData[this.widgetInfo.widgetId];
        if (dialArr != undefined) {
          if (dialArr.length >= 2) {
            this.pannel1 = dialArr[0];
            this.pannel2 = dialArr[1];
          } else if (dialArr.length == 1) {
            this.pannel1 = dialArr[0];
          }
        }
        if (this._dataContainerService.getOrderRevPanel().includes(this.widgetInfo.widgetId)) {
          this.widgetInfo.options = this.pannel1;
        }

      }

    } catch (error) {
      console.log('updateWidgetOnUpdation called ');
      console.log(error);
    }
  }

  public restoreFont(panel: any, additionValue: number = 9): any {
    if (panel == undefined) {
      return panel;
    }
    panel.yAxis.title.style.fontSize = additionValue + "px";
    return panel;
  }

  /*resizing charts on load except dial 2 */
  load(nativeChartRef) {
    this.panelChartObj = nativeChartRef;
    if (!this._dataContainerService.getOrderRevPanel().includes(this.widgetInfo.widgetId)) {
      let currentWidgetWidth = this.widgetRef['nativeElement'].clientWidth;
      let currentWidgetHeight = this.widgetRef['nativeElement'].clientHeight;
      this.panelChartObj.setSize(currentWidgetWidth, currentWidgetHeight);
    }
    else {
      let currentWidgetWidth = (this.widgetRef['nativeElement'].clientWidth) / 2;
      let currentWidgetHeight = this.widgetRef['nativeElement'].clientHeight;
      this.panelChartObj.setSize(currentWidgetWidth, currentWidgetHeight);
      //this.dialChartObj.setSize(currentWidgetWidth, currentWidgetHeight);
    }
  }
 
  /* resizing dial 2 chart  */
  loadDial(nativeChartRef) {
    this.dialChartObj = nativeChartRef;
    let currentWidgetWidth = (this.widgetRef['nativeElement'].clientWidth) / 2;
    let currentWidgetHeight = this.widgetRef['nativeElement'].clientHeight;
    this.dialChartObj.setSize(currentWidgetWidth, currentWidgetHeight);
  }
  /* Event Emitted on every resize/dragging of item. */
  onChangeStop(_item) {
    try {
      /* Getting Current Widget Width and Height. */
      if (!this._dataContainerService.getOrderRevPanel().includes(this.widgetInfo.widgetId)) {
        let currentWidgetWidth = this.widgetRef['nativeElement'].clientWidth;
        let currentWidgetHeight = this.widgetRef['nativeElement'].clientHeight;
        this.panelChartObj.setSize(currentWidgetWidth, currentWidgetHeight);
      }
      else {
        let currentWidgetWidth = (this.widgetRef['nativeElement'].clientWidth) / 2;
        let currentWidgetHeight = this.widgetRef['nativeElement'].clientHeight;
        this.panelChartObj.setSize(currentWidgetWidth, currentWidgetHeight);
        this.dialChartObj.setSize(currentWidgetWidth, currentWidgetHeight);
      }
    } catch (error) {
      console.log('Error while processing resize/drag event of widget');
      console.log(error);
    }
  }
   
  public ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }



} // end of file
