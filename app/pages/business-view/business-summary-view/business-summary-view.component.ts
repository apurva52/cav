import { Route } from '@angular/compiler/src/core';
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { Carousel } from 'primeng';
import { SUMMARY_VIEW_TABLE } from './service/summary-view.dummy';
import { summaryviewTable } from './service/summary-view.model';

@Component({
  selector: 'app-business-summary-view',
  templateUrl: './business-summary-view.component.html',
  styleUrls: ['./business-summary-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BusinessSummaryViewComponent implements OnInit {
  data: summaryviewTable;
  @ViewChild('assetallocation') assetallocation: Carousel;
  constructor(private route: Router) {}

  ngOnInit(): void {
    const me = this;
    me.data = SUMMARY_VIEW_TABLE;
  }

  viewBusinessApplication() {
    console.log('click');
    
    this.route.navigate(['/business-view/business-application-view']);
  }
}
