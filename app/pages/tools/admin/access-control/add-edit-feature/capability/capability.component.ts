import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { TemplateHeaderCols } from "src/app/pages/my-library/reports/template/service/template.model";
import { ADVANCED_TABLE_DATA, PROJECT_TABLE_DATA, TIER_TABLE_DATA } from "./service/capability.dummy";
import { AdvancedTable, ProjectTable, TierTable } from "./service/capability.model";

@Component({
  selector: "app-capability",
  templateUrl: "./capability.component.html",
  styleUrls: ["./capability.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class CapabilityComponent implements OnInit {

  
  data: TierTable;
  projectTableData: ProjectTable;
  advancedTableData: AdvancedTable;

  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;

  cols: TemplateHeaderCols[] = [];
  projectCols: TemplateHeaderCols[] = [];
  advancedCols: TemplateHeaderCols[] = [];

  _selectedColumns: TemplateHeaderCols[] = [];
  _selectedColumnsProject: TemplateHeaderCols[] = [];
  _selectedColumnsAdvanced: TemplateHeaderCols[] = [];

  globalFilterFields: string[] = [];
  projectGlobalFilterFields: string[] = [];
  advancedGlobalFilterFields: string[] = [];

  selectedRow: any;
  isCheckbox: boolean;
  isShowColumnFilter: boolean = false;

   
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';

  numberItems = [];

  projectItems = [];
  typeItems = [];
  permissionItems = [];
  
  constructor() { 

  }

  ngOnInit() {

    const me = this;

    me.data = TIER_TABLE_DATA;
    me.projectTableData = PROJECT_TABLE_DATA;
    me.advancedTableData = ADVANCED_TABLE_DATA;

    me.cols = me.data.headers[0].cols;

    me.projectCols = me.projectTableData.headers[0].cols;
    me.advancedCols = me.advancedTableData.headers[0].cols;

    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    for (const c of me.projectTableData.headers[0].cols) {
      me.projectGlobalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumnsProject.push(c);
      }
    }

    for (const c of me.advancedTableData.headers[0].cols) {
      me.advancedGlobalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumnsAdvanced.push(c);
      }
    }

    me.numberItems = [
      {
        label: "22",
        value: "22"
      },
      {
        label: "23",
        value: "23"
      },
      {
        label: "24",
        value: "24"
      }
    ];

    me.projectItems = [
      {
        label: "Project 1",
        value: "Project 1"
      },
      {
        label: "Project 2",
        value: "Project 2"
      },
      {
        label: "Project 3",
        value: "Project 3"
      }
    ];

    me.typeItems = [
      {
        label: "All",
        value: "All"
      }
    ];

    me.permissionItems = [
      {
        label: "Read / Write",
        value: "Read / Write"
      }
    ];

  }

  @Input() get selectedColumns(): TemplateHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TemplateHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  @Input() get selectedColumnsProject(): TemplateHeaderCols[] {
    const me = this;
    return me._selectedColumnsProject;
  }

  set selectedColumnsProject(val: TemplateHeaderCols[]) {
    const me = this;
    me._selectedColumnsProject = me.cols.filter((col) => val.includes(col));
  }

  @Input() get selectedColumnsAdvanced(): TemplateHeaderCols[] {
    const me = this;
    return me._selectedColumnsAdvanced;
  }

  set selectedColumnsAdvanced(val: TemplateHeaderCols[]) {
    const me = this;
    me._selectedColumnsAdvanced = me.cols.filter((col) => val.includes(col));
  }

}
