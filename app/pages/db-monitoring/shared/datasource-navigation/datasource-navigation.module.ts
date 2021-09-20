import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule, CardModule, TabViewModule, TabMenuModule, ButtonModule, InputSwitchModule, AccordionModule, SlideMenuModule, MessageModule, MenuModule, OrderListModule, SidebarModule, TieredMenuModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { DatasourceNavigationComponent } from './datasource-navigation.component';

const imports = [
  CommonModule,
  HeaderModule,
  ToolbarModule,
  CardModule,
  TabViewModule,
  TabMenuModule, 
  ButtonModule,
  FormsModule,
  InputSwitchModule,
  AccordionModule,
  SlideMenuModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  MessageModule,
  MenuModule,
  OrderListModule,
  SidebarModule,
  TieredMenuModule
];

const components = [
  DatasourceNavigationComponent
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

export class DatasourceNavigationModule { }
