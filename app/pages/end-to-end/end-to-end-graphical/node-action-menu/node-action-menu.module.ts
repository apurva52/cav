import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, TieredMenuModule } from 'primeng';
import { NodeActionMenuComponent } from './node-action-menu.component';

@NgModule({
  declarations: [NodeActionMenuComponent],
  imports: [CommonModule,
    TieredMenuModule,
    ButtonModule],
  exports: [NodeActionMenuComponent],
})
export class NodeActionMenuModule { }
