import { Component, Input, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { SessionStateService } from 'src/app/pages/home/home-sessions/session-state.service';
import { RULE_TABLE } from './service/rule.dummy';
import { UserSegmentRuleHeaderCols, UserSegmentRuleTable } from './service/rule.model';

@Component({
  selector: 'app-rule',
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RuleComponent implements OnInit {

  data: UserSegmentRuleTable;
  buttonflag : boolean = false;
  totalRecords = 0;
  error: AppError;
  loading: boolean;
  emptyTable: boolean;
  cols: UserSegmentRuleHeaderCols[] = [];
  _selectedColumns: UserSegmentRuleHeaderCols[] = [];
  globalFilterFields: string[] = [];
  isShowColumnFilter: boolean;
  empty: boolean;
  downloadOptions: MenuItem[];
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  selectedItem;
  selectedRow: any;
  isCheckbox: boolean;
  tooltipzindex = 100000;
  selectedIds: any;
  tabledata: any = [];
  @Output() deleterulessegment: EventEmitter<any>;
  @Output() editrulessegmentevent: EventEmitter<any>;
  constructor(private sessionStateService: SessionStateService) {
    this.selectedIds = [];
    this.deleterulessegment = new EventEmitter();
    this.editrulessegmentevent = new EventEmitter();
  }

  ngOnInit(): void {
    
    const me = this;
    if (this.sessionStateService.isAdminUser() == true)
      this.buttonflag = true;
    
    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ]
    me.data = RULE_TABLE;
    this.totalRecords = me.data.data.length;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    this.totalRecords = me.data.data.length;
  }
  @Input() get rulestabledata() {
    return;
  }

  set rulestabledata(tabledata) {
    this.tabledata = tabledata;
    for (var i of this.tabledata) {
      if (i.type == "1")
        i["rtype"] = "Url Regular Pattern";
      if (i.type == "0")
        i["rtype"] = "Cookie";
      if (i.type == "2")
        i["rtype"] = "Click";
      if (i.type == "3")
        i["rtype"] = "Engagement";
    }
    this.data = RULE_TABLE;
    console.log('this.tabledata : ', this.tabledata);
  }
  @Input() get selectedColumns(): UserSegmentRuleHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: UserSegmentRuleHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  deleteEntryrules(event) {
    console.log('deleteEntryrules : ', event, 'selectedIds : ', this.selectedIds);
    if (event == false) {
      this.selectedIds = [];
      return;
    }
    this.deleterulessegment.emit(this.selectedIds);
    //all delete method 
    this.selectedIds = [];
    console.log('after method process selectedIds : ', this.selectedIds);
  }

  editrulessegment(event) {
    console.log('editrulessegment : ', event);
    event["id"] = this.selectedIds.id;
    event["usId"] = this.selectedIds.usId;
    this.editrulessegmentevent.emit(event);
    this.selectedIds = [];
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
