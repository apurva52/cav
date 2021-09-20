import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { AccessControlService } from '../../services/access-control.service';
import { saveUserGroupCapabilityRes, groupSaveReq } from '../../services/access-control.model';
import { saveUserLoadingState, saveUserLoadedState, saveUserLoadingErrorState } from '../../services/access-control.state';
import { Subscription } from "rxjs";
import { Store } from "src/app/core/store/store";
import { AppError } from '../../../../../../../../src/app/core/error/error.model';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-group",
  templateUrl: "./group.component.html",
  styleUrls: ["./group.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class GroupComponent implements OnInit {
  totalData = [];
  userList: any;
  groupList: any;
  toShowGroupButton: boolean;
  groupName: string = '';
  groupEmail: string = '';
  groupType: any;
  groupDescription: string = '';
  nativeGroup: boolean;
  groupSubsciption: Subscription;
  groupSaveRespone : saveUserGroupCapabilityRes;
  error : AppError;
  loading: boolean;
  userCapabilityData: any;

  constructor(private accessControlService: AccessControlService, private router : Router, private activatedRoute : ActivatedRoute) {
    this.totalData = this.accessControlService.aclDataGet();

  }


  saveGroup() {
    if (this.checkGroupInputs()) {
      alert('please enter all inputs ')
      return;
    }
    let sessionKey = JSON.parse(localStorage.getItem('session'));
    let productKey = sessionKey['cctx']['pk']

    const payload = {
      name: this.groupName,
      type: this.nativeGroup == true ? 'Native' : 'non-Native',
      description: this.groupDescription
    }
    this.saveGroupInDB(payload, productKey);
  }

  saveGroupInDB(payload: groupSaveReq, productKey: string) {
    const me = this;
    let session = JSON.parse(localStorage.getItem('session'));

    try {
      me.groupSubsciption = me.accessControlService.saveGroup(payload, productKey).subscribe(
        (state: Store.State) => {
          if (state instanceof saveUserLoadingState) {
            //  me.onloadingAclData(state);
            return;
          }

          if (state instanceof saveUserLoadedState) {
            me.onloadedAclData(state);
            return;
          }
        },
        (state: saveUserLoadingErrorState) => {
          //   me.onloadingErrorAclData(state);
        }
      );

    } catch (error) {

    }
  }

  onloadedAclData(state: saveUserLoadedState) {
    const me = this;

    me.groupSaveRespone = state.data;
    console.log('this is save use data', me.groupSaveRespone)
    me.error = null;
    me.loading = false;
    this.router.navigate(['/access-control/home']);
  }


  checkGroupInputs() {
    if (this.groupEmail == '' || this.groupName == '' || this.groupDescription == '')
      return true;
  }

  ngOnInit() {
    if (this.accessControlService.newGroupFlagGet())
      this.toShowGroupButton = false;


      this.activatedRoute.url.subscribe(url => {
        console.log('info from group ===table compoenntn = == ' , this.accessControlService.getGroupInfo());
        let groupInfo = this.accessControlService.getGroupInfo();
        this.groupName = groupInfo.name;
        this.groupEmail = groupInfo.email;
        this.groupDescription = groupInfo.description;
        this.userCapabilityData={};
        this.userCapabilityData = this.accessControlService.getGroupInfo();
        this.userCapabilityData = {...this.userCapabilityData};

      });
  }
}
