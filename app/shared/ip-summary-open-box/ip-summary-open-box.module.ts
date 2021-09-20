import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IpSummaryOpenBoxComponent } from './ip-summary-open-box.component';
import { DropdownModule, ButtonModule, DialogModule, InputNumberModule, TabViewModule, RadioButtonModule, PanelModule, AccordionModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from '@angular/cdk/clipboard';


const imports = [
  CommonModule,
  DropdownModule,
  FormsModule,
  ButtonModule,
  TabViewModule,
  RadioButtonModule,
  PanelModule,
  AccordionModule
];

const components = [
  IpSummaryOpenBoxComponent
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
export class IpSummaryOpenBoxModule { }
