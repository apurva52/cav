import { Component, OnInit } from '@angular/core';
import { PayLoadData } from 'src/app/pages/geolocation/service/geolocation.model';
import { DeviceInfoService } from './service/device-info.service';
import { Store } from 'src/app/core/store/store';
import { AppError } from 'src/app/core/error/error.model';
import {
  DeviceInfoLoadedState, DeviceInfoLoadingErrorState, DeviceInfoLoadingState
} from './service/device-info-state';
import { ActivatedRoute } from '@angular/router';
import { Session } from '../../common/interfaces/session';
import { DataManager } from '../../common/datamanager/datamanager';
import { SessionStateService } from '../../session-state.service';


@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.component.html',
  styleUrls: ['./device-info.component.scss']
})
export class DeviceInfoComponent implements OnInit {
  data: any;
  error: AppError;
  loading: boolean;
  key: any[];
  keyvalue: any[];
  empty: boolean;
  selectedSession: Session;
  showdata: boolean = false;
  constructor(private deviceinfoservice: DeviceInfoService, private route: ActivatedRoute, private stateService: SessionStateService) {

  }


  ngOnInit(): void {
    let me = this;
    this.route.queryParams.subscribe(params => {

    });

    me.selectedSession = me.stateService.getSelectedSession();

    me.stateService.onSessionChange().subscribe((idx: number) => {
      console.log('device-info, session change - ', idx);
      me.selectedSession = me.stateService.getSelectedSession();

      me.reload();
    });

    me.reload();
  }

  reload() {
   const me = this; 
   me.data = me.selectedSession.ff3;
   if (me.data == null)
     me.empty = true;
   if (me.data != null && me.data != undefined)
   {
   me.showdata = true;
   me.data = JSON.parse(unescape(me.selectedSession.ff3)).dinfo
   me.keyvalue = Object.values(me.data)
   me.key = Object.keys(me.data)
   }
   console.log(" --- ", this.selectedSession);
  }


}
