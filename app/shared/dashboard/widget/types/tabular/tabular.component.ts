import {
  Component,
  OnInit,
  HostBinding,
  ViewEncapsulation,
  PipeTransform,
  Input,
} from '@angular/core';
import { DashboardWidgetComponent } from '../../dashboard-widget.component';
import { TableWidget, TableHeaderColumn } from 'src/app/shared/table/table.model';
import { SortEvent } from 'primeng/api';
import { DashboardWidgetTypeTableColumnDef, ForEachGraphArgs } from '../../../service/dashboard.model';
import * as _ from 'lodash';
import { FilterUtils } from 'primeng/utils';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';

@Component({
  selector: 'app-tabular',
  templateUrl: './tabular.component.html',
  styleUrls: ['./tabular.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DashboardWidgetComponent, useExisting: TabularComponent  },
  ],
})
export class TabularComponent  extends DashboardWidgetComponent  {

  @HostBinding('class') class = 'widget-container widget-tabular';

  tableOptions: TableWidget;
  widgetWiseTimeToolTip : string = '';
  @Input() visiblityMenu : any;

  render() {
    const me = this;
    if(!me.data){
      me.empty = false;
      me.loading = false;
     
      let data1Onj:any;
      data1Onj={
        "measure.metric": "",
       "summary.avg2": "",
       "summary.max3": "",
       "summary.stdDev1": ""
      }
      let data:any[]=[];
      data.push(data1Onj);
       this.tableOptions = {
        search: {
          fields: [],
        },
        headers: [
          {
            cols: [],
          },
        ],
        data: data,
        sort: {
          customSort: me.widget.settings.types.table.enableSorting,
        },
  
        tableFilter: me.widget.settings.types.table.enableFiltering,
        resize: me.widget.settings.types.table.enableColumnResizing,
      };
      for (const iWidgetCol in me.widget.settings.types.table.cols) {
        if (me.widget.settings.types.table.cols[iWidgetCol]) {
          const widgetCol = me.widget.settings.types.table.cols[iWidgetCol];
          this.tableOptions.headers[0].cols.push(me.getWidgetTableCol(widgetCol, !!Number(iWidgetCol)));
          // if (me.widget.settings.types.table.tableType === '1') {
          //   break;
          // }
        }
      }
      return;
    }
    if (me.empty || me.data.grpData == null || me.data.grpData.mFrequency == null) {
      me.empty = true;
      return;
    }

    const tableOptions: TableWidget = {
      search: {
        fields: [],
      },
      headers: [
        {
          cols: [],
        },
      ],
      data: [],
      sort: {
        customSort: me.widget.settings.types.table.enableSorting,
      },

      tableFilter: me.widget.settings.types.table.enableFiltering,
      resize: me.widget.settings.types.table.enableColumnResizing,
    };

    // Hide 2nd column if type = 1
    for (const iWidgetCol in me.widget.settings.types.table.cols) {
      if (me.widget.settings.types.table.cols[iWidgetCol]) {
        const widgetCol = me.widget.settings.types.table.cols[iWidgetCol];
        tableOptions.headers[0].cols.push(me.getWidgetTableCol(widgetCol, !!Number(iWidgetCol)));
        // if (me.widget.settings.types.table.tableType === '1') {
        //   break;
        // }
      }
    }
    // Add row for each graph
    let graphData=[];
    let graphs=[];
    me.forEachGraph((args: ForEachGraphArgs) => {
      graphs.push(args.graphName);
      graphData.push({
        graph:args.graphName,
        operation:args.graph.lowerPanelSummary[0]
      });
    });
    let type=me.widget.settings.types.table.tableType;
    let rows=[];
    me.forEachGraph((args: ForEachGraphArgs) => {
      let vector=args.graphName.split('-')[1];
      if(type === '1'){
        if (rows.indexOf(vector) < 0) {
          rows.push(vector);
        }else{
          return;
        }
      }
      const col = {};
      let i=-1;
      let value;

      for (const widgetCol of tableOptions.headers[0].cols) {
        i++;
        value = _.get(args.graph, widgetCol.valueField, null);

        // Load formatter if required
        widgetCol.format =   widgetCol.format == null ||  widgetCol.format == undefined ? "dec_3" : widgetCol.format;
        const formatter: PipeTransform = widgetCol.format ? me.pipeService.getFormatter(widgetCol.format) : null;
        let key:string;
        let _graph:string;
        if(type ==='1'){
          _graph=widgetCol.label+" -"+vector;
        }else{
          _graph=args.graphName;
        }
        key=widgetCol.valueField.split(".")[1];
        if(key=='sampleCount'){
          key='count';
        }
        col['measure.metric'] =_graph;

        if(widgetCol.valueField.indexOf("summary") > -1){
          if(!graphs.includes(_graph)){
          value=args.graph.lowerPanelSummary[args.gsType].avg;
          }else{
            for(let graph of graphData){
            if(graph.graph==_graph){
              value=formatter.transform(_.get(graph.operation, key, null));
              break;
            }
            }
          }
        }

        if (formatter && (!isNaN(value) || value=='-')) {
          col[widgetCol.valueField+i] = value;
        } else {
          if(widgetCol.valueField == "measure.metric"){

            col[widgetCol.valueField] = args.graphName;
          }
          else if(widgetCol.valueField =="subject.tags[0].sName"){
            col[widgetCol.valueField] = args.graphName;
          }
          else{
          col[widgetCol.valueField + i] = value;
          }
        }
      }

      tableOptions.data.push(col);
    });
let selectedfield =me.getSelectedTableFieldType(me.widget.settings.types.table.cols);
let selecteddata :any[] =[];
if(selectedfield.length>0){
for(let j=0;j<selectedfield.length;j++){
  if(selectedfield[j]){
    selecteddata.push(selectedfield[j]+(j+1));
    tableOptions.data.sort(function (a, b) {
      return a['summary.'+selectedfield[j]+(j+1)] - b['summary.'+selectedfield[j]+(j+1)]
    });
  }

}}

var min = tableOptions.data[0]
for(let l=0; l<selecteddata.length;l++){
 for(let i=0;i<tableOptions.data.length;i++){
  if(min['summary.'+selecteddata[l]]<1){
    tableOptions.data[i]['summary.'+selecteddata[l]] =(parseInt(tableOptions.data[i]['summary.'+selecteddata[l]]).toFixed(3)).toLocaleString();
  }
  if(min['summary.'+selecteddata[l]]>=1 && min['summary.'+selecteddata[l]]<10){
    tableOptions.data[i]['summary.'+selecteddata[l]]=(parseInt(tableOptions.data[i]['summary.'+selecteddata[l]]).toFixed(2)).toLocaleString();
  }
  if(min['summary.'+selecteddata[l]]>=10 && min['summary.'+selecteddata[l]]<100){
    tableOptions.data[i]['summary.'+selecteddata[l]] =(parseInt(tableOptions.data[i]['summary.'+selecteddata[l]]).toFixed(1)).toLocaleString();
  }
  if(min['summary.'+selecteddata[l]]>99 ){
    tableOptions.data[i]['summary.'+selecteddata[l]] =  (parseInt(tableOptions.data[i]['summary.'+selecteddata[l]]).toFixed(0)).toLocaleString();
  }
 }
}

    // for (const graph of me.data.grpData.mFrequency[0].data) {
    //   const col = {};
    //   for (const widgetCol of tableOptions.headers[0].cols) {
    //     const formater: PipeTransform = me.pipeService.getFormatter(
    //       me.widget.settings.types.table.format
    //     );
    //     if (formater) {
    //       if (isNaN(_.get(graph.summary, widgetCol.valueField, null))) {
    //         col[widgetCol.valueField] = _.get(
    //           graph.summary,
    //           widgetCol.valueField,
    //           null
    //         );
    //       } else {
    //         col[widgetCol.valueField] = formater.transform(
    //           _.get(graph.summary, widgetCol.valueField, null)
    //         );
    //       }
    //     } else {
    //       col[widgetCol.valueField] = _.get(graph.summary, widgetCol.valueField, null);
    //     }
    //   }
    //   tableOptions.data.push(col);
    // }

    if(me.widget.widgetWiseInfo){
      let timePreset = JSON.parse(sessionStorage.getItem('timePresets'))['timePeriod'];
      let selectedTimePreset = MenuItemUtility.searchById(me.widget.widgetWiseInfo.duration.preset, timePreset);
        me.widgetWiseTimeToolTip = `
        'Widget wise time is applied'
        ${selectedTimePreset.label}
       `;
        }

    this.tableOptions = tableOptions;
  }

