import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutoInstrumentComponent } from './auto-instrument.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CheckboxModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, SlideMenuModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

const imports = [
  CommonModule,
  PanelModule,
  TableModule, 
  ButtonModule,
  AppMessageModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,    
  PipeModule,
  SlideMenuModule,
  MenuModule,  
  InputTextModule, 
  DropdownModule,   
];

const components = [AutoInstrumentComponent];

const routes: Routes = [
  {
    path: 'auto-instrument',
    component: AutoInstrumentComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components, RouterModule],
})
export class AutoInstrumentModule { }
