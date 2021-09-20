import { AddNewEventsData } from './add-new-event.model';


export const ADD_NEW_EVENTS_DATA: AddNewEventsData[] =

  [
    {
      label: 'Definition Method', options: [
        { label: 'Url Pattern', value: 'all' },
        { label: 'Pattern1', value: 'Pattern1' },
        { label: 'Pattern2', value: 'Pattern2' },
        { label: 'Pattern3', value: 'Pattern3' },
        { label: 'Pattern4', value: 'Pattern4' }
      ]
    },
    {
      label: 'Complete Url', options: [
        { label: 'InActive', value: 'all' },
        { label: 'Active', value: 'Active' }
      ]
    }
  ]
