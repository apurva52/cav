import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { STATISTIC_TABLE } from './service/visual-statistic.dummy';
import { StaticticTable } from './service/visual-statistic.model';

@Component({
  selector: 'app-visual-statistics',
  templateUrl: './visual-statistics.component.html',
  styleUrls: ['./visual-statistics.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VisualStatisticsComponent implements OnInit {

  data: StaticticTable;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  constructor() { }

  @Input() statsData;
  ngOnChanges() {
    // changes=this.nfdbresponse
    console.log(this.statsData.length)
  console.log
    if(this.statsData.length !== 0){
      console.log("valuee")
      this.ngOnInit()
    }
  }

  ngOnInit(): void {
    const me = this;
    me.data = STATISTIC_TABLE;
    me.data.data=this.statsData
    console.log(me.data.data)
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
