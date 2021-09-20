import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from '@angular/cdk/clipboard'
import {

  ButtonModule,
  DropdownModule,
  DialogModule,
  InputTextModule,
} from 'primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LongValueComponent } from './long-value.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const imports = [
  CommonModule,
  DropdownModule,
  FormsModule,
  ClipboardModule,
  ButtonModule,
  DialogModule,
  InputTextModule,
];

const components = [
  LongValueComponent
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
export class LongValueModule { }
