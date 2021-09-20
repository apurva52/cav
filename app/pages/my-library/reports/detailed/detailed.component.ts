import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DETAILED_PAGE_DATA } from './service/detailed.dummy';
import { DetailedPageData } from './service/detailed.model';

@Component({
  selector: 'app-detailed',
  templateUrl: './detailed.component.html',
  styleUrls: ['./detailed.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailedComponent implements OnInit {
  data: DetailedPageData;
  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.data = DETAILED_PAGE_DATA;
  }

}
