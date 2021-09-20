import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DerivedMetricIndicesComponent } from './derived-metric-indices.component';
import { FormsModule } from '@angular/forms';
import {
  DropdownModule,
  InputTextModule,
  ButtonModule,
  DialogModule,
  RadioButtonModule,
  TreeTableModule,
  TooltipModule,
  ProgressSpinnerModule
} from 'primeng';

import { ConfirmDialogModule} from 'primeng/confirmdialog';
import { PipeModule } from '../../pipes/pipes.module';

import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash/fp';
@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(items, searchTerm, keys) {
   
    if (searchTerm) {
      let newSearchTerm = !isNaN(searchTerm) ? searchTerm.toString() : searchTerm.toString().toUpperCase();
      // return items.filter(item => {
      
        return this.filter(items, newSearchTerm, keys);
      // })
    }
    else { return items; }
  }
  filter(array,name,keyArr){
    return array.reduce((r, { children, ...o }) => {
      
      if (
        o.data['Server'] &&
        o.data['Server']
          .toString()
          .toUpperCase()
          .indexOf(name.toString().toUpperCase()) > -1
      ) {
        Object.assign(o, { children });
        r.push(o);
        return r;
      }
      if (
        o.data['Tier'] &&
        o.data['Tier']
          .toString()
          .toUpperCase()
          .indexOf(name.toString().toUpperCase()) > -1
      ) {
        Object.assign(o, { children }); 
        r.push(o);
        return r;
      }
      
  //       keyArr.forEach(item => {
  //         if(o.data[item] && (o.data[item].toString().toUpperCase().indexOf(name.toString().toUpperCase()) > -1)){
  //           Object.assign(o, { children })
  // r.push(o);
  //             return r;
  //         }
  //       })
        children = this.filter(children, name, keyArr);
        if (children.length) {
            r.push(Object.assign(o, { children }));
        }
        return r;
    }, []);
  }
}


const imports = [
  CommonModule,
  DropdownModule,
  FormsModule,
  InputTextModule,
  ButtonModule,
  DialogModule,
  RadioButtonModule,
  TreeTableModule,
  TooltipModule,
  ConfirmDialogModule,
  PipeModule,
  ProgressSpinnerModule
];

const components = [DerivedMetricIndicesComponent];

@NgModule({
  declarations: [components, FilterPipe],
  imports: [imports],
  exports: [components],
})
export class DerivedMetricIndicesModule { }
