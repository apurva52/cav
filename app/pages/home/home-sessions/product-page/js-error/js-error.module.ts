import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsErrorComponent } from './js-error.component';
import { OrderListModule, MessageModule, InputSwitchModule, TableModule, InputTextModule, CardModule, ButtonModule, CheckboxModule, DialogModule, MenuModule, MultiSelectModule, SlideMenuModule, ToastModule, TooltipModule } from 'primeng';
import { SourceViewerModule } from './source-viewer/source-viewer.module';


@NgModule({
  declarations: [JsErrorComponent],
  imports: [
    CommonModule,
    OrderListModule, MessageModule, InputSwitchModule, TableModule, InputTextModule, CardModule,
    ButtonModule, CheckboxModule, DialogModule, MenuModule, MultiSelectModule, SlideMenuModule, ToastModule, TooltipModule, SourceViewerModule
  ]
})

export class JsErrorModule { }
