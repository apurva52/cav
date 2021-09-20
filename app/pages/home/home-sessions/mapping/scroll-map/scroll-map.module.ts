import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollMapComponent } from './scroll-map.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, InputTextModule } from 'primeng';
import { MappingConfigurationModule } from '../mapping-configuration/mapping-configuration.module';
import { VideoPlayerModule } from 'src/app/shared/video-player/video-player.module';

const imports = [
  CommonModule,
  InputTextModule,
  ButtonModule,
  MappingConfigurationModule,
  VideoPlayerModule
];

const components = [ScrollMapComponent];

const routes: Routes = [
  {
    path: 'scroll-map',
    component: ScrollMapComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScrollMapModule { }
