import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewCommandComponent } from './new-command.component';
import {
  ButtonModule,
  CardModule,
  CheckboxModule,
  DropdownModule,
  InputNumberModule,
  InputTextModule,
  MenuModule,
  MultiSelectModule,
  OrderListModule,
  SlideMenuModule,
  TableModule,
  ToolbarModule,
  TooltipModule,
} from 'primeng';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
  declarations: [NewCommandComponent],
  imports: [
    CommonModule,
    CheckboxModule,
    MultiSelectModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    TableModule,
    CardModule,
    PipeModule,
    SlideMenuModule,
    MenuModule,
    ToolbarModule,
    TooltipModule,
    OrderListModule
  ],
})
export class NewCommandModule {}
