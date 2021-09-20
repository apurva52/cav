import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditsearchComponent } from './editsearch.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ButtonModule, CardModule, OrderListModule, ToolbarModule } from 'primeng';
import { AceEditorModule } from 'ngx-ace-editor-wrapper';


const imports = [
  CommonModule, 
  HeaderModule,
  ToolbarModule,
  CardModule,
  ButtonModule,
  CardModule,
  AceEditorModule,
  OrderListModule
];

const components = [
  EditsearchComponent
];

const routes: Routes = [
  {
    path: 'editsearch',
    component: EditsearchComponent
  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule,components
  ]
})
export class EditsearchModule { }
