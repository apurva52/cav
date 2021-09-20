import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaySessionsComponent } from './play-sessions.component';
import { RouterModule, Routes } from '@angular/router';
import { MessageService, CheckboxModule,AccordionModule, BreadcrumbModule, ButtonModule, CardModule, MenuModule, OverlayPanelModule, PanelModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { VideoPlayerModule } from 'src/app/shared/video-player/video-player.module';
import { MapConfigModule } from '../mapping/dialog/map-config/map-config.module';
import {ReplayControlComponent} from './replay-control/replay-control.component'
import {DialogModule} from 'primeng/dialog';
import {RadioButtonModule} from 'primeng/radiobutton';
import {SliderModule} from 'primeng/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ColorPickerModule} from 'primeng/colorpicker';
import {TooltipModule} from 'primeng/tooltip';
import { EventRevenueModule } from '../event-revenue/event-revenue.module';
import { LoaderModule } from '../loader/loader.module';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  CardModule,
  MenuModule,
  AccordionModule,
  PanelModule,
  OverlayPanelModule,
  VideoPlayerModule,
  MapConfigModule,
  DialogModule,
  RadioButtonModule,
  SliderModule,
  FormsModule,
  ReactiveFormsModule,
  ColorPickerModule,
  TooltipModule,
  CheckboxModule,
  EventRevenueModule,
  LoaderModule
];


const components = [
  PlaySessionsComponent,ReplayControlComponent
];

const routes: Routes = [
  {
    path: 'play-sessions',
    component: PlaySessionsComponent,
  }
];


@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class PlaySessionsModule { }
