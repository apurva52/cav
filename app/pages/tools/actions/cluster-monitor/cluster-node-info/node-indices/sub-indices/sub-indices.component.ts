import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';

@Component({
  selector: 'app-sub-indices',
  templateUrl: './sub-indices.component.html',
  styleUrls: ['./sub-indices.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SubIndicesComponent implements OnInit {
  breadcrumb: MenuItem[];
  tabs: MenuItem[];

  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'System' },
      { label: 'Cluster Monitor' },
      { label: 'Indices' },
      { label: 'NetForest_Monitoring' },
    ];
    me.tabs = [
      { label: 'METRICS', routerLink: 'indices-metrics' },
      { label: 'SHARDS', routerLink: 'indices-shards' },
      { label: 'ALIASES', routerLink: 'indices-aliases' },
      { label: 'ADMINISTRATION', routerLink: 'indices-administration' },
    ];
  }
}
