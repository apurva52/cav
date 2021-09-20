import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageSidebarComponent } from './page-sidebar.component';
import { SidebarModule } from 'primeng';



@NgModule({
  declarations: [PageSidebarComponent],
  imports: [
    CommonModule,
    SidebarModule
  ]
})
export class PageSidebarModule { }
