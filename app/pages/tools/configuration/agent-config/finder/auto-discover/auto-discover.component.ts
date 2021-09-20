import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MenuItem, TreeNode } from 'primeng';

@Component({
  selector: 'app-auto-discover',
  templateUrl: './auto-discover.component.html',
  styleUrls: ['./auto-discover.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AutoDiscoverComponent implements OnInit {

  options: MenuItem[];
  selectedOptions: MenuItem;
  selectedValue: string = 'val1'
  files: TreeNode[];

  isShow: boolean = true;

  constructor() { }

  ngOnInit(): void {
    const me = this;
    me.options = [
      {label: 'ALL'},
      {label: 'ALL'},
      {label: 'ALL'},
      {label: 'ALL'},
      {label: 'ALL'},
    ];


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

  openAutoDiscoverFinder() {
    const me = this;
    me.isShow = false;
  }

  resetAutoDiscoverFinder(){
    const me = this;
    me.isShow = true;
  }

}
