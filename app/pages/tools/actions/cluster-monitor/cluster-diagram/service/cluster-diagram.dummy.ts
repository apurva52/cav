export const JSON_DATA = {
  nodes: [
    {
      id: '1',
      type: 'action',
      text: 'Select Material',
      left: -327,
      top: -510,
      w: 232.96973588419212,
      h: 118.0139962771496,
    },
    {
      id: '2',
      type: 'question',
      text: 'Is it in the public domain?',
      left: -319,
      top: -253,
      w: 215.65338001994235,
      h: 155.05215092178145,
    },
    {
      id: '3',
      type: 'question',
      text: 'Is it Creative Commons?',
      left: 76,
      top: -260,
      w: 213.12823805585487,
      h: 169.03499069287395,
    },
    {
      id: '4',
      type: 'question',
      text: 'Is it available from the publisher?',
      left: 345,
      top: -105,
      w: 252.43124612203076,
      h: 209.67599751809973,
    },
    {
      id: '5',
      type: 'question',
      text: 'Can it be linked online?',
      left: 181,
      top: 221,
      w: 203.20748914168627,
      h: 140.68999379524934,
    },
    {
      id: '6',
      type: 'action',
      text: 'Provide link to material',
      left: -93,
      top: 423,
      w: 203.2074891416862,
      h: 122.26574581179327,
    },
    {
      id: '7',
      type: 'action',
      text: 'Send request to IPO for usage permission',
      left: 464,
      top: 231,
      w: 282.89916571377125,
      h: 120.79486387020825,
    },
    {
      id: '8',
      type: 'action',
      text: 'Review license and comply with terms',
      left: -147,
      top: 85,
      w: 309.5012275077787,
      h: 143.52449348501182,
    },
    {
      id: '9',
      type: 'question',
      text: 'Can IPO identify the rights holder?',
      left: 477,
      top: 469,
      w: 257.5233975274207,
      h: 179.15913069881458,
    },
    {
      id: '10',
      type: 'output',
      text: 'Copyright cleared',
      left: -351,
      top: 641,
      w: 280.3615888951362,
      h: 139.82669000997112,
    },
  ],
  edges: [
    {
      source: '1',
      target: '2',
      data: {},
    },
    {
      source: '2',
      target: '10',
      data: {
        label: 'yes',
        type: 'response',
      },
      geometry: {
        segments: [
          [-349, -175.5],
          [-381, -175.5],
          [-381, 711],
        ],
        source: [-319, -175.5, 0, 0.5, -1, 0],
        target: [-351, 711, 0, 0.5, -1, 0],
      },
    },
    {
      source: '2',
      target: '3',
      data: {
        label: 'no',
        type: 'response',
      },
    },
    {
      source: '3',
      target: '4',
      data: {
        label: 'no',
        type: 'response',
      },
    },
    {
      source: '3',
      target: '8',
      data: {
        label: 'yes',
        type: 'response',
      },
    },
    {
      source: '4',
      target: '1',
      data: {
        label: 'no',
        type: 'response',
      },
      geometry: {
        segments: [
          [627, 0],
          [670.5734804550352, 0],
          [670.5734804550352, -540],
          [-210.5, -540],
        ],
        source: [597, 0, 1, 0.5, 1, 0],
        target: [-210.5, -510, 0.5, 0, 0, -1],
      },
    },
    {
      source: '4',
      target: '5',
      data: {
        label: 'yes',
        type: 'response',
      },
    },
    {
      source: '6',
      target: '8',
      data: {
        label: 'yes',
        type: 'response',
      },
    },
    {
      source: '5',
      target: '6',
      data: {
        label: 'yes',
        type: 'response',
      },
      geometry: {
        segments: [
          [282.5, 392],
          [282.5, 534],
          [266, 534],
        ],
        source: [282.5, 362, 0.5, 1, 0, 1],
        target: [236, 534, 1, 0.5, 1, 0],
      },
    },
    {
      source: '5',
      target: '7',
      data: {
        label: 'no',
        type: 'response',
      },
    },
    {
      source: '7',
      target: '9',
      data: {},
    },
    {
      source: '8',
      target: '10',
      data: {},
      geometry: {
        segments: [
          [-177, 157],
          [-211.4172498448812, 157],
          [-211.4172498448812, 611.2587476732185],
        ],
        source: [-147, 157, 0, 0.5, -1, 0],
        target: [-211.4172498448812, 641.2587476732185, 0.5, 0, 0, -1],
      },
    },
    {
      source: '9',
      target: '1',
      data: {
        label: 'no',
        type: 'response',
      },
      geometry: {
        segments: [
          [765, 558.5],
          [776.4915824915824, 558.5],
          [776.4915824915824, -451],
          [-64, -451],
        ],
        source: [735, 558.5, 1, 0.5, 1, 0],
        target: [-94, -451, 1, 0.5, 1, 0],
      },
    },
    {
      source: '9',
      target: '10',
      data: {
        label: 'yes',
        type: 'response',
      },
      geometry: {
        segments: [
          [612, 596],
          [612, 679],
          [133, 679],
        ],
        source: [612, 566, 0.5, 1, 0, 1],
        target: [103, 679, 1, 0.5, 1, 0],
      },
    },
  ],
  ports: [],
  groups: [],
};
