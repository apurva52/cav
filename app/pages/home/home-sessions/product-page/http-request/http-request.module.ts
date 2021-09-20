import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, CardModule, CheckboxModule, InputSwitchModule, InputTextModule, MessageModule, MultiSelectModule, OverlayPanelModule, TableModule, TabViewModule, TooltipModule } from 'primeng';
import { HttpRequestComponent } from './http-request.component';


@NgModule({
  declarations: [HttpRequestComponent],
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    CheckboxModule,
    FormsModule,
    InputTextModule,
    MessageModule,
    MultiSelectModule,
    TooltipModule,
    InputSwitchModule,
    TableModule,
    ReactiveFormsModule,
    TabViewModule,
    OverlayPanelModule
  ]
})

export class HttpRequestModule { }
