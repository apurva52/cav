import { Injectable } from '@angular/core';
import { SelectItem } from 'primeng';
import { Subject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Callback, DataPoint, LocalVariable } from '../../common/interfaces/callback';

interface CallBackServiceEvent {
    key: any;
    data?: any;
}

@Injectable({
    providedIn: 'root'
})

export class CallbackDesignerService {

    currentCallback: Callback;

    private _channels: SelectItem[];
    private _profiles: any[];
    private _eventCallBack = new Subject<CallBackServiceEvent>();


    public get channels(): SelectItem[] {
        return this._channels;
    }
    public set channels(value: SelectItem[]) {
        this._channels = value;
    }

    public get profiles(): any[] {
        return this._profiles;
    }
    public set profiles(value: any[]) {
        this._profiles = value;
    }

    public getProfileByChannel(channelId: number): SelectItem[] {
        let profileByChannel = [];
        for (const i of this._profiles) {
            if (i.channelId === channelId) {
                profileByChannel.push({ label: i.name, value: i.name });
            }
        }
        return profileByChannel;
    }


    constructor() { }

    setCallback(cb: Callback) {
        this.currentCallback = cb;

        if (this.currentCallback !== null) {
            this.currentCallback.dirty = false;
        }

        this.broadcast('callbackChanged', this.currentCallback);
    }

    addDataPoint(): DataPoint[] {
        if (this.currentCallback) {
            this.broadcast('addedDataPoint', this.currentCallback.dataPoints);
            return this.currentCallback.dataPoints;
        }
        return [];
    }

    getDataPoint() {
        if (this.currentCallback) {
            return this.currentCallback.dataPoints;
        }
        return [];
    }

    addLocalVar(local: LocalVariable): LocalVariable[] {
        if (this.currentCallback) {
            this.currentCallback.localVariables.push(local);
            this.broadcast('addedLocalVar', this.currentCallback.localVariables);
            return this.currentCallback.localVariables;
        }
        return [];
    }

    getLocalVar() {
        if (this.currentCallback) {
            return this.currentCallback.localVariables;
        }
        return [];
    }

    broadcast(key: any, data?: any) {
        this._eventCallBack.next({ key, data });
    }

    on<T>(key: any): Observable<T> {
        return this._eventCallBack.asObservable()
            .pipe(filter(event => event.key === key))
            .pipe(map(event => event.data as T));
    }
}


