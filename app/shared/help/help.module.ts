import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule, TableModule } from 'primeng';
import {SidebarModule} from 'primeng/sidebar';
import { HelpComponent } from './help.component';

const imports =[
  SidebarModule,
  CommonModule,
DialogModule,
TableModule
]

const components = [HelpComponent];
@NgModule({
  declarations: [components],
imports: [imports],
exports: [components],
})

export class HelpModule { }
