export class Event {
  id: number;
  name: string;
  icon: string;
  description: string;  
  count:number; // for instances
  sid : any;
  pageinstance : any;
  pageid : any;
  iconCls : string =null ;
  constructor(dbrecord: any)
  {
    this.id = dbrecord.id;
    this.name = dbrecord.name;
    this.icon = dbrecord.icon;
    this.description = dbrecord.description || "-";
    this.count = 2;
    this.sid = dbrecord.sid;
    this.pageinstance = dbrecord.pageinstance;
    this.pageid = dbrecord.pageid;
    if(eventIcons[this.icon])
      this.iconCls = eventIcons[this.icon];
  }
}

let eventIcons = {
  "/eventIcons/AddToBagButNoShoppingBag.png" : 'las-shopping-cart-solid ',
  "/eventIcons/AddToBagMaximumAmountExceeded.png" : 'las-luggage-cart-solid',
  "/eventIcons/AddToBagValidationErrors.png" : 'las-cart-arrow-down-solid ',
  "/eventIcons/CheckoutInvalidRewardSerialNumber.png" : null,
  "/eventIcons/CouponExpired.png" : 'las-tag-solid',
  "/eventIcons/clickeve.png" : 'icons8 icons8-cursor',
  "/eventIcons/Feedback.png" : 'cav user-feedback',
  "/eventIcons/HighPageResponse.png" : 'las-file-invoice-solid',
  "/eventIcons/ImageNotAvailable.png" : null,
  "/eventIcons/InvalidCoupon.png"  : null,
  "/eventIcons/InvalidRewardSerialNumber.png"  : null,
  "/eventIcons/InvalidRewardcode.png"  : null,
  "/eventIcons/Invalidmailpassword.png"  : 'las-user-times-solid',
  "/eventIcons/Invalidpromocode.png"  : null,
  "/eventIcons/ItemNotForInternationalShipping.png"  : null,
  "/eventIcons/LongDurationSession.png"  : 'icons8 icons8-clock',
  "/eventIcons/Loop.png"  : 'las-sync-solid', //cav page-performance-overview
  "/eventIcons/MediaMismatch.png"  : null,
  "/eventIcons/MissingProductCopy.png"  : null,
  "/eventIcons/MobileInvalidCardNumber.png"  : null,
  "/eventIcons/MobileInvalidVerificationNumber.png"  : null,
  "/eventIcons/MobilePromoCodeError.png"  : null,
  "/eventIcons/SessionPageFail.png"  : 'icons8 icons8-important-file',
  "/eventIcons/ShoppingBagButNoCheckout.png"  : null,
  "/eventIcons/Surcharge.png"  : null,
  "/eventIcons/TBDforEstimatedShipping.png"  : null,
  "/eventIcons/TBDforEstimatedTax.png"  : null,
  "/eventIcons/TBDforTotalOrder.png"  : null,
  "/eventIcons/addressFor.png"  : null,
  "/eventIcons/blankPage.png"  : null,
  "/eventIcons/default.png"  : null,
  "/eventIcons/email_invalid.png"  : null,
  "/eventIcons/erro404.png"  : null,
  "/eventIcons/exception.png"  : 'icons8 icons8-error',
  "/eventIcons/highshippingcharge.png"  : null,
  "/eventIcons/jserror.png"  : 'cav js-errors',
  "/eventIcons/lowshippingcharge.png"  : null,
  "/eventIcons/nextPageNotAvailable.png"  : null,
  "/eventIcons/noProductFound.png"  : null,
  "/eventIcons/outofstock.png"  : null,
  "/eventIcons/pageFreeze.png"  : null,
  "/eventIcons/pageNotAvailable.png"  : null,
  "/eventIcons/pagebreak.png"  : 'icons8 icons8-business-report',
  "/eventIcons/productNotForDiscount.png"  : null,
  "/eventIcons/session-end.png"  : null,
  "/eventIcons/session-expired.png"  : null,
  "/eventIcons/sessionEnded.png"  : null,
  "/eventIcons/shippingInvalidRewardcode.png"  : null,
  "/eventIcons/slow.png"  : 'las-hourglass-end-solid',
  "/eventIcons/unabletoProcessCard.png"  : null,
  "/eventIcons/veryslow.png"  : 'las-hourglass',
  "/eventIcons/zip-code.png" : null
}
