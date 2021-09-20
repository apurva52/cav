import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'primeng';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { ADD_NEW_EVENTS_DATA } from './service/add-new-event.dummy';
import { AddNewEventsData } from './service/add-new-event.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-events-crud',
  templateUrl: './events-crud.component.html',
  styleUrls: ['./events-crud.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventsCrudComponent extends PageDialogComponent
  implements OnInit {
  @Output() popupData: EventEmitter<any>;
  @Output() adddata: EventEmitter<any>;
  data: AddNewEventsData[];
  showFields: boolean;
  // name: string;
  // desc: string;
  // goal: number;
  items: SelectItem[];
  iconsForEvent: any;
  strugglingUserEvent: any;
  strugglingUserItems: SelectItem[];
  base: any;
  //popupData :any; 
  id: any;
  //taken
  updatedescription: any;
  updateStrugglingEvent: any;
  updatename: any;
  updategoal: any;
  updateIcons: any;
  description: any;
  name: any;
  goal: any;
  StrugglingEvent: any;
  Icons: any;
  constructor() {
    super();
    this.popupData = new EventEmitter();
    this.adddata = new EventEmitter();
  }

  ngOnInit(): void {
    const me = this;
    me.base = environment.api.netvision.base.base;
    me.data = ADD_NEW_EVENTS_DATA;


    (me.items = [
      { label: 'AddToBagButNoShoppingBag', value: "/eventIcons/AddToBagButNoShoppingBag.png" },
      { label: 'AddToBagMaximumAmountExceeded', value: "/eventIcons/AddToBagMaximumAmountExceeded.png" },
      { label: 'AddToBagValidationErrors', value: "/eventIcons/AddToBagValidationErrors.png" },
      { label: 'CheckoutInvalidRewardSerialNumber', value: "/eventIcons/CheckoutInvalidRewardSerialNumber.png" },
      { label: 'CouponExpired', value: "/eventIcons/CouponExpired.png" },
      // { label: 'ClickEvent', value: "/eventIcons/clickeve.png" },
      { label: 'Feedback', value: "/eventIcons/Feedback.png" },
      { label: 'HighPageResponse', value: "/eventIcons/HighPageResponse.png" },
      { label: 'ImageNotAvailable', value: "/eventIcons/ImageNotAvailable.png" },
      { label: 'InvalidCoupon', value: "/eventIcons/InvalidCoupon.png" },
      { label: 'InvalidRewardSerialNumber', value: "/eventIcons/InvalidRewardSerialNumber.png" },
      { label: 'InvalidRewardcode', value: "/eventIcons/InvalidRewardcode.png" },
      { label: 'Invalidmailpassword', value: "/eventIcons/Invalidmailpassword.png" },
      { label: 'Invalidpromocode', value: "/eventIcons/Invalidpromocode.png" },
      { label: 'ItemNotForInternationalShipping', value: "/eventIcons/ItemNotForInternationalShipping.png" },
      { label: 'LongDurationSession', value: "/eventIcons/LongDurationSession.png" },
      { label: 'Loop', value: "/eventIcons/Loop.png" },
      { label: 'MediaMismatch', value: "/eventIcons/MediaMismatch.png" },
      { label: 'MissingProductCopy', value: "/eventIcons/MissingProductCopy.png" },
      { label: 'MobileInvalidCardNumber', value: "/eventIcons/MobileInvalidCardNumber.png" },
      { label: 'MobileInvalidVerificationNumber', value: "/eventIcons/MobileInvalidVerificationNumber.png" },
      { label: 'MobilePromoCodeError', value: "/eventIcons/MobilePromoCodeError.png" },
      { label: 'SessionPageFail', value: "/eventIcons/SessionPageFail.png" },
      { label: 'ShoppingBagButNoCheckout', value: "/eventIcons/ShoppingBagButNoCheckout.png" },
      { label: 'Surcharge', value: "/eventIcons/Surcharge.png" },
      { label: 'TBDforEstimatedShipping', value: "/eventIcons/TBDforEstimatedShipping.png" },
      { label: 'TBDforEstimatedTax', value: "/eventIcons/TBDforEstimatedTax.png" },
      { label: 'TBDforTotalOrder', value: "/eventIcons/TBDforTotalOrder.png" },
      { label: 'addressFor', value: "/eventIcons/addressFor.png" },
      { label: 'blankPage', value: "/eventIcons/blankPage.png" },
      { label: 'default', value: "/eventIcons/default.png" },
      { label: 'email_invalid', value: "/eventIcons/email_invalid.png" },
      { label: 'erro404', value: "/eventIcons/erro404.png" },
      { label: 'exception', value: "/eventIcons/exception.png" },
      { label: 'highshippingcharge', value: "/eventIcons/highshippingcharge.png" },
      { label: 'jserror', value: "/eventIcons/jserror.png" },
      { label: 'lowshippingcharge', value: "/eventIcons/lowshippingcharge.png" },
      { label: 'nextPageNotAvailable', value: "/eventIcons/nextPageNotAvailable.png" },
      { label: 'noProductFound', value: "/eventIcons/noProductFound.png" },
      { label: 'outofstock', value: "/eventIcons/outofstock.png" },
      { label: 'pageFreeze', value: "/eventIcons/pageFreeze.png" },
      { label: 'pageNotAvailable', value: "/eventIcons/pageNotAvailable.png" },
      { label: 'pagebreak', value: "/eventIcons/pagebreak.png" },
      { label: 'productNotForDiscount', value: "/eventIcons/productNotForDiscount.png" },
      { label: 'session-end', value: "/eventIcons/session-end.png" },
      { label: 'session-expired', value: "/eventIcons/session-expired.png" },
      { label: 'sessionEnded', value: "/eventIcons/sessionEnded.png" },
      { label: 'shippingInvalidRewardcode', value: "/eventIcons/shippingInvalidRewardcode.png" },
      { label: 'slow', value: "/eventIcons/slow.png" },
      { label: 'unabletoProcessCard', value: "/eventIcons/unabletoProcessCard.png" },
      { label: 'veryslow', value: "/eventIcons/veryslow.png" },
      { label: 'zip-code', value: "/eventIcons/zip-code.png" }
    ]),



      (me.strugglingUserItems = [{ label: 'Yes', value: '1' },
      { label: 'No', value: '0' }]);

  }

  showDialog(row, isShowFields) {
    super.show();
    if (row) {
      console.log("+++++++row data++++++", row)
      this.id = row.mask;
      this.updatename = row.name;
      this.updatedescription = row.eventDescription;
      this.updategoal = row.goal;
      this.updateStrugglingEvent = row.strugglingEvent;
      this.updateIcons = row.icons;
    }
    else {
      this.name = null;
      this.description = null;
      this.goal = "3";
      this.StrugglingEvent = "1";
      //  this.goal = null; 
      //this.goal = null; 
      //this.StrugglingEvent = "1"; 
      this.Icons = 'Loop';
    }
    this.showFields = isShowFields;
  }

  open() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }

  eventDataObj: any = {};

  saveEvent() {
    this.eventDataObj = {
      //'Icons' :this.Icons,
      // 'name' :this.name,
      // 'description':this.description,
      // 'goal':this.goal,
      // 'StrugglingEvent':this.StrugglingEvent,

      'id': this.id,
      'updatedescription': this.updatedescription,
      'updateStrugglingEvent': this.updateStrugglingEvent,
      'updatename': this.updatename,
      'updategoal': this.updategoal,
      'updateIcons': this.updateIcons

    }
    this.popupData.emit(this.eventDataObj);
    this.visible = false;
  }
  addDataObj: any = {};
  addEvent() {
    this.addDataObj = {
      'Icons': this.Icons,
      'name': this.name,
      'description': this.description,
      'goal': this.goal,
      'StrugglingEvent': this.StrugglingEvent,
    }
    this.adddata.emit(this.addDataObj);

    this.visible = false;
  }


}
