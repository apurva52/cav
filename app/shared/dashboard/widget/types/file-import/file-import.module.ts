import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileImportComponent } from './file-import.component';
import { WidgetMenuModule } from '../../widget-menu/widget-menu.module';
import { InputTextModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { GetFileDataModule } from 'src/app/shared/get-file-data/get-file-data.module';

@NgModule({
  declarations: [FileImportComponent],
  imports: [
    CommonModule,
    WidgetMenuModule,
    TooltipModule,
    TableModule,
    FormsModule,
    InputTextModule,
    GetFileDataModule
  ],
  exports: [FileImportComponent],
})
export class FileImportModule {}
