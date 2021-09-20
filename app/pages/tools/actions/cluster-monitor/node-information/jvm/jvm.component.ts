import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NodeInfoData } from '../service/node-info.model';
import { DATA } from './service/jvm.dummy';

@Component({
  selector: 'app-jvm',
  templateUrl: './jvm.component.html',
  styleUrls: ['./jvm.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class JvmComponent implements OnInit {
  data: NodeInfoData;
  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.data = DATA
  }
}
