import { AwsConfigTable } from "./add-monitor.model";

export const ADD_MONITOR_FORM: any = {
    
  
    
       components: [
        {
          "type": "FieldSet",
          "args": "-F",
          "value": "",
          "class": "p-col-12",
          "label": "",
          "style": {
            "border": "1px solid #e6e6e6",
            "border-radius": "3px",
            "padding": "10px",
            "margin-bottom": "16px"
          },
          "dependentComp": [
            {
              "type": "FieldSetLabel",
              "args": "-F",
              "value": "",
              "class": "p-col-12",
              "label": "JMX Settings"
            },
            {
              "type": "TextField",
              "label": "Instance Name",
              "args": "",
              "value": "",
              "class": "p-grid p-col-4 p-justify-start p-align-center",
              "placeholder": "Instance Name",
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
              "label": "",
              "class": "p-col-12",
              "style": {
                "background-color": "#f7fbfd"
              },
              "items": [
                {
                  "label": "JMX Remote Setting",
                  "args": "-A",
                  "value": "-A",
                  "dependentComp": [
                    {
                      "type": "TextField",
                      "label": "Host",
                      "args": "-n",
                      "value": "100",
                      "class": "p-grid p-col p-justify-start p-align-center",
                      "validation": {
                        "input": "text",
                        "disabled": true
                      },
                      "labelStyle": {},
                      "inputStyle": {
                        "width": "140px"
                      }
                    },
                    {
                      "type": "TextField",
                      "label": "Port",
                      "args": "-n",
                      "value": "100",
                      "class": "p-grid p-col p-justify-start p-align-center",
                      "validation": {
                        "input": "number",
                        "disabled": true
                      },
                      "labelStyle": {
                        "margin-left": "29px"
                      },
                      "inputStyle": {
                        "width": "140px"
                      }
                    },
                    {
                      "type": "TextField",
                      "label": "Username",
                      "args": "-n",
                      "value": "100",
                      "class": "p-grid p-col p-justify-start p-align-center",
                      "validation": {
                        "input": "text",
                        "disabled": true
                      },
                      "labelStyle": {
                        "margin-left": "29px"
                      },
                      "inputStyle": {
                        "width": "130px"
                      }
                    },
                    {
                      "type": "TextField",
                      "class": "p-grid p-col p-justify-start p-align-center",
                      "label": "Password",
                      "args": "-n",
                      "value": "100",
                      "validation": {
                        "input": "password",
                        "disabled": true
                      },
                      "labelStyle": {
                        "margin-left": "29px"
                      },
                      "inputStyle": {
                        "width": "130px"
                      }
                    },
                    {
                      "label": "JMX Connector URL",
                      "args": "-S",
                      "type": "Dropdown",
                      "value": "space",
                      "class": "p-grid p-col-4",
                      "placeholder": "System",
                      "style": {},
                      "validation": {
                        "disabled": true
                      },
                      "isQuoteRequired": "true",
                      "list": [
                        {
                          "label": "URL 1",
                          "value": "URL 1"
                        },
                        {
                          "label": "URL 2",
                          "value": "URL 2"
                        }
                      ]
                    }
                  ]
                },
                {
                  "label": "JMX Connector Using Process Id",
                  "args": "-B",
                  "value": "-B",
                  "dependentComp": [
                    {
                      "type": "TextField",
                      "label": "Host",
                      "args": "-n",
                      "value": "100",
                      "class": "p-grid p-col p-justify-start p-align-center",
                      "validation": {
                        "input": "text",
                        "disabled": true
                      },
                      "labelStyle": {},
                      "inputStyle": {
                        "width": "140px"
                      }
                    },
                    {
                      "type": "TextField",
                      "label": "Port",
                      "args": "-n",
                      "value": "100",
                      "class": "p-grid p-col p-justify-start p-align-center",
                      "validation": {
                        "input": "number",
                        "disabled": true
                      },
                      "labelStyle": {
                        "margin-left": "29px"
                      },
                      "inputStyle": {
                        "width": "140px"
                      }
                    },
                    {
                      "type": "TextField",
                      "label": "Username",
                      "args": "-n",
                      "value": "100",
                      "class": "p-grid p-col p-justify-start p-align-center",
                      "validation": {
                        "input": "text",
                        "disabled": true
                      },
                      "labelStyle": {
                        "margin-left": "29px"
                      },
                      "inputStyle": {
                        "width": "130px"
                      }
                    },
                    {
                      "type": "TextField",
                      "class": "p-grid p-col p-justify-start p-align-center",
                      "label": "Password",
                      "args": "-n",
                      "value": "100",
                      "validation": {
                        "input": "password",
                        "disabled": true
                      },
                      "labelStyle": {
                        "margin-left": "29px"
                      },
                      "inputStyle": {
                        "width": "130px"
                      }
                    },
                    {
                      "label": "JMX Connector URL",
                      "args": "-S",
                      "type": "MultiSelect",
                      "value": [],
                      "class": "p-grid p-col-4",
                      "placeholder": "System",
                      "style": {
                        "width": "180px"
                      },
                      "validation": {
                        "disabled": true
                      },
                      "isQuoteRequired": "true",
                      "list": [
                        {
                          "label": "Space",
                          "value": "space"
                        },
                        {
                          "label": "Tab",
                          "value": "tab"
                        },
                        {
                          "label": "Others",
                          "value": "Others"
                        }
                      ]
                    }
                  ]
                },
                {
                  "label": "JMX Connector Using Process Id file",
                  "args": "-C",
                  "value": "-C",
                  "dependentComp": [
                    {
                      "type": "TextField",
                      "label": "Host",
                      "args": "-n",
                      "value": "100",
                      "class": "p-grid p-col-3 p-justify-start p-align-center",
                      "validation": {
                        "input": "text",
                        "disabled": true
                      },
                      "labelStyle": {},
                      "inputStyle": {}
                    },
                    {
                      "type": "TextField",
                      "label": "Port",
                      "args": "-n",
                      "value": "100",
                      "class": "p-grid p-col-3 p-justify-start p-align-center",
                      "validation": {
                        "input": "number",
                        "disabled": true
                      },
                      "labelStyle": {
                        "margin-left": "29px"
                      },
                      "inputStyle": {}
                    },
                    {
                      "label": "JMX Connector URL",
                      "args": "-S",
                      "type": "Dropdown",
                      "value": "space",
                      "validation": {
                        "disabled": true
                      },
                      "class": "p-grid p-col-4",
                      "placeholder": "System",
                      "style": {},
                      "isQuoteRequired": "true",
                      "list": [
                        {
                          "label": "URL 1",
                          "value": "URL 1"
                        },
                        {
                          "label": "URL 2",
                          "value": "URL 2"
                        },
                        {
                          "label": "Others",
                          "value": {
                            "value": "Other",
                            "dependentComp": [
                              {
                                "type": "TextField",
                                "label": "Other",
                                "args": "",
                                "value": "",
                                "class": "p-grid p-col-2 p-justify-start p-align-center",
                                "placeholder": "Instance Name",
                                "validation": {
                                  "input": "text",
                                  "required": true,
                                  "method": "valInstance(e)"
                                },
                                "labelStyle": {
                                  "margin-left": "-5px"
                                },
                                "inputStyle": {
                                  "width": "150px"
                                }
                              }
                            ]
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  "label": "JMX Connector Using Search Pattern",
                  "args": "-D",
                  "value": "-D",
                  "dependentComp": [
                    {
                      "type": "TextField",
                      "label": "Host",
                      "args": "-n",
                      "value": "100",
                      "class": "p-grid p-col-3 p-justify-start p-align-center",
                      "validation": {
                        "input": "text",
                        "disabled": true
                      },
                      "labelStyle": {},
                      "inputStyle": {}
                    },
                    {
                      "type": "TextField",
                      "label": "Port",
                      "args": "-n",
                      "value": "100",
                      "class": "p-grid p-col-3 p-justify-start p-align-center",
                      "validation": {
                        "input": "number",
                        "disabled": true
                      },
                      "labelStyle": {
                        "margin-left": "29px"
                      },
                      "inputStyle": {}
                    }
                  ]
                }
              ]
            },
            {
              "type": "FieldSet",
              "args": "-F",
              "value": "",
              "class": "p-col-12",
              "label": "",
              "dependentComp": [
                {
                  "type": "FieldSetLabel",
                  "args": "-F",
                  "value": "",
                  "class": "p-col-12",
                  "label": "SSL Settings"
                },
                {
                  "type": "subTitle",
                  "class": "p-col-1",
                  "label": "Trust Store"
                },
                {
                  "type": "TextField",
                  "label": "File Path",
                  "args": "",
                  "value": "",
                  "class": "p-grid p-col-3 p-justify-start p-align-center",
                  "placeholder": "File Path",
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
                  "type": "TextField",
                  "label": "Password",
                  "args": "",
                  "value": "",
                  "class": "p-grid p-col-3 p-justify-start p-align-center",
                  "placeholder": "password",
                  "validation": {
                    "input": "password",
                    "required": true,
                    "method": "valInstance(e)"
                  },
                  "labelStyle": {
                    "margin-left": "-5px"
                  }
                },
                {
                  "type": "TextField",
                  "label": "Type",
                  "args": "",
                  "value": "",
                  "class": "p-grid p-col-3 p-justify-start p-align-center",
                  "placeholder": "Type",
                  "validation": {
                    "input": "text",
                    "required": true,
                    "method": "valInstance(e)"
                  },
                  "labelStyle": {
                    "margin-left": "-5px"
                  }
                }
              ]
            },
            {
              "type": "FieldSet",
              "args": "-F",
              "value": "",
              "class": "p-col-12",
              "label": "",
              "dependentComp": [
                {
                  "type": "subTitle",
                  "class": "p-col-1",
                  "label": "Key Store"
                },
                {
                  "type": "TextField",
                  "label": "File Path",
                  "args": "",
                  "value": "",
                  "class": "p-grid p-col-3 p-justify-start p-align-center",
                  "placeholder": "File Path",
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
                  "type": "TextField",
                  "label": "Password",
                  "args": "",
                  "value": "",
                  "class": "p-grid p-col-3 p-justify-start p-align-center",
                  "placeholder": "password",
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
                  "type": "Checkbox",
                  "class": "p-col-3",
                  "label": "Two way SSL enable",
                  "args": "-o",
                  "value": "false"
                }
              ]
            }
          ]
        },
        {
          "type": "FieldSet",
          "args": "-F",
          "value": "",
          "class": "p-col-12",
          "label": "",
          "style": {
            "border": "1px solid #e6e6e6",
            "border-radius": "3px",
            "padding": "10px",
            "margin-bottom": "16px"
          },
          "dependentComp": [
            {
              "type": "FieldSetLabel",
              "args": "-F",
              "value": "",
              "class": "p-col-12",
              "label": "Command Settings"
            },
            {
              "type": "Checkbox",
              "class": "p-col-12",
              "label": "Execute Remotely(make SSH connection from Cavisson server)",
              "args": "-o",
              "value": false,
              "dependentComp": [
                {
                  "label": "Remote Tier",
                  "args": "-S",
                  "type": "Dropdown",
                  "value": "space",
                  "validation": {
                    "disabled": false
                  },
                  "class": "p-grid p-col-3",
                  "placeholder": "select Tier",
                  "style": {},
                  "isQuoteRequired": "true",
                  "list": [
                    {
                      "label": "Tier 1",
                      "value": "Tier 1"
                    },
                    {
                      "label": "Tier 2",
                      "value": "Tier 2"
                    },
                    {
                      "label": "Tier 3",
                      "value": "Tier 3"
                    }
                  ]
                },
                {
                  "type": "TextField",
                  "label": "",
                  "args": "",
                  "value": "",
                  "class": "p-grid p-col-2 p-justify-start p-align-center",
                  "placeholder": "File Path",
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
                  "label": "Remote Server",
                  "args": "-S",
                  "type": "Dropdown",
                  "value": "space",
                  "validation": {
                    "disabled": false
                  },
                  "class": "p-grid p-col-3",
                  "placeholder": "Select Server",
                  "style": {},
                  "isQuoteRequired": "true",
                  "list": [
                    {
                      "label": "Server 1",
                      "value": "Server 1"
                    },
                    {
                      "label": "Server 2",
                      "value": "Server 2"
                    },
                    {
                      "label": "Server 3",
                      "value": "Server 3"
                    }
                  ]
                },
                {
                  "type": "TextField",
                  "label": "",
                  "args": "",
                  "value": "",
                  "class": "p-grid p-col-2 p-justify-start p-align-center",
                  "placeholder": "Custom remote server IP",
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
                  "type": "TextField",
                  "label": "Display Name",
                  "args": "-n",
                  "value": "100",
                  "class": "p-grid p-col-3 p-justify-start p-align-center",
                  "validation": {
                    "input": "number"
                  },
                  "labelStyle": {},
                  "inputStyle": {}
                },
                {
                  "type": "TextField",
                  "label": "Port",
                  "args": "-n",
                  "value": "100",
                  "class": "p-grid p-col-3 p-justify-start p-align-center",
                  "validation": {
                    "input": "number"
                  },
                  "labelStyle": {
                    "margin-left": "29px"
                  },
                  "inputStyle": {}
                },
                {
                  "type": "TextField",
                  "label": "Username",
                  "args": "-n",
                  "value": "100",
                  "class": "p-grid p-col-4 p-justify-start p-align-center",
                  "validation": {
                    "input": "number"
                  },
                  "labelStyle": {
                    "margin-left": "29px"
                  },
                  "inputStyle": {}
                },
                {
                  "type": "TextField",
                  "label": "Password",
                  "args": "-n",
                  "value": "100",
                  "class": "p-grid p-col-3 p-justify-start p-align-center",
                  "validation": {
                    "input": "password"
                  },
                  "labelStyle": {},
                  "inputStyle": {}
                },
                {
                  "type": "TextField",
                  "label": "Passphrase",
                  "args": "-n",
                  "value": "100",
                  "class": "p-grid p-col-3 p-justify-start p-align-center",
                  "validation": {
                    "input": "number"
                  },
                  "labelStyle": {
                    "margin-left": "29px"
                  },
                  "inputStyle": {}
                },
                {
                  "type": "TextField",
                  "label": "Public Key",
                  "args": "-n",
                  "value": "100",
                  "class": "p-grid p-col-3 p-justify-start p-align-center",
                  "validation": {
                    "input": "number"
                  },
                  "labelStyle": {
                    "margin-left": "29px"
                  },
                  "inputStyle": {}
                },
                {
                  "type": "TextField",
                  "label": "Private key",
                  "args": "-n",
                  "value": "100",
                  "class": "p-grid p-col-3 p-justify-start p-align-center",
                  "validation": {
                    "input": "number"
                  },
                  "labelStyle": {
                    "margin-left": "29px"
                  },
                  "inputStyle": {}
                }
              ]
            },
            {
              "type": "FieldSet",
              "args": "-F",
              "value": "",
              "class": "p-col-12",
              "label": "",
              "dependentComp": [
                {
                  "type": "FieldSetLabel",
                  "args": "-F",
                  "value": "",
                  "class": "p-col-12",
                  "label": "Proxy Settings"
                },
                {
                  "type": "TextField",
                  "label": "Host",
                  "args": "-n",
                  "value": "100",
                  "class": "p-grid p-col-3 p-justify-start p-align-center",
                  "validation": {
                    "input": "text"
                  },
                  "labelStyle": {},
                  "inputStyle": {}
                },
                {
                  "type": "TextField",
                  "label": "Port",
                  "args": "-n",
                  "value": "100",
                  "class": "p-grid p-col-3 p-justify-start p-align-center",
                  "validation": {
                    "input": "number"
                  },
                  "labelStyle": {
                    "margin-left": "29px"
                  },
                  "inputStyle": {}
                },
                {
                  "type": "TextField",
                  "label": "Username",
                  "args": "-n",
                  "value": "100",
                  "class": "p-grid p-col-3 p-justify-start p-align-center",
                  "validation": {
                    "input": "number"
                  },
                  "labelStyle": {
                    "margin-left": "29px"
                  },
                  "inputStyle": {}
                },
                {
                  "type": "TextField",
                  "label": "Password",
                  "args": "-n",
                  "value": "100",
                  "class": "p-grid p-col-3 p-justify-start p-align-center",
                  "validation": {
                    "input": "password"
                  },
                  "labelStyle": {
                    "margin-left": "29px"
                  },
                  "inputStyle": {}
                }
              ]
            },
            {
              "type": "Button",
              "label": "Advance Settings",
              "class": "",
              "args": "",
              "value": "",
              "placeholder": "",
              "validation": {},
              "style": {
                "margin": "5px",
                "float": "left",
                "background-color": "#1d5290",
                "border": "2px solid #1d5290"
              }
            }
          ]
        },
        {
          "type": "Accordion",
          "label": "Threadpool",
          "state": true,
          "class": "p-col-12",
          "style": {
            "padding": "0px"
          },
          "hasCheckbox": false,
          "dependentComp": [
            {
              "type": "TextField",
              "label": "Display Name",
              "args": "",
              "value": "",
              "class": "p-grid p-col-4 p-justify-start p-align-center",
              "placeholder": "Enter Metric Group Name",
              "validation": {
                "input": "text",
                "required": true,
                "method": "valInstance(e)"
              },
              "labelStyle": {
                "margin-left": "-5px"
              }
            }
          ]
        },
        {
          "type": "Accordion",
          "label": "Response_cav_red",
          "state": false,
          "style": {
            "padding": "0px"
          },
          "class": "p-col-12",
          "hasCheckbox": true,
          "dependentComp": [
            {
              "type": "TextField",
              "label": "Display Name",
              "args": "",
              "value": "",
              "class": "p-grid p-col-4 p-justify-start p-align-center",
              "placeholder": "Enter Metric Group Name",
              "validation": {
                "input": "text",
                "required": true,
                "method": "valInstance(e)"
              },
              "labelStyle": {
                "margin-left": "-5px"
              }
            }
          ]
        },
        {
          "type": "Accordion",
          "label": "Thread_cav_567",
          "state": false,
          "style": {
            "padding": "0px"
          },
          "hasCheckbox": true,
          "class": "p-col-12",
          "dependentComp": [
            {
              "type": "TextField",
              "label": "Display Name",
              "args": "",
              "value": "",
              "class": "p-grid p-col-4 p-justify-start p-align-center",
              "placeholder": "Enter Metric Group Name",
              "validation": {
                "input": "text",
                "required": true,
                "method": "valInstance(e)"
              },
              "labelStyle": {
                "margin-left": "-5px"
              }
            }
          ]
        },
        {
          "type": "Accordion",
          "label": "Custom Response_cav",
          "state": false,
          "style": {
            "padding": "0px"
          },
          "hasCheckbox": true,
          "class": "p-col-12",
          "dependentComp": [
            {
              "type": "TextField",
              "label": "Display Name",
              "args": "",
              "value": "",
              "class": "p-grid p-col-4 p-justify-start p-align-center",
              "placeholder": "Enter Metric Group Name",
              "validation": {
                "input": "text",
                "required": true,
                "method": "valInstance(e)"
              },
              "labelStyle": {
                "margin-left": "-5px"
              }
            }
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
                        label: 'Tier',
                        valueField: 'tier',
                        classes: 'text-left',
                        selected: true,
                        editableCol: {
                          editable: true,
                          editType: 'input',
                        },
                        filter: {
                            isFilter: true,
                            type: 'contains',
                          },
                          isSort: true,
                          actionIcon: false
                    },
                    {
                        label: 'Server',
                        valueField: 'server',
                        classes: 'text-left',
                        selected: true,
                        editableCol: {
                          editable: true,
                          editType: 'input',
                        },
                        filter: {
                            isFilter: true,
                            type: 'contains',
                          },
                          isSort: true,
                          actionIcon: false
                    },
                    {
                      label: 'Profile',
                      valueField: 'profile',
                      classes: 'text-left',
                      selected: true,
                      editableCol: {
                        editable: true,
                        editType: 'input',
                      },
                      filter: {
                          isFilter: true,
                          type: 'contains',
                        },
                        isSort: true,
                        actionIcon: false
                  },
                  {
                    label: 'Monitors',
                    valueField: 'monitors',
                    classes: 'text-left',
                    selected: true,
                    editableCol: {
                      editable: true,
                      editType: 'input',
                    },
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                      isSort: true,
                      actionIcon: false
                },
                {
                  label: 'Action',
                  valueField: 'action',
                  classes: 'text-left ',
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
                tier: 'lorem',
                server: 'lorem',
                profile: '1234',
                monitors:'lorem',
                action: ''
            }
              
    
        ],
        tableFilter: true,

      }
        }

        
        


