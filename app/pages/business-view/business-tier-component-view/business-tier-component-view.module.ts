import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessTierComponentViewComponent } from './business-tier-component-view.component';
import { jsPlumbToolkitModule } from 'jsplumbtoolkit-angular';
import { OverlayPanelModule } from 'primeng';

const imports = [CommonModule, jsPlumbToolkitModule, OverlayPanelModule];

@NgModule({
  declarations: [BusinessTierComponentViewComponent],
  imports: [imports],
  exports: [BusinessTierComponentViewComponent],
})
export class BusinessTierComponentViewModule {}
