import { Component, OnInit, OnDestroy } from '@angular/core';
import { TabNavigatorService } from '../../services/tab-navigator.service';
import { Message } from 'primeng/primeng';
import { HttpService } from '../../services/httpService';

@Component({
  selector: 'app-runCmd-graph-info',
  templateUrl: './runCmd-graph-info.component.html',
  styleUrls: ['./runCmd-graph-info.component.css']
})

export class RunCmdGraphInfo implements OnInit, OnDestroy {
  chartType = 'line';
  height = '365';
  width = '1050';
  demoSeries = [];
  chartComponent = '';
  getTotal = '';
  totalOrder: any;
  dataValues = [];
  cols: any;
  options: any;
  isShow = false;
  msgs: Message[] = [];

  /**constructor */
  constructor(public _tabNavigator: TabNavigatorService,
    private _httpService: HttpService,
    // private _dialog: MatDialog
  ) {
    try {
    } catch (error) {
      console.error('error constructor() --> ', error);
    }
  }

  /**Ng Oninit */
  ngOnInit() {
    try {
      this.getRunCommandGraphInfo();
    } catch (error) {
      console.error('érror in ngonint-- > ', error);
    }
  }

  /**set a destroy */
  ngOnDestroy() {
    try {
    } catch (error) {
      console.error('error in ng On destroy -> ')
    }
  }

  /**get a graph data */
  getGraphData(result) {
    try {
      let dataDB;
      let Tstamp;
      let _len1 = 0;
      let graphDataVal = result;
      let values = [];


      let channelOrders = graphDataVal['channelOrderStats'];

      /**create a pie chart */
      for (let key in channelOrders) {
        if (channelOrders.hasOwnProperty(key)) {

          if (channelOrders[key]['basisField'] != 'Total') {
            values.push({
              name: channelOrders[key]['basisField'],
              y: parseInt(channelOrders[key]['percentage'])
            })
          } else {
            this.isShow = true;
            this.totalOrder = channelOrders[key]['total'];
          }
        }
      }


      /**Set a xaxis field name */
      if (graphDataVal['timeStampFieldName'] != undefined)
        this._tabNavigator.xAxisFieldName = graphDataVal['timeStampFieldName'];

      /**set a yaxis field name */
      if (graphDataVal['yAxisFieldName'] != undefined)
        this._tabNavigator.yAxisFieldName = graphDataVal['yAxisFieldName'];

      /**set a basis field name */
      if (graphDataVal['basisFieldName'] != undefined)
        this._tabNavigator.basisFieldName = graphDataVal['basisFieldName'];


      if (graphDataVal.panelGraphArr != undefined)
        dataDB = graphDataVal.panelGraphArr;

      if (graphDataVal.arrTimestamp != undefined)
        Tstamp = graphDataVal.arrTimestamp;

      if (Tstamp != undefined && Tstamp.length != undefined)
        _len1 = Tstamp.length;


      let main = [];
      let counter = -1;
      let colorArray = ["#F33D98", "#FE936F", "#CEFE6F", "#94FE6F", "#6FFED0", "#6FDEFE", "#6F94FE", "#C36FFE", "#E86FFE", "#FE6F89", "#A19609", "#71A109", "#09A145", "#098CA1", "#0967A1"];
      for (let key in dataDB) {
        if (dataDB.hasOwnProperty(key)) {

          if (key === 'timestamp') {
            continue;
          }

          let data = [];
          for (let _j = 0; _j < _len1; _j++) {
            let _d = [];
            _d.push(Tstamp[_j]);
            _d.push(parseInt(dataDB[key][_j]));
            data.push(_d);
          }

          if (key == 'Total') {

            main.push({
              data: data,
              name: key,
              value: '50',
              'type': 'areaspline',
              color: '#3D60A7'
            });

          }
          else {
            counter++;
            if (counter == 14) {
              counter = 0;
            }
            main.push({
              data: data,
              value: '20',
              name: key,
              'type': 'spline',
              color: colorArray[counter]
            });
          }

        }
      }

      /**Pie Chart Data */
      main.push({
        data: values,
        name: this._tabNavigator.yAxisFieldName,
        'type': 'pie',
        center: [100, 80],
        size: 100,
        showInLegend: false,
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
          format: '<b>{point.name}</b>: {point.percentage:.2f} %'
        },
        tooltip: {
          pointFormat: '<b>{point.name}</b>: {point.percentage:.2f} %'
        }
      });

      /*check for the value is pie or others*/
      this.demoSeries = main;

    } catch (error) {
      console.error('getting a graph data ===> ', error);
    }
  }

  /**
   * Get a Run Command Graph Info
   */
  getRunCommandGraphInfo() {
    try {
      let jsonInfo = {
        "separator": this._tabNavigator.seprator,
        "dateFormat": "MM/dd/yyyy HH:mm",
        "timeZone": "CDT",
        "timeStampField": (this._tabNavigator.xAxisIndex - 1).toString(),
        "yAxisField": (this._tabNavigator.yAxisIndex - 1).toString(),
        "basisField": (this._tabNavigator.graphIndex - 1).toString(),
        "isCalculateTotal": this._tabNavigator.showTotal,
        "data": this._tabNavigator.graphData
      }

      let sqlDataSubscription = this._httpService.getGraphData(jsonInfo).subscribe(
        result => {

          if (result['status'] != undefined) {
            if (result['status'].toString() != "Success") {
              this.msgs.push({ severity: 'error', summary: 'Rejected', detail: result['status'].toString() });
              return;
            }
          }

          if (result != undefined) {

            /**Get a Graph data */
            this.getGraphData(result);

            /**Get a Table Data */
            this.getTabledata(result);

          }
        },
        err => {
          console.error('Error in Getting a command graph info ', err);
          sqlDataSubscription.unsubscribe();
        },
        () => {
          sqlDataSubscription.unsubscribe();

        });
    } catch (e) {
      console.error('error in getting data --> ', e);
    }
  }

  /**
   * Get a table data
   */
  getTabledata(result) {
    try {
      let getHeaders = result['channelOrderStats'];

      let columnArray = result['columnArray'];
      for (let key in columnArray) {
        if (columnArray.hasOwnProperty(key)) {
          if (columnArray[key]['field'] == 'total') {
            this.getTotal = columnArray[key]['header'];
          }
        }
      }

      this.cols = result['columnArray'];
      this.dataValues = [];

      /**Get Headers values */
      for (let key in getHeaders) {
        if (getHeaders.hasOwnProperty(key)) {
          if (getHeaders[key]['basisField'] != 'Total') {
            this.dataValues.push(getHeaders[key]);
          }
        }
      }

    } catch (error) {
      console.error('error in getting a tabledata ', error);
    }
  }

  /** 
   * Close a Dialog
   */
  close() {
    try {
      // this._dialog.closeAll();
    } catch (error) {
      console.error('error in closing --> ', error);
    }
  }
}
