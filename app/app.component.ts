import { Component, Injector } from '@angular/core';
import { InjectorResolver } from './core/injector/injector.service';
import { SessionService } from './core/session/session.service';
import * as moment from 'moment-timezone';

export let AppInjector: Injector;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  static i: AppComponent;
  
  private static attributeTVMode = 'tv-mode';

  private _isTVMode: boolean;

  private sessionService: SessionService;

  get tvMode(): boolean {
    return this._isTVMode;
  }

  set tvMode(v: boolean) {
    this._isTVMode = v;

    if (this._isTVMode) {
      document.body.setAttribute(AppComponent.attributeTVMode, '');
    } else {
      document.body.removeAttribute(AppComponent.attributeTVMode);
    }
    this.sessionService.setSetting('TV_MODE', this._isTVMode);
  }

  constructor(injector: Injector) {
    const me = this;
    AppComponent.i = me;
    InjectorResolver.construct(injector);


    window['moment'] = moment;

    setTimeout(() => {
      me.sessionService = InjectorResolver.get(SessionService);
      me.tvMode = me.sessionService.getSetting('TV_MODE', false);
    });

  }

  toggleTVMode() {
    const me = this;
    this.tvMode = !this.tvMode;
  }

}
