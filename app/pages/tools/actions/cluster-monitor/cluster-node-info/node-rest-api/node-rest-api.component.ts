import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-node-rest-api',
  templateUrl: './node-rest-api.component.html',
  styleUrls: ['./node-rest-api.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NodeRestApiComponent implements OnInit {
  cluster: any;
  nodes: any;
  indices: any;

  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.cluster = [
      {
        label: 'Health',
        value: 'health'
      },
      {
        label: 'State',
        value: 'state'
      },
      {
        label: 'Settings',
        value: 'setting'
      },
      {
        label: 'Ping',
        value: 'ping'
      },
      
    ]

    me.nodes = [
      {
        label: 'Info',
        value: 'info'
      },
      {
        label: 'Stats',
        value: 'stats'
      },
      {
        label: 'Health',
        value: 'health'
      },
      {
        label: 'Health',
        value: 'health'
      },
      
    ]

    me.indices = [
      {
        label: 'Aliases',
        value: 'aliases'
      },
      {
        label: 'Settings',
        value: 'settings'
      },
      {
        label: 'Stats',
        value: 'stats'
      },
      {
        label: 'Health',
        value: 'health'
      },
      
    ]


  }
}
