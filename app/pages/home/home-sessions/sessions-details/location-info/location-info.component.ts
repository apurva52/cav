import { Component, OnInit } from '@angular/core';
import { LocationInfoService } from './service/location-info.service';
import { Store } from 'src/app/core/store/store';
import { AppError } from 'src/app/core/error/error.model';
import {
  LocationInfoLoadedState, LocationInfoLoadingErrorState, LocationInfoLoadingState
} from './service/location-info-state';
import { Session } from '../../common/interfaces/session';
import { ActivatedRoute } from '@angular/router';
import { DataManager } from '../../common/datamanager/datamanager';
import { SessionStateService } from '../../session-state.service';


@Component({
  selector: 'app-location-info',
  templateUrl: './location-info.component.html',
  styleUrls: ['./location-info.component.scss']
})
export class LocationInfoComponent implements OnInit {
  data: any;
  error: AppError;
  loading: boolean;
  key: any[];
  keyvalue: any[];
  empty: boolean;
  selectedSession: Session;
  showdata: boolean = false;
  constructor(private locationinfoservice: LocationInfoService, private route: ActivatedRoute, private stateService: SessionStateService) {

  }

  ngOnInit(): void {
    let me = this;
    this.route.queryParams.subscribe(params => {
      // TODO: 
    });

    me.stateService.onSessionChange().subscribe((idx: number) => {
      console.log('location-info, session change - ', idx);

      me.reload();
    });

    me.reload();

  }

  reload() {
    const me = this;

    me.selectedSession = me.stateService.getSelectedSession();
  
    me.data = me.selectedSession.ff3;
    if (me.data == null)
      me.empty = true;
    if (me.data != null && me.data != undefined)
    {
    me.showdata = true;
    me.data = JSON.parse(unescape(me.selectedSession.ff3)).linfo
    me.keyvalue = Object.values(me.data)
    me.key = Object.keys(me.data)
    }
    console.log(" --- ", this.selectedSession);
  }



}
