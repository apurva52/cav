import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Store } from 'src/app/core/store/store';
import { environment } from 'src/environments/environment';
import { SaveSearchLoadedState, SaveSearchLoadingErrorState, SaveSearchLoadingState } from './save-dialog.state';


@Injectable({
    providedIn: 'root'
})
export class SaveDialogService extends Store.AbstractService {

    constructor() {
        super()
    }

    saveDialogData(saveValue): Observable<Store.State> {
        const output = new Subject<Store.State>();
        let payload = saveValue;
        setTimeout(() => {
            output.next(new SaveSearchLoadingState());
        }, 0);

        const path = environment.api.logs.initialsettings.endpoint;
        Object.assign(payload,{"requestType":"save_object"})

        this.controller.post(path,payload).subscribe((data)=>{
            console.log(data)
            output.next(new SaveSearchLoadedState(data));
            output.complete();
            },
            (e: any) => {
            output.error(new SaveSearchLoadingErrorState(e));
            output.complete();
            this.logger.error('loading failed', e);
            });
        return output;
    }


    saveExistData(existData): Observable<Store.State> {
        const output = new Subject<Store.State>();
        let payload = existData;
        setTimeout(() => {
            output.next(new SaveSearchLoadingState());
        }, 0);

        const path = environment.api.logs.initialsettings.endpoint;
        Object.assign(payload,{"requestType":"save_exist_object"})
            console.log('version conflict');
            this.controller.post(path,payload).subscribe((data)=>{
                output.next(new SaveSearchLoadedState(data));
                output.complete();
            },
                (e: any) => {
                    output.error(new SaveSearchLoadingErrorState(e));
                    output.complete();
                    this.logger.error('loading failed', e);
                });
            return output;
        
    }
}