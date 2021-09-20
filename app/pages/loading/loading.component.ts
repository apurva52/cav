import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoadingComponent implements OnInit {

  constructor(private sesstionService: SessionService) { }

  ngOnInit(): void {
    const me = this;
    if(me.sesstionService.copyLinkParam && me.sesstionService.copyLinkParam.requestFrom === 'CopyLink' ){
      console.log("loggedin call");
      const rawCreds = {
        username : "guest", 
        password : null,
        productKey: null,
        requestFrom: "CopyLink"
      }
      me.sesstionService.login(rawCreds).subscribe(() => {
        me.sesstionService.redirectToPostLoginPage();
      });
    }
    if(me.sesstionService.ddrParam && (me.sesstionService.ddrParam.requestFrom === 'DDRA9' || me.sesstionService.ddrParam.requestFrom === 'DDR') ){
      console.log("loggedin call DDR");
      const rawCreds = {
        username : "guest", 
        password : null,
        productKey: null,
        requestFrom: "CopyLink"
      }
      me.sesstionService.login(rawCreds).subscribe(() => {
        me.sesstionService.redirectToPostLoginDDRPage();
      });
    }
  }

}
