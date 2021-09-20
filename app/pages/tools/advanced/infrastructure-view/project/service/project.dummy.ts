import { ProjectPanelData } from "./project.model";


export const PROJECT_PANEL_DATA: ProjectPanelData = {
    panels: [
      {
        label: 'Upcoming Projects',
        headers: [
          {
            cols: [
              {
                label: 'Properties',
                valueField: 'dataLabel',
              },
              {
                label: 'value',
                valueField: 'dataValue',
                classes: 'text-right'
              },
            ],
          },
        ],
        data: [
            {
                dataLabel: 'Build Number',
                dataValue: '10',
              },
              {
                dataLabel: 'Description',
                dataValue: 'NCMON',
              },
              {
                dataLabel: 'Release Number',
                dataValue: '3.2.1',
              },
              {
                dataLabel: 'Git Info',
                dataValue: '-',
              },
              {
                dataLabel: 'Version',
                dataValue: '-',
              },
        ],
      },
      {
        label: 'Current Projects',
        headers: [
          {
            cols: [
              {
                label: 'Properties',
                valueField: 'dataLabel',
              },
              {
                label: 'value',
                valueField: 'dataValue',
              },
            ],
          },
        ],
        data: [
            {
                dataLabel: 'Build Number',
                dataValue: '10',
              },
              {
                dataLabel: 'Description',
                dataValue: 'NCMON',
              },
              {
                dataLabel: 'Release Number',
                dataValue: '3.2.1',
              },
              {
                dataLabel: 'Git Info',
                dataValue: '-',
              },
              {
                dataLabel: 'Version',
                dataValue: '-',
              },
        ],
      },
      {
        label: 'Release History',
        headers: [
          {
            cols: [
              {
                label: 'Properties',
                valueField: 'dataLabel',
              },
              {
                label: 'value',
                valueField: 'dataValue',
              },
            ],
          },
        ],
        data: [
            {
                dataLabel: 'Build Number',
                dataValue: '10',
              },
              {
                dataLabel: 'Description',
                dataValue: 'NCMON',
              },
              {
                dataLabel: 'Release Number',
                dataValue: '3.2.1',
              },
              {
                dataLabel: 'Git Info',
                dataValue: '-',
              },
              {
                dataLabel: 'Version',
                dataValue: '-',
              },
        ],
      },  
    ],
  };