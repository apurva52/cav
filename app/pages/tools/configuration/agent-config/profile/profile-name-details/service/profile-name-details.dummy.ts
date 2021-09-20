import { Table } from 'src/app/shared/table/table.model';
import { profileDetailsTable } from './profile-name-details.model';

export const PROFILE_DETAILS_TABLE_DATA: profileDetailsTable = {
 
  profDetails: [
    {
      heading: 'GENERAL SETTINGS',
      iconField: 'icons8 icons8-user',
      profilenames: [
        {
          label: 'Flowpath',
          routeTo: ['/general-settings/flowpath']
        },
        {
          label: 'Hotspot',
          routeTo: ['/general-settings/hotspot']
        },
        {
          label: 'Capture Exception',
          routeTo: ['/general-settings/capture-exception']
        },
        {
          label: 'Flowpath HTTP Data',
          routeTo: ['/general-settings/flowpath-http-data']
        },
        {
          label: 'Custom Data',
          routeTo: ['/general-settings/custom-data']
        },
        {
          label: 'Instrumentation Profile',
          routeTo: ['/general-settings/instrumentation-profile']
        },
        {
          label: 'Percentile',
          routeTo: ['/general-settings/percentile']
        },
        {
          label: 'Others',
          routeTo: ['/general-settings/others']
        }
      ]
     
      
    },
    {
      heading: 'INSTRUMENTATION SETTINGS',
      iconField: 'icons8 icons8-sugar-cube',
      profilenames: [
        {
          label: 'Service Entry Point',
          routeTo: ['/instrumentation-settings/service-entry-point']
        },
        {
          label: 'Integration Point Detection',
          routeTo: ['/instrumentation-settings/integration-point']
        },
        {
          label: 'Business Transaction',
          routeTo: ['/instrumentation-settings/business-transaction']
        },
        {
          label: 'Instrument Monitor',
          routeTo: ['/instrumentation-settings/instrument-monitors']
        },
        {
          label: 'Error Detection',
          routeTo: ['/instrumentation-settings/error-detection']
        },
        {
          label: 'Asynchronous Transaction',
          routeTo: ['/instrumentation-settings/asynchronous-transaction']
        },
      ]
    },
    {
      heading: 'ADVANCE SETTINGS',
      iconField: 'icons8 icons8-settings',
      profilenames: [
        {
          label: 'Debug Level',
          routeTo: ['/advance-settings/debug-level']
        },
        {
          label: 'Monitors',
          routeTo: ['/advance-settings/monitors']
        },
        {
          label: 'Put Daily in Method',
          routeTo: ['/advance-settings/put-delay-in-method']
        },
        {
          label: 'Generate Exception in Method',
          routeTo: ['/advance-settings/generate-exception']
        },
        {
          label: 'Custom Configuration',
          routeTo: ['/advance-settings/custom-configuration']
        },
        {
          label: 'Debug Tool',
          routeTo: ['/advance-settings/debug-tool']
        },
        {
          label: 'Dynamic Logging',
          routeTo: ['/advance-settings/dynamic-logging']
        },
      ]     
    },
    {
      heading: 'PRODUCT INTEGRATION SETTINGS',
      iconField: 'icons8 icons8-synchronize',
      profilenames: [
        {
          label: 'ND-ND Sessions',
          routeTo: ['/product-integration-settings/nd-sessions']
        },
        {
          label: 'ND-ND Auto Inject',
          routeTo: ['/product-integration-settings/nd-auto-inject']
        },
        {
          label: 'ND-ND Settings',
          routeTo: ['/product-integration-settings/nd-settings']
        }
      ]    
    },
  ],
  };