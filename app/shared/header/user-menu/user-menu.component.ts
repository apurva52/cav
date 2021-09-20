import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SessionService } from 'src/app/core/session/session.service';
import { Store } from 'src/app/core/store/store';
import { ConfigSetting } from 'src/app/pages/tools/configuration/configuration-settings/services/configuration-settings.model';
import { ConfigurationSettingService } from 'src/app/pages/tools/configuration/configuration-settings/services/configuration-settings.services';
import { ConfigSettingLoadedState, ConfigSettingLoadingErrorState, ConfigSettingLoadingState } from 'src/app/pages/tools/configuration/configuration-settings/services/configuration-settings.state';
import { UserMenuOption } from './service/user-options.model';
import { OptionsService } from './service/user-options.service';
import { UserMenuOptionLoadedState, UserMenuOptionLoadingErrorState, UserMenuOptionLoadingState } from './service/user-options.state';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserMenuComponent implements OnInit, AfterViewChecked {
  data: UserMenuOption[];
  error: boolean;
  empty: boolean;
  loading: boolean;
  userName: string;
  emailId: string;
  configData: ConfigSetting[];

  @ViewChild('slideMenu', { read: ElementRef }) slideMenu: ElementRef;
  capability: any;

  constructor(private userOptionsService: OptionsService, public sessionService: SessionService, private configSettings: ConfigurationSettingService) { }

  ngOnInit(): void {
    const me = this;
    me.userName = me.sessionService.session.cctx.u;
    if(me.userName)
     me.emailId = me.userName + '@cavisson.com';
     me.capability = me.sessionService.session.capabilityList;
    me.load();
  }


  ngAfterViewChecked(): void {
    const me = this;
    const slideMenuList = me.slideMenu.nativeElement.getElementsByClassName(
      'ui-slidemenu'
    );

    if (slideMenuList.length) {
      slideMenuList[0].style.opacity = '1';
    }

  }

  load() {
    const me = this;

    me.userOptionsService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof UserMenuOptionLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof UserMenuOptionLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: UserMenuOptionLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );

    if(!me.sessionService.dashboardConfigSettingData) {
      me.configSettings.load().subscribe(
        (state: Store.State) => {
          if(state instanceof ConfigSettingLoadingState){
            me.onLoadingConfigSetting(state);
            return;
          }
          else if(state instanceof ConfigSettingLoadedState){
            me.onLoadedConfigSetting(state);
            return;
          }
        },
        (state: ConfigSettingLoadingErrorState) => {
          me.onLoadingErrorConfigSetting(state);
        }
      );
    }

  }

  private onLoadingConfigSetting(state: ConfigSettingLoadingState) {

  }

  private onLoadingErrorConfigSetting(state: ConfigSettingLoadingErrorState) {

  }

  private onLoadedConfigSetting(state: ConfigSettingLoadedState){
    const me = this;
    me.configData = {...state.data};
    if(me.configData) {
      me.sessionService.dashboardConfigSettingData = {...me.configData};
    }
  }

  private onLoading(state: UserMenuOptionLoadingState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: UserMenuOptionLoadingErrorState) {
    const me = this;
    me.data = null;
    me.empty = false;
    me.error = true;
    me.loading = true;
  }

  private onLoaded(state: UserMenuOptionLoadedState) {
    const me = this;
    me.data = state.data;
    me.empty = !me.data.length;
    me.error = false;
    me.loading = false;
  }
}
