import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { INDICES_DATA } from './service/indices.dummy';
import { IndicesData } from './service/indices.model';

@Component({
  selector: 'app-indices',
  templateUrl: './indices.component.html',
  styleUrls: ['./indices.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IndicesComponent implements OnInit {

  error: AppError;
  empty: boolean;
  loading: boolean;
  data: IndicesData;

  breadcrumb: MenuItem[];
  orderList = [];
  dropDown = [];
 
  constructor(
    private router : Router,
  ) { }

  ngOnInit(): void {

    const me = this;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'System' },
      { label: 'Select Indices' },
    ];

    me.data = INDICES_DATA;
  }

  backToReport(){
    this.router.navigate(['/reports']);
  }
  selectIndices(){
    this.router.navigate(['/select-indices']);
  }

}
