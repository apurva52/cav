import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutGalleryComponent } from './dashboard-layout-gallery.component';
import { CarouselModule } from 'primeng';
import { DataModule } from '../../widget/types/data/data.module';
import { GraphModule } from '../../widget/types/graph/graph.module';
import { LabelModule } from '../../widget/types/label/label.module';
import { SystemHealthModule } from '../../widget/types/system-health/system-health.module';
import { TabularModule } from '../../widget/types/tabular/tabular.module';
import { GroupModule } from '../../widget/types/group/group.module';
import { ImageModule } from '../../widget/types/image/image.module';
import { FileImportModule } from '../../widget/types/file-import/file-import.module';



@NgModule({
  declarations: [DashboardLayoutGalleryComponent],
  exports: [DashboardLayoutGalleryComponent],
  imports: [
    CommonModule,
    CarouselModule,
    DataModule,
    GraphModule,
    LabelModule,
    SystemHealthModule,
    TabularModule,
    GroupModule,
    ImageModule,
    FileImportModule
  ]
})
export class DashboardLayoutGalleryModule { }
