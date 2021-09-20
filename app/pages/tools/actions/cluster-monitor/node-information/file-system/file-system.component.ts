import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DATA } from '../jvm/service/jvm.dummy';
import { NodeInfoData } from '../service/node-info.model';

@Component({
  selector: 'app-file-system',
  templateUrl: './file-system.component.html',
  styleUrls: ['./file-system.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FileSystemComponent implements OnInit {
  data: NodeInfoData;
  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.data = DATA
  }
}