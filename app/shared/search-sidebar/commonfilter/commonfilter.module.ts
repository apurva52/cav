import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlideMenuModule, TabViewModule, SliderModule, TooltipModule, AccordionModule, ButtonModule, CheckboxModule, DropdownModule, InputTextModule, MenuModule, MessageModule, RadioButtonModule, SelectButtonModule, SidebarModule, ToolbarModule } from 'primeng';
import { HeaderModule } from '../../header/header.module';
import { FormsModule } from '@angular/forms';
import { CommonfilterComponent } from './commonfilter.component';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from '../../date-time-picker-moment/moment-date-time.module';
import { PipeModule } from '../../pipes/pipes.module';


const imports = [
  CommonModule,
  DropdownModule,
  SidebarModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  SlideMenuModule,
  SliderModule,
  TooltipModule,
  FormsModule,
  AccordionModule,
  RadioButtonModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  MessageModule,
  MenuModule,
  PipeModule,
  SelectButtonModule,
  TabViewModule
];

const components = [
  CommonfilterComponent
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
export class CommonfilterModule { }
