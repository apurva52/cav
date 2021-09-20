import { Injectable } from '@angular/core';
import { Store } from 'src/app/core/store/store';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FilterByLoadedState } from 'src/app/shared/dashboard/sidebars/advance-open-merge/service/select-item.state';
import { HttpErrorResponse } from '@angular/common/http';
import { HomePageTabLoadingState,HomePageTabLoadedState,HomePageTabLoadingErrorState } from './device-service.state';
@Injectable({
  providedIn: 'root'
})
export class PageTabService extends Store.AbstractService {
    constructor() {
        super();
    }
    LoadPageTabData(filtercriteria) : Observable<Store.State>{
        let path  = environment.api.netvision.rumdataoverview.endpoint;
        let base  = environment.api.netvision.base.base;
        filtercriteria["Type"]="device";
        let filters = '?filterCriteria='+JSON.stringify(filtercriteria)+'&access_token=563e412ab7f5a282c15ae5de1732bfd1';
        path = path + filters;
        const me = this;
        var url = "";
        const output = new Subject<Store.State>();
        setTimeout(() => {
            output.next(new HomePageTabLoadingState());
        }, 0);
        me.controller.get(path,null,base).subscribe((data: any) =>{
            console.log(data);
            let data1 = {'data':data,'charts':data};
            output.next(new HomePageTabLoadedState(data1));
            output.complete();
        }, (e) =>{
            output.error(new HomePageTabLoadingErrorState(e));
            output.complete();
        });
        return output;
    }
}
