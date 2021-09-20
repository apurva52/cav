import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Carousel } from 'primeng';
import { SYSTEM_SUMMARY_VIEW_TABLE } from './service/system-summary-view.dummy';
import { systemsummaryviewTable } from './service/system-view.model';

@Component({
  selector: 'app-system-summary-view',
  templateUrl: './system-summary-view.component.html',
  styleUrls: ['./system-summary-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SystemSummaryViewComponent implements OnInit {
  @ViewChild('assetallocation') assetallocation: Carousel;
  data: systemsummaryviewTable;
  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.data = SYSTEM_SUMMARY_VIEW_TABLE;
  }

}

