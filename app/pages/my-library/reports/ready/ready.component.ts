import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { READY_PAGE_DATA } from './service/ready.dummy';
import { ReadyPageData } from './service/ready.model';

@Component({
  selector: 'app-ready',
  templateUrl: './ready.component.html',
  styleUrls: ['./ready.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReadyComponent implements OnInit {
  data: ReadyPageData;
  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.data = READY_PAGE_DATA;
  }

}