  getSelectedTableFieldType(colsValue) {
    let selectedFields = [];
    for (let i = 1; i < colsValue.length; i++) {
      if(colsValue[i].displayName !== "Metric Name"){
      selectedFields.push(colsValue[i].field.split("summary.")[1]);
      }
    }
    return selectedFields;
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
        let value1 = data1[event.field];
        let value2 = data2[event.field];
        let result = null;

        if (value1 == null && value2 != null)
            result = -1;
        else if (value1 != null && value2 == null)
            result = 1;
        else if (value1 == null && value2 == null)
            result = 0;
        else if (typeof value1 === 'string' && typeof value2 === 'string')
            result = value1.localeCompare(value2);
        else
            result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

        return (event.order * result);
    });
}

  private getWidgetTableCol(
    col: DashboardWidgetTypeTableColumnDef,
    addDefaultFormatter: boolean
  ): TableHeaderColumn {
    const me = this;
    const c: TableHeaderColumn = {
      label: col.displayName,
      valueField: col.field,
      width: col.width
    };

    if (addDefaultFormatter) {
      c.format = me.widget.settings.types.table.format;
    }
    return c;
  }

  getClass(value) {
    let intValue = parseInt(value);
    if (Number(intValue) || intValue === 0) {
      return true;
    }
  }
}
