import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BaseNodeComponent } from 'jsplumbtoolkit-angular';

@Component({
  selector: 'app-solar-pref-node',
  templateUrl: './solar-pref-node.component.html',
  styleUrls: ['./solar-pref-node.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SolarPrefNodeComponent extends BaseNodeComponent implements AfterViewInit{
  zoomLevel1x: boolean;
  zoomLevel2x: boolean;
  zoomLevel3x: boolean;
  zoomLevel4x: boolean;

  ngOnInit(): void {
    this.zoomLevel1x = false;
    this.zoomLevel2x = false;
    this.zoomLevel3x = false;
    this.zoomLevel4x = true;
    console.log('obj:- ', this.obj);
    console.log('obj:- ', this.surface.getZoom());
  }

  ngAfterViewInit(): void {
    const me = this;
     
  }

  isNode(obj: any): obj is Node {
    return obj.objectType === 'Node';
  }
}
