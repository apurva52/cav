import { NodeSettingInfo } from './node-setting-info.model';

export const INFO_DATA: NodeSettingInfo = {
  settingInfo: {
    headers: [
      {
        cols: [
          {
            label: 'Label',
            valueField: 'label',
            classes: 'text-center',
          },
          {
            label: 'Value',
            valueField: 'value',
            classes: 'text-right',
          },
        ],
      },
    ],
    data: [
      {
        label: 'Node Name',
        value: '',
      },
      {
        label: 'Node Version',
        value: '5.0.1',
      },
      {
        label: 'Node is master',
        value: 'true',
      },
      {
        label: 'Node Holds Data',
        value: 'true',
      },
      {
        label: 'Cluster Name',
        value: 'nfdc',
      },
      {
        label: 'Host Name',
        value: '192.199.62.198',
      },
      {
        label: 'HTTP Address',
        value: '',
      },
      {
        label: 'Home Name',
        value: 'home/dashboard/cluster',
      },
      {
        label: 'Log Path',
        value: 'node/node-info/nfsd',
      },
    ],
  },
};
