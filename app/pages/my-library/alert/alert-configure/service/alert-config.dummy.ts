export const ADDED_GRAPH: any[] = [
  {
    index: 'A',
    colorForGraph: '#e07eff',
    metricGroup: 'System Std Linux',
    metricName: 'Request Per Seconds',
    indices: 'Specified Indices',
  },
  {
    index: 'B',
    colorForGraph: '#54f1f1 ',
    metricGroup: 'System Std Linux',
    metricName: 'Free Memory',
    indices: 'All Indices',
  },
  {
    index: 'C',
    colorForGraph: '#82f154',
    metricGroup: 'System Std Linux',
    metricName: 'Free Memory',
    indices: 'All Indices',
  },
  {
    index: 'D',
    colorForGraph: '#f14e5d',
    metricGroup: 'System Std Linux',
    metricName: 'Free Memory',
    indices: 'All Indices',
  },
  {
    index: 'E',
    colorForGraph: '#fd9c09',
    metricGroup: 'System Std Linux',
    metricName: 'Free Memory',
    indices: 'All Indices',
  },
];

export const PANEL_DUMMY: any = {
  panels: [
    { label: '', collapsed: false },
    { label: '', collapsed: false },
    { label: '', collapsed: false },
    { label: '', collapsed: false },
    { label: '', collapsed: false },
  ],
};

export const SEVERITY_PANEL_DUMMY: any = {
  panels: [
    {
      label: 'CRITICAL',
      collapsed: false,
      color: '#f12929',
      state: [
        {
          index: 'X',
          colorForGraph: '#e07eff',
          condition: 'Threshold',
          metricName: 'Request Per Seconds',
          threshold: '60',
          severity: 'Critical',
          recoveryThreshold: '82'
        },
        {
          index: 'Y',
          colorForGraph: '#54f1f1 ',
          condition: 'Anamoly',
          metricName: 'Free Memory',
          threshold: '60',
          severity: 'Minor',
          recoveryThreshold: '82'
        },
      ],
    },
    {
      label: 'MAJOR',
      collapsed: true,
      color: '#ff9898',
      state: [
        {
          index: 'X',
          colorForGraph: '#e07eff',
          condition: 'Threshold',
          metricName: 'Request Per Seconds',
          threshold: '85',
          severity: 'Major',
          recoveryThreshold: '83'
        },
        {
          index: 'Y',
          colorForGraph: '#54f1f1 ',
          condition: 'Anamoly',
          metricName: 'Free Memory',
          threshold: '60',
          severity: 'Minor',
          recoveryThreshold: '83'
        },
      ],
    },
    {
      label: 'MINOR',
      collapsed: true,
      color: '#ffc9c9',
      state: [
        {
          index: 'X',
          colorForGraph: '#e07eff',
          condition: 'Threshold',
          metricName: 'Request Per Seconds',
          threshold: '85',
          severity: 'Major',
          recoveryThreshold: '83'
        },
        {
          index: 'Y',
          colorForGraph: '#54f1f1 ',
          condition: 'Anamoly',
          metricName: 'Free Memory',
          threshold: '60',
          severity: 'Minor',
          recoveryThreshold: '83'
        },
      ],
    },
  ],
};
