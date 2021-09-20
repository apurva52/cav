import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SessionService } from 'src/app/core/session/session.service';
import { Feature } from './welcome-screen.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class WelcomeScreenComponent implements OnInit {

  features: Feature[];

  constructor(private sessionService: SessionService) {
    // An array of Features
    this.features = [
      { label: 'Unified & Enhanced UI', image: 'welcome-1' },
      { label: 'Improved Usability', image: 'welcome-2' },
      { label: 'Global Timebar', image: 'welcome-3' },
      { label: 'Upgraded Color Themes', image: 'welcome-4' },
      { label: 'Favorites Collection', image: 'welcome-5' },
      { label: 'Canvas Mode', image: 'welcome-6' }
    ];
  }

  getLegacyUIURL(): string {
    // return _.get(this.sessionService, 'preSession.legacyUIURL', null);
   // if(this.sessionService.preSession && this.sessionService.preSession.legacyUIURL)
   // return window.location.protocol+"//"+window.location.host+"/"+this.sessionService.preSession.legacyUIURL;
   return window.location.protocol+"//"+window.location.host+"/"+"ProductUI";
  }

  ngOnInit(): void {
  }
}

