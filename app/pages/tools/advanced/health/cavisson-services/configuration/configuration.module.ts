import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationComponent } from './configuration.component';
import { SidebarModule, TooltipModule } from 'primeng';
import { RouterModule, Routes } from '@angular/router';


const imports = [
  CommonModule,
  TooltipModule,
  SidebarModule,
];

const components = [ConfigurationComponent];

const routes: Routes = [
  {
    path: 'configuration',
    component: ConfigurationComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})
export class ConfigurationModule { }
