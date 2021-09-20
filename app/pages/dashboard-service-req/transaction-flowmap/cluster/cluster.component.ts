import { Component, OnInit } from '@angular/core';
import { BaseNodeComponent } from 'jsplumbtoolkit-angular';

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.scss'],
})
export class ClusterComponent extends BaseNodeComponent {
  isShow: boolean;
  ngOnInit(): void {}
}
