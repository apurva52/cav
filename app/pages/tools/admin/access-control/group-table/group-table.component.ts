import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { ACCESS_CONTROL_DATA_TABLE_GROUPS } from "../services/access-control.dummy";
import { AccessControlTableHeaderCols } from "../services/access-control.model";
import { AccessControlService } from '../services/access-control.service';

@Component({
  selector: "app-group-table",
  templateUrl: "./group-table.component.html",
  styleUrls: ["./group-table.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class GroupTableComponent implements OnInit {

  data: any[];
  empty: boolean;
  loading: boolean;
  _selectedColumns: AccessControlTableHeaderCols[];
  cols: any[];
  selectedRow: any;
  @Input() groupListFromContainer: any;
  allGroupMappingInfo

  showEdit: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accessControlService : AccessControlService
  ) {
  }

  @Input()
  set setGroupTableData(da) {
  //  this.data = data;
    this.data = da['mapping']['group']

  }


  ngOnInit() {

    const me = this;
    me.data = this.groupListFromContainer['groupList'];

    me.cols = ACCESS_CONTROL_DATA_TABLE_GROUPS.headers[0].cols;
    me._selectedColumns = me.cols;

    this.route.queryParams.subscribe(params => {

      if (me.route.snapshot.paramMap.get('user') || me.router.url.includes('/user')) {
        me.showEdit = true;
      } else {
        me.showEdit = false;
      }
    });

  }


  @Input() get selectedColumns(): any[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: any[]) {

    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  public editGroup(data): void {

    const me = this;
    this.accessControlService.newGroupFlagSet(false);
    this.accessControlService.newUserFlagSet(false);

    if (this.groupListFromContainer) {
      let groupSelected: any;
      for (let i = 0; i < this.groupListFromContainer['groupList'].length; i++) {
        let groupFromList = this.groupListFromContainer['groupList'][i];
        if (groupFromList['name'] == data.name) {
          groupSelected = groupFromList;
          break;
        }
      }

      this.accessControlService.setGroupInfo(groupSelected);
    }

    me.router.navigate(['access-control/group', data.name]);

  }

  addNewGroup(){
    this.accessControlService.newGroupFlagSet(true);
    this.router.navigate(['access-control/group']);

  }
}
