import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {  NVPreLoadedState, NVPreLoadingErrorState, NVPreLoadingState } from '../../../../home-sessions/common/service/nvhttp.service';
import { HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ScrollMapService extends Store.AbstractService {
    constructor() {
        super();
    }
    LoadScrollMapData(args) : Observable<Store.State>{
        console.log("LoadScrollMapData called : ", args);
        let path  = environment.api.netvision.scrollmap.endpoint;
        let base  = environment.api.netvision.base.base;
        let access_token = "563e412ab7f5a282c15ae5de1732bfd1";
        const me = this;
        const output = new Subject<Store.State>();
        setTimeout(() => {
            output.next(new NVPreLoadingState());
        }, 0);
        path = path + "?startTime=" + args.starttime + "&endTime=" + args.endtime + "&currentPage=" + args.currentpage +"&strOperName=scrollmap" +"&type=" +args.deviceType + "&channel=" +args.channelid + "&usersegmentid="+ args.userSegment+"&access_token=563e412ab7f5a282c15ae5de1732bfd1";
        me.controller.get(path,null,base).subscribe((data: any) =>{
            console.log(data);
            output.next(new NVPreLoadedState(data));
            output.complete();
        }, (e: any) =>{
            output.error(new NVPreLoadingErrorState(e));
            output.complete();
            me.logger.error('loading failed', e);
        });
        return output;
    }

}
