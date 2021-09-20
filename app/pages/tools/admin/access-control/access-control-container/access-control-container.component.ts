import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { AccessControlService } from '../services/access-control.service';
import { AppError } from '../../../../../../../src/app/core/error/error.model'
import { UserTableComponent } from '../user-table/user-table.component';
import { GroupTableComponent } from '../group-table/group-table.component';
import { CapabilityTableComponent } from '../capability-table/capability-table.component';
import { Subscription } from "rxjs";
import { AccessControlLoadedState, AccessControlLoadingErrorState, AccessControlLoadingState } from '../services/access-control.state';
import { Store } from "src/app/core/store/store";
import { aclCompleteList, getAllUserResponse } from '../services/access-control.model';

@Component({
  selector: "app-access-control-container",
  templateUrl: "./access-control-container.component.html",
  styleUrls: ["./access-control-container.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class AccessControlContainerComponent implements OnInit {
  isVisible: boolean = false;
  private accessControlSubscription: Subscription;
  userGroupCapability:any;
  groupList =[];
  capabilityList =[];
  dataForAclScreen: any;
  error: AppError;
  loading: boolean=true;

  constructor(private accessControlService: AccessControlService) {
    this.openAccessControlWindow();
  }

  openAccessControlWindow() {
    console.log('  opeing acces control...')
    this.isVisible = true;
    this.loadUserGroupCapabiltyDetails();
  }

  loadUserGroupCapabiltyDetails() {
    const me = this;
    let session = JSON.parse(localStorage.getItem('session'));

    try {
      const payload: any = { "productKey": session['cctx']['pk'] };
      me.accessControlSubscription = me.accessControlService.load(payload).subscribe(
        (state: Store.State) => {
          if (state instanceof AccessControlLoadingState) {
            me.onloadingAclData(state);
            return;
          }

          if (state instanceof AccessControlLoadedState) {
            me.onloadedAclData(state);
            return;
          }
        },
        (state: AccessControlLoadingErrorState) => {
          me.onloadingErrorAclData(state);
        }
      );

    } catch (error) {

    }
  }

  onloadingAclData(state: AccessControlLoadingState) {

  }

  onloadedAclData(state: AccessControlLoadedState) {
    const me = this;
    
    me.dataForAclScreen = state.data['data'];
    me.accessControlService.aclDataSet(me.dataForAclScreen);
    me.error = null;
    me.loading = false;
    
  }

  onloadingErrorAclData(data: AccessControlLoadingErrorState) {

  }

  ngOnInit() {

  }
}
