import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetMenuModule } from '../../widget-menu/widget-menu.module';
import { ButtonModule, SlideMenuModule, TooltipModule } from 'primeng';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { GroupComponent } from './group.component';
import { GridsterModule } from 'angular-gridster2';
import { DataModule } from '../data/data.module';
import { GraphModule } from '../graph/graph.module';
import { LabelModule } from '../label/label.module';
import { SystemHealthModule } from '../system-health/system-health.module';
import { TabularModule } from '../tabular/tabular.module';
import { ImageModule } from '../image/image.module';
import { FileImportModule } from '../file-import/file-import.module';



@NgModule({
  declarations: [GroupComponent],
  exports: [GroupComponent],
  imports: [
    CommonModule,
    WidgetMenuModule,
    TooltipModule,
    PipeModule,
    GridsterModule,
    DataModule,
    GraphModule,
    LabelModule,
    SystemHealthModule,
    TabularModule,
    ButtonModule,
    SlideMenuModule,
    ImageModule,
    FileImportModule
  ]
})
export class GroupModule { }