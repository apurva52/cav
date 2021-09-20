import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { AccessControlService } from '../../services/access-control.service';
import { AccessControlLoadingState, AccessControlLoadedState, AccessControlLoadingErrorState, saveUserLoadedState, saveUserLoadingErrorState, saveUserLoadingState } from '../../services/access-control.state';
import * as encrypt from 'jsencrypt/bin/jsencrypt.min';
import { saveUserReq, saveUserGroupCapabilityRes } from '../../services/access-control.model';
import { Subscription } from "rxjs";
import { Store } from "src/app/core/store/store";
import { AppError } from '../../../../../../../../src/app/core/error/error.model';
import { ActivatedRoute, Router } from "@angular/router";


@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class UserComponent implements OnInit, OnChanges, OnDestroy {
  groupList = [];
  capabilityList = [];
  totalData: any;
  showUserButtons: boolean;
  userName: string = '';
  groupEmail: string = '';
  mobile: string = '';
  dn: any;
  password: string = '';
  confirmPassword: string = '';
  userSubscription: Subscription;
  resForUserOperation: saveUserGroupCapabilityRes;
  error: AppError;
  loading: boolean;
  userTableCopy: any;
  nativeUser: boolean = true;
  allUserMappingInfo: any;
  dataForUserCapabilityTable: any;

  constructor(private accessControlService: AccessControlService, private router: Router, private activatedRoute: ActivatedRoute, private changeDet:ChangeDetectorRef) {
       this.userTableCopy = this.accessControlService.aclDataGet();
       this.totalData = this.accessControlService.aclDataGet();
    // if (!this.accessControlService.newUserFlagGet())
    // else
    //   this.totalData = null

      console.log("in user componenet>>>>>>>>>" , this.accessControlService.getUserInfo());

    //this.getAllUserInfo();
  }

  setDataForGroupCapabilityTable() {

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

  saveUser() {

    if (this.checkUserInputs())
      return alert('Please enter Inputs fields')

    let prerequisiteKey = JSON.parse(localStorage.getItem('preSession'));
    let sessionKey = JSON.parse(localStorage.getItem('session'));
    let productKey = sessionKey['cctx']['pk']
    let publicMetaKey = '';
    let encryptedPassword = '';
    let confirmedEncryptedPassword = '';
    if (prerequisiteKey)
      publicMetaKey = prerequisiteKey['publicKey']

    if (publicMetaKey != '') {
      let encryptAPI = new encrypt.JSEncrypt();
      encryptAPI.setKey(publicMetaKey);
      encryptedPassword = encryptAPI.encrypt(this.password == "" ? "NA" : this.password);
      confirmedEncryptedPassword = encryptAPI.encrypt(this.confirmPassword == "" ? "NA" : this.confirmPassword);
    }
    else
      alert('encrypted keyt absent');


    const payload = {
      userId: "0",
      name: this.userName,
      type: this.nativeUser == true ? 'Native' : 'Non-Native',
      email: this.groupEmail,
      password: encryptedPassword,
      confirmPassword: confirmedEncryptedPassword,
      mobileNO: this.mobile
    }

    this.saveUserToDB(payload, productKey);
  }

  saveUserToDB(data: saveUserReq, productKey) {
    const me = this;
    let session = JSON.parse(localStorage.getItem('session'));

    try {
      me.userSubscription = me.accessControlService.saveUser(data, productKey).subscribe(
        (state: Store.State) => {
          if (state instanceof saveUserLoadingState) {
            me.onloadingAclData(state);
            return;
          }

          if (state instanceof saveUserLoadedState) {
            me.onloadedAclData(state);
            return;
          }
        },
        (state: saveUserLoadingErrorState) => {
          me.onloadingErrorAclData(state);
        }
      );

    } catch (error) {

    }
  }

  onloadingAclData(state: saveUserLoadingState) {

  }

  onloadedAclData(state: saveUserLoadedState) {
    const me = this;

    me.resForUserOperation = state.data;
    me.error = null;
    me.loading = false;
    this.router.navigate(['/access-control/home']);
  }
  onloadingErrorAclData(state: saveUserLoadingErrorState) {

  }

  checkUserInputs() {
    if (this.userName == '' || this.password == '' || this.confirmPassword == '' || this.groupEmail == '' || this.mobile == '')
      return true;
  }

  ngOnInit() {

    if (this.accessControlService.newUserFlagGet())
      this.showUserButtons = false;


    this.activatedRoute.url.subscribe(url => {
      console.log('info from table compoenntn = == ' , this.accessControlService.getUserInfo());
      let userData = this.accessControlService.getUserInfo();
      this.userName = userData.name;
      this.groupEmail = userData.email;
      this.mobile = userData.mobile;
      this.dn = userData.dn;
      this.accessControlService.dataFromUserComponentSet(true);
      this.totalData={}
      this.totalData = this.accessControlService.getUserInfo();
      this.totalData={...this.totalData};
      console.log(' >>>>>>>>>>>>>>>>>>>>>>>>>>> ' , this.totalData)
      this.changeDet.detectChanges();
    });
  }

  // valueOnUserChage(name: string) {
  // }
  gotoHomeAcl(){
     this.accessControlService.dataFromUserComponentSet(false);
     this.router.navigate(['/access-control/home']);
    }
  ngOnChanges() {

  }

  ngOnDestroy(){
   // this.userSubscription.unsubscribe();
  }
}
