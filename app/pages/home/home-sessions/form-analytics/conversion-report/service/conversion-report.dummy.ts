
import { WHITE_ON_BLACK_CSS_CLASS } from '@angular/cdk/a11y/high-contrast-mode/high-contrast-mode-detector';
import { conversionReportTable } from './conversion-report.model';

export const CONVERSION_REPORT_TABLE_DATA: conversionReportTable = {
  funnelData: [
    // {
    //   entryPage: {
    //     entryCountPct: 0,
    //     entryDetails: {},
    //     totalEntryCount: 154,
    //     bgColor: "#6297C7",
    //    },
    //   exitPage: {
    //     exitCountPct: 40,
    //     exitDetails: {},
    //     totalExitCount: 54,
    //     bgColor: "#F38889"
    //   },
    //   pageName: "Product Details",
    //   totalEntries: 208
    // },
    {
      dec1: "User landed on this page",
      count1: 11,

      count2: 12,
      percentage: "8.33%(1 outof 12)",
      dec3: "User left the page without interacting with the form",

      dec2: "User interacted with the form",
      count3: 11,

    },
    {
      dec1: "User landed on this page",
      count1: 11,
      count2: 12,
      dec2: "User interacted with the form",
      percentage: "91.67%(11 outof 12)",
      dec3: "User didnt try to submit the form",
      count3: 11,

    },
    {
      dec1: "User landed on this page",
      count1: 0,
      count2: 0,
      dec2: "User submitted this form",
      percentage: "00.00%(0 outof 12)",
      dec3: "Failed form submit",
      count3: 0,

    },
  ]
};
