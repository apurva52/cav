import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { NodeInfoData } from '../service/node-info.model';
import { IN_DATA } from './service/indices.dummy';

@Component({
  selector: 'app-indices',
  templateUrl: './indices.component.html',
  styleUrls: ['./indices.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IndicesComponent implements OnInit {
  data: NodeInfoData;
  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.data = IN_DATA
  }
}
