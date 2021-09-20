import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DATA } from '../jvm/service/jvm.dummy';
import { NodeInfoData } from '../service/node-info.model';

@Component({
  selector: 'app-operating-systems',
  templateUrl: './operating-systems.component.html',
  styleUrls: ['./operating-systems.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OperatingSystemsComponent implements OnInit {
  data: NodeInfoData;
  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.data = DATA
  }
}
