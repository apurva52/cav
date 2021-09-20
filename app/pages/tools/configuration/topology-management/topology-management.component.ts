import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem, TreeNode } from 'primeng';

@Component({
  selector: 'app-topology-management',
  templateUrl: './topology-management.component.html',
  styleUrls: ['./topology-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopologyManagementComponent implements OnInit {

  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb: MenuItem[];
  files: TreeNode[];
  options: MenuItem[];
  selectedOption: MenuItem;

  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Topology: CM_Topo' },
      { label: 'Tier: Cavisson' },     
    ];
    
    me.options = [
      {label: 'ALL'},
      {label: 'ALL'},
      {label: 'ALL'},
      {label: 'ALL'},
      {label: 'ALL'}
    ]

    me.files =
    [
      {
        "label": "Page",
        "data": "Documents Folder",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": [
          {
            "label": "Page Report 1",
            "icon": "pi pi-file",
            "data": "Report Document"
          },
          {
            "label": "Page Report 2",
            "icon": "pi pi-file",
            "data": "Report Document"
          }
        ]

      },
      {
        "label": "Page",
        "data": "Documents Folder",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": [
          {
            "label": "Page Report 1",
            "icon": "pi pi-file",
            "data": "Report Document"
          },
          {
            "label": "Page Report 2",
            "icon": "pi pi-file",
            "data": "Report Document"
          }
        ]

      },
      {
        "label": "Revenue",
        "data": "Documents Folder",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": [
          {
            "label": "Page Report 1",
            "icon": "pi pi-file",
            "data": "Report Document"
          },
          {
            "label": "Page Report 2",
            "icon": "pi pi-file",
            "data": "Report Document"
          }
        ]

      },
      {
        "label": "Revenue",
        "data": "Documents Folder",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": [
          {
            "label": "Page Report 1",
            "icon": "pi pi-file",
            "data": "Report Document"
          },
          {
            "label": "Page Report 2",
            "icon": "pi pi-file",
            "data": "Report Document"
          }
        ]

      },
    ];
  }

}
