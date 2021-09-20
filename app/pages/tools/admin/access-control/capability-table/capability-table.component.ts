import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ACCESS_CONTROL_DATA_TABLE_CAPABILITIES } from "../services/access-control.dummy";
import { AccessControlTableHeaderCols } from "../services/access-control.model";
import { AccessControlService } from '../services/access-control.service';

@Component({
  selector: "app-capability-table",
  templateUrl: "./capability-table.component.html",
  styleUrls: ["./capability-table.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class CapabilityTableComponent implements OnInit {

  data: any[];
  empty: boolean;
  loading: boolean;
  _selectedColumns: AccessControlTableHeaderCols[];
  cols: any[];
  selectedRow: any;
  @Input() capabilityListFromContainer: any;

  showEdit: Boolean;

  showAddRemoveButton: Boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accessControlService: AccessControlService
  ) {
  }

  @Input()
  set setCapabilityTable(da) {
    console.log('group - - - - ------ table compoenent = = ', da);
    this.data = da['mapping']['capability']

  }

  ngOnInit() {

    const me = this;

    me.data = this.capabilityListFromContainer['capabilityList'];

    me.cols = ACCESS_CONTROL_DATA_TABLE_CAPABILITIES.headers[0].cols;
    me._selectedColumns = me.cols;

    this.route.queryParams.subscribe(params => {

      if (me.router.url.includes('/group') || me.router.url.includes('/user')) {
        me.showEdit = true;
      } else {
        me.showEdit = false;
      }

      if (me.router.url.includes('/group')) {
        me.showAddRemoveButton = true;
      } else {
        me.showAddRemoveButton = false;
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

  public editCapability(data): void {
    const me = this;

    me.router.navigate(['access-control/capability', data.name]);
  }
}
