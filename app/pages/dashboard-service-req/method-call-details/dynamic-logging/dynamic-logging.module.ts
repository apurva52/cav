import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicLoggingComponent } from './dynamic-logging.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { AccordionModule, ButtonModule, CardModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, OrderListModule, OverlayPanelModule, SlideMenuModule, TableModule, TabViewModule, ToastModule, TooltipModule, TreeTableModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { WidgetMenuModule } from 'src/app/shared/dashboard/widget/widget-menu/widget-menu.module';
import { AceEditorModule } from 'ngx-ace-editor-wrapper';

const components = [
  DynamicLoggingComponent
];

const imports = [
  TabViewModule,
  ButtonModule,
  CommonModule,
  AppMessageModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  FormsModule,
  AccordionModule,
  WidgetMenuModule,
  MenuModule,
  CardModule,
  OrderListModule,
  AceEditorModule
];

@NgModule({
  declarations: [components],
  imports: [ imports, ],
  exports: [components]
})

export class DynamicLoggingModule { }
