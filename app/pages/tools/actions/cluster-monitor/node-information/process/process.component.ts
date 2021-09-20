import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DATA } from '../jvm/service/jvm.dummy';
import { NodeInfoData } from '../service/node-info.model';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProcessComponent implements OnInit {
  data: NodeInfoData;
  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.data = DATA
  }
}
