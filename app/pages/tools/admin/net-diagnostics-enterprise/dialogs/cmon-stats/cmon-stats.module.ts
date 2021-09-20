import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmonStatsComponent } from './cmon-stats.component';
import { FormsModule } from '@angular/forms';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, DropdownModule, MultiSelectModule, CardModule, MenuModule, MessageModule, TableModule, TooltipModule, PanelModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';



const components = [CmonStatsComponent];

const imports = [
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  FormsModule,
  DropdownModule,
  MultiSelectModule,
  TableModule,
  CardModule,
  MessageModule,
  TooltipModule,
  MenuModule,
  PanelModule
 ];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class CmonStatsModule { }
