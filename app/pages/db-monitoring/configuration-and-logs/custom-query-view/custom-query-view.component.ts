import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-custom-query-view',
    templateUrl: './custom-query-view.component.html',
    styleUrls: ['./custom-query-view.component.scss'],
    encapsulation: ViewEncapsulation.None
  })
export class CustomQueryViewComponent implements OnInit, OnDestroy {

    constructor() { }

    ngOnInit() {
    }

    ngOnDestroy() {
        
    }
}
