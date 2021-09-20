import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, TreeNode } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { TOPOLOGY_TABLE_DATA } from './service/topology.dummy';
import { TopologyTable } from './service/topology.model';

@Component({
  selector: 'app-agent-config-topology',
  templateUrl: './agent-config-topology.component.html',
  styleUrls: ['./agent-config-topology.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgentConfigTopologyComponent implements OnInit {
static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  breadcrumb: MenuItem[];


  data: TopologyTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;


  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  globalFilterFields: string[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  options: MenuItem[];
  options1: MenuItem[];
  selectedValues: string[] = [];
  options2: MenuItem[];
  files: TreeNode[];

  selectedFiles: TreeNode[];
  selectedFile: TreeNode;
  treeData;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    const me = this;
    me.files =
    [
      {
        "label": "NC-MON-W",
        "data": "Documents Folder",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": [
          {
            "label": "NC-MON-W",
            "icon": "pi pi-file",
            "data": "Report Document"
          },
          {
            "label": "NC-MON-W",
            "icon": "pi pi-file",
            "data": "Report Document"
          }
        ]

      },
      {
        "label": "NC-MON-W",
        "data": "Documents Folder",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": [
          {
            "label": "NC-MON-W",
            "icon": "pi pi-file",
            "data": "Report Document"
          },
          {
            "label": "NC-MON-W",
            "icon": "pi pi-file",
            "data": "Report Document"
          }
        ]

      },
      {
        "label": "NC-MON-W",
        "data": "Documents Folder",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": [
          {
            "label": "NC-MON-W",
            "icon": "pi pi-file",
            "data": "Report Document"
          },
          {
            "label": "NC-MON-W",
            "icon": "pi pi-file",
            "data": "Report Document"
          }
        ]

      },
      {
        "label": "NC-MON-W",
        "data": "Documents Folder",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": [
          {
            "label": "NC-MON-W",
            "icon": "pi pi-file",
            "data": "Report Document"
          },
          {
            "label": "NC-MON-W",
            "icon": "pi pi-file",
            "data": "Report Document"
          }
        ]

      },
    ];
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'Configuration' },
      { label: ' Color Management' },

    ];

    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ];
    me.options = [
      { label: 'All' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
      { label: 'Dummy Text' },
    ];





    me.data = TOPOLOGY_TABLE_DATA;

    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
  }

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }



  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }
}
