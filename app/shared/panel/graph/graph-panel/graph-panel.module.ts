import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphPanelComponent } from './graph-panel.component';
import { PanelModule, TableModule, CardModule, ButtonModule, ToastModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, AccordionModule, ToolbarModule, MenuModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';



const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,
  AccordionModule,
  PanelModule,
  ToolbarModule,
  MenuModule,
 ];

const components = [
  GraphPanelComponent
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
export class GraphPanelModule { }
