import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDataComponent } from './custom-data.component';
import { FormsModule } from '@angular/forms';
import { TableModule, CardModule, MessageModule, TooltipModule, MultiSelectModule, MenuModule, DropdownModule, InputTextModule, ButtonModule } from 'primeng';
import { CustomDataCrudModule } from '../dialog/custom-data-crud/custom-data-crud.module';
import { DeleteEntryModule } from '../dialog/delete-entry/delete-entry.module';
import {MessagesModule} from 'primeng/messages';
//import {MessageModule} from 'primeng/message';



@NgModule({
  declarations: [CustomDataComponent],
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    MessageModule,
    TooltipModule,
    MultiSelectModule,
    FormsModule,
    MenuModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    CustomDataCrudModule,
    DeleteEntryModule,
    MessagesModule
  ]
})
export class CustomDataModule { }
