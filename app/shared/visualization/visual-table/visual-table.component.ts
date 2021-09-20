import { Component, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { VISUAL_TABLE } from './service/visual-table.dummy';
import { VisualTable } from './service/visual-table.model';

@Component({
  selector: 'app-visual-table',
  templateUrl: './visual-table.component.html',
  styleUrls: ['./visual-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VisualTableComponent implements OnInit {

  data: VisualTable;
  selectedValues: string[] = [];

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  bucketMetricAgg
  @Input() tableData;
  @Input() metricAggs;
  @Input() bucketAggs;
  ngOnChanges(changes: SimpleChanges) {
    // changes=this.nfdbresponse
    console.log('=====changess====',changes)
    this.bucketMetricAgg = this.metricAggs.concat(this.bucketAggs);
    // console.log(this.tableData.length);
    if (this.tableData && this.tableData.length !== 0) {
      console.log("valuee")
      this.ngOnInit()
    }
  }

  constructor() { }
  ngOnInit(): void {
    const me = this;
    console.log('================Aggssss:::======');
    // let bucketMetricAgg = this.metricAggs.concat(this.bucketAggs);
    console.log(this.bucketMetricAgg)
    me.data = JSON.parse(JSON.stringify(VISUAL_TABLE));
    if (this.tableData && this.tableData.length !== 0) {
      console.log("valuee")
      me.data.headers[0].cols = []
      let keys = Object.keys(this.tableData[this.tableData.length-1])
      keys.forEach((key,index)=>{
        let valForCustom = [];
        if(this.bucketMetricAgg != undefined){
        this.bucketMetricAgg.forEach((arrVal)=>{
          if (key.includes(arrVal.aggType || key.includes(arrVal.field))) {
            console.log('=======array value get=========')
            valForCustom.push(arrVal);
          }
        });}
        console.log(valForCustom);
        console.log('=======index is ====',index)
        me.data.headers[0].cols.push({
          label: (valForCustom.length == 0 || valForCustom[0].customName == '') ? key : valForCustom[0].customName,
          valueField: key,
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          width: '80%'
        })
      })
      me.data.data = this.tableData
      console.log("tabledata", me.data)
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
}
