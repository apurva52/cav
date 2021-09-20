import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { PageSidebarComponent } from 'src/app/shared/page-sidebar/page-sidebar.component';
import { EndToEndGraphicalComponent } from '../../end-to-end-graphical/end-to-end-graphical.component';
import { EndToEndNode } from '../../end-to-end-graphical/service/end-to-end-graphical.model';
import { NodeActionSidebarData } from '../node-action-sidebar/service/node-action-sidebar.model';

@Component({
  selector: 'app-node-info',
  templateUrl: './node-info.component.html',
  styleUrls: ['./node-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NodeInfoComponent
  extends PageSidebarComponent
  implements AfterViewInit {
  data: NodeActionSidebarData;
  visible: boolean;
  @Input() nodeData: EndToEndNode;
  @Input() Graphical: EndToEndGraphicalComponent;
  constructor() {
    super();
  }

  openNodeInfo() {
    super.show;
  }

  ngOnInit(): void {}
  ngAfterViewInit() {
    const me = this;
    me.data = {
      relations: {
        applications: {
          label: 'Applications',
          legend: [
            {
              label: 'NCMON',
              icon: 'icons8 icons8-folder',
            },
            {
              label: 'TIERS',
              icon: 'icons8 icons8-folder',
            },
            {
              label: 'SERVERS',
              value: '42%',
            },
            {
              label: 'TIERS',
              icon: 'icons8 icons8-folder',
            },
            {
              label: 'SERVERS',
              value: '42%',
            },
          ],
        },
        tiers: {
          label: 'TIERS',
          legend: [
            {
              label: 'solar',
              icon: 'icons8 icons8-php-logo',
            },
          ],
        },
        servers: {
          label: 'SERVERS',
          legend: [
            {
              label: 'server 1',
              value: '42%',
            },
            {
              label: 'server 2',
              value: '42%',
            },
            {
              label: 'server 3',
              value: '42%',
            },
            {
              label: 'server 1',
              value: '42%',
            },
            {
              label: 'server 2',
              value: '42%',
            },
            {
              label: 'server 3',
              value: '42%',
            },
            {
              label: 'server 1',
              value: '42%',
            },
            {
              label: 'server 2',
              value: '42%',
            },
            {
              label: 'server 3',
              value: '42%',
            },
          ],
        },
        instances: {
          label: 'Instances',
          legend: [
            {
              label: 'server 1',
              value: '42%',
            },
            {
              label: 'server 2',
              value: '42%',
            },
            {
              label: 'server 3',
              value: '42%',
            },
          ],
        },
        ipPoint: {
          label: 'Integration Point',
          legend: [
            {
              label: 'Http 1',
              icon: 'icons8 icons8-globe',
            },
            {
              label: 'Http 2',
              icon: 'icons8 icons8-globe',
            },
            {
              label: 'server 3',
              icon: 'icons8 icons8-globe',
            },
          ],
        },
      },
    };
  }
  open() {
    console.log(this);
  }

  showTierInfo(){
    // Navigate to Tier Info page
  }
}
