import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileMakerComponent } from './profile-maker.component';
import { RouterModule, Routes } from '@angular/router';
import { CardModule, ButtonModule, CheckboxModule, MultiSelectModule, FieldsetModule, RadioButtonModule, DropdownModule, FileUploadModule, InputTextModule, TreeModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { AceEditorModule } from 'ngx-ace-editor-wrapper';

const imports = [
  CommonModule,  
  CardModule,
  ButtonModule,  
  CheckboxModule,  
  FormsModule, 
  RadioButtonModule,
  DropdownModule,
  FileUploadModule,
  InputTextModule,
  AceEditorModule,
  TreeModule,
];

const components = [ProfileMakerComponent];

const routes: Routes = [
  {
    path: 'others',
    component: ProfileMakerComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ProfileMakerModule { }
