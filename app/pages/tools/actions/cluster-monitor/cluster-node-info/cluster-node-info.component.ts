import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng';

@Component({
  selector: 'app-cluster-node-info',
  templateUrl: './cluster-node-info.component.html',
  styleUrls: ['./cluster-node-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ClusterNodeInfoComponent implements OnInit {
  breadcrumb: MenuItem[];
  nodeInfo: SelectItem[];
  tabs: MenuItem[];

  constructor() {}

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'System' },
      { label: 'Cluster Monitor' },
      { label: 'Indices' },
    ];
    me.nodeInfo = [{ label: 'Cq22zz', value: 'cq22zz' }];

    me.tabs = [
      { label: 'INDICES', routerLink: 'node-indices' },
      { label: 'QUERY', routerLink: 'node-query' },
      { label: 'MAPPING', routerLink: 'node-mapping' },
      { label: 'REST API', routerLink: 'node-rest-api' },
    ];
  }
}
