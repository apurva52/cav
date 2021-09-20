import { DashboardLayout } from '../../../service/dashboard.model';

export const DASHBOARD_LAYOUTS: DashboardLayout[] = [
  {
    id: 'default-gallery',
    name: 'Gallery',
    category: 'DEFAULT',
    type: 'GALLERY',
    configGallery: {
      enable: true,
    },
    icon: 'assets/icons/gallery-layout.svg',
  },
  {
    id: 'default-grid-4x4',
    name: '4 Grid',
    category: 'DEFAULT',
    type: 'GRID',
    configGrid: {
      widgetLayouts: [
        
      ],
    },
    icon: 'assets/icons/4-grid-layout.svg',
  },
  {
    id: 'default-grid-horizontal-2',
    name: 'Horizontal 2',
    category: 'DEFAULT',
    type: 'GRID',
    configGrid: {
      widgetLayouts: [
       ,
      ],
    },
    icon: 'assets/icons/horizontal-2-layout.svg',
  },
  {
    id: 'default-grid-3',
    name: '3 Grid',
    category: 'DEFAULT',
    type: 'GRID',
    configGrid: {
      widgetLayouts: [
      ],
    },
    icon: 'assets/icons/3-grid-layout.svg',
  },
  {
    id: 'default-grid-6',
    name: '6 Grid',
    category: 'DEFAULT',
    type: 'GRID',
    configGrid: {
      widgetLayouts: [
      ],
    },
    icon: 'assets/icons/6-grid-layout.svg',
  },
  {
    id: 'default-grid-9',
    name: '9 Grid',
    category: 'DEFAULT',
    type: 'GRID',
    configGrid: {
      widgetLayouts: [
       
      ],
    },
    icon: 'assets/icons/9-grid-layout.svg',
  },
];

export const DASHBOARD_LAYOUT: DashboardLayout = {
  id: 'default-grid-3',
  name: 'Custom 1',
  category: 'CUSTOM',
  type: 'GRID',
  configGrid: {
    widgetLayouts: [
      {
        cols: 32,
        rows: 8,
        x: null,
        y: null,
      },
      {
        cols: 16,
        rows: 8,
        x: null,
        y: null,
      },
      {
        cols: 16,
        rows: 8,
        x: null,
        y: null,
      },
    ],
  },
  icon: 'assets/icons/design-canvas-layout.svg', // TODO: add default layout SVG icon path
};
