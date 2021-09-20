export const NODE = {
    "start": {
        template: "StartNode"
    },
    "question": {
        parent: "selectable",
        template: "QuestionNode"
    },
    "output": {
        parent: "selectable",
        template: "OutputNode"
    },
    "action": {
        parent: "selectable",
        template: "ActionNode"
    }
};

export const NODE_MEASUREMENTS = [
    { label: 'Question', type: 'question', w: 120, h: 120 },
    { label: 'Action', type: 'action', w: 120, h: 70 },
    { label: 'Output', type: 'output', w: 120, h: 70 }
];

export const PORT = {
    'start': {
        endpoint: "Blank",
        anchor: "Continuous",
        uniqueEndpoint: true,
        edgeType: "default"
    },
    'source': {
        endpoint: "Blank",
        paintStyle: { fill: "#84acb3" },
        anchor: "AutoDefault",
        maxConnections: -1,
        edgeType: "connection"
    },
    'target': {
        maxConnections: -1,
        endpoint: "Blank",
        anchor: "AutoDefault",
        paintStyle: { fill: "#84acb3" },
        isTarget: true
    }
};

export const RENDER_PARAM = {
    layout: {
        type: 'Absolute',
    },
    
    //TODO: hiding side bars and top bars buttons to move the flowchart
    enablePanButtons: false,
    
    
    //on wheelup screen must be zoomed and opposite on wheel down
    wheelReverse:true,
    events: {
        canvasClick: (e: Event) => {
            this.toolkit.clearSelection();
        },
        edgeAdded: (params: any) => {
            if (params.addedByMouse) {
                this.editLabel(params.edge);
            }
        }
    },
    consumeRightClick: false,
    dragOptions: {
        filter: '.jtk-draw-handle, .node-action, .node-action i',
        grid:[20,20]
    }
};

export const EDGE_DEFAULT = {
    anchors: [['Perimeter', { shape: 'Circle' }], ['Perimeter', { shape: 'Rectangle' }]],
    endpoint: 'Blank',
    connector: ['Straight', { cornerRadius: 5 }],
    paintStyle: { strokeWidth: 1, stroke: 'rgb(67, 67, 67)', outlineWidth: 3, outlineStroke: 'transparent' },
    hoverPaintStyle: { strokeWidth: 2, stroke: 'rgb(0,0,0)' },
    // events: {
    //   'dblclick': (params: any) => {
    //     console.log('dbclicked edge---',params);
    //   }
    // },
    overlays: [
        ['Arrow', {location: .3, width: 8, length: 8, direction: 1}],
        ['Arrow', {location: 0.9, width: 8, length: 8, direction: 1}],
    ]
  };
export const EDGE_BIDIRECTIONAL = {
    anchors: [['Perimeter', { shape: 'Circle' }], ['Perimeter', { shape: 'Rectangle' }]],
    endpoint: 'Blank',
    connector: ['Straight', { cornerRadius: 5 }],
    paintStyle: { strokeWidth: 1, stroke: 'rgb(67, 67, 67)', outlineWidth: 8, outlineStroke: 'transparent' },
    hoverPaintStyle: { strokeWidth: 2, stroke: 'rgb(0,0,0)' },
    overlays: [
        ['Arrow', {location: .2, width: 8, length: 8, direction: -1}],
        ['Arrow', {location: 0.8, width: 8, length: 8, direction: -1}]
    ]
};
