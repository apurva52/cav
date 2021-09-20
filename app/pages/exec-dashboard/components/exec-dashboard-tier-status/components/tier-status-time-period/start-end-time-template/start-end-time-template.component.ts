import { TierStatusTimeHandlerService } from './../../../services/tier-status-time-handler.service';
import { Component, OnInit, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'ts-start-end-time-template',
  templateUrl: './start-end-time-template.component.html',
  styleUrls: ['./start-end-time-template.component.css']
})
export class TierStatusStartTemplateComponent implements OnInit {
  @Input() selectedTimePeriod: string;

  constructor(public graphTime: TierStatusTimeHandlerService) { }

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
