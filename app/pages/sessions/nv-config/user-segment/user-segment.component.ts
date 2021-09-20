import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { USER_SEGMENT_TABLE } from './service/user-segment.dummy';
import { Store } from 'src/app/core/store/store';
import { HomePageTabLoadingState, HomePageTabLoadingErrorState, HomePageTabLoadedState } from './service/user-segment.state';
import { UserSegmentService } from './service/user-segment.service';
import {
  UserSegmentTable,
  UserSegsmentDataHeaderCols,
} from './service/user-segment.model';
import { MetadataService } from 'src/app/pages/home/home-sessions/common/service/metadata.service';
import { UserSegmentDataSource } from "./service/usersegmentdatasource";
import { SessionStateService } from '../../../../pages/home/home-sessions/session-state.service';

@Component({
  selector: 'app-user-segment',
  templateUrl: './user-segment.component.html',
  styleUrls: ['./user-segment.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserSegmentComponent implements OnInit {
  data: UserSegmentTable;
  totalRecords = 0;
  buttonflag: boolean = false;
  error: AppError;
  loading: boolean;
  cols: UserSegsmentDataHeaderCols[] = [];
  _selectedColumns: UserSegsmentDataHeaderCols[] = [];
  selectedIds: any;
  selectedRow: any;
  visible: boolean = false;
  showFields: boolean;
  isCheckbox: boolean;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;
  globalFilterFields: string[] = [];
  userName: any;
  userDescription: any;
  Icons: any;
  iconeventopn: any[];
  downloadOptions: MenuItem[];
  selectedItem: any;
  ruleenableflag: boolean = false;
  rulestabledata: any = [];
  usersegmentid: any;
  segmentrowrefreshif: any;
  npage: any[];
  msg: any = [];
  msgnormal: any = [];
  constructor(private router: Router, private UserSegmentService: UserSegmentService, private MetadataService: MetadataService, private SessionStateService: SessionStateService) {
    this.selectedIds = [];
    this.segmentrowrefreshif = [];
    this.MetadataService.getMetadata().subscribe(metadata => {
      let pagem: any[] = Array.from(metadata.pageNameMap.keys());
      this.npage = pagem.map(key => {
        return {
          label: metadata.pageNameMap.get(key).name,
          value: metadata.pageNameMap.get(key).id.toString()
        };
      });
    });
  }

  ngOnInit(): void {
    const me = this;
    if (this.SessionStateService.isAdminUser() == true) {

      this.buttonflag = true;
    }
    if (this.SessionStateService.isAdminUser() != true) {

      this.buttonflag = false;

    }
    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ]
    me.data = USER_SEGMENT_TABLE;
    this.totalRecords = me.data.data.length;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      me.globalFilterFields.push(c.valueField);
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    this.iconeventopn = [
      {
        label: "AddToBagButNoShoppingBag",
        value: "/eventIcons/AddToBagButNoShoppingBag.png"
      },
      {
        label: "AddToBagMaximumAmountExceeded",
        value: "/eventIcons/AddToBagMaximumAmountExceeded.png"
      },
      {
        label: "AddToBagValidationErrors",
        value: "/eventIcons/AddToBagValidationErrors.png"
      },
      {
        label: "CheckoutInvalidRewardSerialNumber",
        value: "/eventIcons/CheckoutInvalidRewardSerialNumber.png"
      },
      { label: "CouponExpired", value: "/eventIcons/CouponExpired.png" },
      { label: "ClickEvent", value: "/eventIcons/clickeve.png" },
      { label: "Feedback", value: "/eventIcons/Feedback.png" },
      { label: "HighPageResponse", value: "/eventIcons/HighPageResponse.png" },
      {
        label: "ImageNotAvailable",
        value: "/eventIcons/ImageNotAvailable.png"
      },
      { label: "InvalidCoupon", value: "/eventIcons/InvalidCoupon.png" },
      {
        label: "InvalidRewardSerialNumber",
        value: "/eventIcons/InvalidRewardSerialNumber.png"
      },
      {
        label: "InvalidRewardcode",
        value: "/eventIcons/InvalidRewardcode.png"
      },
      {
        label: "Invalidmailpassword",
        value: "/eventIcons/Invalidmailpassword.png"
      },
      { label: "Invalidpromocode", value: "/eventIcons/Invalidpromocode.png" },
      {
        label: "ItemNotForInternationalShipping",
        value: "/eventIcons/ItemNotForInternationalShipping.png"
      },
      {
        label: "LongDurationSession",
        value: "/eventIcons/LongDurationSession.png"
      },
      { label: "Loop", value: "/eventIcons/Loop.png" },
      { label: "MediaMismatch", value: "/eventIcons/MediaMismatch.png" },
      {
        label: "MissingProductCopy",
        value: "/eventIcons/MissingProductCopy.png"
      },
      {
        label: "MobileInvalidCardNumber",
        value: "/eventIcons/MobileInvalidCardNumber.png"
      },
      {
        label: "MobileInvalidVerificationNumber",
        value: "/eventIcons/MobileInvalidVerificationNumber.png"
      },
      {
        label: "MobilePromoCodeError",
        value: "/eventIcons/MobilePromoCodeError.png"
      },
      { label: "SessionPageFail", value: "/eventIcons/SessionPageFail.png" },
      {
        label: "ShoppingBagButNoCheckout",
        value: "/eventIcons/ShoppingBagButNoCheckout.png"
      },
      { label: "Surcharge", value: "/eventIcons/Surcharge.png" },
      {
        label: "TBDforEstimatedShipping",
        value: "/eventIcons/TBDforEstimatedShipping.png"
      },
      {
        label: "TBDforEstimatedTax",
        value: "/eventIcons/TBDforEstimatedTax.png"
      },
      { label: "TBDforTotalOrder", value: "/eventIcons/TBDforTotalOrder.png" },
      { label: "addressFor", value: "/eventIcons/addressFor.png" },
      { label: "blankPage", value: "/eventIcons/blankPage.png" },
      { label: "default", value: "/eventIcons/default.png" },
      { label: "email_invalid", value: "/eventIcons/email_invalid.png" },
      { label: "erro404", value: "/eventIcons/erro404.png" },
      { label: "exception", value: "/eventIcons/exception.png" },
      {
        label: "highshippingcharge",
        value: "/eventIcons/highshippingcharge.png"
      },
      { label: "jserror", value: "/eventIcons/jserror.png" },
      {
        label: "lowshippingcharge",
        value: "/eventIcons/lowshippingcharge.png"
      },
      {
        label: "nextPageNotAvailable",
        value: "/eventIcons/nextPageNotAvailable.png"
      },
      { label: "noProductFound", value: "/eventIcons/noProductFound.png" },
      { label: "outofstock", value: "/eventIcons/outofstock.png" },
      { label: "pageFreeze", value: "/eventIcons/pageFreeze.png" },
      { label: "pageNotAvailable", value: "/eventIcons/pageNotAvailable.png" },
      { label: "pagebreak", value: "/eventIcons/pagebreak.png" },
      {
        label: "productNotForDiscount",
        value: "/eventIcons/productNotForDiscount.png"
      },
      { label: "session-end", value: "/eventIcons/session-end.png" },
      { label: "session-expired", value: "/eventIcons/session-expired.png" },
      { label: "sessionEnded", value: "/eventIcons/sessionEnded.png" },
      {
        label: "shippingInvalidRewardcode",
        value: "/eventIcons/shippingInvalidRewardcode.png"
      },
      { label: "slow", value: "/eventIcons/slow.png" },
      {
        label: "unabletoProcessCard",
        value: "/eventIcons/unabletoProcessCard.png"
      },
      { label: "veryslow", value: "/eventIcons/veryslow.png" },
      { label: "zip-code", value: "/eventIcons/zip-code.png" }
    ];
    this.Icons = "/eventIcons/AddToBagButNoShoppingBag.png";
    this.getusersegmentdata(false);


  }


  closeDialog() {
    this.visible = false;
  }
  deleteEntrysegment(event) {
    if (event == false)
      return;
    console.log('event : ', event, 'selectedIds : ', this.selectedIds);
    this.usersegmentid = this.selectedIds.id;
    if (this.usersegmentid == undefined || this.usersegmentid == "undefined") {
      this.msg = [{ severity: 'error', summary: 'Error', detail: 'Please select row to delete' }];
      this.msgnormal = [];
    }
    else {
      this.deletsegmententry();
    }


  }

  deletsegmententry() {
    const me = this;
    me.UserSegmentService.getBusinessProcessData().subscribe(
      (state: Store.State) => {
        console.log(" state : ", state);
        if (state instanceof HomePageTabLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {
          me.onLoadeddeleteesegment(state);
          return;

        }

        if (state instanceof HomePageTabLoadingErrorState) {
          me.onLoadingError(state);
          return;
        }

      },
      (state: HomePageTabLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoadeddeleteesegment(state: HomePageTabLoadedState) {
    let checkesponse = state.data.data;
    if (checkesponse != null && checkesponse.length > 0) {
      for (var k of checkesponse) {
        if (k.usersegmentid.split(",").indexOf(this.usersegmentid.toString()) > -1) {
          this.msg = [{ severity: 'error', summary: 'Error', detail: 'One or many business process is configured for this User Segment, can not delete. First remove business process configured for this user segment.' }];
          this.msgnormal = [];
          return;
        }
      }
      const me = this;
      me.UserSegmentService.deleteUserSegmentData(this.usersegmentid).subscribe(
        (statedel: Store.State) => {
          if (statedel instanceof HomePageTabLoadedState) {
            {
              me.onLoadeddeleteesegment(statedel);
              this.getusersegmentdata(true);
              this.selectedIds = [];
              if (statedel.data.data) {
                this.msgnormal = [{ severity: 'success', summary: 'Success', detail: 'Deleted Successfully' }];
                this.msg = [];
              }
              return;
            }
          }
        });

    }

    this.usersegmentid = undefined;
    console.log('state.data.data : ', state.data.data);
  }

  updatesegment(row) {
    console.log('updatesegment row ', row);
    this.visible = true;
    this.showFields = true;
    this.userName = row.name;
    this.userDescription = row.eventDescription;
    this.usersegmentid = row.id;
  }

  deleterulessegment(event) {
    console.log('deleterulessegment event : ', event);
    let ruleusersegmentid = event.id;
    this.segmentrowrefreshif = event.usId;
    const me = this;
    me.UserSegmentService.deleteRulessegment(ruleusersegmentid).subscribe(
      (state: Store.State) => {
        console.log(" state : ", state);
        if (state instanceof HomePageTabLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {
          {
            //me.onLoadedrulesdata(state);
            if (state.data.data != null) {
              this.getusersegmentruledata(true);
              this.getusersegmentdata(false);
              this.msgnormal = [{ severity: 'success', summary: 'Success', detail: 'Deleted Successfully' }];
              this.msg = [];
              this.selectedIds = [];
              return;
            }
          }

        }

        if (state instanceof HomePageTabLoadingErrorState) {
          me.onLoadingError(state);
          return;
        }

      },
      (state: HomePageTabLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }
  editrulessegment(event) {
    console.log('editrulessegment event : ', event);
    let ruleupdateid = event.id;
    this.segmentrowrefreshif = event.usId;
    let rulepageidlist = event.rulepageidlist;
    let ruleType = event.ruleType;
    let ruleurl = event.ruleurl;
    let value3 = event.value3;
    let rulecookiename = event.rulecookiename;
    let rulecookievalue = event.rulecookievalue;
    let ruleselector = event.ruleselector;
    let updateright = event.updateright;
    if (this.npage.length == rulepageidlist.length)
      rulepageidlist = "-1";
    let arg1 = "";
    let arg2 = "";
    if (ruleType == "1") {
      if (updateright == false) {
        this.msg = [{ severity: 'error', summary: 'Error', detail: 'Url Not Matched OR Please Test The Url' }];
        this.msgnormal = [];
        return;
      }
    }
    if (rulepageidlist == "" || rulepageidlist == undefined) {
      this.msg = [{ severity: 'error', summary: 'Error', detail: "Please Select Page Name" }];
      this.msgnormal = [];
      return;
    }

    if (ruleType == "1") {
      if (ruleurl == "" || ruleurl == undefined) {
        this.msg = [{ severity: 'error', summary: 'Error', detail: "Please Enter Url" }];
        this.msgnormal = [];
        return;
      }
      arg1 = ruleurl;
      arg2 = "";
    }
    if (ruleType == "0") {
      if (rulecookiename == "" || rulecookiename == undefined) {
        this.msg = [{ severity: 'error', summary: 'Error', detail: "Please Enter cookie name" }];
        this.msgnormal = [];
        return;
      }
      if (rulecookievalue == "" || rulecookievalue == undefined) {
        this.msg = [{ severity: 'error', summary: 'Error', detail: "Please Enter  Cookie Value" }];
        this.msgnormal = [];
        return;
      }
      arg1 = rulecookiename;
      arg2 = rulecookievalue;
    }
    if (ruleType == "2" || ruleType == "3") {
      if (ruleselector == "" || ruleselector == undefined) {
        this.msg = [{ severity: 'error', summary: 'Error', detail: "Please Enter  Selector" }];
        this.msgnormal = [];
        return;
      }

      arg1 = ruleselector;
      arg2 = "";
    }
    let updateruledata = new UserSegmentDataSource(
      ruleType,
      arg1,
      arg2,
      rulepageidlist,
      "",
      "",
      "",
      ruleupdateid
    );
    const me = this;
    me.UserSegmentService.editRulessegment(updateruledata).subscribe(
      (state: Store.State) => {
        console.log(" state : ", state);
        if (state instanceof HomePageTabLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {
          {
            //me.onLoadedrulesdata(state);
            if (state.data.data != null) {
              this.getusersegmentruledata(true);
              this.getusersegmentdata(false);
              this.selectedIds = [];
              return;
            }
          }

        }

        if (state instanceof HomePageTabLoadingErrorState) {
          me.onLoadingError(state);
          return;
        }

      },
      (state: HomePageTabLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }
  addrulessegment(event) {
    console.log('addrulessegment ', event, ' selectedIds :', this.selectedIds);
    const me = this;
    // 112612 : once the row gets unselected before adding rule, this.selectedIds goes null, so taking it from selecteddata
    // taking whatever is set
    this.usersegmentid = event.selecteddata.id || this.selectedIds.id;
    this.segmentrowrefreshif = event.selecteddata.id || this.selectedIds.id;
    let rulepageidlist = event.rulepageidlist;
    let ruleType = event.ruleType;
    let ruleurl = event.ruleurl;
    let value3 = event.value3;
    let rulecookiename = event.rulecookiename;
    let rulecookievalue = event.rulecookievalue;
    let ruleselector = event.ruleselector;
    let updateright = event.updateright;
    if (this.npage.length == rulepageidlist.length)
      rulepageidlist = "-1";
    let arg1 = "";
    let arg2 = "";
    if (ruleType == "1") {
      if (updateright == false) {
        this.msg = [{ severity: 'error', summary: 'Error', detail: "Url Not Matched OR Please Test The Url" }];
        this.msgnormal = [];
        return;
      }
    }
    if (rulepageidlist == "" || rulepageidlist == undefined) {
      this.msg = [{ severity: 'error', summary: 'Error', detail: "Please Select Page Name" }];
      this.msgnormal = [];
      return;
    }

    if (ruleType == "1") {
      if (ruleurl == "" || ruleurl == undefined) {
        this.msg = [{ severity: 'error', summary: 'Error', detail: "Please Select URL" }];
        this.msgnormal = [];
        return;
      }
      arg1 = ruleurl;
      arg2 = "";
    }
    if (ruleType == "0") {
      if (rulecookiename == "" || rulecookiename == undefined) {
        this.msg = [{ severity: 'error', summary: 'Error', detail: "Please Select Cookie Name" }];
        this.msgnormal = [];
        return;
      }
      if (rulecookievalue == "" || rulecookievalue == undefined) {
        this.msg = [{ severity: 'error', summary: 'Error', detail: "Please Select Cookie value" }];
        this.msgnormal = [];
        return;
      }
      arg1 = rulecookiename;
      arg2 = rulecookievalue;
    }
    if (ruleType == "2" || ruleType == "3") {
      if (ruleselector == "" || ruleselector == undefined) {

        this.msg = [{ severity: 'error', summary: 'Error', detail: "Please Select Selector" }];
        this.msgnormal = [];
        return;
      }

      arg1 = ruleselector;
      arg2 = "";
    }
    let addruledata = new UserSegmentDataSource(
      ruleType,
      arg1,
      arg2,
      rulepageidlist,
      "",
      "",
      "",
      this.usersegmentid
    );
    me.UserSegmentService.addnewRulessegment(addruledata).subscribe(
      (state: Store.State) => {
        console.log(" state : ", state);
        if (state instanceof HomePageTabLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {
          {
            //me.onLoadedrulesdata(state);
            if (state.data.data != null) {
              this.getusersegmentruledata(true);
              this.getusersegmentdata(false);
              this.selectedIds = [];
              return;
            }
          }

        }

        if (state instanceof HomePageTabLoadingErrorState) {
          me.onLoadingError(state);
          return;
        }

      },
      (state: HomePageTabLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  getusersegmentruledata(mflag) {
    if (mflag == true) this.MetadataService.refreshMetadata();
    const me = this;
    me.UserSegmentService.getrulesdata().subscribe(
      (state: Store.State) => {
        console.log(" state : ", state);
        if (state instanceof HomePageTabLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {
          me.onLoadedrulesdata(state);
          return;

        }

        if (state instanceof HomePageTabLoadingErrorState) {
          me.onLoadingError(state);
          return;
        }

      },
      (state: HomePageTabLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }
  private onLoadedrulesdata(state: HomePageTabLoadedState) {
    console.log('onLoadedrulesdata state.data.data : ', state.data.data);
  }
  addNewSegment() {
    this.visible = true;
    this.showFields = false;
    this.userName = null;
    this.userDescription = null;

  }
  addsubmitdialog() {
    console.log('this.userName ', this.userName);
    console.log('this.userDescription  ', this.userDescription, " this.Icons:", this.Icons);
    let data = new UserSegmentDataSource(
      "",
      "",
      "",
      "",
      this.Icons,
      this.userName,
      this.userDescription,
      ""
    );
    this.addsegment(data);
    this.visible = false;
    //this.getusersegmentdata(false);

  }
  updatesubmitdialog() {
    console.log('this.userName ', this.userName);
    console.log('this.userDescription  ', this.userDescription, " this.Icons:", this.Icons);
    let data = new UserSegmentDataSource(
      "",
      "",
      "",
      "",
      this.Icons,
      this.userName,
      this.userDescription,
      this.usersegmentid
    );
    this.updatesegmententry(data);
    this.visible = false;
    //this.getusersegmentdata(false);
  }


  updatesegmententry(data) {
    const me = this;
    me.UserSegmentService.updateUserSegmentData(data).subscribe(
      (state: Store.State) => {
        console.log(" state : ", state);
        if (state instanceof HomePageTabLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {
          me.onLoadedupdatesegment(state);
          return;

        }

        if (state instanceof HomePageTabLoadingErrorState) {
          me.onLoadingError(state);
          return;
        }

      },
      (state: HomePageTabLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoadedupdatesegment(state: HomePageTabLoadedState) {

    this.getusersegmentdata(true);
    console.log('state.data.data : ', state.data.data);
  }

  addsegment(data) {
    const me = this;
    me.UserSegmentService.addUserSegmentData(data).subscribe(
      (state: Store.State) => {
        console.log(" state : ", state);
        if (state instanceof HomePageTabLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {
          me.onLoadedaddsegment(state);
          return;

        }

        if (state instanceof HomePageTabLoadingErrorState) {
          me.onLoadingError(state);
          return;
        }

      },
      (state: HomePageTabLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoadedaddsegment(state: HomePageTabLoadedState) {

    this.getusersegmentdata(false);
    console.log('state.data.data : ', state.data.data);
  }

  getusersegmentdata(mflag) {
    if (mflag == true) this.MetadataService.refreshMetadata();
    this.loadPagePerformanceData();
  }

  loadPagePerformanceData() {
    console.log("loadPagePerformanceData method start");
    const me = this;
    //me.graphInTreeService.load(payload).subscribe(
    me.UserSegmentService.LoadUserSegmentData().subscribe(
      (state: Store.State) => {
        console.log(" state : ", state);
        if (state instanceof HomePageTabLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof HomePageTabLoadedState) {
          me.onLoaded(state);
          return;
        }

        if (state instanceof HomePageTabLoadingErrorState) {
          me.onLoadingError(state);
          return;
        }

      },
      (state: HomePageTabLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  private onLoading(state: HomePageTabLoadingState) {
    console.log("state HomePageTabLoadingState : ", state);
    const me = this;
    me.data = null;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: HomePageTabLoadingErrorState) {
    console.log("HomePageTabLoadingErrorState state : ", state);
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: HomePageTabLoadedState) {
    const me = this;
    me.data = USER_SEGMENT_TABLE;
    for (var i of state.data.data) {
      i["rulelength"] = i.rules.length;
      i["icons"] = i.icons;
    }
    me.data.data = state.data.data;
    if (this.segmentrowrefreshif != "" || this.segmentrowrefreshif != undefined) {
      console.log('getusersegmentdata this.segmentrowrefreshif : ', this.segmentrowrefreshif);
      for (var i of state.data.data) {
        if (this.segmentrowrefreshif == i.id) {
          this.rulestabledata = i.rules;
        }
      }
      //this.rulestabledata = state.data.data.rules[this.segmentrowrefreshif];
    }
    console.log('state.data.data : ', state.data.data, ' this.rulestabledata: ', this.rulestabledata);
  }

  @Input() get selectedColumns(): UserSegsmentDataHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }
  set selectedColumns(val: UserSegsmentDataHeaderCols[]) {
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
  addNewRules(row) {
    console.log('newrules', row);
  }
  openRulestable(rulesdata) {
    //this.router.navigate(['user-segment/rule']);
    this.ruleenableflag = true;
    this.rulestabledata = rulesdata;
    console.log("ruleenableflag : ", this.ruleenableflag);
  }

  handleRowSelection($event) {
    console.log('handleRowSelection selectedIds - ' + $event.data);
    this.selectedIds = $event.data;
  }
}
