import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageDialogComponent } from './page-dialog.component';
import { DialogModule } from 'primeng';



@NgModule({
  declarations: [PageDialogComponent],
  imports: [
    CommonModule,
    DialogModule
  ]
})
export class PageDialogModule { }
