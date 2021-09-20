import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-cleanup-configuration',
  templateUrl: './cleanup-configuration.component.html',
  styleUrls: ['./cleanup-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CleanupConfigurationComponent implements OnInit {

  retentionItems: any[];

  constructor() { }

  ngOnInit(): void {
    const me = this;

    me.retentionItems = [
      {
        value: 'Day',
        label: 'Day'
      },
      {
        value: 'Week',
        label: 'Week'
      },
      {
        value: 'Month',
        label: 'Month'
      }
    ]
  }

}
