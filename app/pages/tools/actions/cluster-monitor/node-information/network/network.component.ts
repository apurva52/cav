import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DATA } from '../jvm/service/jvm.dummy';
import { NodeInfoData } from '../service/node-info.model';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NetworkComponent implements OnInit {
  data: NodeInfoData;
  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.data = DATA
  }
}