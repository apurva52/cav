import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutManagerComponent } from './layout-manager.component';
import { DashboardLayoutManagerService } from './service/layout-manager.service';
import { SidebarModule, InputTextModule, TabViewModule, ButtonModule, CheckboxModule, DropdownModule, MessageModule, RadioButtonModule, ConfirmDialogModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';


@NgModule({
  declarations: [LayoutManagerComponent],
  exports: [LayoutManagerComponent],
  providers: [
    DashboardLayoutManagerService
  ],
  imports: [
    CommonModule,
    SidebarModule,
    InputTextModule,
    TabViewModule,

    ButtonModule,
    CheckboxModule,
    FormsModule,
    DropdownModule,
    MessageModule,
    PipeModule,
    RadioButtonModule,
    ConfirmDialogModule
  ]
})
export class LayoutManagerModule { }
