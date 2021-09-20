import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ButtonModule, CardModule, InputTextModule, MenuModule, MultiSelectModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ProfileNameDetailsComponent } from './profile-name-details/profile-name-details.component';
import { ProfileNameDetailsModule } from './profile-name-details/profile-name-details.module';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  TooltipModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  InputTextModule,
  ProfileNameDetailsModule
]

const components = [ProfileComponent];

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
  },
];

@NgModule({
  declarations: [components,],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileModule { }
