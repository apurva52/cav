import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMessageComponent } from './app-message.component';
import { AppMessageService } from './service/message.service';

@NgModule({
  declarations: [AppMessageComponent],
  imports: [
    CommonModule,
  ],
  exports: [AppMessageComponent],
  providers: [ AppMessageService ]
})
export class AppMessageModule { }
