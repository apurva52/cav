import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UxService {
  private _appConfig: any;

  public get appConfig(): any {
    return this._appConfig;
  }
  public set appConfig(value: any) {
    this._appConfig = value;
  }

  constructor() { }
}
