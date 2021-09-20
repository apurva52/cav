import { FilterData,ParametersData } from './filter-by-favorite.model';

export const PARAMETERS_DATA: ParametersData = {
  data: [
    {
      session: 'Tier: All, Servers: Cavisson, Instance: 23455',
    },
    {
      session: 'Tier: All, Servers: Cavisson, Instance: 23455',
    },
    {
      session: 'Tier: All, Servers: Cavisson, Instance:23455',
    },
    {
      session: 'Tier: All, Servers: Cavisson, Instance:23455',
    },
    {
      session: 'Tier: All, Servers: Cavisson, Instance:23455',
    },
    {
      session: 'Tier: All, Servers: Cavisson, Instance:23455',
    },
    {
      session: 'Tier: All, Servers: Cavisson, Instance:23455',
    },
    {
      session: 'Tier: All, Servers: Cavisson, Instance:23455',
    },
  ],

  tier: [
    { label: 'CC Awe43-front-234', value: 'all' },
    { label: 'Tier1', value: 'Tier1' },
    { label: 'Tier2', value: 'Tier2' },
    { label: 'Tier3', value: 'Tier3' },
    { label: 'Tier4', value: 'Tier4' }
  ],
  server: [
    { label: 'Select Mode', value: 'all' },
    { label: 'Mode1', value: 'Mode' },
    { label: 'Mode2', value: 'Tier2' },
    { label: 'Mode3', value: 'Tier3' },
    { label: 'Mode4', value: 'Tier4' }
  ],
  instance: [
    { label: 'Select Mode', value: 'all' },
    { label: 'Mode1', value: 'Mode' },
    { label: 'Mode2', value: 'Tier2' },
    { label: 'Mode3', value: 'Tier3' },
    { label: 'Mode4', value: 'Tier4' }
  ],
};

export const FILTER_DATA: FilterData[] =

  [
    {
      label: 'Tier', options: [
        { label: 'CC Awe43-front-234', value: 'all' },
        { label: 'Tier1', value: 'Tier1' },
        { label: 'Tier2', value: 'Tier2' },
        { label: 'Tier3', value: 'Tier3' },
        { label: 'Tier4', value: 'Tier4' }
      ]
    },
    {
      label: 'Server', options: [
        { label: 'Select Mode', value: 'all' },
        { label: 'Mode1', value: 'Mode1' },
        { label: 'Mode2', value: 'Mode2' },
        { label: 'Mode3', value: 'Mode3' },
        { label: 'Mode4', value: 'Mode4' }
      ]
    },
    {
      label: 'Instance', options: [
        { label: 'Select Instance', value: 'all' },
        { label: 'Instance1', value: 'Instance1' },
        { label: 'Instance2', value: 'Instance2' },
        { label: 'Instance3', value: 'Instance3' },
        { label: 'Instance4', value: 'Instance4' }
      ]
    }
  ]
