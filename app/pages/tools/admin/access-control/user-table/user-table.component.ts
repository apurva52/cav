import { Component, Input, OnInit, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ACCESS_CONTROL_DATA_TABLE_USERS } from "../services/access-control.dummy";
import { AccessControlTableHeaderCols } from "../services/access-control.model";
import { AccessControlService } from "../services/access-control.service";
import { UserComponent } from '../../access-control/add-edit-feature/user/user.component';
import { AccessControlLoadedState, AccessControlLoadingErrorState, AccessControlLoadingState } from "../services/access-control.state";
import { Subscription } from "rxjs";
import { Store } from "src/app/core/store/store";

@Component({
  selector: "app-user-table",
  templateUrl: "./user-table.component.html",
  styleUrls: ["./user-table.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class UserTableComponent implements OnInit, OnDestroy {

  data: any[];
  empty: boolean;
  loading: boolean;
  _selectedColumns: AccessControlTableHeaderCols[];
  cols: any[];
  selectedRow: any;
  @Input() userListFromContainer: any;
  showAddRemoveButton: Boolean;
  userComponent: UserComponent;
  showUserButtons: boolean = true;
  allUserMappingInfo: { account: [any]; capabilityList: [any]; groupList: [any]; projectClusterList: [any]; projectList: [any]; userList: [any]; };
  userSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accessControlService: AccessControlService
    , private refChange: ChangeDetectorRef) {
    this.getAllUserInfo();
  }

  @Input()
  set setUserTableData(da) {
  //  this.data = data;
    console.log('group - - - user data- ------ table compoenent = = ' , da);
    this.data = da['mapping']['user']

  }

  ngOnInit() {

    const me = this;
    me.data = this.userListFromContainer['userList'];
    
    me.cols = ACCESS_CONTROL_DATA_TABLE_USERS.headers[0].cols;
    me._selectedColumns = me.cols;

    if (this.accessControlService.addNewUserFlag)
      this.showUserButtons = false;

    this.route.queryParams.subscribe(params => {


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

  public editUser(user): void {
    const me = this;
    console.log('in edit user ,mode = = = = ', user)
    //me.userComponent.dataFromUserTableWindow(user, me.userListFromContainer);
    this.accessControlService.newUserFlagSet(false);

    if (this.allUserMappingInfo) {
      let userSelected: any;
      for (let i = 0; i < this.allUserMappingInfo['userList'].length; i++) {
        let userFromList = this.allUserMappingInfo['userList'][i];
        if (userFromList['name'] == user.name) {
          userSelected = userFromList;
          break;
        }
      }

      this.accessControlService.setUserInfo(userSelected);
    }

    me.router.navigate(['access-control/user', user.name]);
    this.refChange.detectChanges();
  }

  public addNewUser() {
    this.accessControlService.newUserFlagSet(true);
    this.router.navigate(['access-control/user']);
  }

  getAllUserInfo() {
    const me = this;
    let sessionKey = JSON.parse(localStorage.getItem('session'));
    let productKey = sessionKey['cctx']['pk']
    try {
      me.userSubscription = me.accessControlService.getAllUserInfo(productKey).subscribe(
        (state: Store.State) => {
          if (state instanceof AccessControlLoadingState) {
            me.onloadingUserInfo(state);
            return;
          }

          if (state instanceof AccessControlLoadedState) {
            me.onloadedUserInfo(state);
            return;
          }
        },
        (state: AccessControlLoadingErrorState) => {
          me.onloadingErrorUserInfo(state);
        }
      );

    } catch (error) {

    }
  }

  onloadingUserInfo(state: AccessControlLoadingState) {

  }

  onloadingErrorUserInfo(state: AccessControlLoadingErrorState) {

  }

  onloadedUserInfo(state: AccessControlLoadedState) {
    console.log("state data = == = == ", state.data);
    this.allUserMappingInfo = state.data['data'];
  }



  ngOnDestroy(){
   // this.userSubscription.unsubscribe();
  }

}
