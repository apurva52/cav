import { DataWidget } from './../containers/data-widget';
import { Chart } from './../../exec-dashboard/containers/chart';
DataWidget
export class ExecDashboardPanelData {
    panelNumber: number = -1;
    widgetType:number = 1;
    chart: any = null;//chart: Chart
    errorCode: number = -1;
    errorMsg: string = null;
    panelTitle: string = null;
    isHeaderReq = true;
    dataWidget: DataWidget = null;
    // tableWidget: TabularData = null;
    originalPanelTitle = null;
    isZoom = false;
    zoomChartTimeList = null;
    isFirstUndoZoomApplied = false;
    // healthWidget: HealthWidget = null;
    // isBtAggAvailable = false;
    graphTimeLabel = '';
    scaleMode = 0;
    scaleBySelectedGraph = 'NA';
    scaleGraphIndex = 0;
    scaleOn = false;
}
