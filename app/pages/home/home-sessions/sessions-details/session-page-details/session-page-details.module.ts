import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionPageDetailsComponent } from './session-page-details.component';
import { DialogModule } from 'primeng/dialog';


@NgModule({
  declarations: [SessionPageDetailsComponent],
  imports: [
    CommonModule,
    DialogModule
  ]
})
export class SessionPageDetailsModule { }
