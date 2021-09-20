import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Metadata } from '../../home-sessions/common/interfaces/metadata';



@Injectable({
    providedIn: 'root'
})

export class FunnelService {
    private _eventCallBack = new Subject<{ key: any, data?: any }>();
    broadcast(key: any, data?: any) {
        this._eventCallBack.next({ key, data });
    }

    on<T>(key: any): Observable<T> {
        return this._eventCallBack.asObservable()
            .pipe(filter(event => event.key === key))
            .pipe(map(event => event.data as T));
    }

    private _metadata: Metadata;
    public get metadata(): Metadata {
        return this._metadata;
    }
    public set metadata(value: Metadata) {
        this._metadata = value;
    }

    private previousUrl: string = undefined;
    private currentUrl: string = undefined;



    constructor(private router: Router) {
        // Handling for state management for Funnel
        // saving the current url for future route references
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.previousUrl = this.currentUrl;
                this.currentUrl = event.url;
                console.log('previous url : ', this.router.url);
                console.log('current url : ', event.url);
            }
        });
    }

    public getPreviousUrl() {
        return this.previousUrl;
    }




}
