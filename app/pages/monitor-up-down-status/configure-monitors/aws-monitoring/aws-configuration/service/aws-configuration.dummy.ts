

export const AWS_CONFIG_FORM: any = {
    
  
    
       components: [
        {
          "type": "TextField",
          "label": "AWS Account Name",
          "args": "",
          "value": "",
          "validation": {
            "input": "text",
            "required": true,
            "method": "valInstance(e)"
          },
          "labelStyle": {
            "margin-left": "-5px"
          }
        },
        {
          "type": "RadioButtonGroup",
          "value": "",
          "label": "Entry Type",
          "items": [
            {
              "label": "Access Key",
              "args": "-A",
              "value": "-A",
              "dependentComp": [
                {
                  "type": "TextField",
                  "label": "AWS Access Key",
                  "args": "-n",
                  "value": "100",
                  "validation": {
                    "input": "number"
                  },
                  "labelStyle": {
                    "margin-left": "29px"
                  }
                },
                {
                  "type": "TextField",
                  "label": "AWS Secret Access Key",
                  "args": "-n",
                  "value": "100",
                  "validation": {
                    "input": "number"
                  },
                  "labelStyle": {
                    "margin-left": "29px"
                  }
                }
              ]
            },
            {
              "label": "Role Designation",
              "args": "-R",
              "value": "-R",
              "dependentComp": [
                {
                  "type": "TextField",
                  "label": "AWS Access Key",
                  "args": "-n",
                  "value": "100",
                  "validation": {
                    "input": "number"
                  },
                  "labelStyle": {
                    "margin-left": "29px"
                  }
                },
                {
                  "type": "TextField",
                  "label": "AWS Secret Access Key",
                  "args": "-n",
                  "value": "100",
                  "validation": {
                    "input": "number"
                  },
                  "labelStyle": {
                    "margin-left": "29px"
                  }
                }
              ]
            }
          ]
        },
        {
          "type": "Accordion",
          "label": "Advanced Settings",
          "state": "true",
          "dependentComp": [
            {
                "label": "Limit Monitoring of selected Region(s)",
                "args": "-S",
                "type": "Dropdown",
                "value": "space",
                "placeholder": "Select Region",
                "style": {
                    padding: '12px 5px'
                },
                "isQuoteRequired": "true",
                "list": [
                  {
                    "label": "ap-south-1",
                    "value": "ap-south-1"
                  },
                  {
                    "label": "ap-south-2",
                    "value": "ap-south-2"
                  },
                  {
                    "label": "ap-south-3",
                    "value": "ap-south-3"
                  }
                ]
              },
              {
                "type": "Checkbox",
                "label": "Collect ColudWatch Alarms",
                "args": "-o",
                "value": "false"
              },
              {
                "type": "Checkbox",
                "label": "Collect Custom Metrics",
                "args": "-o",
                "value": "false"
              },
            {
              "type": "FieldSet",
              "args": "-F",
              "value": "request:NA,respTime:NA,statusCode:NA,respSize:NA",
              "label": "Optionally Limit Resource Collection",
              "dependentComp": [
                {
                  "type": "TextField",
                  "label": "To Host with tag",
                  "value": "",
                  "args": "",
                  "validation": {
                    "input": "text",
                    "required": true
                  }
                },
                {
                  "type": "TextField",
                  "label": "To Lambdas with tag",
                  "value": "",
                  "args": "",
                  "validation": {
                    "input": "text",
                    "required": true
                  }
                }
              ]
            },
            {
              "type": "FieldSet",
              "args": "-F",
              "value": "request:NA,respTime:NA,statusCode:NA,respSize:NA",
              "label": "Proxy",
              "dependentComp": [
                {
                  "type": "TextField",
                  "label": "Host",
                  "value": "",
                  "args": "",
                  "validation": {
                    "input": "text",
                    "required": true
                  }
                },
                {
                  "type": "TextField",
                  "label": "Port",
                  "value": "",
                  "args": "",
                  "validation": {
                    "input": "number",
                    "required": true
                  }
                },
                {
                  "type": "TextField",
                  "label": "Username",
                  "value": "",
                  "args": "",
                  "validation": {
                    "input": "text",
                    "required": true
                  }
                },
                {
                  "type": "TextField",
                  "label": "Password",
                  "value": "",
                  "args": "",
                  "validation": {
                    "input": "password",
                    "required": true
                  }
                }
              ]
            },
            {
              "label": "Exclude Namespace",
              "args": "-S",
              "type": "Dropdown",
              "value": "space",
              "placeholder": "Choose Monitor List",
              "style": {
                  padding: '12px 5px'
              },
              "isQuoteRequired": "true",
              "list": [
                {
                  "label": "Monitor 1",
                  "value": "Monitor 1"
                },
                {
                  "label": "Monitor 2",
                  "value": "Monitor 2"
                },
                {
                  "label": "Monitor 3",
                  "value": "Monitor 3"
                }
              ]
            },
            
          ]
        }
      ],
      table:{
        paginator: {
            first: 1,
            rows: 10,
            rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
        },
        headers: [
            {
                cols: [
                    {
                        label: 'AWS Access Key',
                        valueField: 'accessKey',
                        classes: 'text-left',
                        selected: true,
                        filter: {
                            isFilter: true,
                            type: 'contains',
                          },
                          isSort: true,
                          actionIcon: false
                    },
                    {
                        label: 'AWS Regions',
                        valueField: 'date',
                        classes: 'text-left',
                        selected: true,
                        filter: {
                            isFilter: true,
                            type: 'contains',
                          },
                          isSort: true,
                          actionIcon: true
                    }
    
                ],
            },
        ],
        data: [
            {
                accessKey: '444',
                icon: 'icons8 icons8-more',
                date: 'ap-south-1',
            },
            {
                accessKey: '444',
                icon: 'icons8 icons8-more',
                date: 'ap-south-2',
            },
            {
                accessKey: '444',
                icon: 'icons8 icons8-more',
                date: 'ap-south-3',
            },
            {
                accessKey: '444',
                icon: 'icons8 icons8-more',
                date: 'ap-south-1',
            },
            
    
        ],
        tableFilter: true,

      } 
        }

        
        


