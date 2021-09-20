import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DATA } from '../jvm/service/jvm.dummy';
import { NodeInfoData } from '../service/node-info.model';

@Component({
  selector: 'app-thread-pools',
  templateUrl: './thread-pools.component.html',
  styleUrls: ['./thread-pools.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ThreadPoolsComponent implements OnInit {
  data: NodeInfoData;
  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.data = DATA
  }
}
