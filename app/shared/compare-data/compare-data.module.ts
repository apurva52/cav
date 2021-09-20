import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompareDataComponent } from './compare-data.component';
import {
  
  ButtonModule,
  CardModule,
  ColorPickerModule,
  TooltipModule,
  SlideMenuModule,
  CheckboxModule,
  SliderModule,
  DialogModule,
  DropdownModule,
  InputTextModule,
  MessageModule,
  TableModule,
  ProgressSpinnerModule,
} from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { PipeModule } from '../pipes/pipes.module';
import { OwlMomentDateTimeModule } from '../date-time-picker-moment/moment-date-time.module';
import { CompareDataService } from './service/compare-data.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { InformativeDialogModule } from '../dialogs/informative-dialog/informative-dialog.module';
import {SidebarModule} from 'primeng/sidebar';
import {HelpModule} from './../help/help.module'
const imports = [
  CommonModule,
  DialogModule,
  CardModule,
  DropdownModule,
  FormsModule,
  ReactiveFormsModule,
  SliderModule,
  ProgressSpinnerModule,
  SlideMenuModule,
  CheckboxModule,
  InputTextModule,
  ButtonModule,
  TableModule,
  TooltipModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  MessageModule,
  ColorPickerModule,
  PipeModule,
  ConfirmDialogModule,
  ToastModule,
  MessagesModule,
  InformativeDialogModule,
  SidebarModule,
  HelpModule,
];


const components = [CompareDataComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  providers: [CompareDataService, MessageService],
  exports: [components],
})
export class CompareDataModule {}
