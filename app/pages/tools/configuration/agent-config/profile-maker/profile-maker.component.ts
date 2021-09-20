import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem, TreeNode } from 'primeng';

@Component({
  selector: 'app-profile-maker',
  templateUrl: './profile-maker.component.html',
  styleUrls: ['./profile-maker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileMakerComponent implements OnInit {

  options: MenuItem[];
  selectedOptions: MenuItem;
  url: string = '/tmp';

  jsonView: any;
  json: any = {
    "$schema": 'http://json-schema.org/draft-07/schema#',
    "type": 'object',
    "title": 'Object',
    "additionalProperties": false,
    "properties": {
      "string": {
        "type": 'string',
        "title": 'String',
      },
    },
  }

  files: TreeNode[];
  selectedFiles: TreeNode[];
  selectedFile: TreeNode;
  treeData;

  isShowEmpty: boolean = true;
  isShowFileData: boolean = false;
  isShowTreeData: boolean = false;

  constructor() { }

  ngOnInit(): void {

    const me = this;

    me.options = [
      { label: 'Select' },
      { label: 'logger1' },
      { label: 'logger2' },
      { label: 'logger3' },
      { label: 'logger4' }
    ];

    me.jsonView = JSON.stringify(this.json, null, 2);

    me.files =
      [
        {
          "label": "All",
          "expanded": true,
          "children": [
            {
              "label": "org.springframework.web.servlet",
              "data": "Documents Folder",
              "children": [
                {
                  "label": "Page Report 1",
                  "icon": "pi pi-file",
                  "data": "Report Document"
                },
                {
                  "label": "Page Report 2",
                  "icon": "pi pi-file",
                  "data": "Report Document"
                }
              ]

            },
            {
              "label": "org.springframework.web.method.support",
              "data": "Documents Folder",
              "children": [
                {
                  "label": "Page Report 1",
                  "icon": "pi pi-file",
                  "data": "Report Document"
                },
                {
                  "label": "Page Report 2",
                  "icon": "pi pi-file",
                  "data": "Report Document"
                }
              ]

            },
            {
              "label": "org.springframework.http.server",
              "data": "Documents Folder",
              "children": [
                {
                  "label": "Page Report 1",
                  "icon": "pi pi-file",
                  "data": "Report Document"
                },
                {
                  "label": "Page Report 2",
                  "icon": "pi pi-file",
                  "data": "Report Document"
                }
              ]

            },
            {
              "label": "org.springframework.web.method.annotation",
              "data": "Documents Folder",
              "children": [
                {
                  "label": "Page Report 1",
                  "icon": "pi pi-file",
                  "data": "Report Document"
                },
                {
                  "label": "Page Report 2",
                  "icon": "pi pi-file",
                  "data": "Report Document"
                }
              ]

            },
            {
              "label": "org.springframework.web.util",
              "data": "Documents Folder",
              "children": [
                {
                  "label": "Page Report 1",
                  "icon": "pi pi-file",
                  "data": "Report Document"
                },
                {
                  "label": "Page Report 2",
                  "icon": "pi pi-file",
                  "data": "Report Document"
                }
              ]

            },
          ]

        }
      ];
    }

    showFileData() {
      this.isShowEmpty = false;
      this.isShowFileData = true;
      this.isShowTreeData = false;
    }

    showTreeData() {
      this.isShowEmpty = false;
      this.isShowFileData = false;
      this.isShowTreeData = true;
    }

  }
