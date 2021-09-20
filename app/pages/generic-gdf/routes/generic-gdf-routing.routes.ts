import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GdfHomeComponent } from '../components/gdf-home/gdf-home.component';


  
const GENERIC_GDF_ROUTING: Routes = [

    { path: '', redirectTo:'home', pathMatch: 'full' },
    // { path:'home',component: GdfHomeComponent}, // commented on 13/1/2020 as was not able to open monitor group screen 
    { path:'home/gdf',component: GdfHomeComponent},
];

@NgModule({
    imports: [RouterModule.forChild(GENERIC_GDF_ROUTING)],
    exports: [RouterModule]
})

export class GenericGdfRoutingModule {

}
