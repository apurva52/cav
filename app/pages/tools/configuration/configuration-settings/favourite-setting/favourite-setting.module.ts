import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavouriteSettingComponent } from './favourite-setting.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CardModule, ButtonModule, CheckboxModule, MultiSelectModule, FieldsetModule, DropdownModule, InputTextModule } from 'primeng';


const imports = [
  CommonModule,  
  CardModule,
  ButtonModule,  
  CheckboxModule,  
  FormsModule,
  FieldsetModule,  
  InputTextModule
];

const components = [FavouriteSettingComponent];

const routes: Routes = [
  {
    path: 'fav-setting',
    component: FavouriteSettingComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavouriteSettingModule { }
