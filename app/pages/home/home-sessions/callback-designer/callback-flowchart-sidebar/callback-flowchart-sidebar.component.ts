import { AfterViewInit, Component, Input, OnChanges, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MenuItem, SelectItem } from 'primeng';
import { ActionApi, ActionApiList, Operator } from '../../common/interfaces/action-api';
import { Action, Callback, Trigger } from '../../common/interfaces/callback';
import { Metadata } from '../../common/interfaces/metadata';
import { MetadataService } from '../../common/service/metadata.service';
import { CallbackDesignerService } from '../service/callback-designer.service';
import { CallbackDatapointComponent } from './callback-datapoint/callback-datapoint.component';
import { CallbackLocalvarComponent } from './callback-localvar/callback-localvar.component';

@Component({
  selector: 'app-callback-flowchart-sidebar',
  templateUrl: './callback-flowchart-sidebar.component.html',
  styleUrls: ['./callback-flowchart-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CallbackFlowchartSidebarComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild(CallbackDatapointComponent, { read: CallbackDatapointComponent })
  private dataPoint: CallbackDatapointComponent;

  @ViewChild(CallbackLocalvarComponent, { read: CallbackLocalvarComponent })
  public localVar: CallbackLocalvarComponent;

  @Input() action: Action;
  @Input() callback: Callback;

  items: MenuItem[];

  metadata: Metadata;
  actionApiList: { [key: string]: ActionApi[] };

  dataPointForm: FormGroup;

  surfaceId = 'flowchartSurface';

  constructor(private metaDataService: MetadataService, private fb: FormBuilder, private cbService: CallbackDesignerService) {
    this.actionApiList = ActionApiList.apiList;
    this.getMenuItems();
  }

  getMenuItems() {
    this.items = [
      {
        label: 'Data Points',
        styleClass: 'no-max-height',
        items: [{
          label: 'Add',
          icon: 'icons8 icons8-plus-math',
          title: 'Click to Add Data Point',
          command: () => {
            this.dataPoint.showDialog();
          },
        },
        {
          label: 'Element',
          styleClass: 'Element',
          visible: false,
          items: [
            {
              label: 'Self',
              styleClass: 'nvcbdrag Element_Self',
              id: 'datapoint$Element.self'
            },
            {
              label: 'Text',
              styleClass: 'nvcbdrag Element_Text',
              id: 'datapoint$Element.textContent'
            },
            {
              label: 'Class',
              styleClass: 'nvcbdrag Element_Class',
              id: 'datapoint$Element.className'
            },
            {
              label: 'Attribute',
              styleClass: 'nvcbdrag Element_attributes',
              id: 'datapoint$Element.attributes',
            },
            {
              label: 'Value',
              styleClass: 'nvcbdrag Element_Value',
              id: 'datapoint$Element.value'
            },
            {
              label: 'Style',
              items: [
                {
                  label: 'Display',
                  styleClass: 'nvcbdrag Element_Style_Display',
                  id: "datapoint$Element.style['display']"
                },
                {
                  label: 'Height',
                  styleClass: 'nvcbdrag Element_Style_Height',
                  id: "datapoint$Element.style['height']"
                },
                {
                  label: 'Width',
                  styleClass: 'nvcbdrag Element_Style_Width',
                  id: "datapoint$Element.style['width']"
                },
                {
                  label: 'Color',
                  styleClass: 'nvcbdrag Element_Style_Color',
                  id: "datapoint$Element.style['color']"
                },
                {
                  label: 'Custom',
                  styleClass: 'nvcbdrag Element_style_custom',
                  id: 'datapoint$Element.style.custom'
                }
              ]
            }
          ]
        },
        {
          label: 'XHR',
          styleClass: 'XHR',
          visible: false,
          items: [
            {
              label: 'Status Code',
              styleClass: 'nvcbdrag XHR_status',
              id: 'datapoint$XHR.status'
            },
            {
              label: 'Url',
              styleClass: 'XHR_url',
              items: [
                {
                  label: 'Hash',
                  styleClass: 'nvcbdrag XHR_url_hash',
                  id: 'datapoint$XHR.url.hash'
                },
                {
                  label: 'Host',
                  styleClass: 'nvcbdrag XHR_url_host',
                  id: 'datapoint$XHR.url.host'
                },
                {
                  label: 'Hostname',
                  styleClass: 'nvcbdrag XHR_url_hostname',
                  id: 'datapoint$XHR.url.hostname'
                },
                {
                  label: 'Href',
                  styleClass: 'nvcbdrag XHR_url_href',
                  id: 'datapoint$XHR.url.href'
                },
                {
                  label: 'Origin',
                  styleClass: 'nvcbdrag XHR_url_origin',
                  id: 'datapoint$XHR.url.origin'
                },
                {
                  label: 'Path Name',
                  styleClass: 'nvcbdrag XHR_url_pathname',
                  id: 'datapoint$XHR.url.pathname'
                },
                {
                  label: 'Port',
                  styleClass: 'nvcbdrag XHR_url_port',
                  id: 'datapoint$XHR.url.port'
                },
                {
                  label: 'Protocol',
                  styleClass: 'nvcbdrag XHR_url_protocol',
                  id: 'datapoint$XHR.url.protocol'
                }
              ]
            }
          ]
        }
        ]
      },
      {
        label: 'Local Variables',
        items: [{
          label: 'Add',
          icon: 'icons8 icons8-plus-math',
          title: 'Click to Add Local Variable',
          command: () => {
            this.localVar.showDialog();
          },
        }]
      },
      {
        label: 'Operators',
        items: []
      },
      {
        label: 'Channels',
        items: [],
      },
      {
        label: 'Pages',
        items: []
      },
      {
        label: 'Events',
        items: []
      },
      {
        label: 'User Segments',
        items: []
      },
      {
        label: 'Custom Metrics',
        items: []
      },
      { separator: true },
      {
        label: 'Condition',
        styleClass: 'draggable-node condition',
        title: 'Drag Condition',
        style: { cursor: 'move' }
      }];


    // tslint:disable-next-line: forin
    for (const apiGroup in this.actionApiList) {
      const item: MenuItem = {
        label: apiGroup,
        items: []
      };

      this.actionApiList[apiGroup].forEach(api => {
        item.items.push({
          label: api.label,
          id: api.id,
          styleClass: 'draggable-node api',
          title: 'Drag api ' + api.label,
          style: { cursor: 'move' }
        });
      });

      this.items.push(item);
    }


    let tmp: MenuItem[] = [];

    this.metaDataService.getMetadata().subscribe((response: any) => {
      this.metadata = response;

      // -------channel----------
      const channelm: any[] = Array.from(this.metadata.channelMap.keys());
      const channels: SelectItem[] = channelm.map((key) => {
        return {
          label: this.metadata.channelMap.get(key).name,
          value: this.metadata.channelMap.get(key).name
        };
      });


      // --------user segment-------------
      const usersegment: any[] = Array.from(this.metadata.userSegmentMap.keys());
      const usersegments: SelectItem[] = usersegment.map((key) => {
        return {
          label: this.metadata.userSegmentMap.get(key).name,
          value: this.metadata.userSegmentMap.get(key).id
        };
      });

      //  ------------- events -------------
      const eventm: any[] = Array.from(this.metadata.eventMap.keys());
      const events: SelectItem[] = eventm.map((key) => {
        return {
          label: this.metadata.eventMap.get(key).name,
          value: this.metadata.eventMap.get(key).id
        };
      });

      //  ------------- custom metrics --------------
      const custommetricm: any[] = Array.from(this.metadata.customMetricMap.keys());
      const custommetrics: SelectItem[] = custommetricm.map((key) => {
        return {
          label: this.metadata.customMetricMap.get(key).name,
          value: this.metadata.customMetricMap.get(key).id
        };
      });

      // -------pages------------
      const pagem: any[] = Array.from(this.metadata.pageNameMap.keys());
      const pages: SelectItem[] = pagem.map(key => {
        return {
          label: this.metadata.pageNameMap.get(key).name,
          value: this.metadata.pageNameMap.get(key).id
        };
      });


      for (const i of this.items) {

        if (i.label === 'Channels') {
          i.items = [];
          for (const c of channels) {
            i.items.push({
              label: c.label,
              id: 'channel$' + c.label,
              title: 'Drag Channel ' + c.label,
              styleClass: 'nvcbdrag channel',
              style: { cursor: 'move' }
            });
          }
        }

        if (i.label === 'Pages') {
          i.items = [];
          for (const p of pages) {
            i.items.push({
              label: p.label,
              id: 'page$' + p.label,
              title: 'Drag Page ' + p.label,
              styleClass: 'nvcbdrag page',
              style: { cursor: 'move' }
            });
          }
        }

        if (i.label === 'Events') {
          i.items = [];
          for (const e of events) {
            i.items.push({
              label: e.label,
              id: 'event$' + e.label,
              title: 'Drag Event ' + e.label,
              styleClass: 'nvcbdrag events',
              style: { cursor: 'move' }
            });
          }
        }

        if (i.label === 'User Segments') {
          i.items = [];
          for (const u of usersegments) {
            i.items.push({
              label: u.label,
              id: 'usersegment$' + u.label,
              title: 'Drag User Segment ' + u.label,
              styleClass: 'nvcbdrag usersegment',
              style: { cursor: 'move' }
            });
          }
        }

        if (i.label === 'Custom Metrics') {
          i.items = [];
          for (const c of custommetrics) {
            i.items.push({
              label: c.label,
              id: 'custommetric$' + c.label,
              title: 'Drag Custom Metric ' + c.label,
              styleClass: 'nvcbdrag custommetric',
              style: { cursor: 'move' }
            });
          }
        }

      }

      setTimeout(() => {
        this.markItemsDraggable();
      }, 100);
    });

    this.items[2].items = [];
    for (const i of Operator.operatorList) {
      this.items[2].items.push({
        label: i.name,
        id: 'operator$' + i.name,
        title: 'Drag Operator ' + i.name,
        styleClass: 'nvcbdrag operator',
        style: { cursor: 'move' }
      });
    }
  }


  openLocalVarDialog() {
  }

  openDataPointDialog() {

  }

  dataGenerator(el: HTMLElement) {
    console.log('FlowChart | dataGenerator called : ', el);

    if (el.classList.contains('condition')) {
      return {
        type: 'question',
        w: 180,
        h: 50
      };

    } else if (el.classList.contains('api')) {
      return {
        type: 'action',
        w: 180,
        h: 50,
        api: el.querySelector('a').getAttribute('id')
      };
    }
  }

  ngOnInit(): void {
    this.cbService.on('callbackChanged').subscribe(() => { this.getLocalVarDataPoints(); });
    this.cbService.on('addedDataPoint').subscribe(() => { this.getLocalVarDataPoints(); });
    this.cbService.on('addedLocalVar').subscribe(() => { this.getLocalVarDataPoints(); });
  }

  ngOnChanges(): void {
    if (this.action) {
      this.getSystemDatapoints();
    }
  }

  getSystemDatapoints() {
    this.callback.triggers.forEach((trigger: Trigger) => {
      if (trigger.id === this.action.triggerId) {
        switch (trigger.type) {
          case 'CONTENT_CHANGE':
            this.items[0].items[1].visible = true;
            this.items[0].items[2].visible = false;
            break;

          case 'XHR_COMPLETE':
          case 'XHR_FAILED':
            this.items[0].items[1].visible = false;
            this.items[0].items[2].visible = true;
            break;

          default:
            this.items[0].items[1].visible = false;
            this.items[0].items[2].visible = false;
            break;
        }
      }
    });
  }

  getLocalVarDataPoints(): void {

    this.items[0].items.length = 3;
    for (const dp of this.cbService.getDataPoint()) {
      this.items[0].items.push({
        label: dp.name,
        icon: 'icons8 icons8-edit',
        id: 'datapoint$' + dp.name,
        title: 'Drag Data Point ' + dp.name,
        styleClass: 'nvcbdrag datapoint',
      });
    }

    this.items[1].items.length = 1;
    for (const lvar of this.cbService.getLocalVar()) {
      this.items[1].items.push({
        label: lvar.name,
        id: 'localvar$' + lvar.name,
        title: 'Drag Local Variable ' + lvar.name,
        styleClass: 'nvcbdrag localvar'
      });
    }

    setTimeout(() => {
      this.markItemsDraggable();
    }, 100);

  }


  ngAfterViewInit() {
    this.markItemsDraggable();
    this.replaceHTMLElement('Element_attributes');
    this.replaceHTMLElement('Element_style_custom');
  }

  replaceHTMLElement(data: string) {
    const el: HTMLElement = document.querySelector('.' + data);
    const oldElement = el.children[0];
    const newElement = document.createElement('a');
    newElement.setAttribute('class', 'ui-inputgroup');

    const label = document.createElement('span');
    label.setAttribute('class', 'ui-inputgroup-addon');
    label.innerText = (data.split('_')[2] === undefined ? data.split('_')[1] : data.split('_')[2]);

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'enter value');
    input.setAttribute('class', 'ui-inputtext ui-corner-all');
    input.style.width = '100px';
    newElement.setAttribute('id', 'datapoint$' + data.split('_').join('.'));
    newElement.appendChild(label);
    newElement.appendChild(input);

    // convert htmlelement to input type on mouse hover
    el.addEventListener('mouseenter', () => {
      el.children[0].replaceWith(newElement);
      input.focus();

      this.checkInpputValue(data);

      el.addEventListener('keypress', () => {
        setTimeout(() => {
          this.checkInpputValue(data);
        }, 50);
      });
    });

    el.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
    })

    // convert input type to previous HTMLElement on mouse leave
    el.addEventListener('mouseleave', () => {
      input.blur();
      const inputVal = document.querySelector('[id^="datapoint$' + data.split('_').join('.') + '"]');
      if ((inputVal.children[1] as HTMLInputElement).value === '') {
        el.children[0].replaceWith(oldElement);
      }
    });
  }

  checkInpputValue(data: string) {
    const inputVal = document.querySelector('[id^="datapoint$' + data.split('_').join('.') + '"]');

    if ((inputVal.children[1] as HTMLInputElement).value.trim() === '') {
      inputVal.parentElement.removeAttribute('draggable');
    } else {
      inputVal.parentElement.setAttribute('draggable', 'true');
      inputVal.setAttribute("id", "datapoint$" + data.split('_').join('.') + "['" + (inputVal.children[1] as HTMLInputElement).value + "']");
    }
  }


  markItemsDraggable() {
    const items = document.querySelectorAll('.nvcbdrag');

    items.forEach(item => {
      // set the draggable property to enable dragging
      if (item.getAttribute('draggable') !== 'true') {
        item.setAttribute('draggable', 'true');

        if (item.classList.contains('datapoint')) {
          const x = (item.children[0].children[0] as HTMLElement);
          x.style.cssFloat = 'right';
          x.style.cursor = 'pointer';
          x.setAttribute('title', 'Edit Datapoint');
          x.addEventListener('click', (event) => {
            this.dataPoint.showDialog(item['innerText']);
          });
        }

        item.addEventListener('dragstart', (ev: DragEvent) => {
          //  get id and transfer this id to dropper element
          const id = item.querySelector('a').getAttribute('id');

          if (id.search('style.custom') > -1) {
            ev.dataTransfer.setData('text', id.replace('.custom', ''));
          } else {
            if (navigator.userAgent.indexOf('Firefox') !== -1) {
              if (id.indexOf('operator$') !== -1) {
                alert('Please select operator manually from the operator dropdown in condition form.');
              }
            }
            ev.dataTransfer.setData('text', id);
          }
        });


      }
    });
  }

}
