import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { AppComponent } from 'src/app/app.component';
import { SessionService } from 'src/app/core/session/session.service';
import { TimebarService } from '../time-bar/service/time-bar.service';
import { TimebarValue } from '../time-bar/service/time-bar.model';
import { LoginPayload } from 'src/app/core/session/session.model';
import { MessageService } from 'primeng';
import { Subscription } from 'rxjs';
import { AlertCapabilityService } from 'src/app/pages/my-library/service/alert-capability.service';
declare var $:any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {

  get isTVMode(): boolean {
    return AppComponent.i.tvMode;
  }

  timebarValue: TimebarValue;
  dcData: any = null;
  data : Subscription
  firstTimeLogin : boolean = true;
  showMore: boolean = false;
  tvModeTitle = "TV Mode";
  constructor(public sessionService: SessionService, private timebarService: TimebarService,
    public alertCapability: AlertCapabilityService,
    private messageService: MessageService) {
  }


  ngOnInit(): void {
    const me = this;
    me.sessionService.updateCapabilityOnLogIn();
    
    me.timebarService.events.onChange.subscribe(() => {
      me.timebarValue = me.timebarService.getValue();
    });

    if(me.sessionService.preSession.multiDc) {
      me.dcData =  me.sessionService.preSession.dcData;
      me.firstTimeLogin = true;
      me.showNodeHeathPopup();
    }

    setTimeout(() => {
      let tvMode = AppComponent.i.tvMode;
      if(tvMode) {
        this.tvModeTitle = "Monitor Mode";
      }else {
        this.tvModeTitle = "TV Mode";
      }
   }, 10);

    // this code for when page scroll close dropdown, menu, calender etc but some place giving a issue so comment this query
    // approved by Amit sharma

    // $(document).ready(function() {
    //   $('div').scroll(function(){
    //       if ($(this).scrollTop() > 50) {
    //          $('.ng-trigger-overlayAnimation').fadeOut();
    //          $('body').click();
    //       } else  {
    //       }
    //   });
    // });


  }

  ngOnDestroy() {
    if(this.data)
    this.data.unsubscribe();
  }

  showNodeHeathPopup() {
    const me = this;
    try {
      me.data = this.sessionService._nodeHealthProvider$.subscribe(
        result => {

          if(me.firstTimeLogin) {
            let msg = "";
            setTimeout(() => {
               msg = me.msgForNodeHeathStatusForFirstTime(result);
               this.messageService.clear();
               if(msg !== "") {
                 this.messageService.add({ key: 'tomcat_up_down', summary: 'Node Health Info', detail: msg, life: 3000 });
               }
               me.firstTimeLogin = false;
               this.dcData = result;
            }, 100);
          }else {

              let msg = "";
              setTimeout(() => {
                 msg = me.msgForNodeHealth(result);
                 this.messageService.clear();
                 if(msg !== "") {
                   this.messageService.add({ key: 'tomcat_up_down', summary: 'Node Health Info', detail: msg, life: 3000 });
                 }
                 this.dcData = result;
              }, 100);

          }

        },
        error => {
          console.log('error in getting data ', error);
          me.data.unsubscribe();
        },
        () => {
          me.data.unsubscribe();
          setTimeout(() => {
            this.messageService.clear();
          }, 0);
        }
      );

        setTimeout(() => {
          this.messageService.clear();
        }, 0);



    } catch (error) {
      console.error('error in getting subscription');
    }
  }

  msgForNodeHeathStatusForFirstTime(data){
    let msg = "";
    let dcDown = "";
    for(let dc in data){
      if(data[dc]['status'] == 'DOWN'){
        if(dcDown == "") {
          dcDown = data[dc]['name'];
        }else {
          dcDown = dcDown + ", " + data[dc]['name'];
        }
      }

    }

    if(dcDown !== "") {
      if(dcDown.indexOf(",") > -1) {
        msg = "Node " + dcDown + " are down";
      }else {
        msg = "Node " + dcDown + " is down";
      }
    }
    return msg;
    }


  msgForNodeHealth(response){
    let dcDown = "";
        let dcUp = ""

    this.dcData.forEach(data => {
      response.forEach(dcInfo => {
        if ((data.name == dcInfo.name) && data.status !== dcInfo.status) {
          if (dcInfo.status == "DOWN") {
            if (dcDown === "") {
              dcDown = dcInfo.name;
            } else {
              dcDown = dcDown + "," + dcInfo.name;
            }
          } else {
            if (dcUp === "") {
              dcUp = dcInfo.name;
            } else {
              dcUp = dcUp + "," + dcInfo.name;
            }
          }
        }

      });
    });

    var msg = "";
        if (dcUp !== "") {
          if (dcUp.indexOf(",") !== -1) {
            msg = msg + "Node " + dcUp + " are up now";
          } else {
            msg = msg + "Node " + dcUp + " is up now";
          }
        }

        if (dcDown !== "") {
          if (msg == "") {
            if (dcDown.indexOf(",") !== -1) {
              msg = msg + "Node " + dcDown + " are down now";
            } else {
              msg = msg + "Node " + dcDown + " is down now";
            }
          } else {

            if (msg.indexOf("now") !== -1) {
              msg = msg.substr(0, msg.indexOf("now") - 1);
            }

            if (dcDown.indexOf(",") !== -1) {
              msg = msg + " and " + "Node " + dcDown + " are down now";
            } else {
              msg = msg + " and " + "Node " + dcDown + " is down now";
            }
          }
        }
return msg;
  }

  toggleTVMode() {
    AppComponent.i.toggleTVMode();
    setTimeout(() => {
      let tvMode = AppComponent.i.tvMode;
      if(tvMode) {
        this.tvModeTitle = "Monitor Mode";
      }else {
        this.tvModeTitle = "TV Mode";
      }
   }, 10);


  }

  hasLegacyUIURL(): boolean {
    const me = this;
    const url: string = _.get(me.sessionService, 'preSession.legacyUIURL', '').trim();
    return !!url.length;
  }

  getLegacyUIURL(): string {
    const me = this;

    if(!me.hasLegacyUIURL()) {
      return '';
    }

    //const base = new URL(me.sessionService.preSession.legacyUIURL);
    //const base = new URL(window.location.protocol+"//"+window.location.host+"/"+me.sessionService.preSession.legacyUIURL);
    const base = new URL(window.location.protocol+"//"+window.location.host+"/"+"ProductUI");
    // base.searchParams.append();
    const ssoParams: LoginPayload = me.sessionService.getSetting('SSO_PARAMS', null);

    if (me.sessionService.isMultiDC) {

      if (me.sessionService.isSSO()) {
        //MULTI DC SSO ?requestFrom=MULTIDCSAML&userName=akash.deep@cavisson.com&oktaGroupList=okta"
        base.searchParams.append('requestFrom', 'MULTIDCSAML');
        base.searchParams.append('userName', me.sessionService.session.cctx.u);
        base.searchParams.append('oktaGroupList', ssoParams.oktagroup);

      } else {
        //MULTI DC ACL ?requestFrom=ProductUI&userName=cavisson"
        base.searchParams.append('requestFrom', 'ProductUI');
        base.searchParams.append('userName', me.sessionService.session.cctx.u);

      }

    } else {

      if (me.sessionService.isSSO() && ssoParams) {
        //SINGLE DC SSO ?requestFrom=SAML&userName=akash.deep@cavisson.com&oktaGroupList=okta"
        base.searchParams.append('requestFrom', 'SAML');
        base.searchParams.append('userName', me.sessionService.session.cctx.u);
        base.searchParams.append('oktaGroupList', ssoParams.oktagroup);

      } else {
        if(me.sessionService.session && me.sessionService.session.cctx){
        //SINGLE DC ACL ?requestFrom=ProductUI&userName=cavisson"
        base.searchParams.append('requestFrom', 'ProductUI');
        base.searchParams.append('userName', me.sessionService.session.cctx.u);
        }
      }

    }

    return base.toString();
  }
}
