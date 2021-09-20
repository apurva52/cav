import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelComponent } from './channel.component';
import { RouterModule, Routes } from '@angular/router';
import {
  ButtonModule,
  CardModule,
  DropdownModule,
  InputTextModule,
  MenuModule,
  MessageModule,
  MultiSelectModule,
  TableModule,
  TooltipModule,
} from 'primeng';
import { FormsModule } from '@angular/forms';
import { ChannelCrudModule } from '../dialog/channel-crud/channel-crud.module';
import { DeleteEntryModule } from '../dialog/delete-entry/delete-entry.module';

const components = [ChannelComponent];
const imports =[
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
    ChannelCrudModule,
    DeleteEntryModule
  ]
const routes: Routes = [
  {
    path: 'channel',
    component: ChannelComponent,
  },
];
@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule,components
  ]
  
})
export class ChannelModule {}
