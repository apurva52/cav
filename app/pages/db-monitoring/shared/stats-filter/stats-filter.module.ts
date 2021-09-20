import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule, CardModule, TabViewModule, TabMenuModule, ButtonModule, InputSwitchModule, AccordionModule, SlideMenuModule, MessageModule, MenuModule, OrderListModule, SidebarModule, RadioButtonModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { StatsFilterComponent } from './stats-filter.component';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

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
  RadioButtonModule,
  PipeModule
];

const components = [
  StatsFilterComponent
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

export class StatsFilterModule { }
