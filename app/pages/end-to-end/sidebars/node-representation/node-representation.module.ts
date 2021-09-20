import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeRepresentationComponent } from './node-representation.component';
import { ButtonModule, SidebarModule, TooltipModule } from 'primeng';

const imports = [CommonModule, 
  TooltipModule,
  ButtonModule,
  SidebarModule,];

const declarations = [NodeRepresentationComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})
export class NodeRepresentationModule {}
