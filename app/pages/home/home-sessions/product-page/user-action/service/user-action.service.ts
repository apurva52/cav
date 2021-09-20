import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Util } from "src/app/pages/home/home-sessions/common/util/util";
import {
    UserActionLoadedState, UserActionLoadingErrorState, UserActionLoadingState
} from './user-action.state';
@Injectable({
  providedIn: 'root'
})

export class UserActionService extends Store.AbstractService {
  
    LoadUserActionTableData(session,sessions): Observable<Store.State> {
        let path = environment.api.netvision.useractions.endpoint;
        let base  = environment.api.netvision.base.base;
        const me = this;
        const output = new Subject<Store.State>();
        output.next(new UserActionLoadingState(null));
        output.next(new UserActionLoadingState(null));
        console.log("session1",session);
        let filters = "?strOperName=getUserActionSession&access_token=563e412ab7f5a282c15ae5de1732bfd1&nvSessionId="+session.sid+"&pageinstance="+session.pageinstance+"&duration="+(Util.FormattedDurationToSec(sessions.duration))+"&eventname=null";
        path = path + filters;
        me.controller.get(path, null, base).subscribe((data1) => {
            console.log( "Data1",data1)
            var r = { data: data1 }
            output.next(new UserActionLoadedState(r));
            output.complete();
        },
            (e: any) => {
                output.error(new UserActionLoadingErrorState(e));


                me.logger.error('User Options loading failed', e);
            }
        );
        return output;
    }

}








    /*LoadUserActionTableData(): Observable<Store.State> {
        //let path = environment.api.nv.pagelist;
        environment.api.core.base = "";
        const me = this;
        var url = "";
        const output = new Subject<Store.State>();
        output.next(new UserActionLoadingState(null));
        me.controller.get('netvision/rest/webapi/nvgetuserActions?strOperName=getUserActionSession&access_token=563e412ab7f5a282c15ae5de1732bfd1&nvSessionId=984647585069268993&pageinstance=1&duration=14&eventname=null','null','/').subscribe((data1 :any) => {
            console.log(data1);
            var r = {data: data1 }
            output.next(new UserActionLoadedState(r));
            output.complete();
        },
            (error) => {
                // output.error(new UserMenuOptionLoadingErrorState(e));
                

                //me.logger.error('User Options loading failed', e);
            }
        );
        return output;
    }

}*/