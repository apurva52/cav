import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigureMonitorsComponent } from './configure-monitors.component';
import { OracleServerComponent } from './oracle-server/oracle-server.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ButtonModule, DropdownModule, PanelModule, ProgressSpinnerModule, ToolbarModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import {InputTextModule} from 'primeng/inputtext';
import {CarouselModule} from 'primeng/carousel';
const imports = [
  CommonModule,
  HeaderModule,
  ToolbarModule,
  PanelModule,
  DropdownModule,
  ButtonModule,
  FormsModule,
  PipeModule,
  ProgressSpinnerModule,
  InputTextModule,
  CarouselModule
]

const components = [
  ConfigureMonitorsComponent
];
const routes: Routes = [
  {
    path: 'configure-monitors',
    component: ConfigureMonitorsComponent
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
  ],  
})
export class ConfigureMonitorsModule { }
