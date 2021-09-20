import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { METRICS_INDICES_DATA } from './service/metrics.dummy';
import { IndicesMetricsData } from './service/metrics.model';

@Component({
  selector: 'app-indices-metrics',
  templateUrl: './indices-metrics.component.html',
  styleUrls: ['./indices-metrics.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IndicesMetricsComponent implements OnInit {
  data: IndicesMetricsData;

  constructor() {}

  ngOnInit(): void {
    const me = this;

    me.data = METRICS_INDICES_DATA;
  }
}
