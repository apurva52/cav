import { ExecDashboardPanelData } from './../interfaces/exec-dashboard-panel-data';
import { Widget } from '../containers/widget';

/**
 * Class is used for keeping widget inputs for handling widget operations.
 */
export class ExecWidgetActionInputs {
    widgetAction: string = null;
    widget: Widget = null;
    panelData: ExecDashboardPanelData = null;
    operationName: string = null;
    subOpName: string = null;
    widgetId: number = -1;
    panelNumber: number = -1;
    data: any;
}