import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EndToEndTierLevelComponent } from './end-to-end-tier-level.component';
import { RouterModule, Routes } from '@angular/router';
import { AutoCompleteModule, BreadcrumbModule, ButtonModule, CarouselModule, CheckboxModule, DropdownModule, InputTextModule, MenuModule, MessageModule, OverlayPanelModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import { TimeBarModule } from 'src/app/shared/time-bar/time-bar.module';

const routes: Routes = [
  {
    path: 'end-to-end-tier-level',
    component: EndToEndTierLevelComponent,
  },
];

const components = [EndToEndTierLevelComponent];

const imports = [
  CommonModule,
  MessageModule,
  FormsModule,
  DropdownModule,
  HeaderModule,
  ToolbarModule,
  BreadcrumbModule,
  OverlayPanelModule,
  CheckboxModule,
  MenuModule,
  ButtonModule,
  InputTextModule,
  CarouselModule,
  AutoCompleteModule,
  TimeBarModule
];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class EndToEndTierLevelModule { }
