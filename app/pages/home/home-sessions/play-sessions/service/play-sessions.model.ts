export interface SessionPanelData {
    panels: SessionPanel[];
    sessionDetails?: any;
    pageDetails?:any;
}

export interface SessionPanel {
    label: string;
    duration?: string;
    collapsed?: boolean;
    iconTriangle?: boolean;
    iconcursor?: boolean;
    iconmenu?: boolean;
    accordion?: any;
    iconsField?: boolean;
    menuOption?: boolean;
    details?: any;
    id?:any;
    navigationType ?: any;
}

