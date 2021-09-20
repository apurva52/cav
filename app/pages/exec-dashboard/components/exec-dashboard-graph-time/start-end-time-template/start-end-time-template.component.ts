import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { ExecDashboardGraphTimeDataservice } from '../../../services/exec-dashboard-graph-time-data.service';

@Component({
  selector: 'app-start-end-time-template',
  templateUrl: './start-end-time-template.component.html',
  styleUrls: ['./start-end-time-template.component.css']
})
export class StartEndTimeTemplateComponent implements OnInit {
  @Input() selectedTimePeriod: string;

  constructor(public graphTime: ExecDashboardGraphTimeDataservice) { }

  ngOnInit() {
  }

  eventHandler(event, maxlimit, fieldName) {
    let temp = event.key;
    let maxLimit = maxlimit;
    let val = parseInt(event['target']['value'], 10);
    
    if (val > maxLimit) {
      event.preventDefault();
    }
  }

}
