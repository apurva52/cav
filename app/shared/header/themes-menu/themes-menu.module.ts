import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemesMenuComponent } from './themes-menu.component';
import { OverlayPanelModule, ButtonModule, TooltipModule, TieredMenuModule, DialogModule, InputTextModule } from 'primeng';
import { DownloadFileModule } from '../../download-file/download-file.module';
import { GitConfigurationModule } from 'src/app/pages/tools/admin/git-configuration/git-configuration.module';
import { LDAPServerSettingModule } from 'src/app/pages/tools/admin/ldap-server-setting/ldap-server-setting.module';
import { SecondLevelAuthorizationModule } from 'src/app/pages/tools/admin/second-level-authorization/second-level-authorization.module';


const imports = [
  CommonModule,
  ButtonModule,
  DialogModule,
  InputTextModule,
  OverlayPanelModule,
  ButtonModule,
  TooltipModule,
  TieredMenuModule,
  DownloadFileModule,
  DialogModule,
  GitConfigurationModule,
  LDAPServerSettingModule,
  SecondLevelAuthorizationModule
];

const components = [
  ThemesMenuComponent
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [
    components
  ]
})


export class ThemesMenuModule { }
